import React, { useEffect, useRef, useState } from 'react';

export default function SaveAsModal({
  open,
  onClose,
  onSubmit,
  initialName = 'My Roadmap',
  busy = false,
  error = '',
}) {
  const [name, setName] = useState(initialName);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || busy) return;
    onSubmit?.(name.trim());
  };

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saveas-title"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !busy && onClose?.()}
        aria-hidden="true"
      />
      {/* dialog */}
      <form
        onSubmit={handleSubmit}
        className="relative w-[92%] max-w-md rounded-xl border-2 border-stone-800 bg-white shadow-[8px_8px_0_#444] p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="saveas-title" className="text-xl font-bold text-stone-900">
            Save As
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-2 py-1 rounded border border-stone-300 hover:bg-stone-100 disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-3">
          <label htmlFor="project-name" className="block text-sm font-medium text-stone-700">
            Project name
          </label>
          <input
            ref={inputRef}
            id="project-name"
            type="text"
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2 outline-none focus:ring-2 ring-offset-2 ring-stone-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Roadmap"
            disabled={busy}
          />
        </div>

        {error ? (
          <div className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-3 py-2 rounded border border-stone-300 hover:bg-stone-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || busy}
            className={[
              'px-4 py-2 rounded font-semibold text-white',
              busy ? 'bg-stone-400' : 'bg-stone-900 hover:bg-black',
            ].join(' ')}
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
