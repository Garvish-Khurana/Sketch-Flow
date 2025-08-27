import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

const bgStyle = {
  backgroundImage: `
    radial-gradient(1200px 700px at 70% 20%, rgba(255,255,255,0.18), rgba(0,0,0,0) 60%),
    linear-gradient(135deg, rgba(30,41,59,0.95), rgba(88,28,135,0.85) 40%, rgba(15,23,42,0.95))`,
  backgroundSize: 'auto, auto, 256px 256px',
  backgroundRepeat: 'no-repeat, no-repeat, repeat',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === '1') setVerified(true);
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const eTrim = email.trim();
    if (!isEmail(eTrim)) {
      alert('Enter a valid email address.');
      return;
    }
    if (!password) {
      alert('Enter the password.');
      return;
    }

    try {
      setBusy(true);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const res = await api.post('/auth/login', { email: eTrim, password });
      const payload = res?.data?.data ?? res?.data ?? {};
      const token = payload.token;
      const userId = payload._id || payload.id || payload.userId;
      const userName = payload.name;
      const userEmail = payload.email;

      if (token) localStorage.setItem('token', token);
      if (userId || userName || userEmail) {
        localStorage.setItem('user', JSON.stringify({ _id: userId, name: userName, email: userEmail }));
      }
      window.dispatchEvent(new Event('storage'));

      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 403) {
        navigate('/verify-email/notice', { replace: true, state: { email: email.trim() } });
        return;
      }
      const msg =
        data?.error ||
        (status === 401
          ? 'Invalid email or password.'
          : status === 422
          ? 'Enter a valid email address.'
          : 'Login failed. Please try again.');
      console.error('Login error:', status, data || err.message);
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    const eTrim = email.trim();
    if (!isEmail(eTrim)) {
      alert('Enter a valid email first to resend verification.');
      return;
    }
    try {
      setResending(true);
      await api.post('/auth/resend-verification', { email: eTrim });
      alert('If an account exists, a new verification email has been sent.');
    } catch (err) {
      const data = err?.response?.data;
      console.error('Resend verification error:', data || err.message);
      alert(data?.error || 'Could not resend verification. Try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={bgStyle}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:24px_24px,24px_24px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.45), rgba(99,102,241,0) 60%)',
        }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-sm">Login</h2>

            {verified && (
              <div className="mb-4 rounded-lg bg-green-600/80 text-white px-3 py-2 text-sm">
                ✅ Your email has been verified. You can now log in.
              </div>
            )}

            <label className="block text-xs font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@domain.com"
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-300/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-xs font-medium text-white/80 mb-1">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-300/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300/60"
            >
              {busy ? 'Signing in…' : 'Login'}
            </button>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-violet-200 hover:text-white underline underline-offset-4 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Resend verification email"
              >
                {resending ? 'Resending…' : 'Resend verification email'}
              </button>
            </div>

            <p className="mt-4 text-sm text-white/80">
              Don’t have an account?{' '}
              <Link to="/register" className="text-violet-200 hover:text-white underline underline-offset-4">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
