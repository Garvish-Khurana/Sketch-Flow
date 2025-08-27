import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function DashboardLanding() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyCreate, setBusyCreate] = useState(false);
  const [error, setError] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const navigate = useNavigate();

  const normalize = (p) => ({
    id: String(p._id ?? p.id ?? ''),
    title: p.title || p.name || 'Untitled',
    updatedAt: p.updatedAt || p.updated_at || p.createdAt || p.created_at || null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/projects');
        const items = res?.data?.data?.items ?? [];
        setProjects(items.map(normalize));
        if (items.length === 0) {
          localStorage.removeItem('lastOpenedProjectId');
        }
         window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (err?.response?.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          const msg = err?.response?.data?.error?.message || err?.response?.data?.error || 'Failed to load projects';
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const ordered = useMemo(() => {
    return [...projects].sort((a, b) => {
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return tb - ta;
    });
  }, [projects]);

  const createProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;

    try {
      setBusyCreate(true);
      setError('');
      const res = await api.post('/projects', { title: name, name });
      const createdDoc = res?.data?.data ?? res?.data ?? {};
      const id = String(createdDoc._id ?? createdDoc.id ?? '');
      const title = createdDoc.title || createdDoc.name || name;

      if (!id) throw new Error('Missing new project id');

      setProjects((prev) => [...prev, normalize({ ...createdDoc, title })]);
      setNewProjectName('');
      localStorage.setItem('lastOpenedProjectId', id);
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error('Error creating project:', err);
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

  const deleteProject = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      if (err?.response?.status === 401) {
        localStorage.clear();
        navigate('/login', { replace: true });
      } else {
        alert(err?.response?.data?.error?.message || err?.response?.data?.error || 'Failed to delete project');
      }
    }
  };

  const renameProject = async (id, nextTitleRaw) => {
    const nextTitle = (nextTitleRaw || '').trim();
    setRenamingId(null);
    if (!id || !nextTitle) return;

    try {
      setError('');
      await api.put(`/projects/${id}`, { title: nextTitle, name: nextTitle });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: nextTitle, updatedAt: new Date().toISOString() } : p))
      );
    } catch (err) {
      console.error('Error renaming project:', err);
      if (err?.response?.status === 401) {
        localStorage.clear();
        navigate('/login', { replace: true });
      } else {
        const msg = err?.response?.data?.error?.message || err?.response?.data?.error || 'Failed to rename project';
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-parchment bg-cover bg-center bg-fixed">
      <div className="bg-white/80 min-h-screen">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
          <h1 className="text-4xl font-['Caveat',cursive] font-bold text-stone-900">My Projects</h1>
        </div>

        {/* Create bar */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
            <label htmlFor="new-project" className="sr-only">
              New project name
            </label>
            <input
              id="new-project"
              className="flex-grow p-3 rounded border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444] outline-none focus:ring-2 ring-offset-2 ring-stone-400"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newProjectName.trim() && !busyCreate) createProject();
              }}
              disabled={busyCreate}
            />
            <button
              onClick={createProject}
              disabled={!newProjectName.trim() || busyCreate}
              className={[
                'px-6 py-3 rounded font-semibold border-2 border-stone-800 shadow-[4px_4px_0_#444] transition',
                !newProjectName.trim() || busyCreate
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-stone-900',
              ].join(' ')}
              aria-label="Create project"
              title="Create project"
            >
              {busyCreate ? 'Creating…' : 'Create'}
            </button>
          </div>

          {/* Error or loading */}
          {error && (
            <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded px-3 py-2">{error}</div>
          )}
          {loading && <div className="text-stone-700">Loading projects…</div>}

          {/* Empty state */}
          {!loading && !error && ordered.length === 0 && (
            <div className="mt-8 p-6 rounded-lg border-2 border-stone-800 bg-yellow-50 shadow-[4px_4px_0_#444]">
              <div className="text-2xl mb-2">No roadmaps yet</div>
              <div className="text-stone-700 mb-4">Create your first project to get started.</div>
              <button
                onClick={() => {
                  setNewProjectName('My Roadmap');
                  setTimeout(() => createProject(), 0);
                }}
                className="px-4 py-2 rounded bg-stone-900 text-white hover:bg-black"
              >
                Create “My Roadmap”
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && ordered.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {ordered.map((p) => (
                <article
                  key={p.id}
                  className="relative p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[6px_6px_0_#444] hover:-translate-y-0.5 transition-transform"
                >
                  <header className="pr-8">
                    {renamingId === p.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => renameProject(p.id, renameValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') renameProject(p.id, renameValue);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="w-full rounded border border-stone-300 px-2 py-1 text-stone-900"
                        aria-label="Edit project name"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-stone-900 truncate">{p.title}</h2>
                        <button
                          onClick={() => {
                            setRenamingId(p.id);
                            setRenameValue(p.title);
                          }}
                          className="text-xs underline underline-offset-4 text-stone-600 hover:text-stone-900"
                          aria-label={`Rename ${p.title}`}
                          title="Rename"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {p.updatedAt && (
                      <div className="text-xs text-stone-600 mt-1">
                        Updated {new Date(p.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </header>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        if (!p.id) return;
                        localStorage.setItem('lastOpenedProjectId', p.id);
                        navigate(`/projects/${p.id}`);
                      }}
                      className="px-4 py-2 rounded bg-white border-2 border-stone-800 shadow-[4px_4px_0_#444] hover:bg-stone-50"
                      disabled={!p.id}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => p.id && navigate(`/projects/${p.id}`)}
                      className="px-4 py-2 rounded bg-yellow-200 border-2 border-stone-800 shadow-[4px_4px_0_#444] hover:bg-yellow-300"
                      title="Open in editor"
                      disabled={!p.id}
                    >
                      Edit
                    </button>
                  </div>

                  <button
                    onClick={() => p.id && deleteProject(p.id)}
                    className="absolute top-3 right-3 text-red-700 text-xl leading-none"
                    aria-label={`Delete ${p.title}`}
                    title="Delete project"
                    disabled={!p.id}
                  >
                    &times;
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Helpful links */}
          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            <button onClick={() => navigate('/templates')} className="underline underline-offset-4">
              Browse templates
            </button>
            <button onClick={() => navigate('/project/demo')} className="underline underline-offset-4">
              Try live demo
            </button>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
