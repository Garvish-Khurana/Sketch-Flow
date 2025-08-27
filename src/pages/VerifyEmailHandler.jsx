import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function VerifyEmailHandler() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }
      try {
        const res = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
        if (res?.status >= 200 && res?.status < 300) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          setTimeout(() => navigate('/login?verified=1', { replace: true }), 600);
          return;
        }
        setStatus('error');
        setMessage('Verification failed.');
      } catch (e) {
        try {
          const direct = `${(import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL ||
             'http://localhost:5000/api').replace(/\/api$/, '')}/login?verified=1`;
          setStatus('error');
          setMessage('Invalid or expired verification link. Request a new one from the login page.');
        } catch {
          setStatus('error');
          setMessage('Invalid or expired verification link. Request a new one from the login page.');
        }
      }
    };
    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="max-w-md w-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 text-center">
        {status === 'loading' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold mb-2">✅ Email Verified</h1>
            <p className="text-white/80 mb-4">{message}</p>
            <Link to="/login" className="inline-block rounded-lg bg-violet-500 hover:bg-violet-600 px-4 py-2">
              Go to Login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-2">⚠️ Verification Failed</h1>
            <p className="text-white/80 mb-4">{message}</p>
            <Link to="/login" className="inline-block rounded-lg bg-violet-500 hover:bg-violet-600 px-4 py-2">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
