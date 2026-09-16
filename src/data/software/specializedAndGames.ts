import { SoftwareInfo } from '../../types';

export const SPECIALIZED_AND_GAMES_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'unreal-engine',
    name: 'Unreal Engine 5',
    developer: 'Epic Games',
    category: 'Graphics & Design',
    description: 'Advanced real-time 3D creation tool for photorealistic visuals, games, film, and virtual production.',
    longDescription: 'Unreal Engine is the world’s most open and advanced real-time 3D creation tool for photorealistic visuals and immersive experiences. Features Nanite virtualized geometry and Lumen global illumination.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Core / 5% Royalty on $1M+ games',
    websiteUrl: 'https://unrealengine.com',
    downloadUrl: 'https://unrealengine.com/download',
    supportedExtensions: ['UASSET', 'UMAP', 'FBX', 'OBJ', 'USD', 'EXR', 'PNG', 'GLTF'],
    rating: 4.9,
    reviewCount: 42000,
    features: [
      'Nanite virtualized micropolygon geometry rendering',
      'Lumen real-time dynamic global illumination lighting',
      'Blueprint visual scripting system for game logic'
    ],
    alternatives: [
      { name: 'Unity Engine', slug: 'unity', description: 'Popular multi-platform game engine.' },
      { name: 'Godot Engine', slug: 'godot', description: 'Free open source 2D/3D game engine.' }
    ]
  },
  {
    id: 'unity',
    name: 'Unity Game Engine',
    developer: 'Unity Technologies',
    category: 'Graphics & Design',
    description: 'Cross-platform game engine used to create 2D, 3D, VR, and AR games and interactive experiences.',
    longDescription: 'Unity is the ultimate game development platform. Use Unity to build high-quality 3D and 2D games, deploy them across mobile, desktop, VR/AR, consoles or the Web.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Personal / Pro Subscription',
    websiteUrl: 'https://unity.com',
    downloadUrl: 'https://unity.com/download',
    supportedExtensions: ['UNITY', 'UNITYPACKAGE', 'PREFAB', 'CS', 'FBX', 'OBJ', 'PNG', 'MP3'],
    rating: 4.7,
    reviewCount: 58000,
    features: [
      'Universal Render Pipeline (URP) and High Definition Render Pipeline (HDRP)',
      'Cross-platform deployment to over 20 target platforms',
      'C# object-oriented component scripting architecture'
    ],
    alternatives: [
      { name: 'Unreal Engine', slug: 'unreal-engine', description: 'AAA real-time 3D engine.' },
      { name: 'Godot Engine', slug: 'godot', description: 'Free open source engine.' }
    ]
  },
  {
    id: 'godot',
    name: 'Godot Engine',
    developer: 'Godot Foundation',
    category: 'Graphics & Design',
    description: 'Free open source feature-packed 2D and 3D game engine with an intuitive node system.',
    longDescription: 'Godot provides a huge set of common tools, so you can just focus on making your game without reinventing the wheel. Completely free and open-source under the MIT license.',
    supportedOS: ['windows', 'mac', 'linux', 'android'],
    priceType: 'Free',
    priceText: '100% Free Open Source (MIT)',
    websiteUrl: 'https://godotengine.org',
    downloadUrl: 'https://godotengine.org/download/',
    supportedExtensions: ['TSCN', 'GD', 'GODOT', 'GLTF', 'GLB', 'PNG', 'OGG', 'WAV'],
    rating: 4.9,
    reviewCount: 36000,
    features: [
      'Lightweight editor binary under 100MB with zero install dependencies',
      'Dedicated 2D pixel-perfect rendering engine alongside 3D PBR pipeline',
      'GDScript Python-like scripting and C# support'
    ],
    alternatives: [
      { name: 'Unity', slug: 'unity', description: 'Cross-platform game development engine.' }
    ]
  },
  {
    id: 'virtualbox',
    name: 'Oracle VM VirtualBox',
    developer: 'Oracle Corporation',
    category: 'Utilities & Compression',
    description: 'Free open source cross-platform virtualization software to run multiple operating systems concurrently.',
    longDescription: 'VirtualBox is a powerful x86 and AMD64/Intel64 virtualization product for enterprise as well as home use. Run Windows inside Linux, Linux inside Mac, or isolate test environments in VMs.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source (GPLv2)',
    websiteUrl: 'https://virtualbox.org',
    downloadUrl: 'https://virtualbox.org/wiki/Downloads',
    supportedExtensions: ['VDI', 'VBOX', 'OVA', 'OVF', 'VMDK', 'VHD', 'ISO'],
    rating: 4.7,
    reviewCount: 54000,
    features: [
      'Full guest hardware virtualization with 3D graphics acceleration',
      'Snapshot state saving and restoration manager',
      'Bridged and host-only virtual network card configuration'
    ],
    alternatives: [
      { name: 'VMware Workstation', slug: 'vmware-workstation', description: 'Hypervisor virtualization software.' },
      { name: 'Parallels Desktop', slug: 'parallels-desktop', description: 'Fast macOS Windows virtual machine.' }
    ]
  }
];
