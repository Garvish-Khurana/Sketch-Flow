import { useEffect } from 'react';

export default function useEditorShortcuts({
  onToggleSidebar,
  onSave,
  onDeleteSelected,
  onToggleTheme,
  hasSelectedEdges,
}) {
  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'm') onToggleSidebar?.();

      if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault();
        onSave?.();
      }

      if ((key === 'delete' || key === 'backspace') && hasSelectedEdges) {
        e.preventDefault();
        onDeleteSelected?.();
      }

      if (key === 't') onToggleTheme?.();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onToggleSidebar, onSave, onDeleteSelected, onToggleTheme, hasSelectedEdges]);
}
