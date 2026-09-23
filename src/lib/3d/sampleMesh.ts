/**
 * Sample 3D Models for Instant Browser Testing
 * Generates standard 20mm Calibration Cube (STL & 3MF)
 */

import { exportBinaryStl, StlFacet } from './stlEngine';
import JSZip from 'jszip';

/**
 * Creates a standard 20x20x20mm 3D Printing Calibration Cube
 */
export function generateCalibrationCubeFacets(): StlFacet[] {
  const s = 10; // -10 to +10 mm = 20mm cube

  // 8 vertices
  const v = [
    { x: -s, y: -s, z: 0 },   // 0: front-bottom-left
    { x:  s, y: -s, z: 0 },   // 1: front-bottom-right
    { x:  s, y:  s, z: 0 },   // 2: back-bottom-right
    { x: -s, y:  s, z: 0 },   // 3: back-bottom-left
    { x: -s, y: -s, z: 2 * s }, // 4: front-top-left
    { x:  s, y: -s, z: 2 * s }, // 5: front-top-right
    { x:  s, y:  s, z: 2 * s }, // 6: back-top-right
    { x: -s, y:  s, z: 2 * s }, // 7: back-top-left
  ];

  // 12 triangles (2 per face)
  const triangles: [number, number, number, { x: number; y: number; z: number }][] = [
    // Bottom (Z = 0)
    [0, 2, 1, { x: 0, y: 0, z: -1 }],
    [0, 3, 2, { x: 0, y: 0, z: -1 }],
    // Top (Z = 20)
    [4, 5, 6, { x: 0, y: 0, z: 1 }],
    [4, 6, 7, { x: 0, y: 0, z: 1 }],
    // Front (Y = -10)
    [0, 1, 5, { x: 0, y: -1, z: 0 }],
    [0, 5, 4, { x: 0, y: -1, z: 0 }],
    // Back (Y = +10)
    [2, 3, 7, { x: 0, y: 1, z: 0 }],
    [2, 7, 6, { x: 0, y: 1, z: 0 }],
    // Left (X = -10)
    [3, 0, 4, { x: -1, y: 0, z: 0 }],
    [3, 4, 7, { x: -1, y: 0, z: 0 }],
    // Right (X = +10)
    [1, 2, 6, { x: 1, y: 0, z: 0 }],
    [1, 6, 5, { x: 1, y: 0, z: 0 }],
  ];

  return triangles.map(([i1, i2, i3, normal]) => ({
    normal,
    v1: v[i1],
    v2: v[i2],
    v3: v[i3],
  }));
}

/**
 * Generates an ArrayBuffer of a 20mm Calibration Cube STL
 */
export async function getSampleStlBuffer(): Promise<ArrayBuffer> {
  const facets = generateCalibrationCubeFacets();
  const blob = exportBinaryStl(facets, 'AnyFileX 20mm Calibration Cube');
  return blob.arrayBuffer();
}

/**
 * Generates a valid sample .3MF package with 2 parts (Cube Base + Calibration Plate)
 */
export async function getSample3mfBuffer(): Promise<ArrayBuffer> {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>`;
  zip.file('[Content_Types].xml', contentTypesXml);

  // 2. _rels/.rels
  const relsXml = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`;
  zip.file('_rels/.rels', relsXml);

  // 3. 3D/3dmodel.model
  const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <metadata name="Title">20mm Calibration Cube</metadata>
  <metadata name="Designer">AnyFileX Core Lab</metadata>
  <metadata name="Application">Bambu Studio / AnyFileX</metadata>
  <metadata name="CreationDate">2026-09-22</metadata>
  <resources>
    <object id="1" type="model" name="Calibration Cube 20mm">
      <mesh>
        <vertices>
          <vertex x="-10" y="-10" z="0"/>
          <vertex x="10" y="-10" z="0"/>
          <vertex x="10" y="10" z="0"/>
          <vertex x="-10" y="10" z="0"/>
          <vertex x="-10" y="-10" z="20"/>
          <vertex x="10" y="-10" z="20"/>
          <vertex x="10" y="10" z="20"/>
          <vertex x="-10" y="10" z="20"/>
        </vertices>
        <triangles>
          <triangle v1="0" v2="2" v3="1"/>
          <triangle v1="0" v2="3" v3="2"/>
          <triangle v1="4" v2="5" v3="6"/>
          <triangle v1="4" v2="6" v3="7"/>
          <triangle v1="0" v2="1" v3="5"/>
          <triangle v1="0" v2="5" v3="4"/>
          <triangle v1="2" v2="3" v3="7"/>
          <triangle v1="2" v2="7" v3="6"/>
          <triangle v1="3" v2="0" v3="4"/>
          <triangle v1="3" v2="4" v3="7"/>
          <triangle v1="1" v2="2" v3="6"/>
          <triangle v1="1" v2="6" v3="5"/>
        </triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="1"/>
  </build>
</model>`;
  zip.file('3D/3dmodel.model', modelXml);

  const blob = await zip.generateAsync({ type: 'arraybuffer' });
  return blob;
}
