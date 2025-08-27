import React, { useMemo, useCallback } from 'react';

const cx = (...parts) => parts.filter(Boolean).join(' ');

function ProjectList({
  projects = [],
  loading = false,
  currentProjectId,
  onSelect,
  filter = '',
  onFilterChange,
  isDark = false,
}) {
  const handleFilterChange = useCallback(
    (e) => onFilterChange?.(e.target.value),
    [onFilterChange]
  );

  const filtered = useMemo(() => {
    const q = (filter || '').trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const idStr = String(p.id ?? '').toLowerCase();
      return name.includes(q) || idStr.includes(q);
    });
  }, [projects, filter]);

  return (
    <div>
      {/* Filter input */}
      <div className="pb-2">
        <input
          className={cx(
            'w-full px-3 py-2 rounded-lg border outline-none',
            isDark
              ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400'
              : 'bg-white/85 border-neutral-400/60 text-neutral-900 placeholder:text-neutral-500'
          )}
          type="text"
          placeholder="Filter projects…"
          value={filter}
          onChange={handleFilterChange}
          aria-label="Filter projects"
        />
      </div>

      {/* List */}
      <div
        className={cx(
          'rounded-lg p-1.5 max-h-64 overflow-y-auto border border-dashed',
          isDark ? 'bg-neutral-900/60 border-neutral-700' : 'bg-white/60 border-neutral-400/60'
        )}
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
            const id = String(proj.id);
            const active = String(currentProjectId) === id;

            const itemClass = cx(
              'w-full text-left px-3 py-2 mb-1.5 rounded-lg border transition',
              isDark
                ? 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700'
                : 'border-neutral-400/60 bg-white/85 hover:bg-amber-50',
              active ? (isDark ? 'bg-amber-500/20' : 'bg-amber-200/60') : ''
            );

            return (
              <button
                key={id}
                role="listitem"
                onClick={() => onSelect?.(id)}
                title={`Open ${proj.name || 'project'}`}
                className={itemClass}
                aria-current={active ? 'true' : 'false'}
              >
                <div className="font-semibold mb-0.5 truncate">{proj.name || id}</div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default React.memo(ProjectList);
