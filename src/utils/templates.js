export const templates = {
  chem: {
    title: 'Chemistry Sprint',
    nodes: [
      // Stickers (from Quick Actions)
      { id: 'st', type: 'sticker', position: { x: -120, y: -80 }, data: { text: 'START!', variant: 'start' } },

      // Phase banner (Quick Actions: Add Phase Banner)
      { id: 'b1', type: 'banner', position: { x: 20, y: -200 }, data: { label: 'Phase 1: Prep' } },

      // Milestones (Quick Actions: Add Milestone → badge)
      { id: 'm1', type: 'badge', position: { x: 60, y: 10 }, data: { label: 'Reagents', icon: '🧪' } },
      { id: 'm2', type: 'badge', position: { x: 240, y: -10 }, data: { label: 'Mixture', icon: '⚗️' } },

      // Status Orb (Quick Actions: Add Status Orb)
      { id: 'so1', type: 'statusOrb', position: { x: 420, y: -40 }, data: { label: 'Electrolysis', emoji: '⚡', sub: 'Distill → Split', progress: 0, status: 'idle' } },

      // Shape (Quick Actions: Add Shape)
      { id: 'sh1', type: 'shape', position: { x: 420, y: 40 }, data: { label: 'Safety', color: '#fde68a', textColor: '#111827', shape: 'tag' } },

      // Goal sticker
      { id: 'gl', type: 'sticker', position: { x: 620, y: -80 }, data: { text: 'GOAL', variant: 'goal' } },
    ],
    edges: [
      { id: 'e1', source: 'st', target: 'm1', type: 'rough' },
      { id: 'e2', source: 'm1', target: 'm2', type: 'rough' },
      { id: 'e3', source: 'm2', target: 'so1', type: 'rough' },
      { id: 'e4', source: 'so1', target: 'gl', type: 'rough' },
    ],
  },

  learn: {
    title: 'Learning Path',
    nodes: [
      { id: 'st', type: 'sticker', position: { x: -100, y: -80 }, data: { text: 'START!', variant: 'start' } },

      { id: 'b1', type: 'banner', position: { x: -150, y: -120 }, data: { label: 'Phase 1: Basics' } },

      // Tasks
      { id: 't1', type: 'editable', position: { x: 60, y: 90 }, data: { label: 'Intro Module', description: '' } },

      // Milestone
      { id: 'm1', type: 'badge', position: { x: 240, y: -10 }, data: { label: 'Projects', icon: '🧱' } },

      // Status Orb
      { id: 'so1', type: 'statusOrb', position: { x: 420, y: -30 }, data: { label: 'Capstone', emoji: '🎓', sub: 'Build & Present', progress: 0, status: 'idle' } },

      // Shape note
      { id: 'sh1', type: 'shape', position: { x: 420, y: 40 }, data: { label: 'Rubric', color: '#bfdbfe', textColor: '#111827', shape: 'rectangle' } },

      { id: 'gl', type: 'sticker', position: { x: 620, y: -60 }, data: { text: 'GOAL', variant: 'goal' } },
    ],
    edges: [
      { id: 'e1', source: 'st', target: 't1', type: 'rough' },
      { id: 'e2', source: 't1', target: 'm1', type: 'rough' },
      { id: 'e3', source: 'm1', target: 'so1', type: 'rough' },
      { id: 'e4', source: 'so1', target: 'gl', type: 'rough' },
    ],
  },

  launch: {
    title: 'Product Launch',
    nodes: [
      { id: 'st', type: 'sticker', position: { x: -80, y: -40 }, data: { text: 'START!', variant: 'start' } },

      { id: 'b1', type: 'banner', position: { x: 20, y: -120 }, data: { label: 'Phase 1: Prep' } },

      { id: 'm1', type: 'badge', position: { x: 60, y: -20 }, data: { label: 'Backlog', icon: '🗂️' } },
      { id: 'm2', type: 'badge', position: { x: 240, y: -20 }, data: { label: 'QA', icon: '🔬' } },

      { id: 'so1', type: 'statusOrb', position: { x: 420, y: -40 }, data: { label: 'Release', emoji: '🚀', sub: 'Docs + Changelog', progress: 0, status: 'idle' } },

      // Shape checklist
      { id: 'sh1', type: 'shape', position: { x: 420, y: 40 }, data: { label: 'Checklist', color: '#bbf7d0', textColor: '#111827', shape: 'hexagon' } },

      { id: 'gl', type: 'sticker', position: { x: 620, y: -60 }, data: { text: 'GOAL', variant: 'goal' } },
    ],
    edges: [
      { id: 'e1', source: 'st', target: 'm1', type: 'rough' },
      { id: 'e2', source: 'm1', target: 'm2', type: 'rough' },
      { id: 'e3', source: 'm2', target: 'so1', type: 'rough' },
      { id: 'e4', source: 'so1', target: 'gl', type: 'rough' },
    ],
  },

  empty: {
    title: 'Empty Canvas',
    nodes: [],
    edges: [],
  },
};

export function getTemplateBySlug(slug) {
  return templates[slug] || null;
}

export function getDemoGraph() {
  return {
    title: 'Live Demo',
    nodes: [
      { id: 'start', type: 'sticker', position: { x: -80, y: -60 }, data: { text: 'START!', variant: 'start' } },
      { id: 'badge1', type: 'badge', position: { x: 60, y: -10 }, data: { label: 'Gather', icon: '⛏️' } },
      { id: 'scene1', type: 'statusOrb', position: { x: 240, y: -40 }, data: { label: 'Refine', emoji: '🔥', sub: 'Smelt', progress: 0, status: 'idle' } },
      { id: 'badge2', type: 'badge', position: { x: 420, y: -20 }, data: { label: 'Assemble', icon: '🔩' } },
      { id: 'goal', type: 'sticker', position: { x: 620, y: -60 }, data: { text: 'GOAL', variant: 'goal' } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'badge1', type: 'rough' },
      { id: 'e2', source: 'badge1', target: 'scene1', type: 'rough' },
      { id: 'e3', source: 'scene1', target: 'badge2', type: 'rough' },
      { id: 'e4', source: 'badge2', target: 'goal', type: 'rough' },
    ],
  };
}
