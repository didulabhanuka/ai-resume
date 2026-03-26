const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');

  .ld-root {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ld-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #8888aa;
    letter-spacing: 0.3px;
  }

  .ld-dots {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ld-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #6c63ff;
    animation: ldBounce 1.1s ease infinite;
  }
  .ld-dot:nth-child(2) { animation-delay: 0.15s; background: #8b7ff5; }
  .ld-dot:nth-child(3) { animation-delay: 0.30s; background: #a78bfa; }

  @keyframes ldBounce {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
    40%           { transform: translateY(-5px); opacity: 1;   }
  }
`;

export default function LoadingDots({ text = 'Analysing' }) {
  return (
    <>
      <style>{styles}</style>
      <div className="ld-root">
        <span className="ld-text">{text}</span>
        <span className="ld-dots">
          <span className="ld-dot" />
          <span className="ld-dot" />
          <span className="ld-dot" />
        </span>
      </div>
    </>
  );
}