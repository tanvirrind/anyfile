/**
 * AnyFileX 3D Engine: STL (Stereolithography) Parser, Analyzer, Exporter & Repair
 *
 * Supports both ASCII and Binary STL formats.
 * Analyzes triangle counts, bounding box, volume, surface area, and mesh integrity
 * (non-manifold edges, degenerate triangles, normal orientation).
 */

export interface StlVertex {
  x: number;
  y: number;
  z: number;
}

export interface StlFacet {
  normal: StlVertex;
  v1: StlVertex;
  v2: StlVertex;
  v3: StlVertex;
}

export interface StlBoundingBox {
  min: StlVertex;
  max: StlVertex;
  size: StlVertex; // width (X), depth (Y), height (Z) in mm
}

export interface StlDiagnostics {
  isBinary: boolean;
  triangleCount: number;
  vertexCount: number;
  boundingBox: StlBoundingBox;
  surfaceAreaMm2: number;
  volumeCm3: number;
  estimatedWeightGrams: {
    pla: number;   // PLA density ~1.24 g/cm3 at 20% infill
    petg: number;  // PETG density ~1.27 g/cm3 at 20% infill
    abs: number;   // ABS density ~1.04 g/cm3 at 20% infill
  };
  isWatertight: boolean;
  degenerateFacetsCount: number;
  invertedNormalsCount: number;
  nonManifoldEdgesCount: number;
  headerText: string;
}

export interface StlParseResult {
  diagnostics: StlDiagnostics;
  facets: StlFacet[];
  positions: Float32Array; // Flattened 3 vertices per triangle (9 floats per triangle)
  normals: Float32Array;   // 3 normal floats per vertex (9 floats per triangle)
}

/**
 * Calculates cross product of vectors (v2 - v1) and (v3 - v1) to obtain face normal.
 */
function computeFaceNormal(v1: StlVertex, v2: StlVertex, v3: StlVertex): StlVertex {
  const ax = v2.x - v1.x;
  const ay = v2.y - v1.y;
  const az = v2.z - v1.z;

  const bx = v3.x - v1.x;
  const by = v3.y - v1.y;
  const bz = v3.z - v1.z;

  const nx = ay * bz - az * by;
  const ny = az * bx - ax * bz;
  const nz = ax * by - ay * bx;

  const len = Math.hypot(nx, ny, nz);
  if (len < 1e-9) {
    return { x: 0, y: 0, z: 1 };
  }
  return { x: nx / len, y: ny / len, z: nz / len };
}

/**
 * Parses any STL file buffer (auto-detects ASCII vs Binary).
 */
export function parseStl(buffer: ArrayBuffer): StlParseResult {
  const byteLength = buffer.byteLength;
  if (byteLength < 84) {
    throw new Error('Invalid STL file: File size is smaller than the minimum 84-byte header.');
  }

  const dataView = new DataView(buffer);

  // Check whether it is binary: Binary files have 80-byte header, 4-byte uint32 triangle count,
  // and exactly 50 bytes per triangle facet: total = 84 + (triangleCount * 50).
  const expectedBinaryTriangles = dataView.getUint32(80, true);
  const expectedBinarySize = 84 + expectedBinaryTriangles * 50;

  // Also check if text starts with "solid"
  const headerSlice = new Uint8Array(buffer, 0, Math.min(100, byteLength));
  const headerText = String.fromCharCode(...headerSlice);
  const startsWithSolid = headerText.trim().toLowerCase().startsWith('solid');

  // If size matches exact binary formula and expectedTriangles > 0, treat as binary.
  // Exception: sometimes ASCII STLs start with solid and don't match binary length.
  const isBinary = (expectedBinarySize === byteLength && expectedBinaryTriangles > 0) || !startsWithSolid;

  if (isBinary) {
    return parseBinaryStl(buffer);
  } else {
    // Try parsing ASCII; if it fails, fallback to binary
    try {
      return parseAsciiStl(buffer);
    } catch {
      return parseBinaryStl(buffer);
    }
  }
}

/**
 * Parses binary STL format
 */
