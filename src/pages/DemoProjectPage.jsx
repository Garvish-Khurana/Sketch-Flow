import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDemoGraph, getTemplateBySlug } from '../utils/templates';

export default function DemoProjectPage() {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const { slug } = useParams();

  useEffect(() => {
    let graph = null;
    if (pathname.startsWith('/projects/demo')) {
      graph = getDemoGraph();
    } else if (slug) {
      const tpl = getTemplateBySlug(slug);
      if (tpl) graph = tpl;
    }

    if (!graph) {
      navigate('/templates', { replace: true });
      return;
    }
    navigate('/projects/demo-session', { state: { graph, mode: 'ephemeral' }, replace: true });
  }, [navigate, pathname, slug, state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbf7]">
      <div className="text-stone-700">Preparing {slug ? 'template' : 'demo'}…</div>
    </div>
  );
}
