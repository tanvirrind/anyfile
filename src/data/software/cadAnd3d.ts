import { SoftwareInfo } from '../../types';

export const CAD_AND_3D_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'autocad',
    name: 'Autodesk AutoCAD',
    developer: 'Autodesk Inc.',
    category: 'CAD & Engineering',
    description: 'Computer-aided design (CAD) software for precise 2D drafting and 3D architectural modeling.',
    longDescription: 'Autodesk AutoCAD is the gold standard computer-aided design software trusted by millions of architects, mechanical engineers, and construction managers. It enables high-precision vector drafting, 3D surface modeling, mechanical component layout, and automated documentation.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$245 / month',
    websiteUrl: 'https://autodesk.com/products/autocad',
    downloadUrl: 'https://autodesk.com/products/autocad',
    supportedExtensions: ['DWG', 'DXF', 'DWT', 'DWF', 'STEP', 'IGES', 'STL', 'OBJ', 'PDF', 'PLT'],
    rating: 4.7,
    reviewCount: 31200,
    features: [
      '2D geometry drafting and parametric dimensioning',
      '3D mesh & solid modeling with material rendering',
      'AutoLISP & VBA custom macro automation',
      'Cloud DWG collaboration and mobile redlining',
      'BIM structural component library integration'
    ],
    alternatives: [
      { name: 'DWG TrueView', slug: 'dwg-trueview', description: 'Official free DWG viewer and converter from Autodesk.' },
      { name: 'LibreCAD', slug: 'librecad', description: 'Free open source 2D CAD drafting tool for Linux, Mac, and Windows.' },
      { name: 'FreeCAD', slug: 'freecad', description: 'Open source 3D parametric CAD modeler.' }
    ],
    tutorials: [
      { title: 'How to Open DWG Drawings in AutoCAD', description: 'Step-by-step guide to importing DWG files, managing layers, and viewing XREFs.', readTime: '5 min' },
      { title: 'Exporting DWG to DXF for Laser Cutting', description: 'Convert binary DWG drawings into open ASCII DXF vector paths.', readTime: '4 min' }
    ]
  },
  {
    id: 'blender',
    name: 'Blender 3D Suite',
    developer: 'Blender Foundation',
    category: '3D & Animation',
    description: 'Free open source 3D creation suite supporting modeling, rigging, animation, simulation, and rendering.',
    longDescription: 'Blender is a free and open-source 3D creation suite supporting the entire 3D pipeline—modeling, rigging, animation, physics simulation, photorealistic rendering (Cycles & Eevee), compositing, motion tracking, and video editing.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: '100% Free Open Source',
    websiteUrl: 'https://blender.org',
    downloadUrl: 'https://blender.org/download/',
    supportedExtensions: ['BLEND', 'OBJ', 'FBX', 'STL', 'GLTF', 'GLB', 'DAE', 'PLY', 'ABC', 'USD'],
    rating: 4.9,
    reviewCount: 59000,
    features: [
      'Cycles photorealistic ray-tracing render engine',
      'Sculpting brushes with dynamic topology',
      'Grease Pencil 2D animation in 3D viewport',
      'Python scripting API for automated workflows',
      'VFX motion tracking and green-screen keying'
    ],
    alternatives: [
      { name: 'Autodesk Maya', slug: 'autodesk-maya', description: 'Industry standard character animation software.' },
      { name: 'Cinema 4D', slug: 'cinema-4d', description: 'Motion graphics 3D modeling application.' }
    ]
  },
  {
    id: 'solidworks',
    name: 'SolidWorks 3D CAD',
    developer: 'Dassault Systèmes',
    category: 'CAD & Engineering',
    description: 'Parametric 3D mechanical design software for engineering, simulation, and product data management.',
    longDescription: 'SolidWorks is the industry premier parametric 3D CAD design software. Used by mechanical design engineers to model solid components, assemble complex machinery, simulate structural stress, and generate manufacturing drawings.',
    supportedOS: ['windows'],
    priceType: 'Paid',
    priceText: '$4,195 upfront + subscription',
    websiteUrl: 'https://solidworks.com',
    downloadUrl: 'https://solidworks.com',
    supportedExtensions: ['SLDPRT', 'SLDASM', 'SLDDRW', 'STEP', 'STP', 'IGES', 'IGS', 'SAT', 'STL'],
    rating: 4.8,
    reviewCount: 26800,
    features: [
      'Parametric feature-based solid part modeling',
      'Finite Element Analysis (FEA) structural stress simulation',
      'Automated 2D engineering drawing generation with BOM tables'
    ],
    alternatives: [
      { name: 'Autodesk Inventor', slug: 'autodesk-inventor', description: '3D mechanical engineering CAD.' },
      { name: 'Fusion 360', slug: 'autodesk-fusion360', description: 'Cloud 3D CAD/CAM software.' }
    ]
  },
  {
    id: 'autodesk-fusion',
    name: 'Autodesk Fusion 360',
    developer: 'Autodesk Inc.',
    category: 'CAD & Engineering',
    description: 'Cloud-based 3D CAD, CAM, CAE, and PCB design software platform for product development.',
    longDescription: 'Autodesk Fusion 360 integrates 3D CAD parametric modeling, generative design, mechanical simulation, PCB electronics schematic layout, and CNC machine toolpath (CAM) generation.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$545 / year (Free Personal Use)',
    websiteUrl: 'https://autodesk.com/products/fusion-360',
    downloadUrl: 'https://autodesk.com/products/fusion-360/personal',
    supportedExtensions: ['F3D', 'STEP', 'STP', 'IGES', 'STL', 'OBJ', 'DXF', 'DWG', 'SAT'],
    rating: 4.7,
    reviewCount: 22400,
    features: [
      'Integrated CAD and CNC toolpath generation (CAM)',
      'Generative design AI structural optimization',
      'Cloud parametric history sync across devices'
    ],
    alternatives: [
      { name: 'Onshape', slug: 'onshape', description: 'Browser cloud CAD platform.' },
      { name: 'FreeCAD', slug: 'freecad', description: 'Open source parametric 3D CAD.' }
    ]
  },
  {
    id: 'sketchup',
    name: 'Trimble SketchUp',
    developer: 'Trimble Inc.',
    category: 'CAD & Engineering',
    description: 'Intuitive 3D modeling software for architecture, interior design, civil engineering, and woodworking.',
    longDescription: 'Trimble SketchUp is an easy-to-learn 3D modeling application used by architects, home builders, and woodworkers. Draw lines and push/pull surfaces to build 3D structures with 3D Warehouse model library integration.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Freemium',
    priceText: 'Free Web App / $119 / year Pro',
    websiteUrl: 'https://sketchup.com',
    downloadUrl: 'https://sketchup.com/download',
    supportedExtensions: ['SKP', 'DWG', 'DXF', '3DS', 'DAE', 'OBJ', 'STL', 'KMZ'],
    rating: 4.6,
    reviewCount: 38200,
    features: [
      'Push/Pull 3D geometry extrusion interface',
      'Access to millions of free pre-made 3D Warehouse assets',
      'LayOut documentation tool for construction plans'
    ],
    alternatives: [
      { name: 'Sweet Home 3D', slug: 'sweet-home-3d', description: 'Free interior design application.' },
      { name: 'Blender', slug: 'blender', description: 'Open source 3D modeling.' }
    ]
  },
  {
    id: 'freecad',
    name: 'FreeCAD 3D Modeler',
    developer: 'FreeCAD Community',
    category: 'CAD & Engineering',
    description: 'Free open source parametric 3D CAD modeler made primarily to design real-life objects of any size.',
    longDescription: 'FreeCAD is a customizable open-source 3D CAD modeler that features a modular architecture. Modify models by going back into parameter history with OpenCASCADE technology.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://freecad.org',
    downloadUrl: 'https://freecad.org/downloads.php',
    supportedExtensions: ['FCSTD', 'STEP', 'STP', 'IGES', 'STL', 'OBJ', 'DXF', 'DAE', 'SVG'],
    rating: 4.5,
    reviewCount: 19400,
    features: [
      'Parametric modeling with full feature constraint history',
      'Finite Element Analysis (FEA) solver workbench',
      'Python scripting API and customizable workbench modules'
    ],
    alternatives: [
      { name: 'Autodesk Fusion', slug: 'autodesk-fusion', description: 'Cloud parametric CAD.' }
    ]
  },
  {
    id: 'librecad',
    name: 'LibreCAD 2D',
    developer: 'LibreCAD Team',
    category: 'CAD & Engineering',
    description: 'Free open source 2D CAD drafting application for Windows, Mac, and Linux.',
    longDescription: 'LibreCAD is a free Open Source 2D CAD application for Windows, Apple and Linux. It uses the AutoCAD DXF format for saving and importing 2D technical drawings.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://librecad.org',
    downloadUrl: 'https://librecad.org/#download',
    supportedExtensions: ['DXF', 'DWG', 'JWW', 'SVG', 'PNG'],
    rating: 4.4,
    reviewCount: 11200,
    features: [
      '2D vector drafting with snap-to-grid tools',
      'Reads and writes AutoCAD DXF vector files',
      'Zero license costs or commercial restriction'
    ],
    alternatives: [
      { name: 'QCAD', slug: 'qcad', description: '2D CAD drafting system.' }
    ]
  },
  {
    id: 'autodesk-maya',
    name: 'Autodesk Maya',
    developer: 'Autodesk Inc.',
    category: '3D & Animation',
    description: '3D computer animation, modeling, simulation, and rendering software used in movies and AAA gaming.',
    longDescription: 'Autodesk Maya is the Hollywood visual effects and video game industry standard 3D animation software. Features character rigging, cloth and hair physics simulation, and Arnold renderer.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Paid',
    priceText: '$235 / month',
    websiteUrl: 'https://autodesk.com/products/maya',
    downloadUrl: 'https://autodesk.com/products/maya',
    supportedExtensions: ['MA', 'MB', 'OBJ', 'FBX', 'ABC', 'USD', 'DAE', 'STL'],
    rating: 4.8,
    reviewCount: 24500,
    features: [
      'Bifrost procedural fluid dynamics and particle effects',
      'Non-linear character animation and inverse kinematics rigging',
      'Integrated Arnold photorealistic ray-tracing renderer'
    ],
    alternatives: [
      { name: 'Blender', slug: 'blender', description: 'Free open source 3D suite.' },
      { name: 'Cinema 4D', slug: 'cinema-4d', description: '3D motion graphics software.' }
    ]
  },
  {
    id: 'cinema-4d',
    name: 'Maxon Cinema 4D',
    developer: 'Maxon Computer',
    category: '3D & Animation',
    description: 'Professional 3D modeling, animation, simulation, and rendering software built for motion design.',
    longDescription: 'Cinema 4D is a professional 3D modeling, animation, simulation and rendering software solution. Fast, powerful, flexible and stable toolset makes 3D workflows accessible for motion graphic artists.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$60 / month',
    websiteUrl: 'https://maxon.net/cinema-4d',
    downloadUrl: 'https://maxon.net/downloads',
    supportedExtensions: ['C4D', 'OBJ', 'FBX', 'ABC', 'USD', 'GLTF', 'DXF'],
    rating: 4.8,
    reviewCount: 18900,
    features: [
      'MoGraph procedural motion graphics generator toolset',
      'Redshift GPU renderer integration',
      'Unified physics simulation system for soft and rigid bodies'
    ],
    alternatives: [
      { name: 'Blender', slug: 'blender', description: 'Free open source 3D tool.' }
    ]
  },
  {
    id: 'zbrush',
    name: 'Maxon ZBrush',
    developer: 'Maxon / Pixologic',
    category: '3D & Animation',
    description: 'Industry standard 3D digital sculpting and painting software for high-detail character creation.',
    longDescription: 'ZBrush is the digital sculpting standard for movie creature design, video game character art, and 3D print toy prototyping. Manipulate millions of virtual clay polygons in real time.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$39 / month',
    websiteUrl: 'https://maxon.net/zbrush',
    downloadUrl: 'https://maxon.net/downloads',
    supportedExtensions: ['ZTL', 'ZPR', 'OBJ', 'STL', 'PLY', 'FBX', 'MA'],
    rating: 4.9,
    reviewCount: 21500,
    features: [
      'DynaMesh dynamic polygon resolution virtual clay sculpting',
      'ZRemesher automated quad retopology engine',
      'SubTool multi-component mesh organization'
    ],
    alternatives: [
      { name: 'Mudbox', slug: 'autodesk-mudbox', description: 'Digital 3D sculpting software.' },
      { name: 'Blender', slug: 'blender', description: 'Includes 3D sculpting brushes.' }
    ]
  },
  {
    id: 'rhino-3d',
    name: 'Rhinoceros 3D (Rhino)',
    developer: 'Robert McNeel & Associates',
    category: 'CAD & Engineering',
    description: 'NURBS-based 3D modeling software for industrial design, architecture, and naval engineering.',
    longDescription: 'Rhino 3D can create, edit, analyze, document, render, animate, and translate NURBS curves, surfaces, and solids with no limits on complexity or size.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$995 one-time license',
    websiteUrl: 'https://rhino3d.com',
    downloadUrl: 'https://rhino3d.com/download/',
    supportedExtensions: ['3DM', 'STEP', 'IGES', 'DWG', 'DXF', 'STL', 'OBJ', 'GH'],
    rating: 4.8,
    reviewCount: 17800,
    features: [
      'NURBS mathematical surface modeling precision',
      'Grasshopper visual algorithmic parametric programming',
      'SubD freeform organic surface modeling'
    ],
    alternatives: [
      { name: 'SolidWorks', slug: 'solidworks', description: 'Parametric CAD.' }
    ]
  },
  {
    id: 'revit',
    name: 'Autodesk Revit',
    developer: 'Autodesk Inc.',
    category: 'CAD & Engineering',
    description: 'Building Information Modeling (BIM) software for architects, structural engineers, and contractors.',
    longDescription: 'Autodesk Revit is the premier BIM software platform for architectural design, MEP engineering, structural engineering, and construction coordination. Build intelligent 3D model parametric building components.',
    supportedOS: ['windows'],
    priceType: 'Paid',
    priceText: '$355 / month',
    websiteUrl: 'https://autodesk.com/products/revit',
    downloadUrl: 'https://autodesk.com/products/revit',
    supportedExtensions: ['RVT', 'RFA', 'RTE', 'IFC', 'DWG', 'DXF', 'DGN', 'FBX'],
    rating: 4.7,
    reviewCount: 21000,
    features: [
      'Parametric BIM building components with scheduling data',
      'Multidisciplinary MEP and structural clash detection',
      'Automated floor plan, section, and elevation view generation'
    ],
    alternatives: [
      { name: 'ArchiCAD', slug: 'archicad', description: 'BIM architecture software for Mac and Windows.' }
    ]
  },
  {
    id: 'archicad',
    name: 'Graphisoft Archicad',
    developer: 'Graphisoft',
    category: 'CAD & Engineering',
    description: 'Architectural BIM design software with native macOS and Windows multi-platform support.',
    longDescription: 'Graphisoft Archicad is the leading BIM software solution for architects. Design and document projects of any size with intuitive building component tools.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$240 / month',
    websiteUrl: 'https://graphisoft.com/solutions/archicad',
    downloadUrl: 'https://graphisoft.com/downloads',
    supportedExtensions: ['PLN', 'PLA', 'MOD', 'IFC', 'DWG', 'DXF', '3DS'],
    rating: 4.7,
    reviewCount: 13200,
    features: [
      'BIMcloud real-time team collaboration',
      'Native Apple Silicon hardware acceleration',
      'Energy evaluation and sustainable design calculations'
    ],
    alternatives: [
      { name: 'Autodesk Revit', slug: 'revit', description: 'BIM building design software.' }
    ]
  },
  {
    id: 'meshlab',
    name: 'MeshLab 3D System',
    developer: 'ISTI - CNR',
    category: 'CAD & Engineering',
    description: 'Open source system for processing and editing unstructured 3D triangular meshes.',
    longDescription: 'MeshLab is an open source, portable, and extensible system for the processing and editing of unstructured 3D triangular meshes. Cleaning, converting, and rendering 3D scanning point clouds.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://meshlab.net',
    downloadUrl: 'https://meshlab.net/#download',
    supportedExtensions: ['PLY', 'STL', 'OFF', 'OBJ', '3DS', 'COLLADA', 'PTX', 'E57'],
    rating: 4.6,
    reviewCount: 14200,
    features: [
      '3D mesh surface simplification and decimation filters',
      'Point cloud normal calculation and Poisson surface reconstruction',
      'Automatic hole filling and non-manifold edge repairing'
    ],
    alternatives: [
      { name: 'CloudCompare', slug: 'cloudcompare', description: '3D point cloud editor.' }
    ]
  },
  {
    id: 'cloudcompare',
    name: 'CloudCompare 3D',
    developer: 'CloudCompare Project',
    category: 'CAD & Engineering',
    description: 'Free open-source 3D point cloud and triangular mesh processing software for LiDAR and photogrammetry.',
    longDescription: 'CloudCompare is a 3D point cloud and triangular mesh processing software. Designed to perform comparison between two dense 3D point clouds, or between a point cloud and a triangular mesh.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://cloudcompare.org',
    downloadUrl: 'https://cloudcompare.org',
    supportedExtensions: ['LAS', 'LAZ', 'PCD', 'PLY', 'E57', 'XYZ', 'OBJ', 'STL'],
    rating: 4.8,
    reviewCount: 16800,
    features: [
      'LiDAR point classification and cloud subsampling',
      'Distance computation between 3D surfaces',
      'RGB color mapping and intensity scalar field adjustment'
    ],
    alternatives: [
      { name: 'MeshLab', slug: 'meshlab', description: 'Open source 3D mesh processing.' }
    ]
  }
];
