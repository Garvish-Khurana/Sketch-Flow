import React, { memo, useState, useEffect, useRef } from 'react';

function BannerNode({ id, data }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Phase');
  const inputRef = useRef(null);

  useEffect(() => {
    setLabel(data.label || 'Phase');
  }, [data.label]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = (next) => {
    const finalValue = (next ?? label).trim() || 'Phase';
    setLabel(finalValue);
    setEditing(false);
    data.onChange?.(id, { label: finalValue });
  };

  const cancel = () => {
    setLabel(data.label || 'Phase');
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(e.currentTarget.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <div
      className="hand-title wobble"
      title="Phase banner"
      style={{
        padding: '8px 14px',
        border: '2px dashed rgba(43,43,43,0.6)',
        borderRadius: 12,
        background: 'rgba(246,240,226,0.9)',
        color: 'var(--ink)',
        fontSize: 18,
        letterSpacing: 0.2,
        boxShadow: '4px 6px 0 rgba(43,43,43,0.15)',
        whiteSpace: 'nowrap',
        userSelect: editing ? 'text' : 'none',
        cursor: editing ? 'text' : 'default',
        position: 'relative',
        minWidth: 160,
      }}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          defaultValue={label}
          onBlur={(e) => commit(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          style={{
            font: 'inherit',
            color: 'inherit',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
          }}
          aria-label="Rename phase"
        />
      ) : (
        <span>{label}</span>
      )}

      {/* Optional small edit button for touch devices */}
      {!editing && (
        <button
          onClick={() => setEditing(true)}
          title="Rename phase"
          style={{
            position: 'absolute',
            right: 6,
            top: 4,
            background: 'transparent',
            border: '1px solid rgba(43,43,43,0.25)',
            borderRadius: 6,
            fontSize: 11,
            padding: '2px 6px',
            cursor: 'pointer',
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default memo(BannerNode);
