import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const noop = () => {};
const cx = (...parts) => parts.filter(Boolean).join(' ');

function useClickOutside(ref, onClose = noop) {
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

function useEscToClose(active, onClose = noop) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

function MenuButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={cx(
        'h-9 inline-flex items-center justify-between rounded-md px-3 text-sm font-medium shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default React.memo(function QuickActions({
  // theme
  isDark = false,
  onAddTask,
  onAddBanner,
  onSave,
  canSave = true,
  saving = false,
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

  // utilities
  onToggleInspector,
  onExport,
  onOpenTemplates,
  onOpenImportExport,
  onOpenShortcuts,
  onOpenSettings,

  // shapes
  onAddRectangle,
  onAddCircle,
  onAddDiamond,
  onAddHexagon,
  onAddTag,
}) {
  const [shapeOpen, setShapeOpen] = useState(false);
  const shapeRef = useRef(null);
  useClickOutside(shapeRef, () => setShapeOpen(false));
  useEscToClose(shapeOpen, () => setShapeOpen(false));

  const [stickerOpen, setStickerOpen] = useState(false);
  const stickerRef = useRef(null);
  useClickOutside(stickerRef, () => setStickerOpen(false));
  useEscToClose(stickerOpen, () => setStickerOpen(false));

  const handleAddTask = useCallback(() => onAddTask?.(), [onAddTask]);
  const handleAddBanner = useCallback(() => onAddBanner?.(), [onAddBanner]);
  const handleSave = useCallback(() => onSave?.(), [onSave]);

  const handleAddRectangle = useCallback(() => onAddRectangle?.(), [onAddRectangle]);
  const handleAddCircle = useCallback(() => onAddCircle?.(), [onAddCircle]);
  const handleAddDiamond = useCallback(() => onAddDiamond?.(), [onAddDiamond]);
  const handleAddHexagon = useCallback(() => onAddHexagon?.(), [onAddHexagon]);
  const handleAddTag = useCallback(() => onAddTag?.(), [onAddTag]);
  const addDefaultShape = handleAddRectangle;

  const handleAddStartSticker = useCallback(() => onAddStartSticker?.(), [onAddStartSticker]);
  const handleAddGoalSticker = useCallback(() => onAddGoalSticker?.(), [onAddGoalSticker]);
  const handleAddWarnSticker = useCallback(() => onAddWarnSticker?.(), [onAddWarnSticker]);
  const handleAddInfoSticker = useCallback(() => onAddInfoSticker?.(), [onAddInfoSticker]);
  const handleAddTipSticker = useCallback(() => onAddTipSticker?.(), [onAddTipSticker]);
  const handleAddNoteSticker = useCallback(() => onAddNoteSticker?.(), [onAddNoteSticker]);
  const handleAddBugSticker = useCallback(() => onAddBugSticker?.(), [onAddBugSticker]);
  const handleAddMilestoneSticker = useCallback(() => onAddMilestoneSticker?.(), [onAddMilestoneSticker]);
  const handleAddDeadlineSticker = useCallback(() => onAddDeadlineSticker?.(), [onAddDeadlineSticker]);
  const handleAddDecisionSticker = useCallback(() => onAddDecisionSticker?.(), [onAddDecisionSticker]);
  const handleAddCheckpointSticker = useCallback(() => onAddCheckpointSticker?.(), [onAddCheckpointSticker]);
  const addDefaultSticker = handleAddStartSticker;

  const handleAddMilestone = useCallback(() => onAddMilestone?.('Sulfuric Acid', '⚗️'), [onAddMilestone]);
  const handleAddStatusOrb = useCallback(() => onAddStatusOrb?.('Implement Feature', '💻'), [onAddStatusOrb]);

  const saveDisabled = !canSave || saving || !onSave;

  const hasShapeActions = useMemo(
    () => Boolean(onAddRectangle || onAddCircle || onAddDiamond || onAddHexagon || onAddTag),
    [onAddRectangle, onAddCircle, onAddDiamond, onAddHexagon, onAddTag]
  );
  const hasStickerActions = useMemo(
    () => Boolean(
      onAddStartSticker || onAddGoalSticker || onAddWarnSticker || onAddInfoSticker ||
      onAddTipSticker || onAddNoteSticker || onAddBugSticker ||
      onAddMilestoneSticker || onAddDeadlineSticker || onAddDecisionSticker || onAddCheckpointSticker
    ),
    [
      onAddStartSticker, onAddGoalSticker, onAddWarnSticker, onAddInfoSticker,
      onAddTipSticker, onAddNoteSticker, onAddBugSticker,
      onAddMilestoneSticker, onAddDeadlineSticker, onAddDecisionSticker, onAddCheckpointSticker
    ]
  );

  const menuContainerClass = cx(
    'absolute z-50 mt-1 w-full rounded-lg border shadow-lg overflow-hidden',
    isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-100' : 'bg-white border-neutral-300 text-neutral-900'
  );
  const menuItemHover = isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-50';

  return (
    <div className="space-y-3">
      {/* Create */}
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 px-1">Create</div>

      <div className="grid gap-2">
        {/* Add Task (amber) */}
        <MenuButton
          onClick={handleAddTask}
          disabled={!onAddTask}
          title="Add a new task node"
          aria-label="Add Task"
          className={cx(
            'w-full bg-amber-300 hover:bg-amber-400 text-black focus:outline-none focus:ring-2 ring-offset-2 ring-amber-400/60',
            !onAddTask && 'opacity-60 cursor-not-allowed'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-base">➕</span>
            Add Task
          </span>
          <span className="text-[11px] font-mono text-neutral-700/80">T</span>
        </MenuButton>

        {/* Add Shape */}
        {hasShapeActions && (
          <div className="relative" ref={shapeRef}>
            <div className="flex gap-2">
              <MenuButton
                onClick={addDefaultShape}
                disabled={!onAddRectangle}
                aria-label="Add Shape"
                title="Add Shape"
                className={cx(
                  'flex-1 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300',
                  !onAddRectangle && 'opacity-60 cursor-not-allowed'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="text-base">▭</span>
                  Add Shape
                </span>
                <span className="text-[11px] font-mono text-neutral-500">S</span>
              </MenuButton>

              <button
                type="button"
                onClick={() => setShapeOpen((v) => !v)}
                className={cx(
                  'h-9 w-9 inline-flex items-center justify-center rounded-md border shadow-sm',
                  isDark ? 'bg-neutral-900 text-neutral-100 border-neutral-700 hover:bg-neutral-800'
                         : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50'
                )}
                aria-haspopup="menu"
                aria-expanded={shapeOpen}
                aria-label="Choose shape"
                title="Choose shape"
                aria-controls="qa-shape-menu"
              >
                ▾
              </button>
            </div>

            {shapeOpen && (
              <div id="qa-shape-menu" role="menu" className={menuContainerClass}>
                {onAddRectangle && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddRectangle(); setShapeOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)}>
                    Rectangle ▭
                  </button>
                )}
                {onAddCircle && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddCircle(); setShapeOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)}>
                    Circle ◯
                  </button>
                )}
                {onAddDiamond && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddDiamond(); setShapeOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)}>
                    Decision ◇
                  </button>
                )}
                {onAddHexagon && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddHexagon(); setShapeOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)}>
                    Hexagon ⬣
                  </button>
                )}
                {onAddTag && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddTag(); setShapeOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)}>
                    Tag ▰
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Banner (yellow) */}
        <MenuButton
          onClick={handleAddBanner}
          disabled={!onAddBanner}
          title="Add a phase banner"
          aria-label="Add Phase Banner"
          className={cx(
            'w-full bg-yellow-200 hover:bg-yellow-300 text-black focus:outline-none focus:ring-2 ring-offset-2 ring-yellow-300/60',
            !onAddBanner && 'opacity-60 cursor-not-allowed'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-base">🏷️</span>
            Add Phase Banner
          </span>
          <span className="text-[11px] font-mono text-neutral-700/80">B</span>
        </MenuButton>

        {/* Milestone (indigo) */}
        {onAddMilestone && (
          <MenuButton
            onClick={handleAddMilestone}
            aria-label="Add Milestone"
            title="Add Milestone"
            className="w-full bg-indigo-200 hover:bg-indigo-300 text-black border border-neutral-300"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">🏅</span>
              Add Milestone
            </span>
          </MenuButton>
        )}

        {/* Status Orb (emerald) */}
        {onAddStatusOrb && (
          <MenuButton
            onClick={handleAddStatusOrb}
            aria-label="Add Status Orb"
            title="Add Status Orb"
            className="w-full bg-emerald-200 hover:bg-emerald-300 text-black border border-neutral-300"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">🟢</span>
              Add Status Orb
            </span>
          </MenuButton>
        )}

        {/* Stickers (sky) */}
        {hasStickerActions && (
          <div className="relative" ref={stickerRef}>
            <div className="flex gap-2">
              <MenuButton
                onClick={addDefaultSticker}
                disabled={!onAddStartSticker}
                aria-label="Add Sticker"
                title="Add Sticker"
                className={cx(
                  'flex-1 bg-sky-200 hover:bg-sky-300 text-black border border-neutral-300',
                  !onAddStartSticker && 'opacity-60 cursor-not-allowed'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="text-base">🏷️</span>
                  Add Sticker
                </span>
                <span className="text-[11px] font-mono text-neutral-700/80">K</span>
              </MenuButton>

              <button
                type="button"
                onClick={() => setStickerOpen((v) => !v)}
                className={cx(
                  'h-9 w-9 inline-flex items-center justify-center rounded-md border shadow-sm',
                  isDark ? 'bg-neutral-900 text-neutral-100 border-neutral-700 hover:bg-neutral-800'
                         : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50'
                )}
                aria-haspopup="menu"
                aria-expanded={stickerOpen}
                aria-label="Choose sticker"
                title="Choose sticker"
                aria-controls="qa-sticker-menu"
              >
                ▾
              </button>
            </div>

            {stickerOpen && (
              <div id="qa-sticker-menu" role="menu" className={menuContainerClass}>
                {onAddStartSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddStartSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add START Sticker">
                    START 🚩
                  </button>
                )}
                {onAddGoalSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddGoalSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add GOAL Sticker">
                    GOAL 🎯
                  </button>
                )}
                {onAddWarnSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddWarnSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add WARNING Sticker">
                    Warning ⚠️
                  </button>
                )}
                {onAddInfoSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddInfoSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add INFO Sticker">
                    Info ℹ️
                  </button>
                )}
                {onAddTipSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddTipSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add TIP Sticker">
                    Tip 💡
                  </button>
                )}
                {onAddNoteSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddNoteSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add NOTE Sticker">
                    Note 🗒️
                  </button>
                )}
                {onAddBugSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddBugSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add BUG Sticker">
                    Bug 🐞
                  </button>
                )}
                {onAddMilestoneSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddMilestoneSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add MILESTONE Sticker">
                    Milestone 🏁
                  </button>
                )}
                {onAddDeadlineSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddDeadlineSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add DEADLINE Sticker">
                    Deadline ⏰
                  </button>
                )}
                {onAddDecisionSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddDecisionSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add DECISION Sticker">
                    Decision ⚖️
                  </button>
                )}
                {onAddCheckpointSticker && (
                  <button role="menuitem" type="button"
                    onClick={() => { handleAddCheckpointSticker(); setStickerOpen(false); }}
                    className={cx('w-full text-left px-3 py-2', menuItemHover)} title="Add CHECKPOINT Sticker">
                    Checkpoint 📌
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project */}
      <div className="text-[11px] uppercase tracking-wide text-neutral-500 px-1">Project</div>

      <div className="grid gap-2">
        {/* Save */}
        <MenuButton
          onClick={handleSave}
          disabled={saveDisabled}
          title="Save Now (Ctrl/Cmd+S)"
          aria-label="Save Now"
          className={cx(
            'w-full focus:outline-none focus:ring-2 ring-offset-2',
            saveDisabled
              ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white ring-green-500/50'
          )}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-base">💾</span>
            {saving ? 'Saving…' : 'Save Now'}
          </span>
          <span className="text-[11px] font-mono opacity-80">⌘S</span>
        </MenuButton>

        {/* Export */}
        {typeof onExport === 'function' && (
          <MenuButton
            onClick={onExport}
            title="Export project JSON"
            aria-label="Export JSON"
            className={cx(
              'w-full border focus:outline-none focus:ring-2 ring-offset-2',
              isDark ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border-neutral-700 ring-neutral-700/50'
                     : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300 ring-neutral-300/50'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">⭳</span>
              Export JSON
            </span>
            <span className="text-[11px] font-mono text-neutral-500">E</span>
          </MenuButton>
        )}

        {/* Import */}
        {typeof onOpenImportExport === 'function' && (
          <MenuButton
            onClick={onOpenImportExport}
            title="Import a JSON file"
            aria-label="Import"
            className={cx(
              'w-full border focus:outline-none focus:ring-2 ring-offset-2',
              isDark ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border-neutral-700 ring-neutral-700/50'
                     : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300 ring-neutral-300/50'
            )}
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">⇪</span>
              Import JSON
            </span>
            <span className="text-[11px] font-mono text-neutral-500">I</span>
          </MenuButton>
        )}

        {/* Settings */}
        {typeof onOpenSettings === 'function' && (
          <MenuButton
            onClick={onOpenSettings}
            title="Open settings"
            aria-label="Settings"
            className="w-full bg-purple-200 hover:bg-purple-300 text-black border border-neutral-300"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">⚙️</span>
              Settings
            </span>
            <span className="text-[11px] font-mono text-neutral-700/80">,</span>
          </MenuButton>
        )}

        {/* Templates */}
        {typeof onOpenTemplates === 'function' && (
          <MenuButton
            onClick={onOpenTemplates}
            title="Browse templates"
            aria-label="Templates"
            className="w-full bg-rose-200 hover:bg-rose-300 text-black border border-neutral-300"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">📚</span>
              Templates
            </span>
            <span className="text-[11px] font-mono text-neutral-700/80">G</span>
          </MenuButton>
        )}

        {/* Shortcuts */}
        {typeof onOpenShortcuts === 'function' && (
          <MenuButton
            onClick={onOpenShortcuts}
            title="Keyboard shortcuts"
            aria-label="Keyboard Shortcuts"
            className="w-full bg-cyan-200 hover:bg-cyan-300 text-black border border-neutral-300"
          >
            <span className="inline-flex items-center gap-2">
              <span className="text-base">⌨️</span>
              Keyboard Shortcuts
            </span>
            <span className="text-[11px] font-mono text-neutral-700/80">?</span>
          </MenuButton>
        )}
      </div>

      <div className="text-[11px] leading-snug text-neutral-500 px-1">
        Auto-saves every 2s. Manual save available.
      </div>
    </div>
  );
});
