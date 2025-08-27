import React, { useMemo } from 'react';

export default function ProjectList({
  projects,
  loading,
  currentProjectId,
  onSelect,
  filter,
  onFilterChange,
  isDark,
}) {
  const filtered = useMemo(() => {
    const q = (filter || '').trim().toLowerCase();
    if (!q) return projects;
    return (projects || []).filter((p) => {
      const name = (p.name || p.title || '').toLowerCase();
      const id = String(p.id || p._id || '').toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [projects, filter]);

  return (
    <div>
      <div className="pb-2">
        <input
          className={[
            'w-full px-3 py-2 rounded-lg border outline-none',
            isDark
              ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400'
              : 'bg-white/85 border-neutral-400/60 text-neutral-900 placeholder:text-neutral-500',
          ].join(' ')}
          type="text"
          placeholder="Filter projects…"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter projects"
        />
      </div>

      <div
        className={[
          'rounded-lg p-1.5 max-h-64 overflow-y-auto border border-dashed',
          isDark ? 'bg-neutral-900/60 border-neutral-700' : 'bg-white/60 border-neutral-400/60',
        ].join(' ')}
        role="list"
        aria-busy={loading}
        aria-live="polite"
      >
        {loading && <div className="p-2 italic opacity-80">Loading projects…</div>}

        {!loading && filtered.length === 0 && (
          <div className="p-2 opacity-70">No projects found.</div>
        )}

        {!loading &&
          filtered.map((proj) => {
            const id = String(proj.id ?? proj._id ?? '');
            const name = proj.name || proj.title || `Project ${id || ''}`.trim();
            const active = id && String(currentProjectId) === id;

            return (
              <button
                key={id || name}
                role="listitem"
                onClick={() => (id ? onSelect(id) : undefined)}
                disabled={!id}
                title={id ? `Open ${name}` : 'Missing project id'}
                className={[
                  'w-full text-left px-3 py-2 mb-1.5 rounded-lg border transition',
                  isDark
                    ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-60'
                    : 'border-neutral-400/60 bg-white/85 hover:bg-amber-50 disabled:opacity-60',
                  active ? (isDark ? 'bg-amber-500/20' : 'bg-amber-200/60') : '',
                ].join(' ')}
              >
                <div className="font-semibold mb-0.5">{name}</div>
                {id && <div className="text-xs opacity-80">ID: {id}</div>}
              </button>
            );
          })}
      </div>
    </div>
  );
}
