const styles = `
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid;
    letter-spacing: 0.2px;
    transition: opacity 0.15s;
  }
  .pill-strength {
    color: #34d399;
    background: rgba(52,211,153,0.08);
    border-color: rgba(52,211,153,0.22);
  }
  .pill-gap {
    color: #fbbf24;
    background: rgba(251,191,36,0.08);
    border-color: rgba(251,191,36,0.22);
  }
  .pill-flag {
    color: #ff8099;
    background: rgba(255,77,109,0.08);
    border-color: rgba(255,77,109,0.22);
  }
  .pill-default {
    color: #8888aa;
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }
`;

const icons = {
  strength: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gap: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v4M6 8.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  flag: (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v4M6 8.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
};

export default function SkillPill({ text, variant = 'default' }) {
  return (
    <>
      <style>{styles}</style>
      <span className={`pill pill-${variant}`}>
        {icons[variant] || null}
        {text}
      </span>
    </>
  );
}