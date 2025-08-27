import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function VerifyEmailNotice() {
const loc = useLocation();
const pendingEmail = loc.state?.email;

return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
    <div className="max-w-md w-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-white/80">
        A verification link has been sent{pendingEmail ? ` to ${pendingEmail}` : ''}. Please click the link to activate the account.
        </p>
        <p className="mt-3 text-sm text-white/70">
        Didn’t receive it? Check spam, or request a new link from the login page.
        </p>
        <div className="mt-5">
        <Link to="/login" className="inline-block rounded-lg bg-violet-500 hover:bg-violet-600 px-4 py-2">
            Go to Login
        </Link>
        </div>
    </div>
    </div>
);
}
