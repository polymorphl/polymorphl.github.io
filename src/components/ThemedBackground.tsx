export function ThemedBackground() {
  return (
    <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Pattern layer: grid (cold) or dots (gold) */}
      <div className="absolute inset-0 themed-pattern" />

      {/* Radial gradient accent layer */}
      <div className="absolute inset-0 themed-accents" />

      {/* SVG fractal noise grain overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none themed-grain"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="bg-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-noise)" />
      </svg>
    </div>
  );
}
