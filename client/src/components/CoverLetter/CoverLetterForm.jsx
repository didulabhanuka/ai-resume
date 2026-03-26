import { useState } from 'react';
import ResumeInput from '../Shared/ResumeInput';
import SettingsPanel from './SettingsPanel';
import LoadingDots from '../Shared/LoadingDots';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .clf-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-family: 'Sora', sans-serif;
  }

  /* Two-col grid */
  .clf-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 500px) {
    .clf-row { grid-template-columns: 1fr; }
  }

  .clf-field { display: flex; flex-direction: column; gap: 8px; }

  .clf-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #8888aa;
  }

  /* Shared input/textarea */
  .clf-input,
  .clf-textarea {
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    width: 100%;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 11px 14px;
    color: #f0f0f8;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .clf-input::placeholder,
  .clf-textarea::placeholder { color: #44445a; }
  .clf-input:focus,
  .clf-textarea:focus {
    border-color: #6c63ff;
    background: #1e1e28;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.10);
  }
  .clf-input:hover:not(:focus),
  .clf-textarea:hover:not(:focus) {
    border-color: rgba(255,255,255,0.10);
  }

  .clf-textarea { resize: vertical; min-height: 120px; line-height: 1.65; }

  /* Char counter */
  .clf-field-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: -2px;
  }
  .clf-char {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #44445a;
    transition: color 0.2s;
  }
  .clf-char.active { color: #8888aa; }

  /* Settings wrapper */
  .clf-settings-wrap {
    background: #0e0e15;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 20px;
  }

  /* Submit / Abort */
  .clf-submit,
  .clf-abort {
    font-family: 'Sora', sans-serif;
    width: 100%;
    padding: 13px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background 0.15s;
    position: relative;
    overflow: hidden;
  }

  .clf-submit {
    color: #fff;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    box-shadow: 0 2px 16px rgba(108,99,255,0.28);
  }
  .clf-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .clf-submit:hover::before { background: rgba(255,255,255,0.08); }
  .clf-submit:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(108,99,255,0.35);
  }
  .clf-submit:active { transform: translateY(0); }

  .clf-abort {
    color: #ff8099;
    background: rgba(255,77,109,0.08);
    border: 1px solid rgba(255,77,109,0.22);
    box-shadow: none;
  }
  .clf-abort:hover {
    background: rgba(255,77,109,0.14);
    border-color: rgba(255,77,109,0.35);
    transform: translateY(-1px);
  }
  .clf-abort:active { transform: translateY(0); }

  .clf-btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  /* Stop icon pulse */
  .clf-stop-icon {
    width: 12px; height: 12px;
    border-radius: 3px;
    background: #ff8099;
    animation: clfPulse 1s ease infinite;
  }
  @keyframes clfPulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.45; }
  }
`;

const defaultSettings = {
  tone: 'professional',
  length: 'medium',
  focus: 'technical-skills',
  customNote: '',
};

export default function CoverLetterForm({ onSubmit, onAbort, streaming }) {
  const [jobTitle,        setJobTitle]        = useState('');
  const [companyName,     setCompanyName]     = useState('');
  const [jobDescription,  setJobDescription]  = useState('');
  const [resumeText,      setResumeText]      = useState('');
  const [resumeFile,      setResumeFile]      = useState(null);
  const [settings,        setSettings]        = useState(defaultSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ jobTitle, companyName, jobDescription, resumeText, resumeFile, settings });
  };

  return (
    <>
      <style>{styles}</style>
      <form className="clf-form" onSubmit={handleSubmit}>

        {/* Job title + company */}
        <div className="clf-row">
          <div className="clf-field">
            <label className="clf-label">Job Title</label>
            <input
              type="text"
              className="clf-input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Node.js Developer"
            />
          </div>
          <div className="clf-field">
            <label className="clf-label">Company Name</label>
            <input
              type="text"
              className="clf-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Tech Corp"
            />
          </div>
        </div>

        {/* Job description */}
        <div className="clf-field">
          <label className="clf-label">Job Description</label>
          <textarea
            className="clf-textarea"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={5}
            required
          />
          <div className="clf-field-footer">
            <span className={`clf-char ${jobDescription.length > 0 ? 'active' : ''}`}>
              {jobDescription.length} chars
            </span>
          </div>
        </div>

        {/* Resume */}
        <div className="clf-field">
          <label className="clf-label">Your Resume</label>
          <ResumeInput
            onTextChange={setResumeText}
            onFileChange={setResumeFile}
          />
        </div>

        {/* Settings */}
        <div className="clf-settings-wrap">
          <SettingsPanel settings={settings} onChange={setSettings} />
        </div>

        {/* Submit / abort */}
        {streaming ? (
          <button type="button" className="clf-abort" onClick={onAbort}>
            <span className="clf-btn-inner">
              <span className="clf-stop-icon" />
              Stop Generating
            </span>
          </button>
        ) : (
          <button type="submit" className="clf-submit">
            <span className="clf-btn-inner">
              Generate Cover Letter
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </button>
        )}

      </form>
    </>
  );
}