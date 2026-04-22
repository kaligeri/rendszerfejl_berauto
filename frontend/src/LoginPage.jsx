import { useState } from "react";

const API_BASE = "http://localhost:5239/api";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
          throw new Error(msg || "Invalid username or password.");
      }
      const data = await res.json();
        onLogin?.(data.token, form.username);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="lp-root">
        <div className="lp-right">
          <div className="lp-form-wrap">
            <div className="lp-form-header">
              <h1 className="lp-title">Sign in</h1>
              <p className="lp-subtitle">Enter your credentials to access your account</p>
            </div>

            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              <div className="lp-field">
                              <label className="lp-label" htmlFor="username">Username</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9z" />
                      <path d="m2 6 8 5 8-5" />
                    </svg>
                  </span>
                  <input
                                      id="username"
                    className="lp-input"
                                      type="string"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("username")}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="lp-field">
                <label className="lp-label" htmlFor="password">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="9" width="12" height="9" rx="2" />
                      <path d="M7 9V6a3 3 0 0 1 6 0v3" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    className="lp-input lp-input-pw"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lp-pw-toggle"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        <circle cx="10" cy="10" r="2" />
                        <line x1="3" y1="3" x2="17" y2="17" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                        <circle cx="10" cy="10" r="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="lp-error" role="alert">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </svg>
                  {error}
                </div>
              )}

              <button className="lp-submit" type="submit" disabled={loading}>
                {loading ? (
                  <span className="lp-spinner" />
                ) : (
                  <>
                    Sign in
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

  .lp-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Sora', sans-serif;
    background: #f7f6f3;
  }

  /* ── LEFT PANEL ─────────────────────────── */
  .lp-left {
    position: relative;
    width: 42%;
    background: #141412;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .lp-left-inner {
    position: relative;
    z-index: 2;
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .lp-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    color: #f7f6f3;
  }

  .lp-car-icon {
    width: 52px;
    height: 26px;
    opacity: 0.9;
  }

  .lp-brand-name {
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #f7f6f3;
  }

  .lp-tagline {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .lp-tagline span {
    font-size: 44px;
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #f7f6f3;
  }

  .lp-tagline-light {
    color: #8a8880 !important;
  }

  .lp-dots {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .lp-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3a3936;
  }

  .lp-dots span:first-child { background: #f7f6f3; }

  /* BG shapes */
  .lp-bg-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .lp-shape {
    position: absolute;
    border-radius: 50%;
  }

  .lp-shape-1 {
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, #2a2925 0%, transparent 70%);
    bottom: -80px;
    right: -80px;
  }

  .lp-shape-2 {
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, #1e1d1b 0%, transparent 70%);
    top: -40px;
    left: -40px;
  }

  /* ── RIGHT PANEL ────────────────────────── */
  .lp-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
  }

  .lp-form-wrap {
    width: 100%;
    max-width: 380px;
  }

  .lp-form-header {
    margin-bottom: 36px;
  }

  .lp-title {
    font-size: 30px;
    font-weight: 300;
    letter-spacing: -0.03em;
    color: #141412;
    margin-bottom: 8px;
  }

  .lp-subtitle {
    font-size: 14px;
    color: #8a8880;
    line-height: 1.5;
    font-weight: 300;
  }

  /* ── FIELDS ─────────────────────────────── */
  .lp-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .lp-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lp-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b6a67;
  }

  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lp-input-icon {
    position: absolute;
    left: 14px;
    width: 16px;
    height: 16px;
    color: #b0aea8;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .lp-input-icon svg {
    width: 16px;
    height: 16px;
  }

  .lp-input {
    width: 100%;
    height: 46px;
    padding: 0 14px 0 42px;
    background: #fff;
    border: 1px solid #e2e0d8;
    border-radius: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: #141412;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .lp-input::placeholder { color: #c0bdb6; }

  .lp-input:focus {
    border-color: #141412;
    box-shadow: 0 0 0 3px rgba(20,20,18,0.06);
  }

  .lp-input-pw {
    padding-right: 44px;
  }

  .lp-pw-toggle {
    position: absolute;
    right: 12px;
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #b0aea8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: color 0.15s;
  }

  .lp-pw-toggle:hover { color: #141412; }
  .lp-pw-toggle svg { width: 16px; height: 16px; }

  /* ── ERROR ───────────────────────────────── */
  .lp-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    background: #fdf0ee;
    border: 1px solid #f5c6c2;
    border-radius: 8px;
    font-size: 13px;
    color: #c0392b;
    line-height: 1.4;
    animation: lp-fadein 0.2s ease;
  }

  .lp-error svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ── SUBMIT ──────────────────────────────── */
  .lp-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    width: 100%;
    margin-top: 4px;
    background: #141412;
    color: #f7f6f3;
    border: none;
    border-radius: 8px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }

  .lp-submit:hover { opacity: 0.88; }
  .lp-submit:active { transform: scale(0.98); }
  .lp-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .lp-submit svg { width: 15px; height: 15px; }

  /* ── SPINNER ─────────────────────────────── */
  .lp-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(247,246,243,0.25);
    border-top-color: #f7f6f3;
    border-radius: 50%;
    animation: lp-spin 0.6s linear infinite;
  }

  @keyframes lp-spin { to { transform: rotate(360deg); } }
  @keyframes lp-fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  /* ── RESPONSIVE ──────────────────────────── */
  @media (max-width: 720px) {
    .lp-left { display: none; }
    .lp-right { padding: 32px 24px; }
  }
`;
