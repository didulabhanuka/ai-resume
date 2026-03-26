import { useState } from 'react';
import ProgressRing from '../Shared/ProgressRing';
import SkillPill from './SkillPill';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Card ── */
  .sc-card {
    background: #111118;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── Top row ── */
  .sc-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  @media (min-width: 560px) {
    .sc-top { flex-direction: row; align-items: flex-start; }
  }

  .sc-meta { flex: 1; text-align: center; }
  @media (min-width: 560px) { .sc-meta { text-align: left; } }

  .sc-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 4px;
  }
  @media (min-width: 560px) { .sc-title-row { justify-content: flex-start; } }

  .sc-job-title {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #f0f0f8;
  }

  /* Recommendation badge */
  .sc-rec {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .sc-rec-STRONG_YES { color: #34d399; background: rgba(52,211,153,0.10); border-color: rgba(52,211,153,0.25); }
  .sc-rec-INTERVIEW  { color: #a78bfa; background: rgba(108,99,255,0.10); border-color: rgba(108,99,255,0.28); }
  .sc-rec-MAYBE      { color: #fbbf24; background: rgba(251,191,36,0.10); border-color: rgba(251,191,36,0.25); }
  .sc-rec-REJECT     { color: #ff8099; background: rgba(255,77,109,0.10); border-color: rgba(255,77,109,0.25); }

  .sc-company {
    font-size: 12px;
    color: #44445a;
    margin-bottom: 10px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.3px;
  }

  .sc-summary {
    font-size: 13.5px;
    color: #8888aa;
    line-height: 1.7;
  }

  /* ── Divider ── */
  .sc-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: -4px 0;
  }

  /* ── Sections ── */
  .sc-sections { display: flex; flex-direction: column; gap: 10px; }

  .sc-section {
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .sc-section:hover { border-color: rgba(255,255,255,0.10); }

  .sc-section-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    gap: 10px;
  }

  .sc-section-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .sc-section-icon {
    width: 26px;
    height: 26px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sc-section-icon-strength { background: rgba(52,211,153,0.12); }
  .sc-section-icon-gap      { background: rgba(251,191,36,0.12); }
  .sc-section-icon-flag     { background: rgba(255,77,109,0.12); }

  .sc-section-title {
    font-size: 13px;
    font-weight: 600;
    color: #f0f0f8;
  }

  .sc-section-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #44445a;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 999px;
    padding: 2px 7px;
  }

  .sc-section-chevron {
    color: #44445a;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
    flex-shrink: 0;
  }
  .sc-section-chevron.open { transform: rotate(180deg); }

  .sc-section-body {
    padding: 4px 16px 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    border-top: 1px solid rgba(255,255,255,0.04);
    animation: scBodyIn 0.22s ease both;
  }

  @keyframes scBodyIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const recConfig = {
  STRONG_YES: { label: 'Strong Yes', key: 'STRONG_YES' },
  INTERVIEW:  { label: 'Interview',  key: 'INTERVIEW'  },
  MAYBE:      { label: 'Maybe',      key: 'MAYBE'      },
  REJECT:     { label: 'Reject',     key: 'REJECT'     },
};

const sectionMeta = {
  strength: {
    iconColor: '#34d399',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5L13 4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  gap: {
    iconColor: '#fbbf24',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M8 4v5M8 11.5v.5" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  flag: {
    iconColor: '#ff8099',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M3 2v12M3 2l8 3-8 4" stroke="#ff8099" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
};

function Section({ title, items, variant, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!items || items.length === 0) return null;
  const meta = sectionMeta[variant] || {};

  return (
    <div className="sc-section">
      <button className="sc-section-btn" onClick={() => setOpen(o => !o)}>
        <div className="sc-section-left">
          <div className={`sc-section-icon sc-section-icon-${variant}`}>
            {meta.icon}
          </div>
          <span className="sc-section-title">{title}</span>
          <span className="sc-section-count">{items.length}</span>
        </div>
        <svg
          className={`sc-section-chevron ${open ? 'open' : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="sc-section-body">
          {items.map((item, i) => (
            <SkillPill key={i} text={item} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScoreCard({ result }) {
  const rec = recConfig[result.recommendation] || recConfig.MAYBE;

  return (
    <>
      <style>{styles}</style>
      <div className="sc-card">

        {/* Top — ring + meta */}
        <div className="sc-top">
          <ProgressRing score={result.matchScore} />

          <div className="sc-meta">
            <div className="sc-title-row">
              <span className="sc-job-title">{result.jobTitle}</span>
              <span className={`sc-rec sc-rec-${rec.key}`}>{rec.label}</span>
            </div>
            {result.companyName && (
              <p className="sc-company">{result.companyName}</p>
            )}
            <p className="sc-summary">{result.summary}</p>
          </div>
        </div>

        <div className="sc-divider" />

        {/* Collapsible sections */}
        <div className="sc-sections">
          <Section
            title="Strengths"
            items={result.strengths}
            variant="strength"
            defaultOpen
          />
          <Section
            title="Gaps"
            items={result.gaps}
            variant="gap"
            defaultOpen
          />
          <Section
            title="Red Flags"
            items={result.redFlags}
            variant="flag"
            defaultOpen={false}
          />
        </div>

      </div>
    </>
  );
}