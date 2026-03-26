import { useEffect } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

  .toast-root {
    font-family: 'Sora', sans-serif;
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid;
    font-size: 13px;
    font-weight: 500;
    backdrop-filter: blur(12px);
    animation: toastIn 0.25s cubic-bezier(0.22,1,0.36,1) both;
    max-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  .toast-success { color: #34d399; background: rgba(10,16,14,0.92);  border-color: rgba(52,211,153,0.22); }
  .toast-error   { color: #ff8099; background: rgba(16,10,12,0.92);  border-color: rgba(255,77,109,0.22); }
  .toast-info    { color: #a78bfa; background: rgba(12,10,20,0.92);  border-color: rgba(108,99,255,0.22); }

  .toast-icon {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    flex-shrink: 0;
  }

  .toast-msg { flex: 1; line-height: 1.4; }

  .toast-close {
    background: none;
    border: none;
    cursor: pointer;
    color: currentColor;
    opacity: 0.4;
    padding: 2px;
    display: flex;
    align-items: center;
    transition: opacity 0.15s;
    flex-shrink: 0;
  }
  .toast-close:hover { opacity: 0.8; }
`;

const icons = {
  success: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <line x1="6" y1="5" x2="6" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="6" cy="2.5" r="0.8" fill="currentColor"/>
    </svg>
  ),
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <>
      <style>{styles}</style>
      <div className={`toast-root toast-${type}`}>
        <span className="toast-icon">{icons[type]}</span>
        <span className="toast-msg">{message}</span>
        <button className="toast-close" onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}