import React, { useMemo, useCallback } from 'react';
import ProjectList from './ProjectList';
import QuickActions from './QuickActions';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const NOOP = () => {};
const EMOJI_PRESETS = ['💻','🧪','🔧','🐞','🧭','⚙️','🔬','📦','🚀','📝'];

function SidebarLeft({
  open,
  onClose,
  onToggle,

  // projects
  projects,
  loading,
  currentProjectId,
  onSelectProject,
  projectFilter,
  onChangeProjectFilter,

  // core actions
  onAddTask,
  onAddBanner,
  onSave,
  onAddMilestone,
  onAddStatusOrb,

  // stickers
  onAddStartSticker,
  onAddGoalSticker,
  onAddWarnSticker,
  onAddInfoSticker,
  onAddTipSticker,
  onAddNoteSticker,
  onAddBugSticker,
  onAddMilestoneSticker,
  onAddDeadlineSticker,
  onAddDecisionSticker,
  onAddCheckpointSticker,

  onDeleteSelectedEdges,
  hasSelectedEdges,
  showSaveAs = false,
  onSaveAs,

  // theme
  isDark,
  onToggleTheme,

  // shapes
  onAddRectangle,
  onAddCircle,
  onAddDiamond,
  onAddHexagon,
  onAddTag,

  // selection context
  selectedNodes,
  onBatchUpdateSelected,

  // More actions
  onExport,
  onOpenTemplates,
  onOpenImportExport,
  onOpenShortcuts,
  onOpenSettings,
}) {
  const _onClose = onClose || NOOP;
  const _onToggle = onToggle || NOOP;
  const _onSave = onSave || NOOP;
  const _onSaveAs = onSaveAs || NOOP;
  const _onDeleteSelectedEdges = onDeleteSelectedEdges || NOOP;
  const _onToggleTheme = onToggleTheme || NOOP;
  const _onSelectProject = onSelectProject || NOOP;
  const _onChangeProjectFilter = onChangeProjectFilter || NOOP;
  const _onAddTask = onAddTask || NOOP;
  const _onAddBanner = onAddBanner || NOOP;
  const _onAddRectangle = onAddRectangle || NOOP;
  const _onAddCircle = onAddCircle || NOOP;
  const _onAddDiamond = onAddDiamond || NOOP;
  const _onAddHexagon = onAddHexagon || NOOP;
  const _onAddTag = onAddTag || NOOP;
  const _onAddStatusOrb = onAddStatusOrb || NOOP;

  const _onBatchUpdateSelected = useMemo(
    () => onBatchUpdateSelected || NOOP,
    [onBatchUpdateSelected]
  );

  const handleAddMilestone = useCallback(() => {
    if (onAddMilestone) onAddMilestone('Sulfuric Acid', '⚗️');
  }, [onAddMilestone]);

  const handleAddStatusOrb = useCallback(() => {
    _onAddStatusOrb('Implement Feature', '💻');
  }, [_onAddStatusOrb]);

  // Sticker creators
  const handleAddStartSticker = useCallback(() => { onAddStartSticker?.('START!', 'start'); }, [onAddStartSticker]);
  const handleAddGoalSticker = useCallback(() => { onAddGoalSticker?.('GOAL', 'goal'); }, [onAddGoalSticker]);
  const handleAddWarnSticker = useCallback(() => { onAddWarnSticker?.('Warning', 'warn'); }, [onAddWarnSticker]);
  const handleAddInfoSticker = useCallback(() => { onAddInfoSticker?.('Info', 'info'); }, [onAddInfoSticker]);
  const handleAddTipSticker = useCallback(() => { onAddTipSticker?.('Tip', 'tip'); }, [onAddTipSticker]);
  const handleAddNoteSticker = useCallback(() => { onAddNoteSticker?.('Note', 'note'); }, [onAddNoteSticker]);
  const handleAddBugSticker = useCallback(() => { onAddBugSticker?.('Bug', 'bug'); }, [onAddBugSticker]);
  const handleAddMilestoneSticker2 = useCallback(() => { onAddMilestoneSticker?.('Milestone', 'milestone'); }, [onAddMilestoneSticker]);
  const handleAddDeadlineSticker = useCallback(() => { onAddDeadlineSticker?.('Deadline', 'deadline'); }, [onAddDeadlineSticker]);
  const handleAddDecisionSticker = useCallback(() => { onAddDecisionSticker?.('Decision', 'decision'); }, [onAddDecisionSticker]);
  const handleAddCheckpointSticker = useCallback(() => { onAddCheckpointSticker?.('Checkpoint', 'checkpoint'); }, [onAddCheckpointSticker]);

  // NEW: “10 BILLION %” sticker creator (variant: 'tenb')
  const handleAddTenBillionSticker = useCallback(() => {
    onAddMilestoneSticker?.('10 BILLION %', 'tenb');
  }, [onAddMilestoneSticker]);

  const toggleTitle = useMemo(() => (open ? 'Hide menu' : 'Show menu'), [open]);
  const toggleLabel = useMemo(() => (open ? '← Hide' : '☰ Menu'), [open]);

  const sidebarClass = cx(
    'absolute top-0 left-0 h-full w-[280px] z-40 flex flex-col overflow-hidden',
    'transition-transform duration-200 ease-in-out',
    open ? 'translate-x-0' : '-translate-x-full',
    'border-r shadow-lg',
    isDark ? 'bg-neutral-900/95 border-neutral-700 text-neutral-100'
           : 'bg-[#f6f0e2]/95 border-neutral-700/20 text-neutral-900'
  );

  const headerBorder = isDark ? 'border-neutral-800' : 'border-neutral-700/10';
  const toggleBtnClass = cx(
    'absolute top-3 left-3 z-50 px-3 py-2 rounded-xl',
    'backdrop-blur-sm border shadow',
    isDark ? 'bg-neutral-800/90 border-neutral-700 text-neutral-100'
           : 'bg-[#f6f0e2]/90 border-neutral-700/20 text-neutral-900'
  );

  const themeBtnClass = cx(
    'px-2.5 py-1.5 rounded-lg border text-sm',
    isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700'
           : 'bg-white/90 border-neutral-300 text-neutral-800 hover:bg-neutral-100'
  );

  const closeBtnClass = cx(
    'px-2.5 py-1.5 rounded-lg border',
    isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100'
           : 'bg-white/85 border-neutral-300 text-neutral-800'
  );

  const delBtnClass = hasSelectedEdges
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-neutral-300 text-neutral-600 cursor-not-allowed';

  const selected = Array.isArray(selectedNodes) ? selectedNodes.filter(n => n?.selected) : [];
  const first = selected;
  const allAreStatusOrbs = selected.length > 0 && selected.every(n => n.type === 'statusOrb');
  const firstProgress = first?.data?.progress ?? 0;
  const firstStatus = first?.data?.status ?? 'idle';
  const firstEmoji = first?.data?.emoji ?? '💻';

  const updateProgress = useCallback((value) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    _onBatchUpdateSelected((node) =>
      node.type === 'statusOrb' ? { data: { ...node.data, progress: v } } : null
    );
  }, [_onBatchUpdateSelected]);

  const bumpProgress = useCallback((delta) => {
    _onBatchUpdateSelected((node) => {
      if (node.type !== 'statusOrb') return null;
      const v = Math.max(0, Math.min(100, (node.data?.progress ?? 0) + delta));
      return { data: { ...node.data, progress: v } };
    });
  }, [_onBatchUpdateSelected]);

  const setStatus = useCallback((status) => {
    _onBatchUpdateSelected((node) =>
      node.type === 'statusOrb' ? { data: { ...node.data, status } } : null
    );
  }, [_onBatchUpdateSelected]);

  const setEmoji = useCallback((e) => {
    _onBatchUpdateSelected((node) =>
      node.type === 'statusOrb' ? { data: { ...node.data, emoji: e } } : null
    );
  }, [_onBatchUpdateSelected]);

  return (
    <>
      <button
        type="button"
        onClick={_onToggle}
        title={toggleTitle}
        className={toggleBtnClass}
        aria-expanded={open}
        aria-controls="left-sidebar"
      >
        {toggleLabel}
      </button>

      <aside id="left-sidebar" className={sidebarClass} aria-label="Editor menu">
        <div className={cx('flex items-center justify-between px-3 py-3 border-b', headerBorder)}>
          <div className="font-bold">Menu</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={_onToggleTheme}
              className={themeBtnClass}
              aria-label="Toggle dark mode (panels only)"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? '☀︎ Light' : '🌙 Dark'}
            </button>

            <button
              type="button"
              onClick={_onClose}
              className={closeBtnClass}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-2 pb-3">
          <div className="px-3 py-2 font-semibold text-sm opacity-90">Load Saved Project</div>
          <ProjectList
            projects={projects}
            loading={loading}
            currentProjectId={currentProjectId}
            onSelect={_onSelectProject}
            filter={projectFilter}
            onFilterChange={_onChangeProjectFilter}
            isDark={isDark}
          />

          <div className="h-4" />

          <div className="px-3 py-2 font-semibold text-sm opacity-90">Quick Actions</div>
          <QuickActions
            onAddTask={_onAddTask}
            onAddBanner={_onAddBanner}
            onSave={_onSave}
            canSave={!!currentProjectId}
            onAddMilestone={onAddMilestone ? handleAddMilestone : undefined}
            onAddStatusOrb={handleAddStatusOrb}
            // Stickers
            onAddStartSticker={handleAddStartSticker}
            onAddGoalSticker={handleAddGoalSticker}
            onAddWarnSticker={handleAddWarnSticker}
            onAddInfoSticker={handleAddInfoSticker}
            onAddTipSticker={handleAddTipSticker}
            onAddNoteSticker={handleAddNoteSticker}
            onAddBugSticker={handleAddBugSticker}
            onAddMilestoneSticker={handleAddMilestoneSticker2}
            onAddDeadlineSticker={handleAddDeadlineSticker}
            onAddDecisionSticker={handleAddDecisionSticker}
            onAddCheckpointSticker={handleAddCheckpointSticker}
            onAddTenBillionSticker={handleAddTenBillionSticker} // NEW
            // Shapes
            onAddRectangle={_onAddRectangle}
            onAddCircle={_onAddCircle}
            onAddDiamond={_onAddDiamond}
            onAddHexagon={_onAddHexagon}
            onAddTag={_onAddTag}
            // Theme
            isDark={isDark}
            // More actions
            onExport={onExport}
            onOpenTemplates={onOpenTemplates}
            onOpenImportExport={onOpenImportExport}
            onOpenShortcuts={onOpenShortcuts}
            onOpenSettings={onOpenSettings}
          />

          {allAreStatusOrbs && (
            <>
              <div className="h-4" />
              <div className="px-3 py-2 font-semibold text-sm opacity-90">Selected: Status Orb</div>

              <div className="px-3 py-2">
                <div className="text-[12px] opacity-80 mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={firstProgress}
                    onChange={(e) => updateProgress(e.target.value)}
                    className="w-[160px]"
                    aria-label="Progress"
                  />
                  <div className="font-mono text-xs w-10 text-right">{firstProgress}%</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => bumpProgress(-5)}>-5</button>
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => bumpProgress(+5)}>+5</button>
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => bumpProgress(+10)}>+10</button>
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => updateProgress(0)}>0%</button>
                  <button className="text-xs px-2 py-1 rounded border" onClick={() => updateProgress(100)}>100%</button>
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[12px] opacity-80 mb-1">Status</div>
                <div className="flex gap-2">
                  {['idle','success','warning','error'].map(s => (
                    <button
                      key={s}
                      className={cx(
                        'text-xs px-2 py-1 rounded border',
                        s === firstStatus ? 'bg-black text-white border-black' : 'bg-white'
                      )}
                      onClick={() => setStatus(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-3 py-2">
                <div className="text-[12px] opacity-80 mb-1">Emoji</div>
                <div className="flex gap-1.5 flex-wrap">
                  {EMOJI_PRESETS.map((e, i) => (
                    <button
                      key={`${e}-${i}`}
                      onClick={() => setEmoji(e)}
                      className="rounded border"
                      style={{
                        width: 28, height: 28,
                        background: e === firstEmoji ? '#ffe082' : '#fff',
                        borderColor: e === firstEmoji ? '#111' : 'rgba(0,0,0,0.2)',
                      }}
                      title={`Set ${e}`}
                      aria-label={`Set emoji ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {showSaveAs && (
            <>
              <div className="h-3" />
              <div className="px-3 py-2 font-semibold text-sm opacity-90">Save</div>
              <button
                type="button
"
                onClick={_onSaveAs}
                className="w-full h-9 inline-flex items-center justify-between rounded-md px-3 text-sm font-medium bg-stone-900 hover:bg-black text-white shadow"
                title="Persist this demo/template as a new project"
                aria-label="Save As new project"
              >
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">💾</span>
                  Save As…
                </span>
                <span className="text-[11px] font-mono opacity-80">Ctrl+S</span>
              </button>
            </>
          )}

          <div className="h-4" />

          <div className="px-3 py-2 font-semibold text-sm opacity-90">Selection</div>
          <button
            type="button"
            onClick={_onDeleteSelectedEdges}
            disabled={!hasSelectedEdges}
            className={cx(
              'w-full h-9 inline-flex items-center justify-between rounded-md px-3 text-sm font-medium shadow-sm',
              delBtnClass
            )}
            title="Delete selected edge(s)"
            aria-label="Delete selected edges"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">🗑️</span>
              {`Delete Selected Edge${hasSelectedEdges ? 's' : ''}`}
            </span>
            <span className="text-[11px] font-mono opacity-80">Del</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default React.memo(SidebarLeft);
