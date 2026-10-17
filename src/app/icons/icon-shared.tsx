import type { CSSProperties } from 'react';

export type IconVariant = 'app' | 'maskable' | 'apple';

/**
 * Renders the AnyFileX brand mark for ImageResponse icon generation:
 * dark #020617 rounded tile + bold white "X", matching public/favicon.svg.
 *
 * The X is drawn with two rotated rounded bars (pure shapes) so no webfonts
 * need to be loaded into Satori — output is deterministic at build time.
 *
 * Variants:
 * - 'app': rounded tile with the subtle inner border (matches favicon.svg),
 *   for the manifest's purpose:"any" icons.
 * - 'maskable': full-bleed square, mark at ~62% so it survives the
 *   maskable safe-zone crop on all launchers.
 * - 'apple': full-bleed square, no transparency (iOS rounds it itself).
 */
export function iconMarkup(size: number, variant: IconVariant) {
  const rounded = variant === 'app';
  const markScale = variant === 'maskable' ? 0.62 : 0.78;
  const t = Math.max(2, Math.round(size * 0.125 * markScale)); // X bar thickness
  const l = Math.round(size * 0.58 * markScale); // X bar length

  const bar: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: l,
    height: t,
    marginLeft: -l / 2,
    marginTop: -t / 2,
    background: '#ffffff',
    borderRadius: t / 2,
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#020617',
        borderRadius: rounded ? Math.round(size * 0.25) : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {rounded && (
        <div
          style={{
            position: 'absolute',
            top: Math.round(size * 0.031),
            left: Math.round(size * 0.031),
            right: Math.round(size * 0.031),
            bottom: Math.round(size * 0.031),
            border: `${Math.max(2, Math.round(size * 0.031))}px solid #1e293b`,
            borderRadius: Math.round(size * 0.22),
            background: '#090d16',
          }}
        />
      )}
      <div style={{ ...bar, transform: 'rotate(45deg)' }} />
      <div style={{ ...bar, transform: 'rotate(-45deg)' }} />
    </div>
  );
}
