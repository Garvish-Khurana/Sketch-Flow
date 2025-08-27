import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getDemoGraph } from '../utils/templates';

export default function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [lastProjectId, setLastProjectId] = useState(() => localStorage.getItem('lastOpenedProjectId') || '');

  useEffect(() => {
  const onStorage = () => {
    setLastProjectId(localStorage.getItem('lastOpenedProjectId') || '');
  };
  const onCustom = (e) => {
    if (e?.detail?.key === 'lastOpenedProjectId') {
      setLastProjectId(localStorage.getItem('lastOpenedProjectId') || '');
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('local-storage-change', onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('local-storage-change', onCustom);
  };
  }, []);

  
  const [busyCreate, setBusyCreate] = useState(false);
  const [error, setError] = useState('');

  const normalize = (p) => ({
    id: String(p?._id ?? p?.id ?? ''),
    title: p?.title || p?.name || 'Untitled',
    updatedAt: p?.updatedAt || p?.updated_at || p?.createdAt || p?.created_at || null,
  });

  const handleNewProject = async () => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (busyCreate) return;

    try {
      setBusyCreate(true);
      setError('');
      const defaultTitle = 'My Roadmap';
      const res = await api.post('/projects', { title: defaultTitle, name: defaultTitle });
      const createdDoc = res?.data?.data ?? res?.data ?? {};
      const normalized = normalize(createdDoc);
      if (!normalized.id) throw new Error('Missing new project id');

      localStorage.setItem('lastOpenedProjectId', normalized.id);
      navigate(`/projects/${normalized.id}`);
    } catch (err) {
      console.error('Create project failed:', err);
      if (err?.response?.status === 401) {
        localStorage.clear();
        navigate('/login', { replace: true });
      } else {
        const msg = err?.response?.data?.error?.message || err?.response?.data?.error || 'Failed to create project';
        setError(msg);
      }
    } finally {
      setBusyCreate(false);
    }
  };

  const handleLiveDemo = () => {
    navigate('/projects/demo', {
      state: { mode: 'ephemeral', graph: getDemoGraph() },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-parchment bg-cover bg-center bg-fixed bg-[#f8f3f3]">
      {/* Main overlay keeps existing warm grading; no extra top bar here */}
      <main className="bg-white/50 flex-1 flex flex-col">
        {/* Hero */}
        <section
          className="flex-1 min-h-[520px] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
          aria-labelledby="hero-title"
        >
          {/* rays */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <svg className="w-full h-full" role="img" aria-hidden="true">
              <defs>
                <pattern id="home-rays" patternUnits="userSpaceOnUse" width="400" height="400">
                  <g transform="translate(200,200)">
                    {Array.from({ length: 60 }).map((_, i) => (
                      <rect
                        key={i}
                        x="0"
                        y="-2"
                        width="200"
                        height="4"
                        fill="rgba(0,0,0,0.06)"
                        transform={`rotate(${i * 6})`}
                      />
                    ))}
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#home-rays)" />
            </svg>
          </div>

          <h1
            id="hero-title"
            className="text-5xl md:text-6xl font-bold mb-4 font-['Caveat',cursive] text-stone-900"
          >
            🪨Sketch Flow
          </h1>

          <p className="text-lg md:text-xl text-stone-800 max-w-2xl mb-8">
            Plan like Senku Ishigami—map hypotheses, link breakthroughs, and iterate with a hand‑drawn scientific roadmap.
          </p>

          {error && (
            <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!token ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-md shadow transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                  aria-label="Login"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-green-700"
                  aria-label="Register"
                >
                  Register
                </button>
                <button
                  onClick={handleLiveDemo}
                  className="border-2 border-stone-800 text-stone-900 bg-stone-100 hover:bg-stone-200 px-6 py-3 rounded-md shadow-[4px_4px_0_0] shadow-stone-800 transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                  aria-label="Try live demo"
                  title="Try a live demo (no sign-in)"
                >
                  Try Live Demo
                </button>
              </>
            ) : (
              <>
                {token && lastProjectId && (
                  <button
                    onClick={() => navigate(`/projects/${lastProjectId}`)}
                    className="bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-md shadow transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                    aria-label="Resume last project"
                    title="Resume last project"
                  >
                    Resume Last Project
                  </button>
                )}
                <button
                  onClick={handleNewProject}
                  disabled={busyCreate}
                  className={[
                    'px-6 py-3 rounded-md border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-yellow-600',
                    busyCreate ? 'bg-stone-300 text-stone-600 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black',
                  ].join(' ')}
                  aria-label="Create new project"
                  title="Create new project"
                >
                  {busyCreate ? 'Creating…' : 'New Project'}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="border-2 border-stone-800 text-stone-900 bg-stone-100 hover:bg-stone-200 px-6 py-3 rounded-md shadow-[4px_4px_0_0] shadow-stone-800 transition focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                  aria-label="Browse projects"
                >
                  Browse Projects
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-700">
            <span className="inline-flex items-center gap-2">💾 Autosave</span>
            <span className="inline-flex items-center gap-2">🖨️ Export JSON</span>
            <span className="inline-flex items-center gap-2">📥 Import JSON</span>
            <span className="inline-flex items-center gap-2">🧭 Visual linking</span>
          </div>

          <div className="mt-8 text-stone-600 text-sm opacity-80 select-none" aria-hidden="true">
            ↓ Learn more
          </div>
        </section>

        {/* How it works */}
        <section className="bg-yellow-100/100 py-12 border-t border-yellow-200 ">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center font-['Caveat',cursive] text-stone-900">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 border-2 border-stone-800 rounded-lg bg-white shadow-[4px_4px_0_0] shadow-stone-800 transition-transform hover:-translate-y-0.5">
                <div className="text-3xl mb-2">1️⃣</div>
                <h3 className="text-xl font-semibold mb-2">Add steps</h3>
                <p className="text-stone-700">Drop tasks, banners, or milestones onto the canvas.</p>
              </div>
              <div className="p-5 border-2 border-stone-800 rounded-lg bg-white shadow-[4px_4px_0_0] shadow-stone-800 transition-transform hover:-translate-y-0.5">
                <div className="text-3xl mb-2">2️⃣</div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-stone-700">Link everything with bold, comic-style edges.</p>
              </div>
              <div className="p-5 border-2 border-stone-800 rounded-lg bg-white shadow-[4px_4px_0_0] shadow-stone-800 transition-transform hover:-translate-y-0.5">
                <div className="text-3xl mb-2">3️⃣</div>
                <h3 className="text-xl font-semibold mb-2">Track progress</h3>
                <p className="text-stone-700">Use Status Orbs for emoji, status, and percent done.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Starter templates */}
        <section className="py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900 font-['Caveat',cursive]">Starter templates</h2>
              <button
                onClick={() => navigate('/templates')}
                className="text-sm underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
              >
                Browse all
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <article className="text-left p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 hover:bg-stone-200/90 transition">
                <div className="text-3xl">🧪</div>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Chemistry Sprint</h3>
                <p className="text-stone-700 mb-3">Acids, distillation, electrolysis.</p>
                <button
                  onClick={() => navigate('/projects/template/chem')}
                  className="text-sm underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                >
                  Use template
                </button>
              </article>

              <article className="text-left p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 hover:bg-stone-200/90 transition">
                <div className="text-3xl">💻</div>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Learning Path</h3>
                <p className="text-stone-700 mb-3">Modules, quizzes, capstone.</p>
                <button
                  onClick={() => navigate('/projects/template/learn')}
                  className="text-sm underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                >
                  Use template
                </button>
              </article>

              <article className="text-left p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 hover:bg-stone-200/90 transition">
                <div className="text-3xl">🚀</div>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Product Launch</h3>
                <p className="text-stone-700 mb-3">Backlog, QA, release checklist.</p>
                <button
                  onClick={() => navigate('/projects/template/launch')}
                  className="text-sm underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                >
                  Use template
                </button>
              </article>

              <article className="text-left p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 hover:bg-stone-200/90 transition">
                <div className="text-3xl">🗒️</div>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">Empty Canvas</h3>
                <p className="text-stone-700 mb-3">Start from scratch.</p>
                <button
                  onClick={() => navigate('/projects/template/empty')}
                  className="text-sm underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
                >
                  Use template
                </button>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100/90 py-6 text-center text-gray-700 text-sm border-t border-stone-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="opacity-90">&copy; {new Date().getFullYear()}  Sketch Flow -Garvish Khurana</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
            >
              My Projects
            </button>
            <button
              onClick={() => navigate('/templates')}
              className="underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
            >
              Templates
            </button>
            <button
              onClick={() =>
                navigate('/projects/demo', { state: { mode: 'ephemeral', graph: getDemoGraph() } })
              }
              className="underline underline-offset-4 hover:text-stone-900 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
            >
              Live Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile quick-create */}
      <div className="fixed bottom-4 inset-x-4 md:hidden grid grid-cols-2 gap-3 [padding-bottom:env(safe-area-inset-bottom)] z-40">
        <button
          onClick={() => (token ? handleNewProject() : navigate('/login'))}
          className="bg-stone-900 text-white py-3 rounded-md shadow disabled:opacity-60 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
          aria-label="Quick create new project"
          disabled={busyCreate}
        >
          {busyCreate ? 'Creating…' : 'New Project'}
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white border border-stone-800 py-3 rounded-md shadow-[4px_4px_0_0] shadow-stone-800 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-stone-600"
          aria-label="Open dashboard"
        >
          My Projects
        </button>
      </div>
    </div>
  );
}
