import { ExtensionSchema } from '../lib/database/extensionEngine';

export const SPECIALIZED_EXTENSIONS_DATA: ExtensionSchema[] = [
  // ==========================================
  // 1. MEDICAL & HEALTHCARE (DICOM, DCM, NII, NIFTI, etc.)
  // ==========================================
  {
    slug: 'dcm',
    extension: 'DCM',
    title: '.DCM File Extension - DICOM Medical Imaging Specification',
    description: 'DCM (Digital Imaging and Communications in Medicine) is the international standard format for storing, viewing, and transmitting medical scans including CT, MRI, Ultrasound, and X-ray images along with patient metadata.',
    category: 'Medical & Science',
    mime: 'application/dicom',
    developer: 'NEMA / DICOM Standards Committee',
    software: ['Horos (macOS)', 'OsiriX MD', 'MicroDicom Viewer', 'RadiAnt DICOM Viewer', '3D Slicer', 'Orthanc PACS Server'],
    related_extensions: ['DICOM', 'NII', 'NIFTI', 'MHA'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['dcm-to-jpg', 'dcm-to-png', 'dcm-to-pdf', 'dcm-to-nii'],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['DCM files store Protected Health Information (PHI) in headers; ensure HIPAA compliance and anonymization when sharing']
    },
    keywords: ['dcm file', 'open dicom', 'dicom medical viewer', 'ct scan dcm', 'mri dicom file']
  },
  {
    slug: 'dicom',
    extension: 'DICOM',
    title: '.DICOM File Extension - Digital Imaging in Medicine Format',
    description: 'DICOM is the alias extension for DCM medical image files, incorporating NEMA standard tag attributes for patient demographics, acquisition modalities, pixel spacing, and 3D volume slices.',
    category: 'Medical & Science',
    mime: 'application/dicom',
    developer: 'National Electrical Manufacturers Association (NEMA)',
    software: ['Horos', 'RadiAnt DICOM Viewer', 'MicroDicom', '3D Slicer', 'OsiriX'],
    related_extensions: ['DCM', 'NII', 'ANALYZE'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['dicom-to-jpeg', 'dicom-to-png', 'dicom-to-pdf'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Use PACS servers or dedicated DICOM viewing software to reconstruct multi-slice 3D volumes'] },
    keywords: ['dicom file', 'open dicom file', 'radiology scan viewer']
  },
  {
    slug: 'nii',
    extension: 'NII',
    title: '.NII File Extension - NIfTI-1 Medical Neuroimaging Format',
    description: 'NII (Neuroimaging Informatics Technology Initiative) is a file format widely used in neuroscience and brain imaging research to store 3D and 4D functional Magnetic Resonance Imaging (fMRI) data.',
    category: 'Medical & Science',
    mime: 'application/octet-stream',
    developer: 'NIfTI Data Format Working Group / NIH',
    software: ['3D Slicer', 'FSL (FMRIB Software Library)', 'SPM (Statistical Parametric Mapping)', 'ITK-SNAP', 'Mango Viewer'],
    related_extensions: ['NIFTI', 'NIIGZ', 'DCM', 'HDR'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['nii-to-dcm', 'nii-to-png'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['NIfTI files combine spatial affine transform matrices to map brain coordinates precisely'] },
    keywords: ['nii file', 'open nii', 'nifti neuroimaging', 'fmri brain scan', '3d slicer nii']
  },

  // ==========================================
  // 2. BIOINFORMATICS & GENOMICS (FASTA, BAM, SAM, PDB, FASTQ)
  // ==========================================
  {
    slug: 'fasta',
    extension: 'FASTA',
    title: '.FASTA File Extension - DNA, RNA & Protein Sequence Format',
    description: 'FASTA (often .fa or .fasta) is a text-based format for representing nucleotide or amino acid sequences, where nucleic acids or proteins are represented using single-letter codes.',
    category: 'Medical & Science',
    mime: 'text/plain',
    developer: 'David J. Lipman & William R. Pearson',
    software: ['NCBI BLAST', 'UCSC Genome Browser', 'SnapGene', 'UGENE', 'Biopython', 'MEGA (Molecular Evolutionary Genetics Analysis)'],
    related_extensions: ['FA', 'FASTQ', 'BAM', 'SAM', 'PDB'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['fasta-to-fastq', 'fasta-to-phy'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Text file starting with a header line beginning with a greater-than (>) symbol'] },
    keywords: ['fasta file', 'open fasta', 'dna sequence fasta', 'ncbi blast', 'biopython fasta']
  },
  {
    slug: 'fa',
    extension: 'FA',
    title: '.FA File Extension - FASTA Genomic Sequence Short Extension',
    description: 'FA is the common shorthand extension for FASTA sequence files used in bioinformatics pipelines, sequence alignment tools, and gene annotation databases.',
    category: 'Medical & Science',
    mime: 'text/plain',
    developer: 'David J. Lipman / Pearson',
    software: ['SnapGene', 'UGENE', 'IGV (Integrative Genomics Viewer)', 'Biopython', 'VS Code'],
    related_extensions: ['FASTA', 'FASTQ', 'BAM'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['fa-to-fasta'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Shorthand extension for FASTA DNA/RNA text sequence records'] },
    keywords: ['fa file', 'open fa sequence', 'genomic fa file']
  },
  {
    slug: 'bam',
    extension: 'BAM',
    title: '.BAM File Extension - Binary Alignment Map for Next-Gen Sequencing',
    description: 'BAM is the compressed binary representation of Sequence Alignment Map (SAM) files, storing aligned high-throughput next-generation sequencing (NGS) reads against a reference genome.',
    category: 'Medical & Science',
    mime: 'application/octet-stream',
    developer: 'Heng Li / SAMtools / Global Genomics Community',
    software: ['SAMtools', 'IGV (Integrative Genomics Viewer)', 'UCSC Genome Browser', 'UGENE', 'GATK (Genome Analysis Toolkit)'],
    related_extensions: ['SAM', 'CRAM', 'BAI', 'FASTA'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['bam-to-sam', 'bam-to-fastq', 'bam-to-cram'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Indexed using an accompanying .bai file for rapid random access in genome browsers'] },
    keywords: ['bam file', 'open bam file', 'samtools bam', 'igv genome viewer', 'ngs sequence alignment']
  },
  {
    slug: 'sam',
    extension: 'SAM',
    title: '.SAM File Extension - Sequence Alignment Map Text Specification',
    description: 'SAM (Sequence Alignment Map) is a tab-delimited text format for storing biological sequences aligned to a reference sequence, created for high-throughput DNA sequencers.',
    category: 'Medical & Science',
    mime: 'text/plain',
    developer: 'Heng Li et al. / SAMtools',
    software: ['SAMtools', 'IGV', 'UGENE', 'VS Code', 'BioPerl / Biopython'],
    related_extensions: ['BAM', 'CRAM', 'FASTQ'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['sam-to-bam'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Text equivalent of BAM; convert to binary BAM for faster pipeline throughput'] },
    keywords: ['sam file', 'open sam file', 'sequence alignment map', 'samtools']
  },
  {
    slug: 'pdb',
    extension: 'PDB',
    title: '.PDB File Extension - Protein Data Bank 3D Molecular Structure',
    description: 'PDB (Protein Data Bank) format holds 3D atomic coordinates of biological macromolecules (proteins, nucleic acids, complex enzymes) solved via X-ray crystallography or Cryo-EM.',
    category: 'Medical & Science',
    mime: 'chemical/x-pdb',
    developer: 'WWPDB (Worldwide Protein Data Bank)',
    software: ['PyMOL', 'UCSF ChimeraX', 'VMD (Visual Molecular Dynamics)', 'Rasmol', 'Avogadro', 'Swiss-PdbViewer'],
    related_extensions: ['MMCIF', 'MOL2', 'SDF', 'XYZ'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['pdb-to-mmcif', 'pdb-to-mol2', 'pdb-to-stl'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Visualized in 3D using PyMOL or UCSF ChimeraX to render ribbons, secondary structures, and ligand bonds'] },
    keywords: ['pdb file', 'open pdb molecular structure', 'pymol pdb', 'protein data bank', 'ucsf chimera']
  },

  // ==========================================
  // 3. SCIENTIFIC, ENGINEERING & HIGH-PERFORMANCE COMPUTING (MAT, HDF5, NETCDF)
  // ==========================================
  {
    slug: 'mat',
    extension: 'MAT',
    title: '.MAT File Extension - MATLAB Binary Data Workspace',
    description: 'MAT is the proprietary binary or HDF5-based data container used by MathWorks MATLAB to store variables, numeric arrays, multidimensional matrices, structs, and cell arrays.',
    category: 'Medical & Science',
    mime: 'application/x-matlab-data',
    developer: 'The MathWorks Inc.',
    software: ['MathWorks MATLAB', 'GNU Octave (Free)', 'SciPy (Python scipy.io)', 'MATLAB Mobile'],
    related_extensions: ['M', 'FIG', 'SLX', 'H5'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['mat-to-csv', 'mat-to-json', 'mat-to-h5'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Load without MATLAB using SciPy in Python: scipy.io.loadmat("filename.mat")'] },
    keywords: ['mat file', 'open mat', 'matlab data file', 'gnu octave', 'scipy loadmat']
  },
  {
    slug: 'hdf5',
    extension: 'HDF5',
    title: '.HDF5 File Extension - Hierarchical Data Format Version 5',
    description: 'HDF5 (Hierarchical Data Format 5) is a high-performance data model and file format designed by the HDF Group to store and manage massive, complex multidimensional scientific datasets.',
    category: 'Medical & Science',
    mime: 'application/x-hdf5',
    developer: 'The HDF Group / NCSA',
    software: ['HDFView', 'Panoply (NASA)', 'Python (h5py / PyTables)', 'R (rhdf5)', 'MathWorks MATLAB'],
    related_extensions: ['H5', 'NC', 'HE5', 'MAT'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['hdf5-to-csv', 'hdf5-to-netcdf'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Organized internally like a filesystem with groups and datasets; view in HDFView'] },
    keywords: ['hdf5 file', 'open hdf5', 'hdfview', 'h5py python', 'hierarchical data format']
  },
  {
    slug: 'h5',
    extension: 'H5',
    title: '.H5 File Extension - HDF5 Data Storage & AI Weights Reference',
    description: 'H5 is the standard shorthand extension for HDF5 containers, widely adopted in Machine Learning frameworks (TensorFlow, Keras) to store deep neural network model weights.',
    category: 'Medical & Science',
    mime: 'application/x-hdf5',
    developer: 'The HDF Group / Keras Team',
    software: ['HDFView', 'TensorFlow / Keras', 'Python h5py', 'Panoply', 'MATLAB'],
    related_extensions: ['HDF5', 'PKL', 'ONNX', 'SAFETENSORS'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['h5-to-onnx', 'h5-to-json'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Common model checkpoint format in Keras (model.save("model.h5"))'] },
    keywords: ['h5 file', 'open h5', 'keras h5 model weights', 'h5py viewer']
  },
  {
    slug: 'netcdf',
    extension: 'NETCDF',
    title: '.NetCDF File Extension - Network Common Data Form Specification',
    description: 'NetCDF (Network Common Data Form) is a set of software libraries and self-describing array-oriented data formats for climate science, meteorology, and oceanography.',
    category: 'Medical & Science',
    mime: 'application/x-netcdf',
    developer: 'Unidata / UCAR (University Corporation for Atmospheric Research)',
    software: ['Panoply Data Viewer', 'QGIS', 'ArcGIS Pro', 'Python (xarray / netCDF4)', 'NCAR Command Language (NCL)'],
    related_extensions: ['NC', 'GRIB', 'HDF5'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['netcdf-to-csv', 'netcdf-to-geotiff'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Standard format for satellite weather models, climate change forecasts, and ocean temperature grids'] },
    keywords: ['netcdf file', 'open netcdf', 'panoply nc viewer', 'unidata netcdf', 'xarray python']
  },
  {
    slug: 'nc',
    extension: 'NC',
    title: '.NC File Extension - NetCDF Climate & Spatial Grid Data',
    description: 'NC is the ubiquitous file extension shorthand for NetCDF containers, storing spatial temporal multidimensional climate grids.',
    category: 'Medical & Science',
    mime: 'application/x-netcdf',
    developer: 'Unidata / UCAR',
    software: ['Panoply', 'QGIS', 'ArcGIS Pro', 'Python xarray', 'MATLAB'],
    related_extensions: ['NETCDF', 'GRIB2', 'H5'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['nc-to-csv', 'nc-to-tif'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Open free in NASA Panoply data viewer to plot 2D geo maps'] },
    keywords: ['nc file', 'open nc file', 'panoply climate viewer', 'netcdf grid']
  },

  // ==========================================
  // 4. GEOSPATIAL & LIDAR (LAS, LAZ, SHP, GEOTIFF)
  // ==========================================
  {
    slug: 'las',
    extension: 'LAS',
    title: '.LAS File Extension - LASer LiDAR Point Cloud Specification',
    description: 'LAS is an open binary specification created by the American Society for Photogrammetry and Remote Sensing (ASPRS) for interchange of 3D LiDAR point cloud data.',
    category: 'Medical & Science',
    mime: 'application/octet-stream',
    developer: 'ASPRS (American Society for Photogrammetry & Remote Sensing)',
    software: ['CloudCompare', 'QGIS (with LASTools)', 'ArcGIS Pro', 'Global Mapper', 'PDAL (Point Data Abstraction Library)', 'MeshLab'],
    related_extensions: ['LAZ', 'PCD', 'PLY', 'XYZ'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['las-to-laz', 'las-to-xyz', 'las-to-ply', 'las-to-dxf'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Contains X, Y, Z spatial coordinates, GPS timestamps, laser return intensity, and RGB point classifications'] },
    keywords: ['las file', 'open las lidar', 'cloudcompare las viewer', 'asprs lidar specification', 'convert las to laz']
  },
  {
    slug: 'laz',
    extension: 'LAZ',
    title: '.LAZ File Extension - Compressed LAS LiDAR Point Cloud Format',
    description: 'LAZ is the lossless compressed format for LAS LiDAR data files developed by Martin Isenburg (LASzip), reducing file sizes by up to 85% without precision loss.',
    category: 'Medical & Science',
    mime: 'application/octet-stream',
    developer: 'Martin Isenburg / LASzip',
    software: ['CloudCompare', 'LASTools', 'QGIS', 'ArcGIS Pro', 'Global Mapper', 'PDAL'],
    related_extensions: ['LAS', 'E57', 'PCD'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['laz-to-las', 'laz-to-ply'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Decompress LAZ files using laszip CLI or view directly in CloudCompare'] },
    keywords: ['laz file', 'open laz', 'laszip compression', 'cloudcompare laz', 'lidar compression']
  },
  {
    slug: 'pcd',
    extension: 'PCD',
    title: '.PCD File Extension - Point Cloud Data File Format',
    description: 'PCD is the native 3D point cloud file format used by the Point Cloud Library (PCL) open-source framework for 3D spatial perception and robotics autonomous driving sensors.',
    category: 'Medical & Science',
    mime: 'application/octet-stream',
    developer: 'Point Cloud Library (PCL) Community',
    software: ['CloudCompare', 'PCL Viewer', 'ROS (Robot Operating System)', 'MeshLab', 'Blender'],
    related_extensions: ['PLY', 'LAS', 'XYZ', 'OBJ'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['pcd-to-ply', 'pcd-to-las', 'pcd-to-obj'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Primary sensor payload format captured by LiDAR units on autonomous vehicle test rigs'] },
    keywords: ['pcd file', 'open pcd point cloud', 'pcl viewer', 'robotics lidar format']
  },

  // ==========================================
  // 5. STATISTICAL & SOCIAL SCIENCE (SAV, POR, RDATA, RDS, SAS7BDAT)
  // ==========================================
  {
    slug: 'sav',
    extension: 'SAV',
    title: '.SAV File Extension - IBM SPSS Statistics Dataset',
    description: 'SAV is the binary database file format created by IBM SPSS Statistics, containing structured research survey responses, numeric variables, value labels, and dictionary metadata.',
    category: 'Medical & Science',
    mime: 'application/x-spss-sav',
    developer: 'IBM Corporation / SPSS Inc.',
    software: ['IBM SPSS Statistics', 'PSPP (Free Open Source)', 'R (haven package)', 'Python (pyreadstat / pandas)', 'Stata'],
    related_extensions: ['POR', 'SPS', 'DTA', 'RDATA'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['sav-to-csv', 'sav-to-excel', 'sav-to-rdata'],
    security: {
      dangerRating: 'Low Risk',
      canContainMalware: false,
      tips: ['Open for free without an SPSS license using GNU PSPP or Python pandas (pd.read_spss)']
    },
    keywords: ['sav file', 'open sav spss', 'ibm spss statistics', 'pspp free spss', 'convert sav to csv']
  },
  {
    slug: 'por',
    extension: 'POR',
    title: '.POR File Extension - SPSS Portable Data Format',
    description: 'POR is an ASCII portable dataset format generated by IBM SPSS to enable survey data interchange across heterogeneous mainframes and operating systems.',
    category: 'Medical & Science',
    mime: 'application/x-spss-por',
    developer: 'SPSS Inc. / IBM',
    software: ['IBM SPSS Statistics', 'GNU PSPP', 'R (haven)', 'Python pyreadstat'],
    related_extensions: ['SAV', 'CSV', 'DTA'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['por-to-csv', 'por-to-sav'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Text-portable variant of SPSS .sav binary files'] },
    keywords: ['por file', 'open por spss', 'spss portable dataset']
  },
  {
    slug: 'rdata',
    extension: 'RDATA',
    title: '.RDATA File Extension - R Workspace Binary Data Store',
    description: 'RDATA (or .RData) is the binary data persistence format used by R statistical language, capable of saving entire multi-object R environment workspaces.',
    category: 'Medical & Science',
    mime: 'application/x-r-data',
    developer: 'R Core Team / R Foundation',
    software: ['RStudio', 'R Console', 'VS Code (R Extension)', 'Python (rpy2)'],
    related_extensions: ['RDS', 'R', 'RMD'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['rdata-to-csv', 'rdata-to-rds'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Load in R using load("filename.RData") command'] },
    keywords: ['rdata file', 'open rdata', 'rstudio workspace', 'r statistical language']
  },
  {
    slug: 'rds',
    extension: 'RDS',
    title: '.RDS File Extension - Single R Object Serialization',
    description: 'RDS is a binary format created by the R programming language to serialize and compress a single R data structure (data frame, matrix, linear model) to disk.',
    category: 'Medical & Science',
    mime: 'application/x-r-data',
    developer: 'R Core Team',
    software: ['RStudio', 'R CLI', 'VS Code'],
    related_extensions: ['RDATA', 'R'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['rds-to-csv', 'rds-to-json'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Read in R using my_df <- readRDS("filename.rds")'] },
    keywords: ['rds file', 'open rds', 'r readrds', 'rstudio rds']
  },
  {
    slug: 'sas7bdat',
    extension: 'SAS7BDAT',
    title: '.SAS7BDAT File Extension - SAS Dataset Storage Format',
    description: 'SAS7BDAT is the primary binary dataset container generated by SAS (Statistical Analysis System) enterprise software for pharmaceutical, clinical trial, and financial analytics.',
    category: 'Medical & Science',
    mime: 'application/x-sas-data',
    developer: 'SAS Institute Inc.',
    software: ['SAS University Edition / Studio', 'SAS Universal Viewer (Free)', 'R (haven)', 'Python (sas7bdat / pandas)'],
    related_extensions: ['SD2', 'XPT', 'SAV', 'DTA'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['sas7bdat-to-csv', 'sas7bdat-to-excel'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Standard data submit format for FDA clinical trial submissions'] },
    keywords: ['sas7bdat file', 'open sas7bdat', 'sas universal viewer', 'convert sas7bdat to csv']
  },
  {
    slug: 'dta',
    extension: 'DTA',
    title: '.DTA File Extension - Stata Statistical Dataset',
    description: 'DTA is the native binary data format used by Stata statistical software for microeconometric research, public health epidemiology, and social policy modeling.',
    category: 'Medical & Science',
    mime: 'application/x-stata',
    developer: 'StataCorp LLC',
    software: ['Stata', 'R (haven package)', 'Python pandas (pd.read_stata)', 'Stat/Transfer'],
    related_extensions: ['SAV', 'SAS7BDAT', 'CSV'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: ['dta-to-csv', 'dta-to-excel'],
    security: { dangerRating: 'Low Risk', canContainMalware: false, tips: ['Read directly in Python using pandas: import pandas as pd; df = pd.read_stata("file.dta")'] },
    keywords: ['dta file', 'open dta stata', 'statacorp dta', 'read stata file']
  }
];
