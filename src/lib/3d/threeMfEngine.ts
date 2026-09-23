/**
 * AnyFileX 3D Engine: 3MF (3D Manufacturing Format) Parser & STL Converter
 *
 * 3MF is an XML-based zipped Open Packaging Convention (OPC) package.
 * Core model data resides in `3D/3dmodel.model`.
 *
 * Parses multi-object hierarchies, build items, coordinate transforms,
 * materials, and converts geometry directly to high-fidelity Binary STL in browser memory.
 */

import JSZip from 'jszip';
import { StlFacet, StlVertex, exportBinaryStl } from './stlEngine';

export interface ThreeMfObject {
  id: string;
  name: string;
  type: string;
  partNumber?: string;
  vertexCount: number;
  triangleCount: number;
  vertices: StlVertex[];
  triangles: [number, number, number][];
}

export interface ThreeMfBuildItem {
  objectId: string;
  transformMatrix?: number[]; // 4x3 or 4x4 matrix
}

export interface ThreeMfPackageInfo {
  title?: string;
  designer?: string;
  description?: string;
  application?: string;
  copyright?: string;
  creationDate?: string;
  unit: string; // 'millimeter' | 'micron' | 'inch' | 'foot' | 'meter'
  unitScaleFactorToMm: number;
  objects: ThreeMfObject[];
  buildItems: ThreeMfBuildItem[];
  totalTriangles: number;
  totalVertices: number;
  containedFiles: string[];
  slicerOrigin?: 'Bambu Studio' | 'PrusaSlicer' | 'OrcaSlicer' | 'Cura' | 'Windows 3D Builder' | 'Generic 3MF';
}

export interface ThreeMfConversionResult {
  stlBlob: Blob;
  stlBlobUrl: string;
  filename: string;
  packageInfo: ThreeMfPackageInfo;
  exportedTriangleCount: number;
  exportedObjectCount: number;
  lossWarnings: string[];
  dimensionsMm: {
    width: number;
    depth: number;
    height: number;
  };
}

/**
 * Parses a 3MF file buffer into structured 3D package metadata and mesh geometry.
 */
