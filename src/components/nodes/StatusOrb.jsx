import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

//emoji 
const EMOJI_PRESETS = ['💻','🧪','🔧','🐞','🧭','⚙️','🔬','📦','🚀','📝'];

export default function StatusOrb({ id, data }) {
  const patch = (p) => data.onChange?.(id, p);
  const onDelete = () => data.onDelete?.(id);
  const label = data.label ?? 'Implement Feature';
  const emoji = data.emoji ?? '💻';
  const sub = data.sub ?? 'Module: auth | Issue: #1234';

  // Style inputs
  const color = data.color ?? '#f1f5f9';
  const textColor = data.textColor ?? '#0f172a';
  const imageUrl = data.imageUrl ?? '';
  const imageFit = data.imageFit ?? 'cover';
  const scrim = data.scrim ?? 0.10;

  // Progress and status
  const progress = Math.max(0, Math.min(100, data.progress ?? 0));
  const status = data.status ?? 'idle';
  const statusColor =
    status === 'success' ? '#22c55e' : // green
    status === 'warning' ? '#f59e0b' : // amber
    status === 'error'   ? '#ef4444' : // red
    '#94a3b8';                         // slate-400 for idle

  // Progress ring visuals
  const ringBg = '#e5e7eb';     // track gray-200
  const ringFg = '#0ea5e9';     // progress sky-500
  const ringThickness = 8;      // px
  const circleSize = 150;       // outer box size
  const innerInset = ringThickness; // inset inner content to reveal ring

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    if (menuOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  const bg = useMemo(() => {
    const useImage = Boolean(imageUrl);
    const backgroundColor = useImage ? 'transparent' : color;
    const backgroundImage = useImage
      ? `linear-gradient(rgba(0,0,0,${scrim}), rgba(0,0,0,${scrim})), url('${imageUrl}')`
      : 'none';
    const backgroundRepeat = useImage ? 'no-repeat, no-repeat' : 'no-repeat';
    const backgroundPosition = useImage ? 'center, center' : '0 0';
    const backgroundSize = useImage ? `${imageFit}, ${imageFit}` : 'auto';
    return { backgroundColor, backgroundImage, backgroundRepeat, backgroundPosition, backgroundSize };
  }, [imageUrl, color, scrim, imageFit]);
  
  return (
    <div className="relative">
      {/* Pencil trigger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        title="Edit status orb"
        className="absolute -top-3 -right-3 rounded-full border jiggle-hover"
        style={{
          width: 28, height: 28, background: 'yellow',
          border: '2px solid rgba(0,0,0,0.35)', boxShadow: '2px 3px 0 rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(43,43,43,0.85)', cursor: 'pointer',
        }}
        aria-label="Edit status orb"
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
            minWidth: 240,
            borderRadius: 10,
            border: '2px dashed rgba(0,0,0,0.6)',
            boxShadow: '4px 5px 0 rgba(0,0,0,0.25)',
            fontFamily: "'Comic Neue','Patrick Hand',cursive",
          }}
        >
          {/* Emoji presets */}
          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 block mb-1">Emoji</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {EMOJI_PRESETS.map((e, i) => (
                <button
                  key={`${e}-${i}`}
                  onClick={() => patch({ emoji: e })}
                  aria-label={`Set emoji ${e}`}
                  className="jiggle-hover"
                  style={{
                    width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                    border: emoji === e ? '2px solid #111' : '1px solid rgba(0,0,0,0.2)',
                    background: emoji === e ? '#ffe082' : '#fff',
                    boxShadow: emoji === e ? '2px 3px 0 rgba(0,0,0,0.25)' : 'none',
                  }}
                  title={`Set ${e}`}
                >
                  {e}
                </button>
              ))}
              <input
                className="text-xs border rounded px-2 py-1 bg-white"
                placeholder="Custom"
                defaultValue={emoji}
                onBlur={(ev) => patch({ emoji: ev.target.value })}
                aria-label="Custom emoji"
                style={{ width: 84 }}
              />
            </div>
          </div>

          {/* Title/Subtext */}
          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 mr-2">Title</label>
            <input
              className="text-xs border rounded px-2 py-1 bg-white w-full"
              value={label}
              onChange={(e) => patch({ label: e.target.value })}
              placeholder="Implement Feature"
            />
          </div>
          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 mr-2">Subtext</label>
            <input
              className="text-xs border rounded px-2 py-1 bg-white w-full"
              value={sub}
              onChange={(e) => patch({ sub: e.target.value })}
              placeholder="Module: auth | Issue: #1234"
            />
          </div>

          {/* Colors */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-600">Fill</span>
              <input type="color" value={color} onChange={(e) => patch({ color: e.target.value })} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-600">Text</span>
              <input type="color" value={textColor} onChange={(e) => patch({ textColor: e.target.value })} />
            </div>
          </div>

          {/* Optional circular texture */}
          <div className="mb-2">
            <label className="text-[11px] text-neutral-600 mr-2">Image URL</label>
            <input
              className="text-xs border rounded px-2 py-1 bg-white w-full"
              value={imageUrl}
              onChange={(e) => patch({ imageUrl: e.target.value })}
              placeholder="/blueprint.jpg"
            />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-600">Fit</span>
              <select
                className="text-xs border rounded px-1 py-1 bg-white"
                value={imageFit}
                onChange={(e) => patch({ imageFit: e.target.value })}
              >
                <option value="cover">cover</option>
                <option value="contain">contain</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-neutral-600">Scrim</span>
              <input
                type="range" min={0} max={0.5} step={0.02}
                value={scrim}
                onChange={(e) => patch({ scrim: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onDelete}
              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              title="Delete status orb"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      {/* Only top/bottom handles, centered; slightly larger hit area */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: '50%', transform: 'translateX(-50%)', width: 12, height: 12 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: '50%', transform: 'translateX(-50%)', width: 12, height: 12 }}
      />

      {/* Progress ring + circular content + status badge */}
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        {/* Progress ring using conic-gradient (donut) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            backgroundImage: `conic-gradient(${ringFg} ${progress}%, ${ringBg} 0)`,
            WebkitMask: `radial-gradient(circle at center, transparent calc(${circleSize/2}px - ${ringThickness}px), black calc(${circleSize/2}px - ${ringThickness}px))`,
            mask: `radial-gradient(circle at center, transparent calc(${circleSize/2}px - ${ringThickness}px), black calc(${circleSize/2}px - ${ringThickness}px))`,
            transition: 'background-image 200ms ease-out',
          }}
          title={`Progress: ${progress}%`}
        />

        {/* Inner circular body */}
        <div
          className="shadow border flex flex-col items-center justify-center"
          style={{
            ...bg,
            color: textColor,
            position: 'absolute',
            top: innerInset,
            left: innerInset,
            right: innerInset,
            bottom: innerInset,
            borderRadius: '9999px',
            border: '2px dashed rgba(0,0,0,0.2)',
            boxShadow: '5px 7px 0 rgba(0,0,0,0.25)',
            padding: 10,
            textAlign: 'center',
          }}
        >
          <div className="text-xl" style={{ lineHeight: 1, marginBottom: 6 }}>
            {emoji}
          </div>
          <input
            value={label}
            onChange={(e) => patch({ label: e.target.value })}
            className="bg-transparent outline-none font-semibold text-sm text-center w-[110px]"
            placeholder="Implement Feature"
            style={{ color: textColor }}
          />
          <input
            value={sub}
            onChange={(e) => patch({ sub: e.target.value })}
            className="bg-transparent outline-none text-[11px] opacity-80 text-center w-[120px] mt-1"
            placeholder="Module: auth | Issue: #1234"
            style={{ color: textColor }}
          />
        </div>

        {/* Status badge */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            width: 14,
            height: 14,
            borderRadius: '9999px',
            background: statusColor,
            boxShadow: '0 0 0 2px #ffffff, 0 1px 0 rgba(0,0,0,0.25)',
          }}
          title={`Status: ${status}`}
        />
      </div>
    </div>
  );
}