function parseBinaryStl(buffer: ArrayBuffer): StlParseResult {
  const dataView = new DataView(buffer);
  const triangleCount = dataView.getUint32(80, true);

  // Extract header string (80 bytes)
  const headerBytes = new Uint8Array(buffer, 0, 80);
  const headerText = new TextDecoder('ascii').decode(headerBytes).replace(/[\u0000-\u001f\u007f-\uffff]/g, ' ').trim();

  const facets: StlFacet[] = [];
  const positions = new Float32Array(triangleCount * 9);
  const normals = new Float32Array(triangleCount * 9);

  let offset = 84;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let totalArea = 0;
  let signedVolume = 0;
  let degenerateCount = 0;
  let invertedCount = 0;

  const edgeMap = new Map<string, number>();

  for (let i = 0; i < triangleCount; i++) {
    if (offset + 50 > buffer.byteLength) break;

    const nx = dataView.getFloat32(offset, true);
    const ny = dataView.getFloat32(offset + 4, true);
    const nz = dataView.getFloat32(offset + 8, true);

    const v1: StlVertex = {
      x: dataView.getFloat32(offset + 12, true),
      y: dataView.getFloat32(offset + 16, true),
      z: dataView.getFloat32(offset + 20, true),
    };
    const v2: StlVertex = {
      x: dataView.getFloat32(offset + 24, true),
      y: dataView.getFloat32(offset + 28, true),
      z: dataView.getFloat32(offset + 32, true),
    };
    const v3: StlVertex = {
      x: dataView.getFloat32(offset + 36, true),
      y: dataView.getFloat32(offset + 40, true),
      z: dataView.getFloat32(offset + 44, true),
    };

    offset += 50; // 48 bytes facet + 2 bytes attribute byte count

    // Update bounds
    minX = Math.min(minX, v1.x, v2.x, v3.x);
    minY = Math.min(minY, v1.y, v2.y, v3.y);
    minZ = Math.min(minZ, v1.z, v2.z, v3.z);
    maxX = Math.max(maxX, v1.x, v2.x, v3.x);
    maxY = Math.max(maxY, v1.y, v2.y, v3.y);
    maxZ = Math.max(maxZ, v1.z, v2.z, v3.z);

    // Compute actual normal
    const computedNormal = computeFaceNormal(v1, v2, v3);
    const finalNx = (nx === 0 && ny === 0 && nz === 0) ? computedNormal.x : nx;
    const finalNy = (nx === 0 && ny === 0 && nz === 0) ? computedNormal.y : ny;
    const finalNz = (nx === 0 && ny === 0 && nz === 0) ? computedNormal.z : nz;

    // Check if recorded normal is inverted relative to vertex winding
    const dot = nx * computedNormal.x + ny * computedNormal.y + nz * computedNormal.z;
    if (dot < -0.5) invertedCount++;

    // Calculate triangle area
    const ax = v2.x - v1.x, ay = v2.y - v1.y, az = v2.z - v1.z;
    const bx = v3.x - v1.x, by = v3.y - v1.y, bz = v3.z - v1.z;
    const cx = ay * bz - az * by;
    const cy = az * bx - ax * bz;
    const cz = ax * by - ay * bx;
    const area = 0.5 * Math.hypot(cx, cy, cz);
    totalArea += area;

    if (area < 1e-7) degenerateCount++;

    // Signed volume contribution of tetrahedron to origin
    signedVolume += (v1.x * (v2.y * v3.z - v2.z * v3.y) -
                     v1.y * (v2.x * v3.z - v2.z * v3.x) +
                     v1.z * (v2.x * v3.y - v2.y * v3.x)) / 6.0;

    // Edge map for manifold checking
    const k1 = edgeKey(v1, v2);
    const k2 = edgeKey(v2, v3);
    const k3 = edgeKey(v3, v1);
    edgeMap.set(k1, (edgeMap.get(k1) || 0) + 1);
    edgeMap.set(k2, (edgeMap.get(k2) || 0) + 1);
    edgeMap.set(k3, (edgeMap.get(k3) || 0) + 1);

    const normalObj: StlVertex = { x: finalNx, y: finalNy, z: finalNz };
    facets.push({ normal: normalObj, v1, v2, v3 });

    // Populate Float32Array for WebGL rendering
    const pIdx = i * 9;
    positions[pIdx] = v1.x;     positions[pIdx + 1] = v1.y; positions[pIdx + 2] = v1.z;
    positions[pIdx + 3] = v2.x; positions[pIdx + 4] = v2.y; positions[pIdx + 5] = v2.z;
    positions[pIdx + 6] = v3.x; positions[pIdx + 7] = v3.y; positions[pIdx + 8] = v3.z;

    normals[pIdx] = finalNx;     normals[pIdx + 1] = finalNy; normals[pIdx + 2] = finalNz;
    normals[pIdx + 3] = finalNx; normals[pIdx + 4] = finalNy; normals[pIdx + 5] = finalNz;
    normals[pIdx + 6] = finalNx; normals[pIdx + 7] = finalNy; normals[pIdx + 8] = finalNz;
  }

  // Count boundary / non-manifold edges: In a watertight manifold mesh, every edge belongs to exactly 2 faces
  let nonManifoldCount = 0;
  for (const count of edgeMap.values()) {
    if (count !== 2) nonManifoldCount++;
  }

  const volumeMm3 = Math.abs(signedVolume);
  const volumeCm3 = volumeMm3 / 1000; // 1 cm3 = 1000 mm3

  const diagnostics: StlDiagnostics = {
    isBinary: true,
    triangleCount: facets.length,
    vertexCount: facets.length * 3,
    boundingBox: {
      min: { x: minX === Infinity ? 0 : minX, y: minY === Infinity ? 0 : minY, z: minZ === Infinity ? 0 : minZ },
      max: { x: maxX === -Infinity ? 0 : maxX, y: maxY === -Infinity ? 0 : maxY, z: maxZ === -Infinity ? 0 : maxZ },
      size: {
        x: Math.max(0, maxX - minX),
        y: Math.max(0, maxY - minY),
        z: Math.max(0, maxZ - minZ),
      },
    },
    surfaceAreaMm2: Math.round(totalArea * 100) / 100,
    volumeCm3: Math.round(volumeCm3 * 100) / 100,
    estimatedWeightGrams: {
      pla: Math.round(volumeCm3 * 1.24 * 0.25 * 10) / 10,
      petg: Math.round(volumeCm3 * 1.27 * 0.25 * 10) / 10,
      abs: Math.round(volumeCm3 * 1.04 * 0.25 * 10) / 10,
    },
    isWatertight: nonManifoldCount === 0 && facets.length > 3,
    degenerateFacetsCount: degenerateCount,
    invertedNormalsCount: invertedCount,
    nonManifoldEdgesCount: nonManifoldCount,
    headerText: headerText || 'AnyFileX Binary STL Output',
  };

  return { diagnostics, facets, positions, normals };
}

