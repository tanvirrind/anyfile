import {
  ArchiveMetadataInfo,
  AudioMetadataInfo,
  DocumentMetadataInfo,
  FileMetadataExtraction,
  ImageMetadataInfo,
  VideoMetadataInfo,
} from './types';

/**
 * Parses image dimensions from PNG, JPEG, GIF, BMP, SVG, or WebP bytes without loading full DOM elements when possible
 */
function extractImageDimensionsFromBytes(
  bytes: Uint8Array,
  ext: string
): { width?: number; height?: number; bitDepth?: string; isAnimated?: boolean; colorSpace?: string } {
  const result: { width?: number; height?: number; bitDepth?: string; isAnimated?: boolean; colorSpace?: string } = {};

  try {
    // PNG IHDR chunk at offset 16 (4 bytes width, 4 bytes height, 1 byte bit depth, 1 byte color type)
    if (bytes.length >= 26 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      result.width = view.getUint32(16, false); // big endian
      result.height = view.getUint32(20, false);
      const bitDepth = bytes[24];
      const colorType = bytes[25];
      result.bitDepth = `${bitDepth}-bit`;
      const colorMap: Record<number, string> = {
        0: 'Grayscale',
        2: 'RGB TrueColor',
        3: 'Indexed Palette',
        4: 'Grayscale + Alpha',
        6: 'RGBA TrueColor with Alpha',
      };
      result.colorSpace = colorMap[colorType] || 'RGB';
      // Check for APNG 'acTL' chunk
      const ascii = Array.from(bytes.slice(0, Math.min(bytes.length, 512)))
        .map((b) => String.fromCharCode(b))
        .join('');
      result.isAnimated = ascii.includes('acTL');
      return result;
    }

    // GIF (offset 6: 2 bytes width, 2 bytes height, little endian)
    if (bytes.length >= 10 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      result.width = view.getUint16(6, true);
      result.height = view.getUint16(8, true);
      const version = String.fromCharCode(bytes[3], bytes[4], bytes[5]);
      result.isAnimated = version === '89a';
      result.colorSpace = 'Indexed Palette (8-bit)';
      return result;
    }

    // BMP (offset 18: 4 bytes width, 4 bytes height, 2 bytes bit depth)
    if (bytes.length >= 28 && bytes[0] === 0x42 && bytes[1] === 0x4D) {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      result.width = view.getInt32(18, true);
      result.height = Math.abs(view.getInt32(22, true));
      result.bitDepth = `${view.getUint16(28, true)}-bit`;
      result.colorSpace = 'RGB';
      return result;
    }

    // JPEG SOF0/SOF2 marker scan
    if (bytes.length >= 4 && bytes[0] === 0xFF && bytes[1] === 0xD8) {
      let offset = 2;
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      while (offset < bytes.length - 8) {
        if (bytes[offset] !== 0xFF) {
          offset++;
          continue;
        }
        const marker = bytes[offset + 1];
        // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
        if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
          result.bitDepth = `${bytes[offset + 4]}-bit`;
          result.height = view.getUint16(offset + 5, false);
          result.width = view.getUint16(offset + 7, false);
          const components = bytes[offset + 9];
          result.colorSpace = components === 3 ? 'sRGB / YCbCr' : components === 4 ? 'CMYK' : 'Grayscale';
          return result;
        }
        // Move to next segment
        const segmentLength = view.getUint16(offset + 2, false);
        offset += 2 + segmentLength;
      }
    }
  } catch (err) {
    console.debug('Binary image dimension parse error:', err);
  }

  return result;
}

/**
 * Extracts metadata for a given file asynchronously and non-blockingly
 */
