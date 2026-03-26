import { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import HistoryList from '../components/History/HistoryList';
import ScoreCard from '../components/Screener/ScoreCard';
import { getScreeningById, getCoverLetterById } from '../api/history.api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg:          #0a0a0f;
    --surface:     #111118;
    --surface-2:   #18181f;
    --surface-3:   #1e1e28;
    --border:      rgba(255,255,255,0.06);
    --border-2:    rgba(255,255,255,0.10);
    --accent:      #6c63ff;
    --accent-2:    #a78bfa;
    --accent-glow: rgba(108,99,255,0.28);
    --accent-soft: rgba(108,99,255,0.10);
    --text-1:      #f0f0f8;
    --text-2:      #8888aa;
    --text-3:      #44445a;
    --danger:      #ff4d6d;
    --danger-soft: rgba(255,77,109,0.10);
    --success:     #34d399;
  }

  .hp-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    color: var(--text-1);
    padding: 40px 20px 80px;
    position: relative;
  }

  .hp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .hp-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
  }

  /* Header */
  .hp-header {
    margin-bottom: 32px;
    animation: hpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .hp-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--accent-2);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .hp-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-2);
  }

  .hp-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.7px;
    color: var(--text-1);
    margin-bottom: 6px;
  }

  .hp-subtitle {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
  }

  /* Tabs */
  .hp-tabs {
    display: inline-flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 4px;
    gap: 2px;
    margin-bottom: 28px;
    animation: hpFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }

  .hp-tab {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;
    color: var(--text-2);
  }

  .hp-tab:hover:not(.active) {
    color: var(--text-1);
    background: rgba(255,255,255,0.04);
  }

  .hp-tab.active {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #fff;
    box-shadow: 0 2px 12px var(--accent-glow);
  }

  .hp-tab-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    line-height: 1.4;
  }

  .hp-tab.active .hp-tab-count {
    background: rgba(255,255,255,0.25);
  }

  /* Error */
  .hp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--danger-soft);
    border: 1px solid rgba(255,77,109,0.22);
    border-radius: 10px;
    font-size: 13px;
    color: #ff8099;
    margin-bottom: 20px;
  }

  /* Loading skeleton */
  .hp-loading {
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: hpFadeUp 0.4s ease both;
  }

  .hp-skeleton {
    height: 64px;
    border-radius: 12px;
    background: linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%);
    background-size: 200% 100%;
    animation: hpShimmer 1.4s ease infinite;
  }

  @keyframes hpShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Content area */
  .hp-content {
    animation: hpFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  @keyframes hpFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Divider */
  .hp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 16px;
  }
  .hp-divider-line { flex: 1; height: 1px; background: var(--border); }
  .hp-divider-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  /* Detail panel */
  .hp-detail {
    animation: hpFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }

  .hp-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .hp-detail-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-2);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .hp-close-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 7px;
    color: var(--text-2);
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .hp-close-btn:hover {
    background: var(--surface-3);
    color: var(--text-1);
    border-color: var(--border-2);
  }

  /* Detail loading shimmer */
  .hp-detail-loading {
    height: 200px;
    border-radius: 14px;
    background: linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 50%, var(--surface) 100%);
    background-size: 200% 100%;
    animation: hpShimmer 1.4s ease infinite;
  }

  /* Cover letter card */
  .hp-cl-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.3);
  }

  .hp-cl-meta {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .hp-cl-job-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-1);
    margin-bottom: 3px;
  }

  .hp-cl-company {
    font-size: 12px;
    color: var(--text-3);
  }

  .hp-cl-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .hp-cl-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-2);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 9px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  .hp-cl-body {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px 22px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-1);
    white-space: pre-wrap;
    font-family: 'Georgia', serif;
  }
`;

export default function HistoryPage() {
  const {
    screenings,
    coverLetters,
    loading,
    error,
    removeScreening,
    removeCoverLetter,
  } = useHistory();

  const [activeTab, setActiveTab]       = useState('screenings');
  const [selected, setSelected]         = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleSelectScreening = async (item) => {
    setDetailLoading(true);
    try {
      const res = await getScreeningById(item._id);
      setSelected({ type: 'screening', data: res.data.data });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectCoverLetter = async (item) => {
    setDetailLoading(true);
    try {
      const res = await getCoverLetterById(item._id);
      setSelected({ type: 'coverLetter', data: res.data.data });
    } finally {
      setDetailLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelected(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">
        <div className="hp-inner">

          {/* Header */}
          <div className="hp-header">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              Activity Log
            </div>
            <h1 className="hp-title">History</h1>
            <p className="hp-subtitle">
              Your past screenings and cover letters.
            </p>
          </div>

          {/* Tabs */}
          <div className="hp-tabs">
            <button
              className={`hp-tab ${activeTab === 'screenings' ? 'active' : ''}`}
              onClick={() => switchTab('screenings')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Screenings
              {screenings?.length > 0 && (
                <span className="hp-tab-count">{screenings.length}</span>
              )}
            </button>
            <button
              className={`hp-tab ${activeTab === 'coverLetters' ? 'active' : ''}`}
              onClick={() => switchTab('coverLetters')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Cover Letters
              {coverLetters?.length > 0 && (
                <span className="hp-tab-count">{coverLetters.length}</span>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="hp-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="hp-loading">
              {[1, 2, 3].map(n => (
                <div key={n} className="hp-skeleton" style={{ opacity: 1 - n * 0.2 }} />
              ))}
            </div>
          ) : (
            <div className="hp-content">
              {activeTab === 'screenings' && (
                <HistoryList
                  items={screenings}
                  type="screening"
                  onDelete={removeScreening}
                  onSelect={handleSelectScreening}
                />
              )}
              {activeTab === 'coverLetters' && (
                <HistoryList
                  items={coverLetters}
                  type="coverLetter"
                  onDelete={removeCoverLetter}
                  onSelect={handleSelectCoverLetter}
                />
              )}
            </div>
          )}

          {/* Detail loading */}
          {detailLoading && (
            <>
              <div className="hp-divider">
                <div className="hp-divider-line" />
                <span className="hp-divider-label">Detail View</span>
                <div className="hp-divider-line" />
              </div>
              <div className="hp-detail-loading" />
            </>
          )}

          {/* Detail view */}
          {selected && !detailLoading && (
            <>
              <div className="hp-divider">
                <div className="hp-divider-line" />
                <span className="hp-divider-label">Detail View</span>
                <div className="hp-divider-line" />
              </div>

              <div className="hp-detail">
                <div className="hp-detail-header">
                  <span className="hp-detail-label">
                    {selected.type === 'screening' ? 'Screening Result' : 'Cover Letter'}
                  </span>
                  <button className="hp-close-btn" onClick={() => setSelected(null)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Close
                  </button>
                </div>

                {/* Screening detail */}
                {selected.type === 'screening' && (
                  <ScoreCard result={selected.data} />
                )}

                {/* Cover letter detail */}
                {selected.type === 'coverLetter' && (
                  <div className="hp-cl-card">
                    <div className="hp-cl-meta">
                      <div>
                        <p className="hp-cl-job-title">{selected.data.jobTitle}</p>
                        <p className="hp-cl-company">{selected.data.companyName}</p>
                      </div>
                      <div className="hp-cl-pills">
                        <span className="hp-cl-pill">{selected.data.tone}</span>
                        <span className="hp-cl-pill">{selected.data.length}</span>
                        <span className="hp-cl-pill" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {selected.data.wordCount}w
                        </span>
                      </div>
                    </div>
                    <div className="hp-cl-body">
                      {selected.data.generatedLetter}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}