const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .hi-root {
    font-family: 'Sora', sans-serif;
    background: #111118;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .hi-root:hover {
    border-color: rgba(108,99,255,0.35);
    background: #18181f;
    box-shadow: 0 4px 20px rgba(108,99,255,0.08);
  }

  .hi-left { flex: 1; min-width: 0; }

  .hi-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
  }

  .hi-title {
    font-size: 13.5px;
    font-weight: 600;
    color: #f0f0f8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hi-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 999px;
    border: 1px solid;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.3px;
  }

  .hi-badge-strong  { color: #34d399; background: rgba(52,211,153,0.08);  border-color: rgba(52,211,153,0.22);  }
  .hi-badge-interview { color: #a78bfa; background: rgba(108,99,255,0.10); border-color: rgba(108,99,255,0.28); }
  .hi-badge-maybe   { color: #f59e0b; background: rgba(245,158,11,0.08);  border-color: rgba(245,158,11,0.22);  }
  .hi-badge-reject  { color: #ff8099; background: rgba(255,77,109,0.08);  border-color: rgba(255,77,109,0.22);  }

  .hi-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: #44445a;
  }

  .hi-meta-sep { color: #2a2a38; }

  .hi-meta-score {
    color: #8888aa;
    font-weight: 500;
  }

  .hi-delete {
    margin-left: 14px;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #2e2e3a;
  }
  .hi-delete:hover {
    color: #ff8099;
    background: rgba(255,77,109,0.08);
    border-color: rgba(255,77,109,0.20);
  }
`;

const badgeClass = {
  STRONG_YES: 'hi-badge hi-badge-strong',
  INTERVIEW:  'hi-badge hi-badge-interview',
  MAYBE:      'hi-badge hi-badge-maybe',
  REJECT:     'hi-badge hi-badge-reject',
};

const badgeLabel = {
  STRONG_YES: 'Strong Yes',
  INTERVIEW:  'Interview',
  MAYBE:      'Maybe',
  REJECT:     'Reject',
};

export default function HistoryItem({ item, type, onDelete, onClick }) {
  const isScreening = type === 'screening';

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <>
      <style>{styles}</style>
      <div className="hi-root" onClick={onClick}>
        <div className="hi-left">
          <div className="hi-title-row">
            <span className="hi-title">{item.jobTitle}</span>
            {isScreening && item.recommendation && (
              <span className={badgeClass[item.recommendation]}>
                {badgeLabel[item.recommendation]}
              </span>
            )}
          </div>
          <div className="hi-meta">
            <span>{item.companyName}</span>
            <span className="hi-meta-sep">·</span>
            <span>{formatDate(item.createdAt)}</span>
            {isScreening && (
              <>
                <span className="hi-meta-sep">·</span>
                <span className="hi-meta-score">{item.matchScore}% match</span>
              </>
            )}
            {!isScreening && (
              <>
                <span className="hi-meta-sep">·</span>
                <span>{item.wordCount}w</span>
                <span className="hi-meta-sep">·</span>
                <span style={{ textTransform: 'capitalize' }}>{item.tone}</span>
              </>
            )}
          </div>
        </div>

        <button
          className="hi-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
          aria-label="Delete"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11"/>
            <line x1="11" y1="1" x2="1" y2="11"/>
          </svg>
        </button>
      </div>
    </>
  );
}