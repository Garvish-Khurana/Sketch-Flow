import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import api from '../utils/api';

const ProjectsContext = createContext({ projects: [], loading: false, error: null, refresh: () => {} });
const baseURL = import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`${baseURL}/api/projects`);
      const items = Array.isArray(res.data) ? res.data : [];
      const normalized = items.map(p => ({
        id: String(p.id ?? p._id),
        name: p.name || p.title || `Project ${p.id ?? p._id}`,
      }));
      setProjects(normalized);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const value = useMemo(() => ({ projects, loading, error, refresh }), [projects, loading, error]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  return useContext(ProjectsContext);
}
