import { useState } from 'react';
import LoadingDots from '../Shared/LoadingDots';
import Toast from '../Shared/Toast';
import { useToast } from '../../hooks/useToast';
import { downloadCoverLetter } from '../../api/coverLetter.api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Lora:ital,wght@0,400;1,400&display=swap');

  .clo-wrap {
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Header bar */
  .clo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: #111118;
    border: 1px solid rgba(255,255,255,0.06);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
  }

  .clo-header-left {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .clo-header-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #8888aa;
  }

  /* Live dot */
  .clo-live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #a78bfa;
    animation: cloDotPulse 0.8s ease infinite;
  }
  @keyframes cloDotPulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.3; transform: scale(0.75); }
  }

  /* Done badge */
  .clo-done-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #34d399;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.22);
    border-radius: 999px;
    padding: 3px 9px;
    letter-spacing: 0.3px;
  }

  /* Letter body */
  .clo-body {
    background: #0e0e15;
    border: 1px solid rgba(255,255,255,0.06);
    padding: 28px 30px;
    font-family: 'Lora', Georgia, serif;
    font-size: 14px;
    line-height: 1.85;
    color: #d8d8f0;
    white-space: pre-wrap;
    min-height: 120px;
    position: relative;
  }

  /* Blinking cursor */
  .clo-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: #a78bfa;
    margin-left: 2px;
    vertical-align: text-bottom;
    border-radius: 1px;
    animation: cloBlink 1s step-start infinite;
  }
  @keyframes cloBlink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  /* Action bar */
  .clo-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 14px 20px;
    background: #111118;
    border: 1px solid rgba(255,255,255,0.06);
    border-top: 1px solid rgba(255,255,255,0.04);
    border-radius: 0 0 16px 16px;
    animation: cloActionsIn 0.3s ease both;
  }

  @keyframes cloActionsIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .clo-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.15s ease;
    background: none;
  }

  .clo-btn-copy {
    color: #8888aa;
    border-color: rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
  }
  .clo-btn-copy:hover {
    color: #f0f0f8;
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.06);
  }

  .clo-btn-download {
    color: #34d399;
    border-color: rgba(52,211,153,0.20);
    background: rgba(52,211,153,0.06);
  }
  .clo-btn-download:hover {
    background: rgba(52,211,153,0.12);
    border-color: rgba(52,211,153,0.32);
  }
  .clo-btn-download:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .clo-btn-regen {
    color: #a78bfa;
    border-color: rgba(108,99,255,0.22);
    background: rgba(108,99,255,0.07);
  }
  .clo-btn-regen:hover {
    background: rgba(108,99,255,0.14);
    border-color: rgba(108,99,255,0.35);
  }

  /* Spacer pushes regen to the right */
  .clo-spacer { flex: 1; }
`;

export default function CoverLetterOutput({ text, streaming, done, letterId, onRegenerate }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy.', 'error');
    }
  };

  const handleDownload = async () => {
    if (!letterId) { showToast('Letter ID not available yet.', 'error'); return; }
    setDownloading(true);
    try {
      const res = await downloadCoverLetter(letterId);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover-letter.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('PDF downloaded!', 'success');
    } catch {
      showToast('Failed to download PDF.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (!text && !streaming) return null;

  return (
    <>
      <style>{styles}</style>
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="clo-wrap">

        {/* Header */}
        <div className="clo-header">
          <div className="clo-header-left">
            {streaming && <span className="clo-live-dot" />}
            <span className="clo-header-label">
              {streaming ? 'Writing…' : 'Cover Letter'}
            </span>
          </div>
          {done && (
            <span className="clo-done-badge">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
            </span>
          )}
        </div>

        {/* Letter body */}
        <div className="clo-body">
          {text}
          {streaming && <span className="clo-cursor" />}
        </div>

        {/* Actions */}
        {done && (
          <div className="clo-actions">
            <button className="clo-btn clo-btn-copy" onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  Copy
                </>
              )}
            </button>

            <button
              className="clo-btn clo-btn-download"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-9-9"/>
                  </svg>
                  Downloading…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </>
              )}
            </button>

            <div className="clo-spacer" />

            <button className="clo-btn clo-btn-regen" onClick={onRegenerate}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              Regenerate
            </button>
          </div>
        )}

      </div>
    </>
  );
}