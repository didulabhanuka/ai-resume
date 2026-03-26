import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg:          #0a0a0f;
    --surface:     #111118;
    --surface-2:   #18181f;
    --surface-3:   #1e1e28;
    --border:      rgba(255,255,255,0.06);
    --accent:      #6c63ff;
    --accent-2:    #a78bfa;
    --accent-glow: rgba(108,99,255,0.28);
    --accent-soft: rgba(108,99,255,0.10);
    --text-1:      #f0f0f8;
    --text-2:      #8888aa;
    --text-3:      #44445a;
    --danger:      #ff4d6d;
    --danger-soft: rgba(255,77,109,0.10);
  }

  .l-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    color: var(--text-1);
    position: relative;
    overflow: hidden;
  }

  .l-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .l-root::after {
    content: '';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    width: 700px;
    height: 700px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  .l-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .l-wrap.in { opacity: 1; transform: translateY(0); }

  .l-header { text-align: center; margin-bottom: 28px; }

  .l-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    box-shadow: 0 0 28px var(--accent-glow);
    margin-bottom: 20px;
  }

  .l-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.6px;
    color: var(--text-1);
    margin-bottom: 6px;
  }
  .l-subtitle { font-size: 13px; color: var(--text-2); }

  .l-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  }

  /* Error with shake */
  .l-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    margin-bottom: 20px;
    background: var(--danger-soft);
    border: 1px solid rgba(255,77,109,0.2);
    border-radius: 8px;
    font-size: 13px;
    color: #ff8099;
    animation: lShake 0.35s ease;
  }
  @keyframes lShake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-4px); }
    40%      { transform: translateX(4px); }
    60%      { transform: translateX(-3px); }
    80%      { transform: translateX(3px); }
  }

  .l-form  { display: flex; flex-direction: column; gap: 18px; }
  .l-field { display: flex; flex-direction: column; gap: 7px; }

  .l-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .l-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--text-2);
  }
  .l-forgot {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-3);
    text-decoration: none;
    transition: color 0.15s;
  }
  .l-forgot:hover { color: var(--accent-2); }

  .l-input-wrap { position: relative; }

  .l-input-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    pointer-events: none;
    transition: color 0.2s;
  }
  .l-input-wrap:focus-within .l-input-icon { color: var(--accent-2); }

  .l-input {
    font-family: 'Sora', sans-serif;
    width: 100%;
    padding: 11px 40px 11px 38px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text-1);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .l-input::placeholder { color: var(--text-3); font-family: 'Sora', sans-serif; }
  .l-input:focus {
    border-color: var(--accent);
    background: var(--surface-3);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  /* Show/hide toggle */
  .l-pw-toggle {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    padding: 2px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }
  .l-pw-toggle:hover { color: var(--accent-2); }

  /* Submit */
  .l-submit {
    font-family: 'Sora', sans-serif;
    width: 100%;
    padding: 12px;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border: none;
    border-radius: 9px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 16px var(--accent-glow);
    position: relative;
    overflow: hidden;
  }
  .l-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.2s;
  }
  .l-submit:hover:not(:disabled)::before { background: rgba(255,255,255,0.08); }
  .l-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px var(--accent-glow); }
  .l-submit:active:not(:disabled)  { transform: translateY(0); }
  .l-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  .l-btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  .l-spinner {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: lSpin 0.6s linear infinite;
  }
  @keyframes lSpin { to { transform: rotate(360deg); } }

  .l-footer { text-align: center; margin-top: 22px; font-size: 13px; color: var(--text-2); }

  .l-link {
    font-weight: 600;
    color: var(--accent-2);
    text-decoration: none;
    transition: color 0.2s;
  }
  .l-link:hover { color: var(--text-1); }

  .l-brand { text-align: center; margin-top: 32px; }
  .l-brand-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]               = useState({ email: '', password: '' });
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate('/screener');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="l-root">
        <div className={`l-wrap ${mounted ? 'in' : ''}`}>

          {/* Header */}
          <div className="l-header">
            <div className="l-logo">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M3 13V6l5-3 5 3v7" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                <rect x="5.5" y="8.5" width="5" height="4.5" rx="0.75" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
            <h1 className="l-title">Welcome back</h1>
            <p className="l-subtitle">Sign in to continue to Screener AI</p>
          </div>

          {/* Card */}
          <div className="l-card">
            {error && (
              <div className="l-error" key={error}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form className="l-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="l-field">
                <label className="l-label">Work email</label>
                <div className="l-input-wrap">
                  <span className="l-input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    className="l-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="l-field">
                <div className="l-label-row">
                  <label className="l-label">Password</label>
                  <a href="#" className="l-forgot">Forgot password?</a>
                </div>
                <div className="l-input-wrap">
                  <span className="l-input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    className="l-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="l-pw-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="l-submit" disabled={loading}>
                <span className="l-btn-inner">
                  {loading ? (
                    <><span className="l-spinner"/>Signing in…</>
                  ) : (
                    <>Sign in
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          <p className="l-footer">
            Don't have an account?{' '}
            <Link to="/register" className="l-link">Create one free</Link>
          </p>

          <div className="l-brand">
            <span className="l-brand-name">Screener AI</span>
          </div>
        </div>
      </div>
    </>
  );
}