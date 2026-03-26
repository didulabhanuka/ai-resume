import { useState } from 'react';
import ResumeInput from '../Shared/ResumeInput';
import LoadingDots from '../Shared/LoadingDots';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .sf-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-family: 'Sora', sans-serif;
  }

  .sf-field { display: flex; flex-direction: column; gap: 8px; }

  .sf-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #8888aa;
  }

  .sf-textarea {
    font-family: 'Sora', sans-serif;
    width: 100%;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 13px 15px;
    font-size: 13.5px;
    color: #f0f0f8;
    line-height: 1.65;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    min-height: 140px;
  }
  .sf-textarea::placeholder { color: #44445a; font-family: 'Sora', sans-serif; }
  .sf-textarea:focus {
    border-color: #6c63ff;
    background: #1e1e28;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.10);
  }
  .sf-textarea:hover:not(:focus) {
    border-color: rgba(255,255,255,0.10);
  }

  /* Char counter */
  .sf-field-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: -2px;
  }
  .sf-char-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #44445a;
    transition: color 0.2s;
  }
  .sf-char-count.active { color: #8888aa; }

  /* Submit */
  .sf-submit {
    font-family: 'Sora', sans-serif;
    width: 100%;
    padding: 13px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 16px rgba(108,99,255,0.28);
    position: relative;
    overflow: hidden;
  }
  .sf-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .sf-submit:hover:not(:disabled)::before { background: rgba(255,255,255,0.08); }
  .sf-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(108,99,255,0.35);
  }
  .sf-submit:active:not(:disabled) { transform: translateY(0); }
  .sf-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .sf-submit-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }
`;

export default function ScreenerForm({ onSubmit, loading }) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText]         = useState('');
  const [resumeFile, setResumeFile]         = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ jobDescription, resumeText, resumeFile });
  };

  return (
    <>
      <style>{styles}</style>
      <form className="sf-form" onSubmit={handleSubmit}>

        {/* Job description */}
        <div className="sf-field">
          <label className="sf-label">Job Description</label>
          <textarea
            className="sf-textarea"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={6}
            required
          />
          <div className="sf-field-footer">
            <span className={`sf-char-count ${jobDescription.length > 0 ? 'active' : ''}`}>
              {jobDescription.length} chars
            </span>
          </div>
        </div>

        {/* Resume */}
        <div className="sf-field">
          <label className="sf-label">Your Resume</label>
          <ResumeInput
            onTextChange={setResumeText}
            onFileChange={setResumeFile}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="sf-submit" disabled={loading}>
          <span className="sf-submit-inner">
            {loading ? (
              <LoadingDots text="Analysing your resume" />
            ) : (
              <>
                Analyse Resume
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </span>
        </button>

      </form>
    </>
  );
}