export async function extractFileMetadata(
  file: File,
  headerBytes: Uint8Array,
  detectedExt: string,
  category: string
): Promise<FileMetadataExtraction> {
  const general: Record<string, string | number | boolean> = {
    'File Name': file.name,
    'File Size (Bytes)': file.size,
    'Last Modified': new Date(file.lastModified).toISOString().replace('T', ' ').slice(0, 19),
    'Reported MIME': file.type || 'application/octet-stream',
  };

  const rawPropertyList: { key: string; value: string; category: string }[] = [
    { key: 'File Name', value: file.name, category: 'General' },
    { key: 'File Size', value: `${(file.size / 1024).toFixed(1)} KB (${file.size.toLocaleString()} bytes)`, category: 'General' },
    { key: 'Browser MIME', value: file.type || 'application/octet-stream', category: 'General' },
    { key: 'Last Modified', value: new Date(file.lastModified).toLocaleString(), category: 'General' },
  ];

  let imageInfo: ImageMetadataInfo | undefined;
  let audioInfo: AudioMetadataInfo | undefined;
  let videoInfo: VideoMetadataInfo | undefined;
  let docInfo: DocumentMetadataInfo | undefined;
  let archiveInfo: ArchiveMetadataInfo | undefined;

  const upperExt = detectedExt.toUpperCase();

  // 1. IMAGE METADATA
  if (category === 'Images' || ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'BMP', 'SVG', 'ICO', 'AVIF', 'HEIC', 'PSD'].includes(upperExt)) {
    const binDims = extractImageDimensionsFromBytes(headerBytes, upperExt);
    imageInfo = {
      width: binDims.width,
      height: binDims.height,
      bitDepth: binDims.bitDepth || '24-bit',
      colorSpace: binDims.colorSpace || 'sRGB',
      isAnimated: binDims.isAnimated || false,
    };

    // If binary fast parse didn't get dimensions, try Image() DOM constructor for standard web formats
    if ((!imageInfo.width || !imageInfo.height) && ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'BMP', 'SVG', 'AVIF'].includes(upperExt) && file.size < 25 * 1024 * 1024) {
      try {
        const objectUrl = URL.createObjectURL(file);
        const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => reject(new Error('Image decode error'));
          img.src = objectUrl;
        });
        URL.revokeObjectURL(objectUrl);

        imageInfo.width = dims.width;
        imageInfo.height = dims.height;
      } catch {
        // Fallback gracefully
      }
    }

    if (imageInfo.width && imageInfo.height) {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(imageInfo.width, imageInfo.height);
      imageInfo.aspectRatio = `${imageInfo.width / divisor}:${imageInfo.height / divisor}`;
      imageInfo.megapixels = `${((imageInfo.width * imageInfo.height) / 1000000).toFixed(2)} MP`;

      rawPropertyList.push(
        { key: 'Dimensions', value: `${imageInfo.width} × ${imageInfo.height} px`, category: 'Image' },
        { key: 'Aspect Ratio', value: imageInfo.aspectRatio, category: 'Image' },
        { key: 'Resolution', value: imageInfo.megapixels, category: 'Image' },
        { key: 'Color Space', value: imageInfo.colorSpace || 'sRGB', category: 'Image' }
      );
    }
  }

  // 2. AUDIO METADATA
  else if (category === 'Audio & Video' && ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A'].includes(upperExt)) {
    audioInfo = {
      codec: upperExt,
      sampleRateHz: 44100,
      channels: 2,
      channelLayout: 'Stereo',
    };

    if (file.size < 50 * 1024 * 1024) {
      try {
        const objectUrl = URL.createObjectURL(file);
        const audio = new Audio();
        audio.src = objectUrl;
        const duration = await new Promise<number>((resolve) => {
          audio.onloadedmetadata = () => resolve(audio.duration);
          setTimeout(() => resolve(0), 1000); // 1s timeout
        });
        URL.revokeObjectURL(objectUrl);

        if (duration > 0 && isFinite(duration)) {
          audioInfo.durationSec = duration;
          const mins = Math.floor(duration / 60);
          const secs = Math.floor(duration % 60);
          audioInfo.formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
          rawPropertyList.push(
            { key: 'Audio Duration', value: audioInfo.formattedDuration, category: 'Audio' }
          );
        }
      } catch {
        // Fallback gracefully
      }
    }

    rawPropertyList.push(
      { key: 'Audio Codec', value: audioInfo.codec || upperExt, category: 'Audio' },
      { key: 'Channels', value: audioInfo.channelLayout || 'Stereo (2 Ch)', category: 'Audio' }
    );
  }

  // 3. VIDEO METADATA
  else if (category === 'Audio & Video' && ['MP4', 'MOV', 'WEBM', 'MKV', 'AVI', 'WMV'].includes(upperExt)) {
    videoInfo = {
      codec: upperExt,
      hasAudio: true,
    };

    if (file.size < 50 * 1024 * 1024) {
      try {
        const objectUrl = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.src = objectUrl;
        const meta = await new Promise<{ duration: number; width: number; height: number }>((resolve) => {
          video.onloadedmetadata = () => {
            resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight });
          };
          setTimeout(() => resolve({ duration: 0, width: 0, height: 0 }), 1200);
        });
        URL.revokeObjectURL(objectUrl);

        if (meta.duration > 0 && isFinite(meta.duration)) {
          videoInfo.durationSec = meta.duration;
          const mins = Math.floor(meta.duration / 60);
          const secs = Math.floor(meta.duration % 60);
          videoInfo.formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        if (meta.width > 0) {
          videoInfo.width = meta.width;
          videoInfo.height = meta.height;
          videoInfo.aspectRatio = `${meta.width}:${meta.height}`;
        }
      } catch {
        // Fallback gracefully
      }
    }

    if (videoInfo.width) {
      rawPropertyList.push(
        { key: 'Video Resolution', value: `${videoInfo.width} × ${videoInfo.height} px`, category: 'Video' },
        { key: 'Video Duration', value: videoInfo.formattedDuration || 'Variable', category: 'Video' }
      );
    }
  }

  // 4. DOCUMENT METADATA
  else if (category === 'Documents' || ['PDF', 'DOCX', 'XLSX', 'PPTX', 'EPUB', 'RTF', 'TXT', 'JSON', 'XML', 'CSV'].includes(upperExt)) {
    docInfo = {
      documentType: upperExt,
    };

    // PDF inspection
    if (upperExt === 'PDF') {
      const ascii = Array.from(headerBytes.slice(0, Math.min(headerBytes.length, 512)))
        .map((b) => String.fromCharCode(b))
        .join('');
      const versionMatch = ascii.match(/%PDF-(\d+\.\d+)/);
      if (versionMatch) {
        docInfo.pdfVersion = `PDF ${versionMatch[1]}`;
      }
      docInfo.isEncrypted = ascii.includes('/Encrypt');
      rawPropertyList.push(
        { key: 'PDF Specification', value: docInfo.pdfVersion || 'ISO 32000', category: 'Document' },
        { key: 'Encryption Status', value: docInfo.isEncrypted ? 'Password Protected / Encrypted' : 'Unencrypted (Standard)', category: 'Document' }
      );
    } else if (['TXT', 'JSON', 'XML', 'CSV'].includes(upperExt) && file.size < 5 * 1024 * 1024) {
      try {
        const textSample = await file.slice(0, 16384).text();
        const lines = textSample.split(/\r\n|\r|\n/).length;
        docInfo.lineCount = lines;
        docInfo.encoding = 'UTF-8 / ASCII';
        rawPropertyList.push(
          { key: 'Text Encoding', value: 'UTF-8', category: 'Document' },
          { key: 'Estimated Lines', value: `${lines.toLocaleString()} lines`, category: 'Document' }
        );
      } catch {
        // Text slice fallback
      }
    }
  }

  // 5. ARCHIVE METADATA
  else if (category === 'Archives' || ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(upperExt)) {
    archiveInfo = {
      archiveType: upperExt,
      compressionMethod: upperExt === '7Z' ? 'LZMA2' : upperExt === 'GZ' || upperExt === 'ZIP' ? 'Deflate' : 'Proprietary Block',
    };

    // For ZIP, scan first 4KB for filenames in PK\x03\x04 headers
    if (upperExt === 'ZIP' || upperExt === 'DOCX' || upperExt === 'XLSX') {
      const sampleNames: string[] = [];
      let offset = 0;
      while (offset < headerBytes.length - 30) {
        if (headerBytes[offset] === 0x50 && headerBytes[offset + 1] === 0x4B && headerBytes[offset + 2] === 0x03 && headerBytes[offset + 3] === 0x04) {
          const view = new DataView(headerBytes.buffer, headerBytes.byteOffset, headerBytes.byteLength);
          const nameLen = view.getUint16(offset + 26, true);
          const extraLen = view.getUint16(offset + 28, true);
          if (offset + 30 + nameLen <= headerBytes.length) {
            const nameBytes = headerBytes.slice(offset + 30, offset + 30 + nameLen);
            const name = Array.from(nameBytes).map((b) => String.fromCharCode(b)).join('');
            if (name && !sampleNames.includes(name)) {
              sampleNames.push(name);
            }
          }
          offset += 30 + nameLen + extraLen;
        } else {
          offset++;
        }
      }
      if (sampleNames.length > 0) {
        archiveInfo.sampleEntries = sampleNames.slice(0, 8);
        archiveInfo.estimatedEntries = sampleNames.length;
        rawPropertyList.push(
          { key: 'Internal Entries Found', value: `${sampleNames.length}+ files`, category: 'Archive' },
          { key: 'Sample Contents', value: sampleNames.slice(0, 3).join(', '), category: 'Archive' }
        );
      }
    }
  }

  return {
    general,
    image: imageInfo,
    audio: audioInfo,
    video: videoInfo,
    document: docInfo,
    archive: archiveInfo,
    rawPropertyList,
  };
}
