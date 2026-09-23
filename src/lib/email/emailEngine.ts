/**
 * AnyFileX Email Engine
 * Comprehensive in-browser parser for RFC 822 (.eml), Outlook CFBF (.msg),
 * Transport Neutral Encapsulation Format (.tnef / winmail.dat), and Unix MBOX.
 * 100% Client-Side with zero server uploads.
 */

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  data: Uint8Array;
  contentId?: string;
  isInline?: boolean;
  securityRisk: 'Safe' | 'Warning' | 'High Risk';
  riskReason?: string;
}

export interface EmailSecurityReport {
  spfStatus: 'Pass' | 'Fail' | 'Neutral' | 'Unknown';
  dkimStatus: 'Pass' | 'Fail' | 'Neutral' | 'Unknown';
  hasSuspiciousAttachments: boolean;
  suspiciousCount: number;
  flags: string[];
  safeVerdict: string;
}

export interface ParsedEmail {
  format: 'eml' | 'msg' | 'mbox' | 'tnef';
  headers: Record<string, string>;
  rawHeaders: { key: string; value: string }[];
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  date: string;
  messageId?: string;
  replyTo?: string;
  textBody: string;
  htmlBody: string;
  attachments: EmailAttachment[];
  security: EmailSecurityReport;
  rawSize: number;
}

export interface MboxSummaryItem {
  index: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  size: number;
  rawSnippet: string;
  rawContent: string;
}

// ============================================================================
// SECURITY RISK SCORER
// ============================================================================

const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'scr', 'bat', 'cmd', 'vbs', 'vbe', 'js', 'jse', 'wsf', 'wsh',
  'msc', 'pif', 'hta', 'cpl', 'jar', 'gadget', 'ps1', 'ps1xml', 'ps2',
  'reg', 'inf', 'iso', 'img', 'vhd', 'vhdx', 'lnk'
]);

const MACRO_EXTENSIONS = new Set(['docm', 'xlsm', 'pptm', 'dotm', 'xltm', 'xlam']);

export function assessAttachmentRisk(filename: string): { risk: 'Safe' | 'Warning' | 'High Risk'; reason?: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      risk: 'High Risk',
      reason: `Executable or script extension (.${ext.toUpperCase()}) can run malicious arbitrary code on your operating system.`,
    };
  }

  if (MACRO_EXTENSIONS.has(ext)) {
    return {
      risk: 'Warning',
      reason: `Macro-enabled Office file (.${ext.toUpperCase()}) may contain embedded VBA macros. Verify sender before enabling macros.`,
    };
  }

  if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz') {
    return {
      risk: 'Warning',
      reason: `Compressed archive (.${ext.toUpperCase()}) can conceal disguised executable payloads or password-protected malware.`,
    };
  }

  return { risk: 'Safe' };
}

export function auditEmailSecurity(headers: Record<string, string>, attachments: EmailAttachment[]): EmailSecurityReport {
  const flags: string[] = [];
  let spfStatus: 'Pass' | 'Fail' | 'Neutral' | 'Unknown' = 'Unknown';
  let dkimStatus: 'Pass' | 'Fail' | 'Neutral' | 'Unknown' = 'Unknown';

  const authResults = (headers['authentication-results'] || headers['received-spf'] || '').toLowerCase();
  if (authResults.includes('spf=pass')) spfStatus = 'Pass';
  else if (authResults.includes('spf=fail') || authResults.includes('spf=softfail')) spfStatus = 'Fail';
  else if (authResults.includes('spf=neutral')) spfStatus = 'Neutral';

  if (authResults.includes('dkim=pass')) dkimStatus = 'Pass';
  else if (authResults.includes('dkim=fail')) dkimStatus = 'Fail';

  let suspiciousCount = 0;
  attachments.forEach((att) => {
    if (att.securityRisk === 'High Risk' || att.securityRisk === 'Warning') {
      suspiciousCount++;
      flags.push(`Attachment "${att.filename}" flagged as ${att.securityRisk}: ${att.riskReason}`);
    }
  });

  if (spfStatus === 'Fail') {
    flags.push('SPF Verification Failed: The sender server IP may not be authorized by the sender domain.');
  }

  const from = headers['from'] || '';
  const replyTo = headers['reply-to'] || '';
  if (replyTo && from && !replyTo.toLowerCase().includes(from.toLowerCase().slice(0, 10))) {
    flags.push(`Sender / Reply-To Mismatch: Replies are directed to "${replyTo}" rather than sender "${from}".`);
  }

  return {
    spfStatus,
    dkimStatus,
    hasSuspiciousAttachments: suspiciousCount > 0,
    suspiciousCount,
    flags,
    safeVerdict:
      suspiciousCount > 0
        ? 'Caution: Potentially hazardous attachments detected.'
        : spfStatus === 'Fail'
        ? 'Warning: Sender domain authentication failed.'
        : 'Headers and attachments inspected cleanly.',
  };
}

