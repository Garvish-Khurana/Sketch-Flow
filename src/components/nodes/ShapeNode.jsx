import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { FaPencilAlt } from 'react-icons/fa';
import StyleMenu from '../menus/StyleMenu';
import getRandomTilt from '../../utils/getRandomTilt';
import notepaper from '../../assets/notepaper.jpg';
import chalk from '../../assets/chalk.jpg';
import grid from '../../assets/grid.jpg';
import stone from '../../assets/stone.jpg';

const TEXTURE_MAP = { notepaper, chalk, grid, stone };

const SHAPE_STYLES = {
  rectangle: { borderRadius: 12, minWidth: 172, minHeight: 84, padding: '12px 20px' },
  circle: { borderRadius: 9999, width: 120, height: 120, padding: 8 },
  hexagon: {
    width: 220, height: 140, padding: 12,
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    borderRadius: 8,
  },
  tag: {
    minWidth: 172, minHeight: 84, padding: '12px 20px',
    clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
    borderRadius: 10,
  },
  diamond: {
    width: 136, height: 136, padding: 8, borderRadius: 0,
    transform: 'rotate(45deg)',
  },
};

export default function ShapeNode({ id, data }) {
  const {
    label = 'Shape',
    color = '#f59e0b',
    textColor = '#111827',
    shape = 'rectangle',
    backgroundType = 'solid',
    texture = 'notepaper',
    fontFamily = "'Comic Neue','Patrick Hand',cursive",
    fontSize = 16,
    bold = false,
    italic = false,
    underline = false,
    tilt: tiltIn,
    onChange,
    onDelete,
  } = data || {};
  const HANDLE_SIZE = 10;
  const isDiamond = shape === 'diamond';
  const outward = isDiamond ? 25 : 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const [tilt, setTilt] = useState(typeof tiltIn === 'number' ? tiltIn : getRandomTilt());

  const patch = useCallback((p) => onChange?.(id, p), [id, onChange]);

  const debouncedPatch = useMemo(() => {
    let t;
    return (p) => {
      clearTimeout(t);
      t = setTimeout(() => patch(p), 120);
    };
  }, [patch]);

  useEffect(() => {
    if (typeof tiltIn === 'number') setTilt(tiltIn);
  }, [tiltIn]);

  const handleShuffleTilt = () => {
    const next = getRandomTilt();
    setTilt(next);
    patch({ tilt: next });
  };

  // Texture background
  const textureUrl = TEXTURE_MAP[texture];
  const isTexture = backgroundType === 'texture' && !!textureUrl;
  const backgroundImage = isTexture
    ? `linear-gradient(transparent 0%, rgba(0,0,0,0.05) 100%), url(${textureUrl})`
    : 'none';

  // shared outer container styles
  const baseStyle = {
    backgroundColor: isTexture ? 'transparent' : color,
    backgroundImage,
    backgroundSize: isTexture ? 'auto, 256px 256px' : 'auto',
    backgroundRepeat: isTexture ? 'repeat' : 'no-repeat',
    border: '2px dashed rgba(0,0,0,0.2)',
    boxShadow: '4px 6px 0 rgba(0,0,0,0.2)',
    transform: `rotate(${tilt}deg)`,
    fontFamily,
    fontSize,
    fontWeight: bold ? '600' : '400',
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHAPE_STYLES[shape],
  };

  const innerStyle = shape === 'diamond'
    ? { transform: 'rotate(-45deg)', width: '100%' }
    : {};

  return (
    <div className="relative">
      {/* Pencil trigger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        title="Edit shape"
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

      {menuOpen && (
        <StyleMenu
          values={{ color, textColor, backgroundType, texture, fontFamily, fontSize, bold, italic, underline }}
          onChange={(p) => debouncedPatch(p)}
          onDelete={() => onDelete?.(id)}
          onShuffleTilt={handleShuffleTilt}
          options={{
            showBackground: true,
            showTextures: true,
            showTextColors: true,
            showTypography: true,
            showShapePicker: true,
            shapeValue: shape,
            onShapeChange: (next) => debouncedPatch({ shape: next }),
          }}
          onRequestClose={() => setMenuOpen(false)}
        />
      )}

      {/* Only top/bottom handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: '50%',
          zIndex: 1,
          transform: 'translateX(-50%)',
          top: -Math.ceil(HANDLE_SIZE / 2) - outward,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: '50%',
          zIndex: 1,
          transform: 'translateX(-50%)',
          bottom: -Math.ceil(HANDLE_SIZE / 2) - outward,
        }}
      />

      {/* Unified shape box */}
      <div className="shadow" style={baseStyle}>
        <input
          value={label}
          onChange={(e) => debouncedPatch({ label: e.target.value })}
          onFocus={() => setMenuOpen(true)}
          className="bg-transparent outline-none text-center text-sm font-semibold w-full"
          style={{ color: textColor, ...innerStyle }}
          placeholder="Label"
          aria-label="Node label"
        />
      </div>
    </div>
  );
}
