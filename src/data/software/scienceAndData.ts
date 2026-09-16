import { SoftwareInfo } from '../../types';

export const SCIENCE_AND_DATA_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'matlab',
    name: 'MathWorks MATLAB',
    developer: 'MathWorks, Inc.',
    category: 'Medical & Science',
    description: 'Numeric computing environment and programming language for engineers and scientists.',
    longDescription: 'MATLAB combines a desktop environment tuned for iterative analysis and design processes with a programming language that expresses matrix and array mathematics directly.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Paid',
    priceText: '$860 / year or Student License',
    websiteUrl: 'https://mathworks.com/products/matlab.html',
    downloadUrl: 'https://mathworks.com/downloads',
    supportedExtensions: ['M', 'MAT', 'FIG', 'SLX', 'MDL', 'MEX', 'P'],
    rating: 4.8,
    reviewCount: 32000,
    features: [
      'Matrix-based mathematics engine optimized for linear algebra',
      '2D and 3D data visualization plotting libraries',
      'Simulink block diagram environment for multi-domain simulation'
    ],
    alternatives: [
      { name: 'GNU Octave', slug: 'gnu-octave', description: 'Free open source MATLAB alternative.' },
      { name: 'Jupyter Notebook', slug: 'jupyter-notebook', description: 'Interactive Python data science notebook.' }
    ]
  },
  {
    id: 'rstudio',
    name: 'Posit RStudio Desktop',
    developer: 'Posit, PBC (RStudio)',
    category: 'Medical & Science',
    description: 'Premier Integrated Development Environment (IDE) for R statistical computing and data science.',
    longDescription: 'RStudio is an integrated development environment for R and Python, with a console, syntax-highlighting editor that supports direct code execution, and tools for plotting, history, debugging and workspace management.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source Desktop',
    websiteUrl: 'https://posit.co/download/rstudio-desktop/',
    downloadUrl: 'https://posit.co/download/rstudio-desktop/',
    supportedExtensions: ['R', 'RMD', 'RDATA', 'RDS', 'CSV', 'SHINY'],
    rating: 4.9,
    reviewCount: 29000,
    features: [
      'Integrated ggplot2 chart viewer and data table inspector',
      'R Markdown and Quarto notebook interactive publishing',
      'Package management with CRAN ecosystem integration'
    ],
    alternatives: [
      { name: 'Jupyter Notebook', slug: 'jupyter-notebook', description: 'Python data science environment.' }
    ]
  },
  {
    id: 'horos',
    name: 'Horos Medical Viewer',
    developer: 'Horos Project / Purview',
    category: 'Medical & Science',
    description: 'Free open-source medical image viewer for macOS designed for viewing CT, MRI, and DICOM medical scans.',
    longDescription: 'Horos is a free, open-source medical image viewer for macOS based on OsiriX. It allows radiologists and medical researchers to inspect, measure, 3D reconstruct, and analyze DICOM radiology images.',
    supportedOS: ['mac'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://horosproject.org',
    downloadUrl: 'https://horosproject.org/download-horos/',
    supportedExtensions: ['DCM', 'DICOM', 'NII', 'NIFTI', 'MHA'],
    rating: 4.8,
    reviewCount: 14200,
    features: [
      'Multiplanar reconstruction (MPR) and 3D volume rendering',
      'PACS network integration (C-STORE, C-FIND, C-GET)',
      'Patient metadata anonymization and ROI measurement tools'
    ],
    alternatives: [
      { name: 'OsiriX MD', slug: 'osirix', description: 'FDA approved commercial DICOM station for macOS.' },
      { name: 'MicroDicom', slug: 'microdicom', description: 'Free DICOM viewer for Windows.' }
    ]
  },
  {
    id: '3d-slicer',
    name: '3D Slicer',
    developer: 'Slicer Community / NIH',
    category: 'Medical & Science',
    description: 'Open-source software platform for medical image informatics, image processing, and 3D visualization.',
    longDescription: '3D Slicer is a free open-source software application for medical image computing, neuroimaging, and 3D visualization. It integrates advanced segmentation, registration, and surgical simulation algorithms.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://slicer.org',
    downloadUrl: 'https://download.slicer.org/',
    supportedExtensions: ['NII', 'NIFTI', 'DCM', 'DICOM', 'NRRD', 'MHA', 'STL', 'OBJ', 'VTK'],
    rating: 4.9,
    reviewCount: 18900,
    features: [
      'Automated organ segmentation and brain tractography',
      'Interactive 3D model creation from MRI / CT slices',
      'Extensible Python extension ecosystem'
    ],
    alternatives: [
      { name: 'ITK-SNAP', slug: 'itk-snap', description: 'Medical image segmentation tool.' }
    ]
  },
  {
    id: 'pymol',
    name: 'PyMOL Molecular Graphics',
    developer: 'Schrödinger, Inc.',
    category: 'Medical & Science',
    description: 'User-sponsored molecular visualization system for rendered 3D chemical structures and protein crystal ribbons.',
    longDescription: 'PyMOL is an open-source molecular visualization system created by Warren Lyford DeLano and developed by Schrödinger. It produces high-quality 3D images of small molecules and biological macromolecules such as proteins and nucleic acids.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Open Source Core / Educational',
    websiteUrl: 'https://pymol.org',
    downloadUrl: 'https://pymol.org',
    supportedExtensions: ['PDB', 'MMCIF', 'MOL2', 'SDF', 'XYZ'],
    rating: 4.9,
    reviewCount: 22400,
    features: [
      'Ray-traced 3D rendering of secondary protein structures',
      'Ligand binding site hydrogen bond measurement',
      'Python scripting API for automated molecular animations'
    ],
    alternatives: [
      { name: 'UCSF ChimeraX', slug: 'chimerax', description: 'Interactive molecular visualization software.' }
    ]
  },
  {
    id: 'qgis',
    name: 'QGIS GIS Platform',
    developer: 'QGIS Association',
    category: 'Medical & Science',
    description: 'Free open source Geographic Information System (GIS) for viewing, editing, and analyzing spatial data.',
    longDescription: 'QGIS is a user friendly Open Source Geographic Information System (GIS). Analyze vector shapefiles, raster elevation DEMs, LiDAR point clouds, and compose high-resolution geographic maps.',
    supportedOS: ['windows', 'mac', 'linux', 'android'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://qgis.org',
    downloadUrl: 'https://qgis.org/en/site/forusers/download.html',
    supportedExtensions: ['SHP', 'KML', 'KMZ', 'GEOJSON', 'GPX', 'TIF', 'TIFF', 'GEOTIFF', 'LAS', 'LAZ', 'GPKG'],
    rating: 4.9,
    reviewCount: 31000,
    features: [
      'Geospatial vector shapefile and GeoJSON editing',
      'Raster map projection, hillshade, and elevation contouring',
      'Integration with PostGIS databases and WMS map servers'
    ],
    alternatives: [
      { name: 'ArcGIS Pro', slug: 'arcgis-pro', description: 'Commercial ESRI GIS platform.' },
      { name: 'Google Earth Pro', slug: 'google-earth-pro', description: '3D satellite imagery viewer.' }
    ]
  },
  {
    id: 'google-earth-pro',
    name: 'Google Earth Pro',
    developer: 'Google LLC',
    category: 'Medical & Science',
    description: '3D virtual globe program for exploring global satellite imagery, terrain, 3D buildings, and GIS KML files.',
    longDescription: 'Google Earth Pro is a free geospatial software that displays a 3D representation of Earth based primarily on satellite imagery. Fly anywhere on Earth to view 3D buildings, imagery, and elevation data.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Desktop App',
    websiteUrl: 'https://google.com/earth/versions/#earth-pro',
    downloadUrl: 'https://google.com/earth/versions/#earth-pro',
    supportedExtensions: ['KML', 'KMZ', 'GPX', 'CSV', 'SHP'],
    rating: 4.8,
    reviewCount: 72000,
    features: [
      'High-resolution historical satellite imagery timeline slider',
      'Import and display KML and KMZ GPS tracking routes',
      'Export high-resolution geographic map print graphics'
    ],
    alternatives: [
      { name: 'QGIS', slug: 'qgis', description: 'Open source GIS mapping suite.' }
    ]
  },
  {
    id: 'ibm-spss',
    name: 'IBM SPSS Statistics',
    developer: 'IBM Corporation',
    category: 'Medical & Science',
    description: 'Statistical software suite used for data management, advanced analytics, multivariate analysis, and business intelligence.',
    longDescription: 'IBM SPSS Statistics is a statistical software suite used by healthcare researchers, social scientists, and marketing analysts for hypothesis testing, predictive modeling, and data management.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$99 / month',
    websiteUrl: 'https://ibm.com/products/spss-statistics',
    downloadUrl: 'https://ibm.com/products/spss-statistics',
    supportedExtensions: ['SAV', 'POR', 'SPS', 'DTA', 'CSV', 'XLSX'],
    rating: 4.6,
    reviewCount: 28900,
    features: [
      'Comprehensive parametric and non-parametric statistical tests',
      'ANOVA, regression analysis, factor analysis, and clustering',
      'Export chart graphics to high-resolution publication formats'
    ],
    alternatives: [
      { name: 'GNU PSPP', slug: 'pspp', description: 'Free open source alternative to IBM SPSS.' },
      { name: 'RStudio', slug: 'rstudio', description: 'Premier IDE for R statistical computing.' }
    ]
  }
];