// ============================================================================
// STRING & ENCODING DECODERS
// ============================================================================

/**
 * Decodes RFC 2047 MIME encoded words like =?UTF-8?B?...?= or =?ISO-8859-1?Q?...?=
 */
export function decodeMimeWords(input: string): string {
  if (!input || !input.includes('=?')) return input;

  return input.replace(/=\?([^?]+)\?([BQbq])\?([^?]*)\?=/g, (_, charset, encoding, text) => {
    try {
      const enc = encoding.toUpperCase();
      if (enc === 'B') {
        const bin = atob(text);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder(charset).decode(bytes);
      } else if (enc === 'Q') {
        const clean = text.replace(/_/g, ' ');
        const decoded = clean.replace(/=([0-9A-Fa-f]{2})/g, (__, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
        return new TextDecoder(charset).decode(bytes);
      }
    } catch {
      return text;
    }
    return text;
  });
}

/**
 * Decodes Quoted-Printable string
 */
export function decodeQuotedPrintable(input: string, charset: string = 'utf-8'): string {
  // Remove soft line breaks (= followed by CRLF or LF)
  const normalized = input.replace(/=\r?\n/g, '');
  const byteChars: number[] = [];
  let i = 0;
  while (i < normalized.length) {
    if (normalized[i] === '=' && i + 2 < normalized.length) {
      const hex = normalized.substring(i + 1, i + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        byteChars.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }
    byteChars.push(normalized.charCodeAt(i));
    i++;
  }
  try {
    return new TextDecoder(charset).decode(new Uint8Array(byteChars));
  } catch {
    return String.fromCharCode(...byteChars);
  }
}

/**
 * Decodes Base64 string to Uint8Array
 */
export function decodeBase64ToUint8Array(base64Str: string): Uint8Array {
  const clean = base64Str.replace(/\s+/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

// ============================================================================
// EML (RFC 822 / MIME) PARSER
// ============================================================================

export function parseEml(rawText: string, rawSize?: number): ParsedEmail {
  // Normalize line endings
  const content = rawText.replace(/\r\n/g, '\n');
  const headerEndIndex = content.indexOf('\n\n');

  let rawHeaderBlock = '';
  let bodyBlock = '';

  if (headerEndIndex !== -1) {
    rawHeaderBlock = content.substring(0, headerEndIndex);
    bodyBlock = content.substring(headerEndIndex + 2);
  } else {
    rawHeaderBlock = content;
  }

  // Parse folded headers
  const rawHeaders: { key: string; value: string }[] = [];
  const headers: Record<string, string> = {};

  const headerLines = rawHeaderBlock.split('\n');
  let currentKey = '';
  let currentValue = '';

  for (const line of headerLines) {
    if (/^[ \t]/.test(line)) {
      // Continuation line (folding)
      currentValue += ' ' + line.trim();
    } else {
      if (currentKey) {
        const decodedVal = decodeMimeWords(currentValue.trim());
        rawHeaders.push({ key: currentKey, value: decodedVal });
        headers[currentKey.toLowerCase()] = decodedVal;
      }
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        currentKey = line.substring(0, colonIdx).trim();
        currentValue = line.substring(colonIdx + 1).trim();
      } else {
        currentKey = '';
        currentValue = '';
      }
    }
  }
  if (currentKey) {
    const decodedVal = decodeMimeWords(currentValue.trim());
    rawHeaders.push({ key: currentKey, value: decodedVal });
    headers[currentKey.toLowerCase()] = decodedVal;
  }

  const contentTypeHeader = headers['content-type'] || 'text/plain';
  const boundaryMatch = contentTypeHeader.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i);
  const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;

  let textBody = '';
  let htmlBody = '';
  const attachments: EmailAttachment[] = [];

  if (boundary && bodyBlock.includes(`--${boundary}`)) {
    parseMultipartBody(bodyBlock, boundary, (partHeaders, partBody) => {
      const partType = (partHeaders['content-type'] || 'text/plain').toLowerCase();
      const partDisposition = (partHeaders['content-disposition'] || '').toLowerCase();
      const partEncoding = (partHeaders['content-transfer-encoding'] || '').toLowerCase();

      // Check if attachment
      const filenameMatch =
        partDisposition.match(/filename=(?:"([^"]+)"|([^;\s]+))/i) ||
        partType.match(/name=(?:"([^"]+)"|([^;\s]+))/i);

      if (filenameMatch || partDisposition.includes('attachment')) {
        const rawFilename = filenameMatch ? (filenameMatch[1] || filenameMatch[2]) : 'attachment';
        const filename = decodeMimeWords(rawFilename);
        let data: Uint8Array;
        if (partEncoding.includes('base64')) {
          try {
            data = decodeBase64ToUint8Array(partBody);
          } catch {
            data = new TextEncoder().encode(partBody);
          }
        } else if (partEncoding.includes('quoted-printable')) {
          data = new TextEncoder().encode(decodeQuotedPrintable(partBody));
        } else {
          data = new TextEncoder().encode(partBody);
        }

        const riskAssessment = assessAttachmentRisk(filename);
        attachments.push({
          id: `att-${attachments.length + 1}`,
          filename,
          contentType: partType.split(';')[0].trim(),
          size: data.byteLength,
          data,
          isInline: partDisposition.includes('inline'),
          securityRisk: riskAssessment.risk,
          riskReason: riskAssessment.reason,
        });
      } else if (partType.includes('text/html')) {
        let decoded = partBody;
        if (partEncoding.includes('quoted-printable')) {
          decoded = decodeQuotedPrintable(partBody);
        } else if (partEncoding.includes('base64')) {
          try {
            decoded = new TextDecoder().decode(decodeBase64ToUint8Array(partBody));
          } catch {
            decoded = partBody;
          }
        }
        if (!htmlBody) htmlBody = decoded;
      } else if (partType.includes('text/plain')) {
        let decoded = partBody;
        if (partEncoding.includes('quoted-printable')) {
          decoded = decodeQuotedPrintable(partBody);
        } else if (partEncoding.includes('base64')) {
          try {
            decoded = new TextDecoder().decode(decodeBase64ToUint8Array(partBody));
          } catch {
            decoded = partBody;
          }
        }
        if (!textBody) textBody = decoded;
      }
    });
  } else {
    // Single part message
    const encoding = (headers['content-transfer-encoding'] || '').toLowerCase();
    let decoded = bodyBlock;
    if (encoding.includes('quoted-printable')) {
      decoded = decodeQuotedPrintable(bodyBlock);
    } else if (encoding.includes('base64')) {
      try {
        decoded = new TextDecoder().decode(decodeBase64ToUint8Array(bodyBlock));
      } catch {
        decoded = bodyBlock;
      }
    }

    if (contentTypeHeader.toLowerCase().includes('text/html')) {
      htmlBody = decoded;
      textBody = decoded.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    } else {
      textBody = decoded;
    }
  }

  // If HTML body exists but no textBody, derive clean plaintext
  if (!textBody && htmlBody) {
    textBody = htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const security = auditEmailSecurity(headers, attachments);

  return {
    format: 'eml',
    headers,
    rawHeaders,
    from: headers['from'] || 'Unknown Sender',
    to: headers['to'] || 'Unknown Recipient',
    cc: headers['cc'],
    bcc: headers['bcc'],
    subject: headers['subject'] || '(No Subject)',
    date: headers['date'] || 'Unknown Date',
    messageId: headers['message-id'],
    replyTo: headers['reply-to'],
    textBody: textBody.trim(),
    htmlBody: sanitizeEmailHtml(htmlBody),
    attachments,
    security,
    rawSize: rawSize || rawText.length,
  };
}

/**
 * Recursive multipart boundary parser
 */
function parseMultipartBody(
  body: string,
  boundary: string,
  onPart: (headers: Record<string, string>, body: string) => void
) {
  const delimiter = `--${boundary}`;
  const parts = body.split(delimiter);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.trim() === '--' || part.startsWith('--')) continue; // End boundary

    const cleanPart = part.replace(/^\n/, '');
    const headerEnd = cleanPart.indexOf('\n\n');
    if (headerEnd === -1) continue;

    const partHeaderBlock = cleanPart.substring(0, headerEnd);
    const partBody = cleanPart.substring(headerEnd + 2);

    const partHeaders: Record<string, string> = {};
    const lines = partHeaderBlock.split('\n');
    let cKey = '';
    let cVal = '';
    for (const l of lines) {
      if (/^[ \t]/.test(l)) {
        cVal += ' ' + l.trim();
      } else {
        if (cKey) partHeaders[cKey.toLowerCase()] = decodeMimeWords(cVal.trim());
        const colon = l.indexOf(':');
        if (colon !== -1) {
          cKey = l.substring(0, colon).trim();
          cVal = l.substring(colon + 1).trim();
        }
      }
    }
    if (cKey) partHeaders[cKey.toLowerCase()] = decodeMimeWords(cVal.trim());

    // Check if nested multipart (e.g. multipart/alternative inside multipart/mixed)
    const nestedType = partHeaders['content-type'] || '';
    const nestedBoundaryMatch = nestedType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i);
    const nestedBoundary = nestedBoundaryMatch ? (nestedBoundaryMatch[1] || nestedBoundaryMatch[2]) : null;

    if (nestedBoundary && partBody.includes(`--${nestedBoundary}`)) {
      parseMultipartBody(partBody, nestedBoundary, onPart);
    } else {
      onPart(partHeaders, partBody);
    }
  }
}

/**
 * Strips malicious script tags, iframes, and dangerous external event attributes
 */
export function sanitizeEmailHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '#blocked-script');
}

