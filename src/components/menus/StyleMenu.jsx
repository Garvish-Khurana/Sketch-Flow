import React, { useEffect, useRef } from "react";
import nodeTextures from "../../utils/nodeTextures";

export default function StyleMenu({
  anchor = { top: "-140%", left: "100%", marginLeft: 10 },
  values,
  onChange,
  onDelete,
  onShuffleTilt,
  options = {
    showBackground: true,
    showTextures: true,
    showTextColors: true,
    showTypography: true,
    showShapePicker: false,
    shapeValue: "rectangle",
    onShapeChange: null,
    extraControls: null,
  },
  onRequestClose,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onRequestClose?.();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onRequestClose]);

  const { color, textColor, backgroundType, texture, fontFamily, fontSize, bold, italic, underline } = values;

  return (
    <div
      ref={ref}
      className="peel-in"
      style={{
        position: "absolute",
        top: anchor.top,
        left: anchor.left,
        marginLeft: anchor.marginLeft ?? 10,
        zIndex: 999,
        background: "#fff",
        padding: 10,
        minWidth: 200,
        borderRadius: 10,
        border: "2px dashed rgba(0,0,0,0.6)",
        boxShadow: "4px 5px 0 rgba(0,0,0,0.25)",
        fontFamily: "'Comic Neue','Patrick Hand',cursive",
      }}
    >
      {/* top-right delete */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
        <button
          onClick={onDelete}
          title="Delete"
          style={{
            padding: "6px",
            borderRadius: 6,
            background: "#ff5252",
            color: "white",
            border: "2px solid rgba(0,0,0,0.6)",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "2px 3px 0 rgba(0,0,0,0.25)",
          }}
          className="jiggle-hover"
        >
          🗑
        </button>
      </div>

      {/* shape picker (optional) */}
      {options.showShapePicker && options.onShapeChange && (
        <div className="mb-2">
          <label className="text-[11px] text-neutral-600 mr-2">Shape</label>
          <select
            value={options.shapeValue}
            onChange={(e) => options.onShapeChange(e.target.value)}
            className="text-xs border rounded px-1 py-1 bg-white"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="diamond">Diamond</option>
            <option value="hexagon">Hexagon</option>
            <option value="tag">Tag</option>
          </select>
        </div>
      )}

      {/* colors */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-neutral-600">Fill</span>
          <input type="color" value={color} onChange={(e) => onChange({ color: e.target.value })} />
        </div>
        {options.showTextColors && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-neutral-600">Text</span>
            <input type="color" value={textColor} onChange={(e) => onChange({ textColor: e.target.value })} />
          </div>
        )}
      </div>

      {/* background mode + textures */}
      {options.showBackground && (
        <>
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12, marginRight: 6 }}>🖼 Background:</label>
            <select
              value={backgroundType}
              onChange={(e) => onChange({ backgroundType: e.target.value })}
            >
              <option value="solid">Solid Color</option>
              <option value="texture">Texture</option>
            </select>
          </div>

          {options.showTextures && backgroundType === "texture" && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>📜 Texture:</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {nodeTextures.map((tex) => (
                  <div
                    key={tex.key}
                    onClick={() => onChange({ texture: tex.key })}
                    title={tex.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 6,
                      border: texture === tex.key ? "2px solid #333" : "2px dashed rgba(0,0,0,0.4)",
                      backgroundImage: `url(${tex.preview})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      cursor: "pointer",
                      boxShadow: texture === tex.key ? "2px 3px 0 rgba(0,0,0,0.25)" : "none",
                    }}
                    className="jiggle-hover"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* typography */}
      {options.showTypography && (
        <>
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12, marginRight: 6 }}>🔠 Size:</label>
            <input
              type="number"
              min="12"
              max="32"
              value={fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || fontSize })}
              style={{ width: 56 }}
            />
          </div>
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12, marginRight: 6 }}>✍ Font:</label>
            <select
              value={fontFamily}
              onChange={(e) => onChange({ fontFamily: e.target.value })}
            >
              <option value="'Comic Neue','Patrick Hand',cursive">Comic Hand</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Times New Roman', serif">Serif</option>
              <option value="'Courier New', monospace">Monospace</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => onChange({ bold: !bold })}
              style={{ border: "1px solid #333", borderRadius: 6, padding: 4, background: bold ? "#ffd54f" : "white" }}
              className="jiggle-hover"
            >
              B
            </button>
            <button
              onClick={() => onChange({ italic: !italic })}
              style={{ border: "1px solid #333", borderRadius: 6, padding: 4, background: italic ? "#ffb74d" : "white" }}
              className="jiggle-hover"
            >
              I
            </button>
            <button
              onClick={() => onChange({ underline: !underline })}
              style={{ border: "1px solid #333", borderRadius: 6, padding: 4, background: underline ? "#4dd0e1" : "white" }}
              className="jiggle-hover"
            >
              U
            </button>
          </div>
        </>
      )}

      {/* shuffle tilt */}
      {onShuffleTilt && (
        <button
          onClick={onShuffleTilt}
          style={{
            width: "100%",
            marginBottom: 8,
            padding: "6px",
            borderRadius: 6,
            background: "#ffee58",
            color: "#333",
            border: "2px solid rgba(0,0,0,0.6)",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "2px 3px 0 rgba(0,0,0,0.25)",
          }}
          className="jiggle-hover"
        >
          🔄 Shuffle Tilt
        </button>
      )}

      {options.extraControls}
    </div>
  );
}
