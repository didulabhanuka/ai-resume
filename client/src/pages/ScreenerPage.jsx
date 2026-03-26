import { useScreener } from '../hooks/useScreener';
import ScreenerForm from '../components/Screener/ScreenerForm';
import ScoreCard from '../components/Screener/ScoreCard';

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
    --warn:        #f59e0b;
  }

  .sp-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    color: var(--text-1);
    padding: 40px 20px 80px;
    position: relative;
  }

  /* Subtle grid */
  .sp-root::before {
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

  .sp-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
  }

  /* Page header */
  .sp-header {
    margin-bottom: 32px;
    animation: spFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .sp-eyebrow {
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

  .sp-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-2);
    animation: spPulse 2s ease infinite;
  }

  @keyframes spPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.8); }
  }

  .sp-title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.7px;
    color: var(--text-1);
    margin-bottom: 6px;
  }

  .sp-subtitle {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.6;
  }

  /* Card */
  .sp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
    animation: spFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
  }

  @keyframes spFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Error */
  .sp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--danger-soft);
    border: 1px solid rgba(255,77,109,0.22);
    border-radius: 10px;
    font-size: 13px;
    color: #ff8099;
    animation: spFadeUp 0.3s ease both, spShake 0.35s ease both;
  }

  @keyframes spShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-4px); }
    40%      { transform: translateX(4px); }
    60%      { transform: translateX(-3px); }
    80%      { transform: translateX(3px); }
  }

  /* Result wrapper */
  .sp-result {
    animation: spFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* Section divider */
  .sp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
  }
  .sp-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .sp-divider-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }
`;

export default function ScreenerPage() {
  const { result, loading, error, screen } = useScreener();

  return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-inner">

          {/* Header */}
          <div className="sp-header">
            <div className="sp-eyebrow">
              <span className="sp-eyebrow-dot" />
              AI Screener
            </div>
            <h1 className="sp-title">Resume Screener</h1>
            <p className="sp-subtitle">
              Paste a job description and your resume to get an AI-powered match analysis.
            </p>
          </div>

          {/* Form card */}
          <div className="sp-card">
            <ScreenerForm onSubmit={screen} loading={loading} />
          </div>

          {/* Error */}
          {error && (
            <div className="sp-error" key={error} style={{ marginTop: 20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <>
              <div className="sp-divider" style={{ marginTop: 32 }}>
                <div className="sp-divider-line" />
                <span className="sp-divider-label">Analysis Result</span>
                <div className="sp-divider-line" />
              </div>
              <div className="sp-result">
                <ScoreCard result={result} />
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}