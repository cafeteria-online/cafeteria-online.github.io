// Cenefa decorativa inspirada en los bordados florales de Zinacantán
// y en la laca de Chiapa de Corzo (flores de colores sobre fondo oscuro).
export default function Cenefa({ height = 28, className = '' }) {
  const id = 'cenefa-patron'
  return (
    <svg className={`cenefa ${className}`} height={height} width="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="64" height="28" patternUnits="userSpaceOnUse">
          <rect width="64" height="28" fill="var(--laca)" />
          {/* flor */}
          <g transform="translate(16 14)">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} rx="3.6" ry="6.4" cy="-5.6" fill="var(--magenta)" transform={`rotate(${r})`} />
            ))}
            <circle r="3" fill="var(--maiz)" />
          </g>
          {/* hojas */}
          <path d="M30 14 q5 -7 10 0 q-5 7 -10 0z" fill="var(--turquesa)" />
          {/* rombo */}
          <path d="M50 8 l6 6 l-6 6 l-6 -6z" fill="var(--morado-claro)" />
          <circle cx="50" cy="14" r="1.8" fill="var(--maiz)" />
          <rect y="0" width="64" height="2" fill="var(--maiz)" />
          <rect y="26" width="64" height="2" fill="var(--maiz)" />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  )
}
