const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .pr-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .pr-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.4px;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid;
  }

  .pr-badge-strong  { color: #34d399; background: rgba(52,211,153,0.08);  border-color: rgba(52,211,153,0.22); }
  .pr-badge-partial { color: #f59e0b; background: rgba(245,158,11,0.08);  border-color: rgba(245,158,11,0.22); }
  .pr-badge-weak    { color: #ff8099; background: rgba(255,77,109,0.08);  border-color: rgba(255,77,109,0.22); }
`;

export default function ProgressRing({ score }) {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const isStrong  = score >= 70;
  const isPartial = score >= 40 && score < 70;

  const trackColor  = isStrong ? 'rgba(52,211,153,0.10)'  : isPartial ? 'rgba(245,158,11,0.10)'  : 'rgba(255,77,109,0.10)';
  const strokeColor = isStrong ? '#34d399'                : isPartial ? '#f59e0b'                : '#ff8099';
  const textColor   = strokeColor;
  const badgeClass  = isStrong ? 'pr-badge pr-badge-strong' : isPartial ? 'pr-badge pr-badge-partial' : 'pr-badge pr-badge-weak';
  const label       = isStrong ? 'Strong Match'             : isPartial ? 'Partial Match'              : 'Weak Match';

  return (
    <>
      <style>{styles}</style>
      <div className="pr-root">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Track */}
          <circle cx="70" cy="70" r={radius} fill={trackColor} stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
          {/* Progress */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${strokeColor}55)` }}
          />
          {/* Score */}
          <text x="70" y="66" textAnchor="middle" fontSize="30" fontWeight="700" fill={textColor} fontFamily="'Sora', sans-serif">
            {score}
          </text>
          <text x="70" y="84" textAnchor="middle" fontSize="11" fill={textColor} opacity="0.5" fontFamily="'JetBrains Mono', monospace">
            out of 100
          </text>
        </svg>
        <span className={badgeClass}>{label}</span>
      </div>
    </>
  );
}