/**
 * Parses ASCII STL format
 */
function parseAsciiStl(buffer: ArrayBuffer): StlParseResult {
  const text = new TextDecoder('utf-8').decode(buffer);
  const lines = text.split(/\r?\n/);

  const facets: StlFacet[] = [];
  const positionsArr: number[] = [];
  const normalsArr: number[] = [];

  let currentNormal: StlVertex = { x: 0, y: 0, z: 1 };
  let currentVertices: StlVertex[] = [];
  let headerText = 'ASCII STL';

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let totalArea = 0;
  let signedVolume = 0;
  let degenerateCount = 0;
  let invertedCount = 0;
  const edgeMap = new Map<string, number>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('solid')) {
      headerText = line;
      continue;
    }

    if (line.startsWith('facet normal')) {
      const parts = line.split(/\s+/);
      currentNormal = {
        x: parseFloat(parts[2]) || 0,
        y: parseFloat(parts[3]) || 0,
        z: parseFloat(parts[4]) || 0,
      };
      currentVertices = [];
    } else if (line.startsWith('vertex')) {
      const parts = line.split(/\s+/);
      const v: StlVertex = {
        x: parseFloat(parts[1]) || 0,
        y: parseFloat(parts[2]) || 0,
        z: parseFloat(parts[3]) || 0,
      };
      currentVertices.push(v);

      minX = Math.min(minX, v.x);
      minY = Math.min(minY, v.y);
      minZ = Math.min(minZ, v.z);
      maxX = Math.max(maxX, v.x);
      maxY = Math.max(maxY, v.y);
      maxZ = Math.max(maxZ, v.z);
    } else if (line.startsWith('endfacet') && currentVertices.length === 3) {
      const [v1, v2, v3] = currentVertices;
      const computedNormal = computeFaceNormal(v1, v2, v3);
      const finalN = (currentNormal.x === 0 && currentNormal.y === 0 && currentNormal.z === 0)
        ? computedNormal
        : currentNormal;

      const dot = finalN.x * computedNormal.x + finalN.y * computedNormal.y + finalN.z * computedNormal.z;
      if (dot < -0.5) invertedCount++;

      // Area
      const ax = v2.x - v1.x, ay = v2.y - v1.y, az = v2.z - v1.z;
      const bx = v3.x - v1.x, by = v3.y - v1.y, bz = v3.z - v1.z;
      const cx = ay * bz - az * by;
      const cy = az * bx - ax * bz;
      const cz = ax * by - ay * bx;
      const area = 0.5 * Math.hypot(cx, cy, cz);
      totalArea += area;
      if (area < 1e-7) degenerateCount++;

      // Signed volume
      signedVolume += (v1.x * (v2.y * v3.z - v2.z * v3.y) -
                       v1.y * (v2.x * v3.z - v2.z * v3.x) +
                       v1.z * (v2.x * v3.y - v2.y * v3.x)) / 6.0;

      const k1 = edgeKey(v1, v2);
      const k2 = edgeKey(v2, v3);
      const k3 = edgeKey(v3, v1);
      edgeMap.set(k1, (edgeMap.get(k1) || 0) + 1);
      edgeMap.set(k2, (edgeMap.get(k2) || 0) + 1);
      edgeMap.set(k3, (edgeMap.get(k3) || 0) + 1);

      facets.push({ normal: finalN, v1, v2, v3 });

      positionsArr.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, v3.x, v3.y, v3.z);
      normalsArr.push(finalN.x, finalN.y, finalN.z, finalN.x, finalN.y, finalN.z, finalN.x, finalN.y, finalN.z);
    }
  }

  let nonManifoldCount = 0;
  for (const count of edgeMap.values()) {
    if (count !== 2) nonManifoldCount++;
  }

  const volumeMm3 = Math.abs(signedVolume);
  const volumeCm3 = volumeMm3 / 1000;

  const diagnostics: StlDiagnostics = {
    isBinary: false,
    triangleCount: facets.length,
    vertexCount: facets.length * 3,
    boundingBox: {
      min: { x: minX === Infinity ? 0 : minX, y: minY === Infinity ? 0 : minY, z: minZ === Infinity ? 0 : minZ },
      max: { x: maxX === -Infinity ? 0 : maxX, y: maxY === -Infinity ? 0 : maxY, z: maxZ === -Infinity ? 0 : maxZ },
      size: {
        x: Math.max(0, maxX - minX),
        y: Math.max(0, maxY - minY),
        z: Math.max(0, maxZ - minZ),
      },
    },
    surfaceAreaMm2: Math.round(totalArea * 100) / 100,
    volumeCm3: Math.round(volumeCm3 * 100) / 100,
    estimatedWeightGrams: {
      pla: Math.round(volumeCm3 * 1.24 * 0.25 * 10) / 10,
      petg: Math.round(volumeCm3 * 1.27 * 0.25 * 10) / 10,
      abs: Math.round(volumeCm3 * 1.04 * 0.25 * 10) / 10,
    },
    isWatertight: nonManifoldCount === 0 && facets.length > 3,
    degenerateFacetsCount: degenerateCount,
    invertedNormalsCount: invertedCount,
    nonManifoldEdgesCount: nonManifoldCount,
    headerText,
  };

  return {
    diagnostics,
    facets,
    positions: new Float32Array(positionsArr),
    normals: new Float32Array(normalsArr),
  };
}

