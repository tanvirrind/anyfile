import { describe, it, expect } from 'vitest';
import {
  crc32Uint8Array,
  calculateFileHashes,
  compareChecksums,
  sanitizeHashString
} from '../../src/utils/hashUtils';
import { analyzeMagicBytes } from '../../src/data/expandedMimeDatabase';
import {
  parseStl,
  repairStl,
  exportBinaryStl,
  StlFacet
} from '../../src/lib/3d/stlEngine';

describe('Phase 4: Specialist Data & Forensics Tools', () => {
  describe('CRC-32 Implementation & Test Vectors', () => {
    it('calculates the standard IEEE 802.3 CRC-32 test vector for "123456789"', () => {
      const bytes = new TextEncoder().encode('123456789');
      const crc = crc32Uint8Array(bytes);
      expect(crc).toBe('cbf43926');
    });

    it('calculates CRC-32 for empty input as "00000000"', () => {
      const bytes = new Uint8Array(0);
      const crc = crc32Uint8Array(bytes);
      expect(crc).toBe('00000000');
    });

    it('calculates standard CRC-32 for "The quick brown fox jumps over the lazy dog"', () => {
      const bytes = new TextEncoder().encode('The quick brown fox jumps over the lazy dog');
      const crc = crc32Uint8Array(bytes);
      expect(crc).toBe('414fa339');
    });
  });

  describe('Multi-Hash Calculation & Checksum Verification', () => {
    it('computes CRC-32, MD5, SHA-1, SHA-256, SHA-384, and SHA-512', async () => {
      const content = new TextEncoder().encode('AnyFileX-Forensics-Test-2026');
      const file = new File([content], 'sample.bin', { type: 'application/octet-stream' });
      const hashes = await calculateFileHashes(file);

      expect(hashes.crc32).toHaveLength(8);
      expect(hashes.md5).toHaveLength(32);
      expect(hashes.sha1).toHaveLength(40);
      expect(hashes.sha256).toHaveLength(64);
      expect(hashes.sha384).toHaveLength(96);
      expect(hashes.sha512).toHaveLength(128);
    });

    it('matches and identifies 8-char CRC-32 in compareChecksums', () => {
      const dummyHashes = {
        crc32: 'cbf43926',
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sha384: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
        sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      };

      const result = compareChecksums('CBF43926', dummyHashes);
      expect(result.isMatch).toBe(true);
      expect(result.matchedAlgorithm).toBe('CRC-32');
      expect(result.detectedType).toBe('CRC-32');
    });

    it('matches and identifies 96-char SHA-384 in compareChecksums', () => {
      const dummyHashes = {
        crc32: 'cbf43926',
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sha384: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
        sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      };

      const result = compareChecksums('38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b', dummyHashes);
      expect(result.isMatch).toBe(true);
      expect(result.matchedAlgorithm).toBe('SHA-384');
      expect(result.detectedType).toBe('SHA-384');
    });

    it('flags checksum mismatch when input does not match any algorithm', () => {
      const dummyHashes = {
        crc32: 'cbf43926',
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        sha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      };

      const result = compareChecksums('ffffffffffffffffffffffffffffffff', dummyHashes);
      expect(result.isMatch).toBe(false);
      expect(result.detectedType).toBe('MD5');
    });
  });

  describe('Magic Byte Forensic Analysis & Spoofing Detection', () => {
    it('detects Windows PE Executable (MZ) and flags critical spoofing if disguised as JPG', () => {
      // 0x4D 0x5A ("MZ")
      const bytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const file = new File([bytes], 'innocent_photo.jpg', { type: 'image/jpeg' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('exe');
      expect(analysis.isSpoofed).toBe(true);
      expect(analysis.securitySeverity).toBe('critical');
      expect(analysis.securityMessage).toContain('CRITICAL SECURITY SPOOFING ALERT');
    });

    it('detects Linux ELF Executable and flags spoofing if disguised as PDF', () => {
      // 0x7F 'E' 'L' 'F'
      const bytes = new Uint8Array([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00]);
      const file = new File([bytes], 'invoice.pdf', { type: 'application/pdf' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('elf');
      expect(analysis.isSpoofed).toBe(true);
      expect(analysis.securitySeverity).toBe('critical');
    });

    it('detects Shell Script Shebang (#!) and flags script spoofing if disguised as PNG', () => {
      // 0x23 0x21 ('#' '!')
      const bytes = new TextEncoder().encode('#!/bin/bash\nrm -rf /');
      const file = new File([bytes], 'logo.png', { type: 'image/png' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.isSpoofed).toBe(true);
      expect(analysis.securitySeverity).toBe('critical');
      expect(analysis.securityMessage).toContain('SCRIPT SPOOFING ALERT');
    });

    it('detects authentic PNG signature without spoof alert', () => {
      // 89 50 4E 47 0D 0A 1A 0A
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const file = new File([bytes], 'graphic.png', { type: 'image/png' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('png');
      expect(analysis.isSpoofed).toBe(false);
      expect(analysis.securitySeverity).toBe('safe');
    });

    it('detects authentic WebP image signature', () => {
      // 'RIFF' .... 'WEBP'
      const bytes = new TextEncoder().encode('RIFFxxxxWEBPVP8 ');
      const file = new File([bytes], 'hero.webp', { type: 'image/webp' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('webp');
      expect(analysis.isSpoofed).toBe(false);
    });

    it('detects RAR archive signature', () => {
      // 52 61 72 21 1A 07
      const bytes = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00]);
      const file = new File([bytes], 'archive.rar', { type: 'application/x-rar-compressed' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('rar');
      expect(analysis.isSpoofed).toBe(false);
    });

    it('detects 7-Zip archive signature', () => {
      // 37 7A BC AF 27 1C
      const bytes = new Uint8Array([0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c]);
      const file = new File([bytes], 'bundle.7z', { type: 'application/x-7z-compressed' });
      const analysis = analyzeMagicBytes(file, bytes);

      expect(analysis.detectedExtension).toBe('7z');
      expect(analysis.isSpoofed).toBe(false);
    });
  });

  describe('3D STL Mesh Forensics & Repair', () => {
    it('detects degenerate facets and repairs them correctly', async () => {
      const validFacet: StlFacet = {
        normal: { x: 0, y: 0, z: 1 },
        v1: { x: 0, y: 0, z: 0 },
        v2: { x: 10, y: 0, z: 0 },
        v3: { x: 0, y: 10, z: 0 }
      };

      // Degenerate facet where v1 == v2 (zero area collinear)
      const degenerateFacet: StlFacet = {
        normal: { x: 0, y: 0, z: 0 },
        v1: { x: 5, y: 5, z: 5 },
        v2: { x: 5, y: 5, z: 5 },
        v3: { x: 10, y: 10, z: 10 }
      };

      const binaryBlob = exportBinaryStl([validFacet, degenerateFacet], 'Test Degenerate STL');
      const buffer = await binaryBlob.arrayBuffer();

      const repairResult = repairStl(buffer);
      expect(repairResult.removedDegenerateCount).toBe(1);
      expect(repairResult.repairedTriangles).toBe(1);
    });

    it('exports and parses binary STL round-trip accurately', async () => {
      const facet: StlFacet = {
        normal: { x: 0, y: 0, z: 1 },
        v1: { x: 0, y: 0, z: 0 },
        v2: { x: 20, y: 0, z: 0 },
        v3: { x: 0, y: 20, z: 0 }
      };

      const binaryBlob = exportBinaryStl([facet], 'AnyFileX Test STL');
      const buffer = await binaryBlob.arrayBuffer();
      const parsed = parseStl(buffer);

      expect(parsed.diagnostics.isBinary).toBe(true);
      expect(parsed.diagnostics.triangleCount).toBe(1);
      expect(parsed.diagnostics.boundingBox.size.x).toBe(20);
      expect(parsed.diagnostics.boundingBox.size.y).toBe(20);
    });
  });
});
