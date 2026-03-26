const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .stp-root {
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stp-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #8888aa;
  }

  .stp-heading-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }

  .stp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (min-width: 540px) {
    .stp-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .stp-group { display: flex; flex-direction: column; gap: 8px; }

  .stp-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #44445a;
  }

  .stp-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .stp-pill {
    font-family: 'Sora', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.07);
    background: #18181f;
    color: #8888aa;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    line-height: 1;
  }

  .stp-pill:hover:not(.active) {
    border-color: rgba(255,255,255,0.13);
    color: #c8c8e8;
    background: #1e1e28;
  }

  .stp-pill.active {
    background: rgba(108,99,255,0.15);
    border-color: rgba(108,99,255,0.35);
    color: #a78bfa;
  }

  /* Custom note input */
  .stp-note-wrap { display: flex; flex-direction: column; gap: 8px; }

  .stp-note-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #44445a;
  }

  .stp-note-label span {
    color: #2e2e3a;
    font-style: italic;
    text-transform: none;
    letter-spacing: 0;
    font-family: 'Sora', sans-serif;
    font-size: 10px;
  }

  .stp-note-input {
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    width: 100%;
    padding: 10px 14px;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 9px;
    color: #f0f0f8;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .stp-note-input::placeholder { color: #44445a; font-family: 'Sora', sans-serif; }
  .stp-note-input:focus {
    border-color: #6c63ff;
    background: #1e1e28;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.10);
  }
  .stp-note-input:hover:not(:focus) {
    border-color: rgba(255,255,255,0.10);
  }
`;

const options = {
  tone: [
    { value: 'professional',  label: 'Professional' },
    { value: 'enthusiastic',  label: 'Enthusiastic' },
    { value: 'concise',       label: 'Concise'      },
    { value: 'storytelling',  label: 'Storytelling' },
  ],
  length: [
    { value: 'short',  label: 'Short ~200w'  },
    { value: 'medium', label: 'Medium ~350w' },
    { value: 'long',   label: 'Long ~500w'   },
  ],
  focus: [
    { value: 'technical-skills', label: 'Technical'   },
    { value: 'leadership',       label: 'Leadership'  },
    { value: 'culture-fit',      label: 'Culture Fit' },
    { value: 'career-change',    label: 'Career Change' },
  ],
};

export default function SettingsPanel({ settings, onChange }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <>
      <style>{styles}</style>
      <div className="stp-root">

        <div className="stp-heading">
          <span>Settings</span>
          <div className="stp-heading-line" />
        </div>

        <div className="stp-grid">
          {/* Tone */}
          <div className="stp-group">
            <span className="stp-label">Tone</span>
            <div className="stp-pills">
              {options.tone.map(o => (
                <button
                  key={o.value}
                  type="button"
                  className={`stp-pill ${settings.tone === o.value ? 'active' : ''}`}
                  onClick={() => update('tone', o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="stp-group">
            <span className="stp-label">Length</span>
            <div className="stp-pills">
              {options.length.map(o => (
                <button
                  key={o.value}
                  type="button"
                  className={`stp-pill ${settings.length === o.value ? 'active' : ''}`}
                  onClick={() => update('length', o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <div className="stp-group">
            <span className="stp-label">Focus</span>
            <div className="stp-pills">
              {options.focus.map(o => (
                <button
                  key={o.value}
                  type="button"
                  className={`stp-pill ${settings.focus === o.value ? 'active' : ''}`}
                  onClick={() => update('focus', o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom note */}
        <div className="stp-note-wrap">
          <span className="stp-note-label">
            Additional instruction <span>(optional)</span>
          </span>
          <input
            type="text"
            className="stp-note-input"
            value={settings.customNote}
            onChange={(e) => update('customNote', e.target.value)}
            placeholder='e.g. "Mention I am relocating to London"'
          />
        </div>

      </div>
    </>
  );
}