import { SoftwareInfo } from '../../types';

export const MEDIA_AND_AUDIO_SOFTWARE: SoftwareInfo[] = [
  {
    id: 'vlc',
    name: 'VLC Media Player',
    developer: 'VideoLAN',
    category: 'Media & Audio',
    description: 'Universal open-source multimedia player that plays almost every video and audio format.',
    longDescription: 'VLC Media Player is a free, open-source portable cross-platform media player software and streaming media server developed by the VideoLAN project. It plays almost all video files, audio tracks, optical discs, webcams, and network streams.',
    supportedOS: ['windows', 'mac', 'linux', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://videolan.org/vlc',
    downloadUrl: 'https://videolan.org/vlc/#download',
    supportedExtensions: ['MP4', 'MOV', 'MKV', 'AVI', 'FLAC', 'MP3', 'WMV', 'WEBM', 'OGG', 'AAC', 'M4A', 'M4V', 'TS', 'VOB', '3GP', 'WAV'],
    rating: 4.9,
    reviewCount: 92000,
    features: [
      'Plays all codecs without downloading codec packs',
      'Hardware decoding acceleration for 4K / 8K video',
      'Subtitle synchronizer and stream downloader',
      'Built-in video format converter tool',
      'Zero ads, zero spyware, zero user tracking'
    ],
    alternatives: [
      { name: 'MPC-HC', slug: 'mpc-hc', description: 'Lightweight media player for Windows.' },
      { name: 'IINA', slug: 'iina', description: 'Modern native media player crafted for macOS.' },
      { name: 'PotPlayer', slug: 'potplayer', description: 'Feature-rich media player for Windows.' }
    ],
    tutorials: [
      { title: 'How to Play MKV and MP4 Videos in VLC', description: 'Configure hardware acceleration and subtitle loading in VLC.', readTime: '3 min' },
      { title: 'Converting Video Formats inside VLC Media Player', description: 'Convert MKV to MP4 or extract MP3 audio using VLC built-in media converter.', readTime: '4 min' }
    ]
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg Multimedia Framework',
    developer: 'FFmpeg Team',
    category: 'Media & Audio',
    description: 'Universal command-line tool for decoding, encoding, transcoding, muxing, and streaming audio and video.',
    longDescription: 'FFmpeg is the leading multimedia framework able to decode, encode, transcode, mux, demux, stream, filter and play almost anything that humans and machines have created. Used behind the scenes by YouTube, VLC, and HandBrake.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source CLI',
    websiteUrl: 'https://ffmpeg.org',
    downloadUrl: 'https://ffmpeg.org/download.html',
    supportedExtensions: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'MP3', 'FLAC', 'AAC', 'WAV', 'M4A', 'OGG', 'TS', 'H264', 'HEVC', 'AV1'],
    rating: 4.9,
    reviewCount: 45000,
    features: [
      'Hardware accelerated H.264/HEVC/AV1 encoding (NVENC, QuickSync, VAAPI)',
      'Complex filtergraph processing for video watermarking, scaling, and audio mixing',
      'Scriptable command line for server-side automated video conversion'
    ],
    alternatives: [
      { name: 'HandBrake', slug: 'handbrake', description: 'GUI video transcoder powered by FFmpeg.' }
    ]
  },
  {
    id: 'handbrake',
    name: 'HandBrake Video Transcoder',
    developer: 'HandBrake Team',
    category: 'Media & Audio',
    description: 'Free open source video transcoder for converting video from nearly any format to modern codecs.',
    longDescription: 'HandBrake is a tool for converting video from nearly any format to a selection of modern, widely supported codecs (H.264, H.265, AV1, VP9). Includes device presets for iPhone, iPad, Roku, and PlayStation.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://handbrake.fr',
    downloadUrl: 'https://handbrake.fr/downloads.php',
    supportedExtensions: ['MP4', 'MKV', 'WEBM', 'MOV', 'AVI', 'M2TS', 'VOB', 'WMV'],
    rating: 4.8,
    reviewCount: 38000,
    features: [
      'Built-in device presets for optimized mobile video playback',
      'Hardware GPU video encoding (Intel QSV, Nvidia NVENC, AMD VCE)',
      'Subtitle selection, chapter markers, and video dimension scaling'
    ],
    alternatives: [
      { name: 'FFmpeg', slug: 'ffmpeg', description: 'Command line media tool.' }
    ]
  },
  {
    id: 'audacity',
    name: 'Audacity Audio Editor',
    developer: 'Muse Group / Audacity Team',
    category: 'Media & Audio',
    description: 'Free open source multi-track audio recorder and editor for Windows, Mac, and Linux.',
    longDescription: 'Audacity is an easy-to-use, multi-track audio editor and recorder for Windows, macOS, GNU/Linux and other operating systems. Record live audio, cut/copy/splice sounds, and apply digital effects.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://audacityteam.org',
    downloadUrl: 'https://audacityteam.org/download/',
    supportedExtensions: ['AUP3', 'WAV', 'MP3', 'FLAC', 'OGG', 'AAC', 'M4A', 'AIFF'],
    rating: 4.7,
    reviewCount: 62000,
    features: [
      'Multi-track audio recording and mixing',
      'Spectral analysis and background noise reduction filter',
      'Supports VST, Nyquist, and LADSPA audio effect plugins'
    ],
    alternatives: [
      { name: 'Reaper', slug: 'reaper', description: 'Professional digital audio workstation.' },
      { name: 'Adobe Audition', slug: 'adobe-audition', description: 'Pro audio cleanup software.' }
    ]
  },
  {
    id: 'obs-studio',
    name: 'OBS Studio',
    developer: 'OBS Project',
    category: 'Media & Audio',
    description: 'Free open source software for video recording and live streaming to Twitch, YouTube, and Facebook.',
    longDescription: 'OBS Studio is a free and open source software for video recording and live streaming. Create scenes with multiple sources including window captures, images, webcams, capture cards, and audio interface feeds.',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://obsproject.com',
    downloadUrl: 'https://obsproject.com/download',
    supportedExtensions: ['MP4', 'MKV', 'MOV', 'FLV', 'TS'],
    rating: 4.9,
    reviewCount: 84000,
    features: [
      'Real-time video/audio capturing and scene compositing',
      'Hardware GPU encoding with NVENC and QuickSync',
      'Virtual Camera output feed for Zoom and Teams meetings'
    ],
    alternatives: [
      { name: 'Streamlabs OBS', slug: 'streamlabs', description: 'Streaming suite built on OBS.' }
    ]
  },
  {
    id: 'adobe-premiere-pro',
    name: 'Adobe Premiere Pro',
    developer: 'Adobe Inc.',
    category: 'Media & Audio',
    description: 'Industry-standard timeline video editing software for film, TV, and web video creation.',
    longDescription: 'Adobe Premiere Pro is the leading video editing software for movies, TV, and the web. Edit footage in any format, from 8K to virtual reality. Native file support, lightweight proxy workflows, and Lumetri color grading.',
    supportedOS: ['windows', 'mac'],
    priceType: 'Paid',
    priceText: '$22.99 / month',
    websiteUrl: 'https://adobe.com/products/premiere.html',
    downloadUrl: 'https://adobe.com/products/premiere.html',
    supportedExtensions: ['PRPROJ', 'MP4', 'MOV', 'MXF', 'AVI', 'WMV', 'MTS', 'PRORES', 'R3D'],
    rating: 4.7,
    reviewCount: 46000,
    features: [
      'Timeline multi-track video and audio non-linear editing',
      'Lumetri Color grading and HDR color scope monitors',
      'Text-based speech-to-text automated video captioning'
    ],
    alternatives: [
      { name: 'DaVinci Resolve', slug: 'davinci-resolve', description: 'Hollywood video editor and color corrector.' },
      { name: 'Final Cut Pro', slug: 'final-cut-pro', description: 'Apple native video editor for Mac.' }
    ]
  },
  {
    id: 'davinci-resolve',
    name: 'Blackmagic DaVinci Resolve',
    developer: 'Blackmagic Design',
    category: 'Media & Audio',
    description: 'Hollywood-grade video editing, color correction, visual effects, and Fairlight audio post-production.',
    longDescription: 'DaVinci Resolve is the world’s only solution that combines editing, color correction, visual effects (Fusion), motion graphics and audio post production (Fairlight) all in one software tool!',
    supportedOS: ['windows', 'mac', 'linux'],
    priceType: 'Freemium',
    priceText: 'Free Version / $295 Studio',
    websiteUrl: 'https://blackmagicdesign.com/products/davinciresolve',
    downloadUrl: 'https://blackmagicdesign.com/products/davinciresolve',
    supportedExtensions: ['DRA', 'DRP', 'MP4', 'MOV', 'MXF', 'PRORES', 'DNXHD', 'BRAW', 'WAV'],
    rating: 4.9,
    reviewCount: 51000,
    features: [
      'World-famous node-based color grading wheel controls',
      'Fusion 3D node visual effects compositing workspace',
      'Fairlight digital audio workstation with 2,000 track support'
    ],
    alternatives: [
      { name: 'Adobe Premiere Pro', slug: 'adobe-premiere-pro', description: 'Timeline video editor.' }
    ]
  },
  {
    id: 'final-cut-pro',
    name: 'Apple Final Cut Pro',
    developer: 'Apple Inc.',
    category: 'Media & Audio',
    description: 'Professional non-linear video editing application optimized natively for Mac and Apple Silicon.',
    longDescription: 'Final Cut Pro combines revolutionary creative editing with powerful media organization and incredible performance for Apple Silicon Macs and iPad.',
    supportedOS: ['mac', 'ios'],
    priceType: 'Paid',
    priceText: '$299.99 one-time payment',
    websiteUrl: 'https://apple.com/final-cut-pro/',
    downloadUrl: 'https://apps.apple.com/app/final-cut-pro/id424389933',
    supportedExtensions: ['FCPBUNDLE', 'FCPXML', 'MOV', 'MP4', 'PRORES', 'M4V', 'WAV'],
    rating: 4.8,
    reviewCount: 31000,
    features: [
      'Magnetic Timeline 2 tracks video clips without collision conflicts',
      'Engineered specifically for Metal GPU and Apple M1/M2/M3 Pro chips',
      'ProRes RAW real-time playback performance'
    ],
    alternatives: [
      { name: 'DaVinci Resolve', slug: 'davinci-resolve', description: 'Cross-platform video editor.' }
    ]
  },
  {
    id: 'iina',
    name: 'IINA Media Player for Mac',
    developer: 'IINA Team',
    category: 'Media & Audio',
    description: 'Modern, open source media player for macOS with Touch Bar, Dark Mode, and MPV playback engine.',
    longDescription: 'IINA is a modern media player for macOS based on MPV. Written in Swift, it features a sleek native design, picture-in-picture mode, customizable UI themes, and gesture controls.',
    supportedOS: ['mac'],
    priceType: 'Free',
    priceText: 'Free Open Source',
    websiteUrl: 'https://iina.io',
    downloadUrl: 'https://iina.io',
    supportedExtensions: ['MP4', 'MKV', 'MOV', 'AVI', 'FLAC', 'MP3', 'WEBM'],
    rating: 4.9,
    reviewCount: 22000,
    features: [
      'Native macOS SwiftUI design matching modern Mac aesthetics',
      'Picture-in-Picture floating window and Touch Bar controls',
      'Powered by MPV open source video rendering backend'
    ],
    alternatives: [
      { name: 'VLC', slug: 'vlc', description: 'Universal media player.' }
    ]
  },
  {
    id: 'foobar2000',
    name: 'foobar2000 Audio Player',
    developer: 'Peter Pawlowski',
    category: 'Media & Audio',
    description: 'Advanced freeware audio player for Windows with customizable layout and lossless playback.',
    longDescription: 'foobar2000 is an advanced freeware audio player for the Windows platform. Features include gapless playback, full Unicode support, tag editing, and customizable interface.',
    supportedOS: ['windows', 'android', 'ios'],
    priceType: 'Free',
    priceText: 'Free Desktop App',
    websiteUrl: 'https://foobar2000.org',
    downloadUrl: 'https://foobar2000.org/download',
    supportedExtensions: ['MP3', 'FLAC', 'WAV', 'AAC', 'OGG', 'M4A', 'ALAC', 'OPUS', 'MPC', 'APE'],
    rating: 4.8,
    reviewCount: 29000,
    features: [
      'Seamless gapless audio playback for live albums',
      'ReplayGain volume normalization and tag editing',
      'Bit-exact WASAPI / ASIO audio output hardware driver support'
    ],
    alternatives: [
      { name: 'AIMP', slug: 'aimp', description: 'Audio player for Windows and Android.' }
    ]
  }
];