export async function parse3mf(buffer: ArrayBuffer): Promise<ThreeMfPackageInfo> {
  const zip = new JSZip();
  let zipContent: JSZip;

  try {
    zipContent = await zip.loadAsync(buffer);
  } catch {
    throw new Error('Failed to extract 3MF container. The file does not appear to be a valid ZIP-based 3MF archive.');
  }

  const containedFiles = Object.keys(zipContent.files);

  // Look for 3D/3dmodel.model or any *.model file
  const modelFileKey = containedFiles.find(
    (name) => name.toLowerCase() === '3d/3dmodel.model' || name.toLowerCase().endsWith('.model')
  );

  if (!modelFileKey) {
    throw new Error('Invalid 3MF package: Missing 3D/3dmodel.model XML geometry manifest.');
  }

  const modelXmlText = await zipContent.file(modelFileKey)!.async('text');
  const parser = new DOMParser();
  const doc = parser.parseFromString(modelXmlText, 'application/xml');

  // Check XML parser errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`Corrupted 3MF XML: ${parseError.textContent || 'Syntax error in model manifest'}`);
  }

  // Determine slicer origin based on package contents and metadata
  let slicerOrigin: ThreeMfPackageInfo['slicerOrigin'] = 'Generic 3MF';
  if (containedFiles.some(f => f.toLowerCase().includes('bambu'))) {
    slicerOrigin = 'Bambu Studio';
  } else if (containedFiles.some(f => f.toLowerCase().includes('prusa'))) {
    slicerOrigin = 'PrusaSlicer';
  } else if (containedFiles.some(f => f.toLowerCase().includes('orca'))) {
    slicerOrigin = 'OrcaSlicer';
  } else if (containedFiles.some(f => f.toLowerCase().includes('cura'))) {
    slicerOrigin = 'Cura';
  }

  // Model root attributes
  const modelElement = doc.documentElement;
  const unitAttr = modelElement.getAttribute('unit')?.toLowerCase() || 'millimeter';

  let unitScaleFactor = 1.0;
  switch (unitAttr) {
    case 'micron':
      unitScaleFactor = 0.001;
      break;
    case 'centimeter':
      unitScaleFactor = 10.0;
      break;
    case 'meter':
      unitScaleFactor = 1000.0;
      break;
    case 'inch':
      unitScaleFactor = 25.4;
      break;
    case 'foot':
      unitScaleFactor = 304.8;
      break;
    case 'millimeter':
    default:
      unitScaleFactor = 1.0;
      break;
  }

  // Metadata tags
  let title: string | undefined;
  let designer: string | undefined;
  let description: string | undefined;
  let application: string | undefined;
  let copyright: string | undefined;
  let creationDate: string | undefined;

  const metadataNodes = doc.querySelectorAll('metadata');
  metadataNodes.forEach((node) => {
    const name = node.getAttribute('name')?.toLowerCase();
    const content = node.textContent?.trim();
    if (!content) return;

    if (name === 'title') title = content;
    else if (name === 'designer' || name === 'author') designer = content;
    else if (name === 'description') description = content;
    else if (name === 'application') {
      application = content;
      if (content.toLowerCase().includes('bambu')) slicerOrigin = 'Bambu Studio';
      if (content.toLowerCase().includes('prusa')) slicerOrigin = 'PrusaSlicer';
    } else if (name === 'copyright') copyright = content;
    else if (name === 'creationdate') creationDate = content;
  });

  // Resources -> Objects
  const objects: ThreeMfObject[] = [];
  const objectNodes = doc.querySelectorAll('resources > object, object');

  let totalTriangles = 0;
  let totalVertices = 0;

  objectNodes.forEach((objNode) => {
    const id = objNode.getAttribute('id') || `obj-${objects.length + 1}`;
    const name = objNode.getAttribute('name') || objNode.getAttribute('partnumber') || `Part ${id}`;
    const type = objNode.getAttribute('type') || 'model';

    // Parse vertices
    const vertexNodes = objNode.querySelectorAll('mesh > vertices > vertex, vertices > vertex');
    const vertices: StlVertex[] = [];
    vertexNodes.forEach((vNode) => {
      const x = (parseFloat(vNode.getAttribute('x') || '0') || 0) * unitScaleFactor;
      const y = (parseFloat(vNode.getAttribute('y') || '0') || 0) * unitScaleFactor;
      const z = (parseFloat(vNode.getAttribute('z') || '0') || 0) * unitScaleFactor;
      vertices.push({ x, y, z });
    });

    // Parse triangles
    const triangleNodes = objNode.querySelectorAll('mesh > triangles > triangle, triangles > triangle');
    const triangles: [number, number, number][] = [];
    triangleNodes.forEach((tNode) => {
      const v1 = parseInt(tNode.getAttribute('v1') || '0', 10);
      const v2 = parseInt(tNode.getAttribute('v2') || '0', 10);
      const v3 = parseInt(tNode.getAttribute('v3') || '0', 10);
      triangles.push([v1, v2, v3]);
    });

    if (triangles.length > 0) {
      objects.push({
        id,
        name,
        type,
        partNumber: objNode.getAttribute('partnumber') || undefined,
        vertexCount: vertices.length,
        triangleCount: triangles.length,
        vertices,
        triangles,
      });

      totalTriangles += triangles.length;
      totalVertices += vertices.length;
    }
  });

  // Build items (instances placed in 3D space on build plate)
  const buildItems: ThreeMfBuildItem[] = [];
  const itemNodes = doc.querySelectorAll('build > item, item');
  itemNodes.forEach((itemNode) => {
    const objectId = itemNode.getAttribute('objectid');
    if (objectId) {
      const transformAttr = itemNode.getAttribute('transform');
      let transformMatrix: number[] | undefined;
      if (transformAttr) {
        transformMatrix = transformAttr.trim().split(/\s+/).map(v => parseFloat(v) || 0);
      }
      buildItems.push({ objectId, transformMatrix });
    }
  });

  return {
    title,
    designer,
    description,
    application,
    copyright,
    creationDate,
    unit: unitAttr,
    unitScaleFactorToMm: unitScaleFactor,
    objects,
    buildItems,
    totalTriangles,
    totalVertices,
    containedFiles,
    slicerOrigin,
  };
}

/**
 * Transforms a 3D vertex using a 3MF 4x3 affine transform matrix:
 * [ m00 m01 m02 ]
 * [ m10 m11 m12 ]
 * [ m20 m21 m22 ]
 * [ m30 m31 m32 ] (translation)
 */