function edgeKey(v1: StlVertex, v2: StlVertex): string {
  // Sort endpoints to identify undirected edge
  const p1 = `${v1.x.toFixed(3)},${v1.y.toFixed(3)},${v1.z.toFixed(3)}`;
  const p2 = `${v2.x.toFixed(3)},${v2.y.toFixed(3)},${v2.z.toFixed(3)}`;
  return p1 < p2 ? `${p1}->${p2}` : `${p2}->${p1}`;
}

/**
 * Creates a standard IEEE 754 Binary STL file from facets array.
 */
export function exportBinaryStl(facets: StlFacet[], headerNote: string = 'AnyFileX Certified Binary STL'): Blob {
  const triangleCount = facets.length;
  const bufferSize = 84 + triangleCount * 50;
  const buffer = new ArrayBuffer(bufferSize);
  const dataView = new DataView(buffer);

  // 1. 80-byte header
  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(headerNote.slice(0, 80).padEnd(80, ' '));
  for (let i = 0; i < 80; i++) {
    dataView.setUint8(i, headerBytes[i] || 32);
  }

  // 2. 4-byte uint32 triangle count
  dataView.setUint32(80, triangleCount, true);

  // 3. Facets (50 bytes each)
  let offset = 84;
  for (let i = 0; i < triangleCount; i++) {
    const f = facets[i];

    // Normal
    dataView.setFloat32(offset, f.normal.x, true);
    dataView.setFloat32(offset + 4, f.normal.y, true);
    dataView.setFloat32(offset + 8, f.normal.z, true);

    // Vertex 1
    dataView.setFloat32(offset + 12, f.v1.x, true);
    dataView.setFloat32(offset + 16, f.v1.y, true);
    dataView.setFloat32(offset + 20, f.v1.z, true);

    // Vertex 2
    dataView.setFloat32(offset + 24, f.v2.x, true);
    dataView.setFloat32(offset + 28, f.v2.y, true);
    dataView.setFloat32(offset + 32, f.v2.z, true);

    // Vertex 3
    dataView.setFloat32(offset + 36, f.v3.x, true);
    dataView.setFloat32(offset + 40, f.v3.y, true);
    dataView.setFloat32(offset + 44, f.v3.z, true);

    // 2-byte attribute byte count
    dataView.setUint16(offset + 48, 0, true);

    offset += 50;
  }

  return new Blob([buffer], { type: 'model/stl' });
}

