import { useState } from "react";

const API_BASE = "http://localhost:5239/api";

export default function RegisterPage({ onSuccess, onLoginClick }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    role: "User",
    address: "",
    phoneNumber: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              username: form.username,
              email: form.email,
              password: form.password,
              role: form.role === "Admin" ? 2 : 0,
              address: form.address || null,
              phoneNumber: form.phoneNumber || null,
          }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Registration failed. Please try again.");
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="rp-root">
        <div className="rp-right">
          <div className="rp-form-wrap">
            <div className="rp-form-header">
              <h1 className="rp-title">Create account</h1>
              <p className="rp-subtitle">Fill in your details to get started</p>
            </div>

            <form className="rp-form" onSubmit={handleSubmit} noValidate>

              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-username">Username</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><UserIcon /></span>
                    <input id="rp-username" className="rp-input" type="text"
                      placeholder="johndoe" value={form.username}
                      onChange={set("username")} autoComplete="username" required />
                  </div>
                </div>
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-email">Email</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><MailIcon /></span>
                    <input id="rp-email" className="rp-input" type="email"
                      placeholder="you@example.com" value={form.email}
                      onChange={set("email")} autoComplete="email" required />
                  </div>
                </div>
              </div>

              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-password">Password</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><LockIcon /></span>
                    <input id="rp-password" className="rp-input rp-input-pw"
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 6 characters" value={form.password}
                      onChange={set("password")} autoComplete="new-password" required />
                    <button type="button" className="rp-pw-toggle"
                      onClick={() => setShowPw(v => !v)} tabIndex={-1}
                      aria-label={showPw ? "Hide password" : "Show password"}>
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-confirm">Confirm password</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><LockIcon /></span>
                    <input id="rp-confirm" className="rp-input rp-input-pw"
                      type={showPw ? "text" : "password"}
                      placeholder="Repeat password" value={form.confirm}
                      onChange={set("confirm")} autoComplete="new-password" required />
                  </div>
                </div>
              </div>

              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-phone">Phone <span className="rp-optional">(optional)</span></label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><PhoneIcon /></span>
                    <input id="rp-phone" className="rp-input" type="tel"
                      placeholder="+36 20 123 4567" value={form.phoneNumber}
                      onChange={set("phoneNumber")} autoComplete="tel" />
                  </div>
                </div>
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-role">Role</label>
                  <div className="rp-input-wrap rp-select-wrap">
                    <span className="rp-input-icon"><RoleIcon /></span>
                    <select id="rp-role" className="rp-input rp-select"
                      value={form.role} onChange={set("role")}>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <span className="rp-select-arrow"><ChevronIcon /></span>
                  </div>
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label" htmlFor="rp-address">Address <span className="rp-optional">(optional)</span></label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon"><MapPinIcon /></span>
                  <input id="rp-address" className="rp-input" type="text"
                    placeholder="1234 Budapest, Fő utca 1." value={form.address}
                    onChange={set("address")} autoComplete="street-address" />
                </div>
              </div>

              {error && (
                <div className="rp-error" role="alert">
                  <AlertIcon />
                  {error}
                </div>
              )}

              <button className="rp-submit" type="submit" disabled={loading}>
                {loading ? <span className="rp-spinner" /> : (
                  <>Create account <ArrowIcon /></>
                )}
              </button>

              <p className="rp-login-link">
                Already have an account?{" "}
                <button type="button" className="rp-link-btn" onClick={onLoginClick}>
                  Sign in
                </button>
              </p>

            </form>
          </div>
        </div>

      </div>
    </>
  );
}

