import HistoryItem from './HistoryItem';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

  .hl-list { display: flex; flex-direction: column; gap: 8px; }

  .hl-empty {
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 20px;
    gap: 12px;
  }

  .hl-empty-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hl-empty-text {
    font-size: 13px;
    color: #44445a;
  }
`;

export default function HistoryList({ items, type, onDelete, onSelect }) {
  const isScreening = type === 'screening';

  if (items.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="hl-empty">
          <div className="hl-empty-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#44445a" strokeWidth="1.6" strokeLinecap="round">
              {isScreening
                ? <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></>
                : <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>
              }
            </svg>
          </div>
          <span className="hl-empty-text">
            No {isScreening ? 'screenings' : 'cover letters'} yet.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="hl-list">
        {items.map((item) => (
          <HistoryItem
            key={item._id}
            item={item}
            type={type}
            onDelete={onDelete}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </>
  );
}