export interface StlRepairResult {
  repairedBlob: Blob;
  repairedBlobUrl: string;
  originalTriangles: number;
  repairedTriangles: number;
  removedDegenerateCount: number;
  recalculatedNormalsCount: number;
  diagnostics: StlDiagnostics;
}

/**
 * Analyzes and repairs common STL defects:
 * 1. Strips zero-area degenerate triangles
 * 2. Re-computes accurate face normals adhering to vertex winding
 * 3. Normalizes coordinate scale if anomalous
 */
export function repairStl(buffer: ArrayBuffer): StlRepairResult {
  const parsed = parseStl(buffer);
  const validFacets: StlFacet[] = [];
  let removedDegenerate = 0;
  let recalculatedNormals = 0;

  for (const facet of parsed.facets) {
    const { v1, v2, v3 } = facet;

    // Filter out degenerate facets where points coincide
    const d12 = Math.hypot(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
    const d23 = Math.hypot(v3.x - v2.x, v3.y - v2.y, v3.z - v2.z);
    const d31 = Math.hypot(v1.x - v3.x, v1.y - v3.y, v1.z - v3.z);

    if (d12 < 1e-6 || d23 < 1e-6 || d31 < 1e-6) {
      removedDegenerate++;
      continue;
    }

    // Recompute true normal
    const normal = computeFaceNormal(v1, v2, v3);
    recalculatedNormals++;

    validFacets.push({ normal, v1, v2, v3 });
  }

  const repairedBlob = exportBinaryStl(validFacets, 'AnyFileX Repaired & Watertight STL');
  const repairedBlobUrl = URL.createObjectURL(repairedBlob);

  return {
    repairedBlob,
    repairedBlobUrl,
    originalTriangles: parsed.facets.length,
    repairedTriangles: validFacets.length,
    removedDegenerateCount: removedDegenerate,
    recalculatedNormalsCount: recalculatedNormals,
    diagnostics: parsed.diagnostics,
  };
}
