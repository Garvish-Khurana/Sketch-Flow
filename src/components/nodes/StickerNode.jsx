import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const VARIANTS = {
  start:     { bg: '#ef4444', text: '#ffffff', label: 'Start 🚩', placeholder: 'START!' },     // red
  goal:      { bg: '#0ea5e9', text: '#ffffff', label: 'Goal 🎯', placeholder: 'GOAL' },        // blue
  warn:      { bg: '#f59e0b', text: '#111827', label: 'Warning ⚠️', placeholder: 'Warning' },  // amber
  info:      { bg: '#22c55e', text: '#0b1324', label: 'Info ℹ️', placeholder: 'Info' },        // green/blue
  tip:       { bg: '#10b981', text: '#0b1324', label: 'Tip 💡', placeholder: 'Tip' },          // tip
  note:      { bg: '#fde68a', text: '#1f2937', label: 'Note 🗒️', placeholder: 'Note' },       // sticky note 
  bug:       { bg: '#dc2626', text: '#ffffff', label: 'Bug 🐞', placeholder: 'Bug #123' },     // defect
  milestone: { bg: '#8b5cf6', text: '#ffffff', label: 'Milestone 🏁', placeholder: 'Sprint 3' }, // phase marker
  deadline:  { bg: '#f43f5e', text: '#ffffff', label: 'Deadline ⏰', placeholder: 'Due: 12 Sep' }, // time-bound 
  decision:  { bg: '#6b7280', text: '#ffffff', label: 'Decision ⚖️', placeholder: 'Pending' }, // decision marker
  checkpoint:{ bg: '#14b8a6', text: '#0b1324', label: 'Checkpoint 📌', placeholder: 'Ready for QA' }, // gate
};

export default function StickerNode({ id, data }) {
  const patch = (p) => data.onChange?.(id, p);
  const onDelete = () => data.onDelete?.(id);

  const variant = data.variant ?? 'start';
  const conf = VARIANTS[variant] ?? VARIANTS.start;
  const text = data.text ?? conf.placeholder;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);


  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  return (
    <div className="relative">
      {/* Pencil menu trigger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        title="Edit sticker"
        className="absolute -top-3 -right-3 rounded-full border jiggle-hover"
        style={{
          width: 28, height: 28, background: 'yellow',
          border: '2px solid rgba(0,0,0,0.35)',
          boxShadow: '2px 3px 0 rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(43,43,43,0.85)', cursor: 'pointer',
          zIndex: 1,
        }}
      >
        <FaPencilAlt />
      </button>

      {/* Minimal floating menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="peel-in"
          style={{
            position: 'absolute',
            top: '-140%',
            left: '100%',
            marginLeft: 10,
            zIndex: 30,
            background: '#fff',
            padding: 10,
            minWidth: 220,
            borderRadius: 10,
            border: '2px dashed rgba(0,0,0,0.6)',
            boxShadow: '4px 5px 0 rgba(0,0,0,0.25)',
            fontFamily: "'Comic Neue','Patrick Hand',cursive",
          }}
        >
          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 mr-2">Variant</label>
            <select
              value={variant}
              onChange={(e) => patch({ variant: e.target.value })}
              className="text-xs border rounded px-1 py-1 bg-white"
            >
              {Object.entries(VARIANTS).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 mr-2">Text</label>
            <input
              className="text-xs border rounded px-2 py-1 bg-white w-full"
              value={text}
              onChange={(e) => patch({ text: e.target.value })}
              placeholder={conf.placeholder}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={onDelete}
              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              title="Delete sticker"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      {/* Only top/bottom handles for consistency */}
      <Handle type="target" position={Position.Top} style={{ left: '50%', transform: 'translateX(-50%)' }} />
      <Handle type="source" position={Position.Bottom} style={{ left: '50%', transform: 'translateX(-50%)' }} />

      {/* Sticker body */}
      <div
        className="inline-flex items-center justify-center rounded-xl px-3 py-2 shadow"
        style={{
          backgroundColor: conf.bg,
          color: conf.text,
          transform: 'rotate(-2deg)',
          border: '2px dashed rgba(0,0,0,0.2)',
          boxShadow: '4px 6px 0 rgba(0,0,0,0.2)',
        }}
      >
        <span style={{ marginRight: 6, fontSize: 14 }}>
          {conf.label.split(' ').slice(-1)[0]} {/* show only emoji for compactness */}
        </span>
        <input
          className="bg-transparent outline-none text-sm font-bold text-center w-[130px]"
          value={text}
          onChange={(e) => patch({ text: e.target.value })}
          onFocus={() => setMenuOpen(true)}
          aria-label="Sticker text"
          style={{ color: conf.text }}
        />
      </div>
    </div>
  );
}
