import React from 'react';

export default function CanvasBackdrop({
  children,
  labMode = false,
  className = '',
  isDark = false,
}) {
  const wrap = [
    'relative w-full h-full overflow-hidden transition-none',
    labMode ? 'comic-blueprint' : 'parchment-bg',
    isDark ? 'dark' : '',
    className,
  ].join(' ');

  return (
    <div className={wrap}>
      <span className="sr-only" title="Senku says: Ctrl+S to save 10 billion brain cells.">
        Lab Mode hint
      </span>
      <div className="absolute inset-0 transition-none will-change-auto">{children}</div>
    </div>
  );
}