const Svg = ({ d, children, ...p }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);
const UserIcon  = () => <Svg><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/></Svg>;
const MailIcon  = () => <Svg><rect x="2" y="5" width="16" height="12" rx="2"/><path d="m2 6 8 5 8-5"/></Svg>;
const LockIcon  = () => <Svg><rect x="4" y="9" width="12" height="9" rx="2"/><path d="M7 9V6a3 3 0 0 1 6 0v3"/></Svg>;
const PhoneIcon = () => <Svg d="M6.5 2h7L15 5l-2.5 2.5c.5 1 1 2 1.5 2.5s1.5 1 2.5 1.5L19 9l.5 2.5C19 14 17 16 14.5 17S8 16 5 13 2 7 3.5 4.5L6.5 2z"/>;
const RoleIcon  = () => <Svg><path d="M10 2a4 4 0 0 1 4 4v1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2V6a4 4 0 0 1 4-4z"/><circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none"/></Svg>;
const MapPinIcon= () => <Svg><path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6z"/><circle cx="10" cy="8" r="2"/></Svg>;
const EyeIcon   = () => <Svg><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2"/></Svg>;
const EyeOffIcon= () => <Svg><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2"/><line x1="3" y1="3" x2="17" y2="17"/></Svg>;
const ChevronIcon=() => <Svg d="M5 7l5 5 5-5"/>;
const AlertIcon = () => <svg viewBox="0 0 16 16" fill="currentColor" style={{width:15,height:15,flexShrink:0,marginTop:1}}><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>;
const ArrowIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><path d="M3 8h10M9 4l4 4-4 4"/></svg>;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

  .rp-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Sora', sans-serif;
    background: #f7f6f3;
  }

  /* LEFT PANEL */
  .rp-left {
    position: relative;
    width: 38%;
    background: #141412;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .rp-left-inner {
    position: relative;
    z-index: 2;
    padding: 48px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .rp-brand { display: flex; align-items: center; gap: 14px; color: #f7f6f3; }
  .rp-car-icon { width: 52px; height: 26px; opacity: 0.9; }
  .rp-brand-name { font-size: 22px; font-weight: 300; letter-spacing: 0.18em; text-transform: uppercase; }
  .rp-tagline { display: flex; flex-direction: column; gap: 4px; }
  .rp-tagline span { font-size: 44px; font-weight: 300; line-height: 1.1; letter-spacing: -0.03em; color: #f7f6f3; }
  .rp-tagline-light { color: #8a8880 !important; }
  .rp-dots { display: flex; gap: 8px; margin-top: 8px; }
  .rp-dots span { width: 6px; height: 6px; border-radius: 50%; background: #3a3936; }
  .rp-dots span:first-child { background: #f7f6f3; }
  .rp-bg-shapes { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
  .rp-shape { position: absolute; border-radius: 50%; }
  .rp-shape-1 { width: 380px; height: 380px; background: radial-gradient(circle, #2a2925 0%, transparent 70%); bottom: -80px; right: -80px; }
  .rp-shape-2 { width: 240px; height: 240px; background: radial-gradient(circle, #1e1d1b 0%, transparent 70%); top: -40px; left: -40px; }

  /* RIGHT PANEL */
  .rp-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    overflow-y: auto;
  }
  .rp-form-wrap { width: 100%; max-width: 520px; }
  .rp-form-header { margin-bottom: 32px; }
  .rp-title { font-size: 30px; font-weight: 300; letter-spacing: -0.03em; color: #141412; margin-bottom: 8px; }
  .rp-subtitle { font-size: 14px; color: #8a8880; line-height: 1.5; font-weight: 300; }

  /* FORM */
  .rp-form { display: flex; flex-direction: column; gap: 18px; }

  .rp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .rp-field { display: flex; flex-direction: column; gap: 7px; }

  .rp-label {
    font-size: 11px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: #6b6a67;
  }
  .rp-optional { font-weight: 300; text-transform: none; letter-spacing: 0; color: #b0aea8; }

  .rp-input-wrap { position: relative; display: flex; align-items: center; }

  .rp-input-icon {
    position: absolute; left: 13px; width: 16px; height: 16px;
    color: #b0aea8; pointer-events: none; display: flex; align-items: center;
  }
  .rp-input-icon svg { width: 16px; height: 16px; }

  .rp-input {
    width: 100%; height: 44px; padding: 0 14px 0 40px;
    background: #fff; border: 1px solid #e2e0d8; border-radius: 8px;
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 300;
    color: #141412; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none; appearance: none;
  }
  .rp-input::placeholder { color: #c0bdb6; }
  .rp-input:focus { border-color: #141412; box-shadow: 0 0 0 3px rgba(20,20,18,0.06); }
  .rp-input-pw { padding-right: 42px; }

  /* SELECT */
  .rp-select-wrap { position: relative; }
  .rp-select { cursor: pointer; }
  .rp-select-arrow {
    position: absolute; right: 12px; pointer-events: none;
    color: #b0aea8; display: flex; align-items: center;
  }
  .rp-select-arrow svg { width: 14px; height: 14px; }

  /* PASSWORD TOGGLE */
  .rp-pw-toggle {
    position: absolute; right: 12px; width: 20px; height: 20px;
    background: transparent; border: none; cursor: pointer;
    color: #b0aea8; display: flex; align-items: center; justify-content: center;
    padding: 0; transition: color 0.15s;
  }
  .rp-pw-toggle:hover { color: #141412; }
  .rp-pw-toggle svg { width: 16px; height: 16px; }

  /* ERROR */
  .rp-error {
    display: flex; align-items: flex-start; gap: 8px;
    padding: 12px 14px; background: #fdf0ee; border: 1px solid #f5c6c2;
    border-radius: 8px; font-size: 13px; color: #c0392b; line-height: 1.4;
    animation: rp-fadein 0.2s ease;
  }

  /* SUBMIT */
  .rp-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    height: 48px; width: 100%; margin-top: 4px;
    background: #141412; color: #f7f6f3; border: none; border-radius: 8px;
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500;
    letter-spacing: 0.01em; cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }
  .rp-submit:hover { opacity: 0.88; }
  .rp-submit:active { transform: scale(0.98); }
  .rp-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* LOGIN LINK */
  .rp-login-link { text-align: center; font-size: 13px; color: #8a8880; font-weight: 300; }
  .rp-link-btn {
    background: none; border: none; font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 500; color: #141412; cursor: pointer;
    text-decoration: underline; text-underline-offset: 2px; padding: 0;
  }
  .rp-link-btn:hover { opacity: 0.7; }

  /* SPINNER */
  .rp-spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2px solid rgba(247,246,243,0.25); border-top-color: #f7f6f3;
    border-radius: 50%; animation: rp-spin 0.6s linear infinite;
  }

  @keyframes rp-spin { to { transform: rotate(360deg); } }
  @keyframes rp-fadein { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 780px) {
    .rp-left { display: none; }
    .rp-right { padding: 32px 24px; }
    .rp-row { grid-template-columns: 1fr; }
  }
`;
