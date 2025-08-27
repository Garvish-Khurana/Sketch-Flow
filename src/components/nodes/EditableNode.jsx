import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";
import { FaPencilAlt } from "react-icons/fa";
import { defaultNodeStyles } from "../../utils/defaultNodeStyles";
import getRandomTilt from "../../utils/getRandomTilt";
import "../styles/animations.css";
import tearSfx from "../../assets/paper-tear.mp3";
import StyleMenu from "../menus/StyleMenu";
import notepaper from "../../assets/notepaper.jpg";
import chalk from "../../assets/chalk.jpg";
import grid from "../../assets/grid.jpg";
import stone from "../../assets/stone.jpg";

const TEXTURE_MAP = {
  notepaper,
  chalk,
  grid,
  stone,
};

const EditableNode = ({ id, data }) => {
  const [title, setTitle] = useState(data.label);
  const [description, setDescription] = useState(data.description || "");
  const [fresh, setFresh] = useState(!!data.__fresh);

  // style state
  const [color, setColor] = useState(data.color ?? defaultNodeStyles.color);
  const [fontSize, setFontSize] = useState(data.fontSize ?? defaultNodeStyles.fontSize);
  const [fontFamily, setFontFamily] = useState(data.fontFamily ?? defaultNodeStyles.fontFamily);
  const [bold, setBold] = useState(data.bold ?? defaultNodeStyles.bold);
  const [italic, setItalic] = useState(data.italic ?? defaultNodeStyles.italic);
  const [underline, setUnderline] = useState(data.underline ?? defaultNodeStyles.underline);
  const [backgroundType, setBackgroundType] = useState(data.backgroundType ?? defaultNodeStyles.backgroundType);
  const [texture, setTexture] = useState(data.texture ?? defaultNodeStyles.texture);

  // tilt & animations
  const [tilt, setTilt] = useState(data.tilt ?? getRandomTilt());
  const [nodeWobble, setNodeWobble] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // menu + sfx
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const tearSoundRef = useRef(null);

  // sync with props
  useEffect(() => setTitle(data.label), [data.label]);
  useEffect(() => setDescription(data.description || ""), [data.description]);

  // fresh wobble
  useEffect(() => {
    if (!fresh) return;
    const t = setTimeout(() => setFresh(false), 300);
    return () => clearTimeout(t);
  }, [fresh]);

  // wobble on style change
  useEffect(() => {
    setNodeWobble(true);
    const t = setTimeout(() => setNodeWobble(false), 450);
    return () => clearTimeout(t);
  }, [color, fontSize, fontFamily, bold, italic, underline, backgroundType, texture]);

  // swing reset
  useEffect(() => {
    if (swinging) {
      const t = setTimeout(() => setSwinging(false), 650);
      return () => clearTimeout(t);
    }
  }, [swinging]);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // persist
  const updateData = (updates) => {
    data.onChange?.(id, {
      label: title,
      description,
      color,
      fontSize,
      fontFamily,
      bold,
      italic,
      underline,
      backgroundType,
      texture,
      tilt,
      ...updates,
    });
  };

  const onTitleChange = (e) => {
    const next = e.target.value;
    setTitle(next);
    updateData({ label: next });
  };

  const onDescriptionChange = (e) => {
    const next = e.target.value;
    setDescription(next);
    updateData({ description: next });
  };

  const onDeleteClick = () => {
    if (tearSoundRef.current) {
      tearSoundRef.current.currentTime = 0;
      tearSoundRef.current.play();
    }
    setDeleting(true);
    setTimeout(() => data.onDelete?.(id), 600);
  };

  // background from texture key
  const textureUrl = TEXTURE_MAP[texture];
  const isTextureMode = backgroundType === "texture" && !!textureUrl;
  const bgImage = isTextureMode
    ? `linear-gradient(transparent 0%, rgba(0,0,0,0.05) 100%), url(${textureUrl})`
    : "none";

  // shared menu bindings
  const sharedValues = {
    color,
    textColor: undefined,
    backgroundType,
    texture,
    fontFamily,
    fontSize,
    bold,
    italic,
    underline,
  };

  const onSharedChange = (patch) => {
    if (patch.color !== undefined) setColor(patch.color);
    if (patch.backgroundType !== undefined) setBackgroundType(patch.backgroundType);
    if (patch.texture !== undefined) setTexture(patch.texture);
    if (patch.fontFamily !== undefined) setFontFamily(patch.fontFamily);
    if (patch.fontSize !== undefined) setFontSize(patch.fontSize);
    if (patch.bold !== undefined) setBold(patch.bold);
    if (patch.italic !== undefined) setItalic(patch.italic);
    if (patch.underline !== undefined) setUnderline(patch.underline);
    updateData(patch);
  };

  const onShuffleTilt = () => {
    const newTilt = getRandomTilt();
    setTilt(newTilt);
    setSwinging(true);
    updateData({ tilt: newTilt });
  };

  return (
    <div
      className={`comic-node ${nodeWobble ? "wobble-once" : ""} ${swinging ? "swing-tilt" : ""} ${deleting ? "crumple-out" : ""}`}
      style={{
        "--tilt": `${tilt}deg`,
        position: "relative",
        minWidth: 230,
        maxWidth: 330,
        padding: 12,
        backgroundColor: isTextureMode ? "transparent" : color,
        backgroundImage: bgImage,
        backgroundSize: isTextureMode ? "auto, 256px 256px" : "auto",
        backgroundRepeat: isTextureMode ? "repeat" : "no-repeat",
        border: "2.5px dashed rgba(30,30,30,0.85)",
        borderRadius: 14,
        boxShadow: "5px 7px 0 rgba(20,20,20,0.35)",
        fontFamily,
        cursor: "default",
        fontSize,
        textDecoration: underline ? "underline" : "none",
        fontWeight: bold ? "bold" : "normal",
        fontStyle: italic ? "italic" : "normal",
        transition: "all 0.25s ease-in-out",
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* Pencil trigger */}
      <button
        onClick={() => setShowMenu((v) => !v)}
        title="Edit style"
        style={{
          width: 30, height: 30, position: "absolute", top: -10, right: -10,
          background: "yellow", borderRadius: 50, border: "2px solid rgba(0,0,0,0.35)",
          cursor: "pointer", color: "rgba(43,43,43,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "2px 3px 0 rgba(0,0,0,0.2)",
        }}
        className="jiggle-hover"
      >
        <FaPencilAlt />
      </button>

      {/* Shared Style Menu */}
      {showMenu && (
        <div ref={menuRef}>
          <StyleMenu
            anchor={{ top: "-140%", left: "100%", marginLeft: 10 }}
            values={sharedValues}
            onChange={onSharedChange}
            onDelete={onDeleteClick}
            onShuffleTilt={onShuffleTilt}
            options={{
              showBackground: true,
              showTextures: true,
              showTextColors: false,
              showTypography: true,
              showShapePicker: false,
            }}
            onRequestClose={() => setShowMenu(false)}
          />
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "transparent", border: "2px dashed rgba(43,43,43,0.7)" }}
      />

      {/* Title */}
      <input
        value={title}
        onChange={onTitleChange}
        placeholder="Task title"
        style={{
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
          border: "none",
          borderBottom: "2px dashed rgba(43,43,43,0.35)",
          marginBottom: 6,
          width: "100%",
          background: "transparent",
          outline: "none",
          fontSize: fontSize + 2,
        }}
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={onDescriptionChange}
        placeholder="Description"
        style={{
          width: "100%",
          resize: "none",
          border: "2px dashed rgba(43,43,43,0.25)",
          borderRadius: 8,
          padding: 6,
          fontSize,
          background: "transparent",
          outline: "none",
          lineHeight: 1.35,
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          textDecoration: underline ? "underline" : "none",
        }}
        rows={3}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "transparent", border: "2px dashed rgba(43,43,43,0.7)" }}
      />

      {/* tear sound */}
      <audio ref={tearSoundRef} src={tearSfx} preload="auto" />
    </div>
  );
};

export default EditableNode;
