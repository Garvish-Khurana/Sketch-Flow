import React, { useState, useEffect } from 'react';

export default function SettingsPanel({
  isDark,
  onToggleTheme,
  autosaveDelay,
  onChangeAutosaveDelay,
  onClose,
}) {
  const [delay, setDelay] = useState(autosaveDelay || 2000);

  useEffect(() => {
    setDelay(autosaveDelay || 2000);
  }, [autosaveDelay]);

  const applyDelay = () => {
    const v = Math.max(500, Math.min(20000, Number(delay) || 2000));
    onChangeAutosaveDelay?.(v);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Settings</h3>
        <button className="text-sm px-2 py-1 rounded border" onClick={onClose}>Close</button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Theme</div>
          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-md border bg-white hover:bg-neutral-50"
            aria-label="Toggle theme"
          >
            Switch to {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        <div>
          <div className="text-sm font-medium mb-1">Autosave Interval</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={500}
              max={20000}
              step={100}
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="w-28 h-9 rounded-md border px-2"
              aria-label="Autosave interval (ms)"
            />
            <button
              type="button"
              onClick={applyDelay}
              className="h-9 px-3 rounded-md border bg-white hover:bg-neutral-50"
            >
              Apply
            </button>
          </div>
          <div className="text-xs text-neutral-600 mt-1">Range: 500ms — 20,000ms</div>
        </div>
      </div>
    </div>
  );
}
