import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const bgStyle = {
  backgroundImage: `
    radial-gradient(1200px 700px at 30% 25%, rgba(255,255,255,0.18), rgba(0,0,0,0) 60%),
    linear-gradient(135deg, rgba(15,23,42,0.95), rgba(88,28,135,0.85) 45%, rgba(15,23,42,0.95))
  `,
  backgroundSize: 'auto, auto, 256px 256px',
  backgroundRepeat: 'no-repeat, no-repeat, repeat',
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const nm = name.trim();
    const em = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      alert('Enter a valid email address.');
      return;
    }
    if (!nm) {
      alert('Enter your name.');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    try {
      setBusy(true);
      await api.post('/auth/register', {
        name: nm,
        email: em,
        password,
      });

      navigate('/verify-email/notice', {
        replace: true,
        state: { email: em },
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error ||
        (status === 409
          ? 'Email already in use.'
          : status === 422
          ? 'Enter a valid email address.'
          : 'Registration failed. Please try again.');
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={bgStyle}>
      {/* Soft grid accent (optional) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:24px_24px,24px_24px]"
      />

      {/* Glow orb (subtle) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle at 60% 40%, rgba(167,139,250,0.45), rgba(99,102,241,0) 60%)' }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-sm">Register</h2>

            <label className="block text-xs font-medium text-white/80 mb-1">Name</label>
            <input
              type="text"
              placeholder="Senku Ishigami"
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-300/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="block text-xs font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              placeholder="name@domain.com"
              className="mb-3 w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-300/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-xs font-medium text-white/80 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-300/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              {busy ? 'Registering…' : 'Register'}
            </button>

            <p className="mt-4 text-sm text-white/80">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-200 hover:text-white underline underline-offset-4">
                Login
              </Link>
            </p>

            <p className="mt-2 text-[12px] text-white/60">
              After registering, a verification link will be sent to the email address provided.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
