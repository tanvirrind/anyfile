import type { ExtensionSchema } from '../lib/database/extensionEngine';

/**
 * High-priority search extensions with format-specific editorial records.
 * Keep ambiguous extensions explicit so generated pages do not present a
 * heuristic category or fabricated binary signature as fact.
 */
export const PRIORITY_EXTENSIONS_DATA: ExtensionSchema[] = [
  {
    slug: 'cont',
    extension: 'CONT',
    title: '.CONT File Extension - Panasonic Camcorder Metadata & Video File Guide',
    description:
      'Learn what .CONT files are, why they appear beside camcorder video recordings, and which Panasonic or Canon software may be needed to open them. Because CONT is used by more than one camera ecosystem, identify the file source before attempting conversion or repair.',
    category: 'Audio & Video',
    mime: 'application/octet-stream',
    developer: 'Panasonic Corporation, Canon, and other camera-software ecosystems',
    software: ['Panasonic HD Writer', 'PHOTOfunSTUDIO', 'Panasonic VideoCam Suite', 'Canon Picture Motion Browser'],
    related_extensions: ['MTS', 'M2TS', 'MP4', 'MOV', 'TMB', 'PMPD', 'JPG', 'THM'],
    related_guides: ['how-to-open-unknown-files'],
    related_converters: [],
    security: {
      dangerRating: 'Medium Risk',
      canContainMalware: false,
      tips: [
        'CONT is not one universal format; confirm the camera, folder, and companion video file before opening it.',
        'Do not rename a CONT file to MP4 or another video extension unless binary analysis confirms it contains a playable video stream.',
        'Work from a copy of the camera card and scan files transferred from an unknown device before opening them.',
      ],
    },
    keywords: [
      'cont file',
      'cont file extension',
      'open cont file',
      'how to open cont file',
      'what is a cont file',
      'panasonic cont file',
      'panasonic camcorder metadata',
      'canon cont video file',
      'cont file viewer',
      'cont to mp4',
      'cont video file',
    ],
  },
];
