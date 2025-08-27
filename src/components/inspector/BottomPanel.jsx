import React from 'react';

const cx = (...p) => p.filter(Boolean).join(' ');

// Strict hex validator (#rrggbb only)
const isValidHex = (s) => typeof s === 'string' && /^#([0-9a-fA-F]{6})$/.test(s);

const safeToHex = (c, fallback = '#000000') => {
  if (!c || typeof c !== 'string') return fallback;
  const s = c.trim();

  if (s.startsWith('#')) {
    if (/^#[0-9a-fA-F]{3}$/.test(s)) {
      const r = s[1] + s[1];
      const g = s + s;
      const b = s + s;
      return `#${r}${g}${b}`.toLowerCase();
    }
    if (isValidHex(s)) return s.toLowerCase();
    return fallback;
  }

  const m = s.match(
    /rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)/i
  );
  if (m) {
    const clamp255 = (n) => Math.max(0, Math.min(255, Number(n)));
    const r = clamp255(m[1]).toString(16).padStart(2, '0');
    const g = clamp255(m).toString(16).padStart(2, '0');
    const b = clamp255(m).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }
  return fallback;
};

const hexToRgbOrRgba = (hex, alpha) => {
  if (!isValidHex(hex)) return 'rgb(0,0,0)';
  const h = hex.slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (typeof alpha === 'number' && alpha >= 0 && alpha <= 1) {
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgb(${r},${g},${b})`;
};

const getAlphaFromRgba = (c, defaultA = 1) => {
  if (typeof c !== 'string') return defaultA;
  const m = c.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(\d*\.?\d+)\s*\)/i);
  if (m) {
    const a = Number(m[1]);
    if (!Number.isNaN(a)) return Math.max(0, Math.min(1, a));
  }
  return defaultA;
};

export default function BottomPanel({
  open,
  selectedNode,
  onChangeNodeData,
  onDeleteNode,
  onClose,
  isDark,
  sidebarOpen = true,
  sidebarWidth = 280,
}) {
  const canShow = open && !!selectedNode;
  const data = selectedNode?.data || {};

  const fontSize = data.fontSize ?? 14;
  const fontWeight = data.fontWeight ?? 500;
  const italic = !!data.italic;
  const underline = !!data.underline;

  // Colors
  const fillHex = safeToHex(data.color ?? '#f59e0b', '#f59e0b');
  const textHex = safeToHex(data.textColor ?? '#111827', '#111827');

  // Border
  const borderAlpha = getAlphaFromRgba(data.borderColor, 0.15);
  const borderHex = safeToHex(data.borderColor ?? 'rgba(0,0,0,0.15)', '#000000');

  const style = {
    position: 'absolute',
    left: sidebarOpen ? sidebarWidth : 0,
    right: 0,
    bottom: 0,
    height: 44,
  };

  const shell = cx(
    'z-50 border-t backdrop-blur-sm px-2',
    'flex items-center gap-2 overflow-x-auto',
    isDark
      ? 'bg-neutral-900/95 text-neutral-100 border-neutral-800'
      : 'bg-white/95 text-neutral-900 border-neutral-200',
    canShow ? 'translate-y-0' : 'translate-y-full',
    'transition-[transform,left] duration-150 ease-in-out'
  );

  const inputBase = 'h-8 rounded border text-sm focus:outline-none';
  const tone = isDark
    ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-400 focus:ring-neutral-600'
    : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-neutral-300';
  const input = (extra = '') => cx(inputBase, tone, extra);

  const patch = (p) => {
    if (!selectedNode || !selectedNode.id) return;
    onChangeNodeData?.(selectedNode.id, p);
  };

  const setHex = (key) => (e) => {
    const v = e.target.value;
    if (!isValidHex(v)) return;
    patch({ [key]: v.toLowerCase() });
  };

  const fillValue = isValidHex(fillHex) ? fillHex : '#000000';
  const textValue = isValidHex(textHex) ? textHex : '#000000';
  const borderValue = isValidHex(borderHex) ? borderHex : '#000000';

  return (
    <div className={shell} style={style} aria-hidden={!canShow}>
      {/* Font size */}
      <input
        className={input('px-2 w-14')}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min={10}
        max={40}
        value={fontSize}
        onChange={(e) =>
          patch({
            fontSize: Math.max(10, Math.min(40, Number(e.target.value || 14))),
          })
        }
        title="Font size"
        aria-label="Font size"
      />

      {/* Weight */}
      <select
        className={input('px-2 w-28')}
        value={fontWeight}
        onChange={(e) => {
          const v = Number(e.target.value);
          const allowed = [400, 500, 600, 700];
          patch({ fontWeight: allowed.includes(v) ? v : 500 });
        }}
        title="Font weight"
        aria-label="Font weight"
      >
        <option value={400}>Normal</option>
        <option value={500}>Medium</option>
        <option value={600}>Semibold</option>
        <option value={700}>Bold</option>
      </select>

      {/* I/U */}
      <button
        type="button"
        className={cx('h-8 px-2 rounded border text-sm', italic ? 'bg-neutral-200/40' : '')}
        onClick={() => patch({ italic: !italic })}
        title="Italic"
        aria-pressed={italic}
      >
        I
      </button>
      <button
        type="button"
        className={cx('h-8 px-2 rounded border text-sm', underline ? 'bg-neutral-200/40' : '')}
        onClick={() => patch({ underline: !underline })}
        title="Underline"
        aria-pressed={underline}
      >
        U
      </button>

      {/* Colors */}
      <label className="text-xs opacity-70" htmlFor="fill-color">Fill</label>
      <input
        id="fill-color"
        type="color"
        className="h-7 w-8"
        value={fillValue}
        onChange={setHex('color')}
        aria-label="Fill color"
      />

      <label className="text-xs opacity-70" htmlFor="text-color">Text</label>
      <input
        id="text-color"
        type="color"
        className="h-7 w-8"
        value={textValue}
        onChange={setHex('textColor')}
        aria-label="Text color"
      />

      <label className="text-xs opacity-70" htmlFor="border-color">Border</label>
      <input
        id="border-color"
        type="color"
        className="h-7 w-8"
        value={borderValue}
        onChange={(e) => {
          const hex = e.target.value;
          if (!isValidHex(hex)) return;
          const rgba = hexToRgbOrRgba(hex, borderAlpha);
          patch({ borderColor: rgba });
        }}
        aria-label="Border color"
      />

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className={cx(
          'ml-auto h-8 px-2 rounded border text-xs',
          isDark ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-300 hover:bg-neutral-100'
        )}
        title="Close edit bar (Esc)"
        aria-label="Close edit bar"
      >
        ✕
      </button>
    </div>
  );
}
