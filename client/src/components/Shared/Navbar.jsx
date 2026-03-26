import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .nav-root {
    font-family: 'Sora', sans-serif;
    background: #0d0d14;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(12px);
  }

  .nav-inner {
    max-width: 1080px;
    margin: 0 auto;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }

  .nav-logo-mark {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-logo-text {
    font-size: 15px;
    font-weight: 700;
    color: #f0f0f8;
    letter-spacing: -0.3px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .nav-link {
    font-size: 13px;
    font-weight: 500;
    padding: 6px 13px;
    border-radius: 8px;
    text-decoration: none;
    color: #8888aa;
    transition: color 0.15s, background 0.15s;
    border: 1px solid transparent;
  }
  .nav-link:hover {
    color: #f0f0f8;
    background: rgba(255,255,255,0.04);
  }
  .nav-link.active {
    color: #a78bfa;
    background: rgba(108,99,255,0.10);
    border-color: rgba(108,99,255,0.20);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .nav-user {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #44445a;
    letter-spacing: 0.3px;
  }

  .nav-logout {
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 7px;
    border: 1px solid rgba(255,77,109,0.18);
    background: rgba(255,77,109,0.06);
    color: #ff8099;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .nav-logout:hover {
    background: rgba(255,77,109,0.12);
    border-color: rgba(255,77,109,0.30);
  }
`;

const navLinks = [
  { path: '/screener',     label: 'Resume Screener' },
  { path: '/cover-letter', label: 'Cover Letter'    },
  { path: '/history',      label: 'History'         },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          <Link to="/screener" className="nav-logo">
            <div className="nav-logo-mark">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <span className="nav-logo-text">Screener AI</span>
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            {user?.name && (
              <span className="nav-user">{user.name}</span>
            )}
            <button
              className="nav-logout"
              onClick={() => { logout(); navigate('/login'); }}
            >
              Logout
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}