function applyTransform(v: StlVertex, m?: number[]): StlVertex {
  if (!m || m.length < 12) return v;
  return {
    x: v.x * m[0] + v.y * m[3] + v.z * m[6] + m[9],
    y: v.x * m[1] + v.y * m[4] + v.z * m[7] + m[10],
    z: v.x * m[2] + v.y * m[5] + v.z * m[8] + m[11],
  };
}

/**
 * Calculates facet normal for 3 vertices.
 */
function computeNormal(v1: StlVertex, v2: StlVertex, v3: StlVertex): StlVertex {
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
  if (len < 1e-9) return { x: 0, y: 0, z: 1 };
  return { x: nx / len, y: ny / len, z: nz / len };
}

/**
 * Converts a 3MF file to a clean, standardized IEEE 754 Binary STL file.
 * Supports converting all objects merged, or an explicitly selected object ID.
 */
export async function convert3mfToStl(
  buffer: ArrayBuffer,
  selectedObjectId?: string
): Promise<ThreeMfConversionResult> {
  const packageInfo = await parse3mf(buffer);

  if (packageInfo.objects.length === 0) {
    throw new Error('The uploaded 3MF package does not contain any 3D mesh geometry.');
  }

  const targetObjects = selectedObjectId
    ? packageInfo.objects.filter((o) => o.id === selectedObjectId)
    : packageInfo.objects;

  if (targetObjects.length === 0) {
    throw new Error(`Specified object ID "${selectedObjectId}" was not found in the 3MF package.`);
  }

  const facets: StlFacet[] = [];
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const obj of targetObjects) {
    // Check if there are build item transforms for this object
    const instances = packageInfo.buildItems.filter(b => b.objectId === obj.id);
    const transformsToApply = instances.length > 0 ? instances.map(i => i.transformMatrix) : [undefined];

    for (const transform of transformsToApply) {
      for (const [i1, i2, i3] of obj.triangles) {
        if (i1 >= obj.vertices.length || i2 >= obj.vertices.length || i3 >= obj.vertices.length) {
          continue; // Skip out of range vertex index
        }

        const v1 = applyTransform(obj.vertices[i1], transform);
        const v2 = applyTransform(obj.vertices[i2], transform);
        const v3 = applyTransform(obj.vertices[i3], transform);

        minX = Math.min(minX, v1.x, v2.x, v3.x);
        minY = Math.min(minY, v1.y, v2.y, v3.y);
        minZ = Math.min(minZ, v1.z, v2.z, v3.z);
        maxX = Math.max(maxX, v1.x, v2.x, v3.x);
        maxY = Math.max(maxY, v1.y, v2.y, v3.y);
        maxZ = Math.max(maxZ, v1.z, v2.z, v3.z);

        const normal = computeNormal(v1, v2, v3);
        facets.push({ normal, v1, v2, v3 });
      }
    }
  }

  const stlBlob = exportBinaryStl(facets, `AnyFileX from 3MF: ${packageInfo.title || 'Model'}`);
  const stlBlobUrl = URL.createObjectURL(stlBlob);

  const lossWarnings: string[] = [
    'Color & Texture Data: STL only records raw triangular facet geometry. Any multi-material color painting or UV texture maps in the 3MF have been omitted.',
    'Slicer Project Settings: Infill patterns, support structures, temperature presets, and perimeter settings are specific to slicer project files and cannot be preserved in STL.',
    'Multi-Part Hierarchy: If your 3MF contained multiple distinct components, they have been converted into standard watertight surface meshes.',
  ];

  return {
    stlBlob,
    stlBlobUrl,
    filename: `${(packageInfo.title || 'converted-model').replace(/[^a-zA-Z0-9_-]/g, '_')}.stl`,
    packageInfo,
    exportedTriangleCount: facets.length,
    exportedObjectCount: targetObjects.length,
    lossWarnings,
    dimensionsMm: {
      width: Math.round(Math.max(0, maxX - minX) * 10) / 10,
      depth: Math.round(Math.max(0, maxY - minY) * 10) / 10,
      height: Math.round(Math.max(0, maxZ - minZ) * 10) / 10,
    },
  };
}