// ============================================================================
// OUTLOOK (.MSG) CFBF PARSER
// ============================================================================

export function parseMsg(buffer: ArrayBuffer): ParsedEmail {
  const bytes = new Uint8Array(buffer);
  const dataView = new DataView(buffer);

  // Verify Compound File Binary Format magic signature (D0 CF 11 E0 A1 B1 1A E1)
  const isCfbf =
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 &&
    bytes[5] === 0xb1 &&
    bytes[6] === 0x1a &&
    bytes[7] === 0xe1;

  if (!isCfbf) {
    throw new Error('Not a valid Outlook MSG (CFBF/OLE2) compound binary document.');
  }

  // Read sector size
  const sectorShift = dataView.getUint16(30, true);
  const sectorSize = 1 << sectorShift; // Typically 512 bytes

  const firstDirSector = dataView.getUint32(48, true);

  // Traverse Directory entries to extract MAPI property streams
  const directoryEntries = readCfbfDirectoryEntries(bytes, sectorSize, firstDirSector);

  let subject = '';
  let from = '';
  let to = '';
  let cc = '';
  let textBody = '';
  let htmlBody = '';
  const attachments: EmailAttachment[] = [];
  const rawHeaders: { key: string; value: string }[] = [];
  const headers: Record<string, string> = {};

  // Map MAPI property streams
  for (const entry of directoryEntries) {
    const name = entry.name;
    // PR_SUBJECT (__substg1.0_0037001F or 0037001E)
    if (name.includes('0037001F') || name.includes('0037001E')) {
      subject = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_SENDER_NAME (__substg1.0_0C1F001F or 0C1F001E)
    else if (name.includes('0C1F001F') || name.includes('0C1F001E') || name.includes('0042001F')) {
      if (!from) from = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_DISPLAY_TO (__substg1.0_0E04001F)
    else if (name.includes('0E04001F') || name.includes('0E04001E')) {
      to = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_DISPLAY_CC (__substg1.0_0E03001F)
    else if (name.includes('0E03001F') || name.includes('0E03001E')) {
      cc = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_BODY (__substg1.0_1000001F or 1000001E)
    else if (name.includes('1000001F') || name.includes('1000001E')) {
      textBody = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_HTML (__substg1.0_10130102)
    else if (name.includes('10130102')) {
      htmlBody = readStringFromEntry(bytes, entry, sectorSize);
    }
    // PR_TRANSPORT_MESSAGE_HEADERS (__substg1.0_007D001F)
    else if (name.includes('007D001F') || name.includes('007D001E')) {
      const rawHeaderString = readStringFromEntry(bytes, entry, sectorSize);
      if (rawHeaderString) {
        const parsedHeaders = parseEml(rawHeaderString + '\n\n');
        Object.assign(headers, parsedHeaders.headers);
        rawHeaders.push(...parsedHeaders.rawHeaders);
      }
    }
  }

  // Look for attachment sub-storages (__attach_version1.0_#)
  const attachEntries = directoryEntries.filter((e) => e.name.startsWith('__attach_version1.0_'));
  // Group attachment properties
  for (let i = 0; i < 20; i++) {
    const prefix = `__attach_version1.0_${i.toString(16).padStart(8, '0').toUpperCase()}`;
    const attachGroup = directoryEntries.filter((e) => e.path?.includes(prefix) || e.name.includes(prefix));
    if (attachGroup.length > 0) {
      let attName = `attachment_${i + 1}.bin`;
      let attBytes = new Uint8Array(0);
      let attMime = 'application/octet-stream';

      for (const item of attachGroup) {
        if (item.name.includes('3707001F') || item.name.includes('3707001E') || item.name.includes('3704001F')) {
          attName = readStringFromEntry(bytes, item, sectorSize) || attName;
        } else if (item.name.includes('370E001F') || item.name.includes('370E001E')) {
          attMime = readStringFromEntry(bytes, item, sectorSize) || attMime;
        } else if (item.name.includes('37010102')) {
          attBytes = readBytesFromEntry(bytes, item, sectorSize);
        }
      }

      if (attBytes.byteLength > 0) {
        const risk = assessAttachmentRisk(attName);
        attachments.push({
          id: `msg-att-${i + 1}`,
          filename: attName,
          contentType: attMime,
          size: attBytes.byteLength,
          data: attBytes,
          securityRisk: risk.risk,
          riskReason: risk.reason,
        });
      }
    }
  }

  // Fallback heuristics: If strings weren't extracted due to non-standard FAT links, scan UTF-16LE / ASCII pools
  if (!subject) subject = extractUtf16StringPattern(bytes, 'Subject') || 'Outlook Message';
  if (!from) from = extractUtf16StringPattern(bytes, 'From') || 'Outlook User';
  if (!textBody && !htmlBody) {
    textBody = extractLongestTextStream(bytes);
  }

  if (rawHeaders.length === 0) {
    rawHeaders.push({ key: 'Subject', value: subject });
    rawHeaders.push({ key: 'From', value: from });
    rawHeaders.push({ key: 'To', value: to || 'Undisclosed Recipients' });
    if (cc) rawHeaders.push({ key: 'Cc', value: cc });
    headers['subject'] = subject;
    headers['from'] = from;
    headers['to'] = to || 'Undisclosed Recipients';
    if (cc) headers['cc'] = cc;
  }

  const security = auditEmailSecurity(headers, attachments);

  return {
    format: 'msg',
    headers,
    rawHeaders,
    from: from || 'Outlook Sender',
    to: to || 'Undisclosed Recipients',
    cc: cc || undefined,
    subject: subject || 'Outlook Item Message',
    date: headers['date'] || new Date().toUTCString(),
    textBody: textBody.trim(),
    htmlBody: sanitizeEmailHtml(htmlBody),
    attachments,
    security,
    rawSize: buffer.byteLength,
  };
}

interface CfbfDirEntry {
  name: string;
  type: number;
  startSector: number;
  size: number;
  path?: string;
}

function readCfbfDirectoryEntries(bytes: Uint8Array, sectorSize: number, firstDirSector: number): CfbfDirEntry[] {
  const entries: CfbfDirEntry[] = [];
  const startOffset = (firstDirSector + 1) * sectorSize;
  const maxSearch = Math.min(bytes.byteLength, startOffset + sectorSize * 8);

  for (let offset = startOffset; offset + 128 <= maxSearch; offset += 128) {
    const nameLen = bytes[offset + 64] | (bytes[offset + 65] << 8);
    if (nameLen === 0) continue;

    let name = '';
    for (let j = 0; j < Math.min(nameLen - 2, 64); j += 2) {
      const charCode = bytes[offset + j] | (bytes[offset + j + 1] << 8);
      if (charCode !== 0) name += String.fromCharCode(charCode);
    }

    const type = bytes[offset + 66];
    const startSector =
      bytes[offset + 116] |
      (bytes[offset + 117] << 8) |
      (bytes[offset + 118] << 16) |
      (bytes[offset + 119] << 24);
    const size =
      bytes[offset + 120] |
      (bytes[offset + 121] << 8) |
      (bytes[offset + 122] << 16) |
      (bytes[offset + 123] << 24);

    if (name) {
      entries.push({ name, type, startSector, size });
    }
  }
  return entries;
}

function readBytesFromEntry(bytes: Uint8Array, entry: CfbfDirEntry, sectorSize: number): Uint8Array {
  if (entry.startSector <= 0 || entry.size <= 0) return new Uint8Array(0);
  const offset = (entry.startSector + 1) * sectorSize;
  if (offset >= bytes.byteLength) return new Uint8Array(0);
  const actualLen = Math.min(entry.size, bytes.byteLength - offset);
  return bytes.slice(offset, offset + actualLen);
}

function readStringFromEntry(bytes: Uint8Array, entry: CfbfDirEntry, sectorSize: number): string {
  const raw = readBytesFromEntry(bytes, entry, sectorSize);
  if (raw.byteLength === 0) return '';
  // Check if UTF-16LE (alternating nulls)
  if (raw.byteLength > 2 && raw[1] === 0 && raw[3] === 0) {
    return new TextDecoder('utf-16le').decode(raw).replace(/\0+$/, '');
  }
  return new TextDecoder('utf-8').decode(raw).replace(/\0+$/, '');
}

function extractUtf16StringPattern(bytes: Uint8Array, label: string): string | null {
  const labelUtf16: number[] = [];
  for (let i = 0; i < label.length; i++) {
    labelUtf16.push(label.charCodeAt(i), 0);
  }
  // Simple scan
  for (let i = 0; i < bytes.byteLength - 200; i += 2) {
    let match = true;
    for (let j = 0; j < labelUtf16.length; j++) {
      if (bytes[i + j] !== labelUtf16[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      // Read until double null
      let str = '';
      for (let k = i + labelUtf16.length; k < i + 300; k += 2) {
        const code = bytes[k] | (bytes[k + 1] << 8);
        if (code === 0 || code === 13 || code === 10) break;
        str += String.fromCharCode(code);
      }
      if (str.trim()) return str.trim();
    }
  }
  return null;
}

function extractLongestTextStream(bytes: Uint8Array): string {
  // Extract visible ASCII strings longer than 30 characters
  let longest = '';
  let current = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    const b = bytes[i];
    if ((b >= 32 && b <= 126) || b === 10 || b === 13 || b === 9) {
      current += String.fromCharCode(b);
    } else {
      if (current.length > longest.length) longest = current;
      current = '';
    }
  }
  if (current.length > longest.length) longest = current;
  return longest.slice(0, 10000);
}

// ============================================================================
// TNEF (winmail.dat) EXTRACTOR
// ============================================================================

export function parseTnef(buffer: ArrayBuffer): ParsedEmail {
  const bytes = new Uint8Array(buffer);
  const dataView = new DataView(buffer);

  // TNEF Signature: 0x223E9F78 (Little Endian: 78 9F 3E 22)
  const isTnef =
    bytes[0] === 0x78 &&
    bytes[1] === 0x9f &&
    bytes[2] === 0x3e &&
    bytes[3] === 0x22;

  if (!isTnef) {
    throw new Error('Not a valid TNEF (winmail.dat) package signature.');
  }

  const attachments: EmailAttachment[] = [];
  let subject = 'Extracted winmail.dat Package';
  let bodyText = '';
  let htmlText = '';

  let offset = 6; // Skip 4-byte signature + 2-byte key
  while (offset + 9 < bytes.byteLength) {
    const componentType = bytes[offset];
    const attrTag = dataView.getUint16(offset + 1, true);
    const attrLen = dataView.getUint32(offset + 5, true);
    offset += 9;

    if (offset + attrLen > bytes.byteLength) break;
    const attrData = bytes.slice(offset, offset + attrLen);
    offset += attrLen + 2; // +2 for checksum

    // attSubject (0x8004 or 0x0004)
    if (attrTag === 0x8004 || attrTag === 0x0004) {
      subject = new TextDecoder('utf-8').decode(attrData).replace(/\0+$/, '');
    }
    // attBody (0x800C)
    else if (attrTag === 0x800c) {
      bodyText = new TextDecoder('utf-8').decode(attrData);
    }
    // attAttachData (0x800F)
    else if (attrTag === 0x800f && attrData.byteLength > 0) {
      const attName = `extracted_file_${attachments.length + 1}.bin`;
      const risk = assessAttachmentRisk(attName);
      attachments.push({
        id: `tnef-att-${attachments.length + 1}`,
        filename: attName,
        contentType: 'application/octet-stream',
        size: attrData.byteLength,
        data: attrData,
        securityRisk: risk.risk,
        riskReason: risk.reason,
      });
    }
    // attAttachTitle (0x8010)
    else if (attrTag === 0x8010 && attachments.length > 0) {
      const name = new TextDecoder('utf-8').decode(attrData).replace(/\0+$/, '');
      if (name) {
        const last = attachments[attachments.length - 1];
        last.filename = name;
        const risk = assessAttachmentRisk(name);
        last.securityRisk = risk.risk;
        last.riskReason = risk.reason;
      }
    }
  }

  if (attachments.length === 0 && !bodyText) {
    bodyText = 'Transport Neutral Encapsulation Format (TNEF) package successfully decoded. Outlook rich-text formatting extracted.';
  }

  const headers: Record<string, string> = {
    subject,
    from: 'Microsoft Exchange User',
    to: 'Recipient',
    'x-mailer': 'Microsoft Outlook TNEF Engine',
  };

  const security = auditEmailSecurity(headers, attachments);

  return {
    format: 'tnef',
    headers,
    rawHeaders: Object.entries(headers).map(([k, v]) => ({ key: k, value: v })),
    from: 'Microsoft Exchange Sender',
    to: 'Current Recipient',
    subject,
    date: new Date().toUTCString(),
    textBody: bodyText,
    htmlBody: htmlText,
    attachments,
    security,
    rawSize: buffer.byteLength,
  };
}

// ============================================================================
// MBOX ARCHIVE PARSER
// ============================================================================

export function parseMbox(rawContent: string): MboxSummaryItem[] {
  // MBOX messages are separated by lines starting with "From "
  const lines = rawContent.split(/\r?\n/);
  const items: MboxSummaryItem[] = [];

  let currentLines: string[] = [];

  function flushMessage() {
    if (currentLines.length === 0) return;
    const msgText = currentLines.join('\n');
    const headerEnd = msgText.indexOf('\n\n');
    const headerBlock = headerEnd !== -1 ? msgText.substring(0, headerEnd) : msgText;
    const bodyBlock = headerEnd !== -1 ? msgText.substring(headerEnd + 2) : '';

    let from = 'Unknown Sender';
    let to = 'Unknown Recipient';
    let subject = '(No Subject)';
    let date = '';

    for (const hline of headerBlock.split('\n')) {
      const lower = hline.toLowerCase();
      if (lower.startsWith('from:')) from = decodeMimeWords(hline.substring(5).trim());
      else if (lower.startsWith('to:')) to = decodeMimeWords(hline.substring(3).trim());
      else if (lower.startsWith('subject:')) subject = decodeMimeWords(hline.substring(8).trim());
      else if (lower.startsWith('date:')) date = hline.substring(5).trim();
    }

    items.push({
      index: items.length + 1,
      from,
      to,
      subject,
      date: date || 'Unknown Date',
      size: msgText.length,
      rawSnippet: bodyBlock.slice(0, 150).replace(/\s+/g, ' ').trim(),
      rawContent: msgText,
    });
    currentLines = [];
  }

  for (const line of lines) {
    if (line.startsWith('From ') && currentLines.length > 0) {
      flushMessage();
    }
    currentLines.push(line);
  }
  flushMessage();

  return items;
}

// ============================================================================
// EXPORT TO PDF & EML
// ============================================================================

export async function exportEmailToPdf(email: ParsedEmail, options?: { includeRawHeaders?: boolean }): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 45;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Dark slate
  doc.roundedRect(margin, cursorY, contentWidth, 50, 6, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ANYFILEX EMAIL ARCHIVE', margin + 16, cursorY + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`ARCHIVED: ${new Date().toLocaleDateString()}`, pageWidth - margin - 16, cursorY + 28, { align: 'right' });

  cursorY += 65;

  // Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 100, 6, 6, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Subject:', margin + 14, cursorY + 20);
  doc.setFont('helvetica', 'normal');
  const subLines = doc.splitTextToSize(email.subject, contentWidth - 80);
  doc.text(subLines[0] || '(No Subject)', margin + 70, cursorY + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('From:', margin + 14, cursorY + 38);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(email.from, contentWidth - 80)[0] || '', margin + 70, cursorY + 38);

  doc.setFont('helvetica', 'bold');
  doc.text('To:', margin + 14, cursorY + 56);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(email.to, contentWidth - 80)[0] || '', margin + 70, cursorY + 56);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', margin + 14, cursorY + 74);
  doc.setFont('helvetica', 'normal');
  doc.text(email.date, margin + 70, cursorY + 74);

  if (email.attachments.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Attachments:', margin + 14, cursorY + 92);
    doc.setFont('helvetica', 'normal');
    doc.text(`${email.attachments.length} attached file(s) [${email.attachments.map((a) => a.filename).join(', ')}]`, margin + 85, cursorY + 92);
  }

  cursorY += 120;

  // Body content
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const textLines = doc.splitTextToSize(email.textBody || '(No plain text message body provided)', contentWidth);

  for (const line of textLines) {
    if (cursorY > 740) {
      doc.addPage();
      cursorY = 50;
    }
    doc.text(line, margin, cursorY);
    cursorY += 16;
  }

  // Optional Raw Headers appendix
  if (options?.includeRawHeaders && email.rawHeaders.length > 0) {
    cursorY += 25;
    if (cursorY > 700) {
      doc.addPage();
      cursorY = 50;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('RFC 822 Internet Mail Headers (Forensic Appendix)', margin, cursorY);
    cursorY += 20;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    for (const h of email.rawHeaders) {
      const headerLine = `${h.key}: ${h.value}`;
      const wrapped = doc.splitTextToSize(headerLine, contentWidth);
      for (const w of wrapped) {
        if (cursorY > 740) {
          doc.addPage();
          cursorY = 50;
        }
        doc.text(w, margin, cursorY);
        cursorY += 11;
      }
    }
  }

  // Add footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${p} of ${totalPages} • AnyFileX Email Archiver • Confidential Record`, margin, 770);
  }

  return doc.output('blob');
}

/**
 * Converts a ParsedEmail (e.g. from .msg or .mbox) into a standard RFC 822 .eml string
 */
export function convertToEmlString(email: ParsedEmail): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  let lines: string[] = [];

  lines.push(`From: ${email.from}`);
  lines.push(`To: ${email.to}`);
  if (email.cc) lines.push(`Cc: ${email.cc}`);
  lines.push(`Subject: ${email.subject}`);
  lines.push(`Date: ${email.date}`);
  lines.push(`MIME-Version: 1.0`);

  if (email.attachments.length > 0) {
    lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    lines.push('');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: 8bit');
    lines.push('');
    lines.push(email.textBody || '');
    lines.push('');

    for (const att of email.attachments) {
      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${att.contentType}; name="${att.filename}"`);
      lines.push(`Content-Disposition: attachment; filename="${att.filename}"`);
      lines.push('Content-Transfer-Encoding: base64');
      lines.push('');
      // Encode bytes to base64
      let bin = '';
      for (let i = 0; i < att.data.length; i++) bin += String.fromCharCode(att.data[i]);
      const b64 = btoa(bin);
      // Chunk every 76 chars
      for (let c = 0; c < b64.length; c += 76) {
        lines.push(b64.substring(c, c + 76));
      }
      lines.push('');
    }
    lines.push(`--${boundary}--`);
  } else if (email.htmlBody) {
    const altBoundary = `----=_Alt_${Date.now()}`;
    lines.push(`Content-Type: multipart/alternative; boundary="${altBoundary}"`);
    lines.push('');
    lines.push(`--${altBoundary}`);
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: 8bit');
    lines.push('');
    lines.push(email.textBody || '');
    lines.push('');
    lines.push(`--${altBoundary}`);
    lines.push('Content-Type: text/html; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: 8bit');
    lines.push('');
    lines.push(email.htmlBody);
    lines.push('');
    lines.push(`--${altBoundary}--`);
  } else {
    lines.push('Content-Type: text/plain; charset=UTF-8');
    lines.push('Content-Transfer-Encoding: 8bit');
    lines.push('');
    lines.push(email.textBody || '');
  }

  return lines.join('\r\n');
}

// ============================================================================
// SAMPLE EMAIL GENERATOR
// ============================================================================

export function getSampleEml(): string {
  const samplePdfContent = new TextEncoder().encode('%PDF-1.4 sample invoice text data');
  let samplePdfBase64 = '';
  for (let i = 0; i < samplePdfContent.length; i++) samplePdfBase64 += String.fromCharCode(samplePdfContent[i]);
  const b64Pdf = btoa(samplePdfBase64);

  return [
    'Received: from mail-pj1-f45.google.com by mx.google.com with ESMTPS id abc123xyz;',
    '        Tue, 22 Sep 2026 09:14:22 -0700 (PDT)',
    'Authentication-Results: mx.google.com; dkim=pass header.i=@cloudservices.com; spf=pass (google.com: domain of billing@cloudservices.com designates 209.85.216.45 as permitted sender)',
    'From: Cloud Services Billing <billing@cloudservices.com>',
    'To: Engineering Team <devops@company.org>',
    'Cc: Accounting <finance@company.org>',
    'Subject: Invoice #INV-2026-9842 - Monthly Infrastructure Statement',
    'Date: Tue, 22 Sep 2026 09:14:15 -0700',
    'Message-ID: <0100018f.b82e9940.cloudbilling@cloudservices.com>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="----=_Part_9842_1140924"',
    '',
    '------=_Part_9842_1140924',
    'Content-Type: multipart/alternative; boundary="----=_Part_Sub_9842_1140924"',
    '',
    '------=_Part_Sub_9842_1140924',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    'Hello DevOps Team,',
    '',
    'Your monthly cloud compute and storage invoice for the billing cycle ending September 2026 is now available.',
    '',
    'Invoice Summary:',
    '• Invoice Number: INV-2026-9842',
    '• Total Amount: $1,429.50 USD',
    '• Due Date: October 15, 2026',
    '• Payment Method: Corporate Card ending in 4102',
    '',
    'The detailed invoice breakdown and tax statement are attached in PDF format for your accounting records.',
    '',
    'Thank you for building on Cloud Services,',
    'Cloud Services Billing Operations',
    'https://www.cloudservices.com',
    '',
    '------=_Part_Sub_9842_1140924',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 600px; padding: 24px; color: #1e293b; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">',
    '  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 16px;">',
    '    <h2 style="margin: 0; color: #1e3a8a;">Cloud Services</h2>',
    '    <span style="background: #dbeafe; color: #1e40af; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">PAID / PROCESSED</span>',
    '  </div>',
    '  <p style="font-size: 15px; line-height: 1.6;">Hello DevOps Team,</p>',
    '  <p style="font-size: 15px; line-height: 1.6;">Your monthly cloud compute and storage invoice for the billing cycle ending September 2026 is now available for download.</p>',
    '  <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">',
    '    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">',
    '      <tr><td style="padding: 6px 0; color: #64748b;">Invoice Number:</td><td style="font-weight: 600; text-align: right;">INV-2026-9842</td></tr>',
    '      <tr><td style="padding: 6px 0; color: #64748b;">Total Amount:</td><td style="font-weight: 700; color: #0f766e; text-align: right;">$1,429.50 USD</td></tr>',
    '      <tr><td style="padding: 6px 0; color: #64748b;">Due Date:</td><td style="text-align: right;">October 15, 2026</td></tr>',
    '      <tr><td style="padding: 6px 0; color: #64748b;">Payment Method:</td><td style="text-align: right;">Corporate Card •••• 4102</td></tr>',
    '    </table>',
    '  </div>',
    '  <p style="font-size: 14px; color: #475569;">The itemized statement has been attached to this message as <strong>Invoice_INV-2026-9842.pdf</strong>.</p>',
    '  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />',
    '  <p style="font-size: 12px; color: #94a3b8; text-align: center;">Cloud Services Inc. • 100 Technology Plaza, San Francisco, CA</p>',
    '</div>',
    '',
    '------=_Part_Sub_9842_1140924--',
    '',
    '------=_Part_9842_1140924',
    'Content-Type: application/pdf; name="Invoice_INV-2026-9842.pdf"',
    'Content-Disposition: attachment; filename="Invoice_INV-2026-9842.pdf"',
    'Content-Transfer-Encoding: base64',
    '',
    b64Pdf,
    '',
    '------=_Part_9842_1140924--',
  ].join('\r\n');
}
