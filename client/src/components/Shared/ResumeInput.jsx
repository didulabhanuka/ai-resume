import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .ri-root { font-family: 'Sora', sans-serif; }

  /* Toggle */
  .ri-toggle {
    display: inline-flex;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
    background: #0e0e15;
  }

  .ri-tab {
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    padding: 7px 16px;
    border: none;
    background: none;
    color: #44445a;
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
    position: relative;
  }
  .ri-tab:hover:not(.active) {
    color: #8888aa;
    background: rgba(255,255,255,0.03);
  }
  .ri-tab.active {
    color: #a78bfa;
    background: rgba(108,99,255,0.12);
  }

  /* Textarea */
  .ri-textarea {
    font-family: 'Sora', sans-serif;
    font-size: 13.5px;
    width: 100%;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 12px 14px;
    color: #f0f0f8;
    resize: vertical;
    min-height: 160px;
    outline: none;
    line-height: 1.65;
    box-sizing: border-box;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .ri-textarea::placeholder { color: #44445a; }
  .ri-textarea:focus {
    border-color: #6c63ff;
    background: #1e1e28;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.10);
  }

  /* Dropzone */
  .ri-drop {
    border: 1.5px dashed rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 36px 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    background: #0e0e15;
  }
  .ri-drop:hover, .ri-drop.active {
    border-color: rgba(108,99,255,0.40);
    background: rgba(108,99,255,0.05);
  }

  .ri-drop-icon {
    width: 38px;
    height: 38px;
    margin: 0 auto 10px;
    border-radius: 10px;
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ri-drop-title {
    font-size: 13px;
    font-weight: 600;
    color: #c8c8e8;
    margin-bottom: 4px;
  }
  .ri-drop-sub {
    font-size: 12px;
    color: #44445a;
    line-height: 1.5;
  }
  .ri-drop-hint {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #2e2e3a;
    margin-top: 8px;
  }

  /* Uploaded state */
  .ri-file-done {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(52,211,153,0.06);
    border: 1px solid rgba(52,211,153,0.18);
    border-radius: 10px;
  }
  .ri-file-name {
    font-size: 13px;
    font-weight: 500;
    color: #34d399;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ri-file-replace {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #44445a;
  }
`;

export default function ResumeInput({ onTextChange, onFileChange }) {
  const [mode,     setMode]     = useState('paste');
  const [text,     setText]     = useState('');
  const [fileName, setFileName] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTextChange(e.target.value);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) { setFileName(file.name); onFileChange(file); }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <>
      <style>{styles}</style>
      <div className="ri-root">

        <div className="ri-toggle">
          <button className={`ri-tab ${mode === 'paste'  ? 'active' : ''}`} onClick={() => setMode('paste')}>Paste text</button>
          <button className={`ri-tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => setMode('upload')}>Upload PDF</button>
        </div>

        {mode === 'paste' && (
          <textarea
            className="ri-textarea"
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your resume text here…"
            rows={8}
          />
        )}

        {mode === 'upload' && (
          <div {...getRootProps()} className={`ri-drop ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {fileName ? (
              <div className="ri-file-done">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ri-file-name">{fileName}</span>
                <span className="ri-file-replace">click to replace</span>
              </div>
            ) : (
              <>
                <div className="ri-drop-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="ri-drop-title">{isDragActive ? 'Drop it here' : 'Drag & drop your resume'}</p>
                <p className="ri-drop-sub">or click to browse</p>
                <p className="ri-drop-hint">PDF only · max 5 MB</p>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}