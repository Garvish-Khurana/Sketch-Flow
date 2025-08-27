import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import SaveAsModal from './SaveAsModal';
import SidebarLeft from './sidebar/SidebarLeft';
import CanvasBackdrop from './canva/CanvasBackdrop';

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import RoughEdge from './edges/RoughEdge';
import EditableNode from './nodes/EditableNode';
import BannerNode from './nodes/BannerNode';
import BadgeNode from './nodes/BadgeNode';
import StatusOrb from './nodes/StatusOrb';
import StickerNode from './nodes/StickerNode';
import ShapeNode from './nodes/ShapeNode';

import api from '../utils/api';
import { createProject } from '../utils/projectsApi';
import useLocalStorage from '../hooks/useLocalStorage';
import useTheme from '../hooks/useTheme';

import useAutosave from '../hooks/useAutosave';
import useEditorShortcuts from '../hooks/useEditorShortcuts';
import { serializeForSave, serializeForCreate } from '../services/serialize';

import TemplatesPage from '../pages/TemplatesPage';
import SettingsPanel from '../pages/SettingsPanel';
import { getTemplateBySlug } from '../utils/templates';

import './styles/theme.css';
import { createPortal } from 'react-dom';
function OverlayPortal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

const AUTOSAVE_DELAY_MS_DEFAULT = 2000;

// Node/edge types
const NODE_TYPES = {
  editable: EditableNode,
  banner: BannerNode,
  badge: BadgeNode,
  statusOrb: StatusOrb,
  sticker: StickerNode,
  shape: ShapeNode,
};
const EDGE_TYPES = { rough: RoughEdge };

export default function RoadmapEditor() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialGraph = location.state?.graph ?? null;
  const sessionMode = location.state?.mode ?? null;

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectFilter, setProjectFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('editor.sidebarOpen', true);

  const { isDark, toggle: toggleTheme } = useTheme('light');

  const [saveAsOpen, setSaveAsOpen] = useState(false);
  const [saveAsBusy, setSaveAsBusy] = useState(false);
  const [saveAsError, setSaveAsError] = useState('');

  const [savedVisible, setSavedVisible] = useState(false);
  const savedTimerRef = useRef(null);

  // Overlays: Templates, Shortcuts, Settings
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Autosave delay
  const [autosaveDelay, setAutosaveDelay] = useLocalStorage(
    'editor.autosaveDelay',
    AUTOSAVE_DELAY_MS_DEFAULT
  );

  const openTemplates = useCallback(() => setTemplatesOpen(true), []);
  const closeTemplates = useCallback(() => setTemplatesOpen(false), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  // Callbacks injected into each node
  const onNodeDataChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

  const onDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
    },
    [setNodes, setEdges]
  );

  const attachNodeCallbacks = useCallback(
    (n) => ({
      ...n,
      data: {
        ...(n.data || {}),
        onChange: onNodeDataChange,
        onDelete: onDeleteNode,
      },
    }),
    [onNodeDataChange, onDeleteNode]
  );

  const withAttach = useCallback((list) => list.map(attachNodeCallbacks), [attachNodeCallbacks]);

  useEffect(() => {
    if (!initialGraph && !projectId) {
      // navigate('/dashboard', { replace: true });
    }
  }, [projectId, initialGraph, navigate]);

  // Load project list
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingProjects(true);
        const res = await api.get('/projects');
        if (!active) return;
        const items = res?.data?.data?.items ?? [];
        setProjects(
          items.map((p) => ({
            id: String(p._id ?? p.id),
            name: p.title || p.name || `Project ${p._id ?? p.id}`,
          }))
        );
      } catch (err) {
        console.error('Failed to load project list', err);
      } finally {
        if (active) setLoadingProjects(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Load graph
  useEffect(() => {
    if (initialGraph) {
      const ns = withAttach(initialGraph.nodes || []);
      const es = (initialGraph.edges || []).map((e) => ({ ...e, type: 'rough' }));
      setNodes(ns);
      setEdges(es);
      return;
    }

    if (!projectId) return;

    let active = true;
    api
      .get(`/projects/${projectId}`)
      .then((res) => {
        if (!active) return;
        const project = res?.data?.data ?? res?.data ?? {};
        const rawNodes = Array.isArray(project.nodes) ? project.nodes : [];

        const ns = rawNodes.map((n) =>
          attachNodeCallbacks({
            id: n.id,
            position: n.position,
            type:
              n.type === 'banner'
                ? 'banner'
                : n.type === 'scene'
                ? 'statusOrb'
                : n.type || 'editable',
            data: {
              label: n.title || n.data?.label || 'Untitled Task',
              description: n.data?.description || '',
              color: n.data?.color,
              textColor: n.data?.textColor,
              shape: n.data?.shape,
              width: n.data?.width,
              height: n.data?.height,
              fontFamily: n.data?.fontFamily,
              fontSize: n.data?.fontSize,
              fontWeight: n.data?.fontWeight,
              italic: n.data?.italic,
              underline: n.data?.underline,
              emoji: n.data?.emoji,
              sub: n.data?.sub,
              progress: n.data?.progress,
              status: n.data?.status,
              imageUrl: n.data?.imageUrl,
              imageFit: n.data?.imageFit,
              scrim: n.data?.scrim,
              variant: n.data?.variant,
              text: n.data?.text,
            },
          })
        );

        const rawEdges = Array.isArray(project.edges) ? project.edges : [];
        const es = rawEdges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'rough',
        }));

        setNodes(ns);
        setEdges(es);
      })
      .catch((err) => {
        console.error('Failed to load project data', err);
      });

    return () => {
      active = false;
    };
  }, [projectId, initialGraph, attachNodeCallbacks, setNodes, setEdges, withAttach]);

  // Flow handlers
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  const onSelectionChange = useCallback((params) => {
    const selEdges = Array.isArray(params?.edges) ? params.edges : [];
    setSelectedEdges(selEdges);

    const selNodes = Array.isArray(params?.nodes) ? params.nodes : [];
    setSelectedNodeId(selNodes?.id || null);
  }, []);

  const deleteSelectedEdges = useCallback(() => {
    setEdges((eds) => eds.filter((edge) => !selectedEdges.some((sel) => sel.id === edge.id)));
  }, [setEdges, selectedEdges]);

  // Save & autosave
  const saveRoadmap = useCallback(async () => {
    if (sessionMode === 'ephemeral') return;
    if (!projectId) return;
    try {
      const payload = serializeForSave(nodes, edges);
      await api.put(`/projects/${projectId}`, payload);
      setSavedVisible(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSavedVisible(false), 2000);
    } catch (err) {
      console.error('Failed to save roadmap:', err);
    }
  }, [nodes, edges, projectId, sessionMode]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  useAutosave(saveRoadmap, autosaveDelay, [saveRoadmap]);

  // Helpers
  const nextId = () => String(Date.now() + Math.floor(Math.random() * 1000));
  const defaultPos = (x = 100, y = 100) => ({ x, y });

  // Adders
  const addNode = useCallback(() => {
    setNodes((nds) =>
      withAttach([
        ...nds,
        {
          id: nextId(),
          position: defaultPos(60, 60),
          type: 'editable',
          data: { label: 'New Task', description: '' },
        },
      ])
    );
  }, [setNodes, withAttach]);

  const addBanner = useCallback(() => {
    setNodes((nds) =>
      withAttach([
        ...nds,
        {
          id: nextId(),
          position: defaultPos(-100, -100),
          type: 'banner',
          data: { label: 'Phase 1' },
        },
      ])
    );
  }, [setNodes, withAttach]);

  const addMilestone = useCallback(
    (label = 'Milestone', icon = '🏅', position = defaultPos(120, 80)) =>
      setNodes((nds) =>
        withAttach([
          ...nds,
          { id: nextId(), type: 'badge', position, data: { label, icon } },
        ])
      ),
    [setNodes, withAttach]
  );

  const addStatusOrb = useCallback(
    (label = 'Implement Feature', emoji = '💻', position = defaultPos(260, 80)) => {
      setNodes((nds) =>
        withAttach([
          ...nds,
          {
            id: nextId(),
            type: 'statusOrb',
            position,
            data: { label, emoji, sub: 'Module: core | Issue: #1234', progress: 0, status: 'idle' },
          },
        ])
      );
    },
    [setNodes, withAttach]
  );

  // Stickers
  const addSticker = useCallback(
    (text = 'START!', variant = 'start', position = defaultPos(-40, -40)) => {
      setNodes((nds) =>
        withAttach([
          ...nds,
          { id: nextId(), type: 'sticker', position, data: { text, variant } },
        ])
      );
    },
    [setNodes, withAttach]
  );
  const addStartSticker = useCallback(() => addSticker('START!', 'start'), [addSticker]);
  const addGoalSticker = useCallback(() => addSticker('GOAL', 'goal'), [addSticker]);

  // All sticker variants
  const addWarnSticker = useCallback(() => addSticker('Warning', 'warn'), [addSticker]);
  const addInfoSticker = useCallback(() => addSticker('Info', 'info'), [addSticker]);
  const addTipSticker = useCallback(() => addSticker('Tip', 'tip'), [addSticker]);
  const addNoteSticker = useCallback(() => addSticker('Note', 'note'), [addSticker]);
  const addBugSticker = useCallback(() => addSticker('Bug', 'bug'), [addSticker]);
  const addMilestoneSticker2 = useCallback(() => addSticker('Milestone', 'milestone'), [addSticker]);
  const addDeadlineSticker = useCallback(() => addSticker('Deadline', 'deadline'), [addSticker]);
  const addDecisionSticker = useCallback(() => addSticker('Decision', 'decision'), [addSticker]);
  const addCheckpointSticker = useCallback(() => addSticker('Checkpoint', 'checkpoint'), [addSticker]);

  // Shapes
  const addShape = useCallback(
    (opts = {}) => {
      const {
        label = 'Shape',
        color = '#f59e0b',
        textColor = '#111827',
        shape = 'rectangle',
        position = defaultPos(120, 120),
      } = opts;

      setNodes((nds) =>
        withAttach([
          ...nds,
          {
            id: nextId(),
            type: 'shape',
            position,
            data: { label, color, textColor, shape },
          },
        ])
      );
    },
    [setNodes, withAttach]
  );

  const addRectangle = useCallback(() => addShape({ shape: 'rectangle', label: 'Box' }), [addShape]);
  const addCircle = useCallback(() => addShape({ shape: 'circle', label: 'Circle' }), [addShape]);
  const addDiamond = useCallback(() => addShape({ shape: 'diamond', label: 'Decision' }), [addShape]);
  const addHexagon = useCallback(() => addShape({ shape: 'hexagon', label: 'Hexagon' }), [addShape]);
  const addTag = useCallback(() => addShape({ shape: 'tag', label: 'Tag' }), [addShape]);

  // Sidebar navigation
  const onSelectProject = useCallback(
    (id) => {
      if (!id) return;
      setSidebarOpen(false);
      navigate(`/projects/${id}`);
    },
    [navigate, setSidebarOpen]
  );

  // Save As
  const onSaveAs = useCallback(
    async (name) => {
      try {
        setSaveAsBusy(true);
        setSaveAsError('');
        const payload = serializeForCreate(name, nodes, edges);
        const created = await createProject(payload);
        const doc = created?.data ?? created;
        const newId = String(doc._id ?? doc.id);
        if (!newId) throw new Error('Missing new project id');
        localStorage.setItem('lastOpenedProjectId', newId);
        setSaveAsOpen(false);
        setSaveAsBusy(false);
        navigate(`/projects/${newId}`, { replace: true });
      } catch (err) {
        console.error('Save As failed', err);
        setSaveAsBusy(false);
        setSaveAsError('Login/Registration Required!. Failed to create project. Please try again.');
      }
    },
    [nodes, edges, navigate]
  );

  // Export JSON
  const exportGraph = useCallback(() => {
    try {
      const payload = serializeForSave(nodes, edges);
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `roadmap-${projectId || 'untitled'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('Export failed', err);
    }
  }, [nodes, edges, projectId]);

  // Import JSON
  const fileInputRef = useRef(null);
  const triggerImport = useCallback(() => fileInputRef.current?.click(), []);
  const importGraphFromFile = useCallback(
    async (e) => {
      try {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const parsed = JSON.parse(text);

        const importedNodes = Array.isArray(parsed?.nodes) ? parsed.nodes : [];
        const importedEdges = Array.isArray(parsed?.edges) ? parsed.edges : [];

        const ns = importedNodes.map((n) =>
          attachNodeCallbacks({
            id: n.id || String(Date.now() + Math.random()),
            position: n.position || { x: 0, y: 0 },
            type: n.type === 'scene' ? 'statusOrb' : n.type || 'editable',
            data: n.data || {},
          })
        );
        const es = importedEdges.map((ed) => ({
          id: ed.id || `${ed.source}-${ed.target}-${Math.random()}`,
          source: ed.source,
          target: ed.target,
          type: 'rough',
        }));

        setNodes(ns);
        setEdges(es);
        e.target.value = '';
      } catch (err) {
        console.error('Import failed', err);
      }
    },
    [attachNodeCallbacks, setNodes, setEdges]
  );

  // Load template by slug
  const loadTemplateBySlug = useCallback(
    (slug) => {
      const tpl = getTemplateBySlug(slug);
      if (!tpl) return;
      const ns = (tpl.nodes || []).map((n) =>
        attachNodeCallbacks({
          id: n.id,
          position: n.position || { x: 0, y: 0 },
          type: n.type === 'scene' ? 'statusOrb' : n.type || 'editable',
          data: n.data || {},
        })
      );
      const es = (tpl.edges || []).map((e) => ({ ...e, type: 'rough' }));
      setNodes(ns);
      setEdges(es);
    },
    [attachNodeCallbacks, setNodes, setEdges]
  );

  // Shortcuts (global)
  useEditorShortcuts({
    onToggleSidebar: () => setSidebarOpen((o) => !o),
    onSave: saveRoadmap,
    onDeleteSelected: deleteSelectedEdges,
    onToggleTheme: toggleTheme,
    hasSelectedEdges: selectedEdges.length > 0,
  });

  // Close overlays on Esc
  useEffect(() => {
    if (!templatesOpen && !shortcutsOpen && !settingsOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (templatesOpen) closeTemplates();
        if (shortcutsOpen) closeShortcuts();
        if (settingsOpen) closeSettings();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [templatesOpen, shortcutsOpen, settingsOpen, closeTemplates, closeShortcuts, closeSettings]); 
  const canvasBlocked = templatesOpen || shortcutsOpen || settingsOpen; 
  
  // Layout
  const editorContainerClass = 'relative w-screen h-[91.7vh] overflow-hidden bg-[#1a022b]';
  const canvasContainerClass = `absolute inset-0 p-2 transition-none`;

  return (
    <div className={editorContainerClass}>
      {/* Hidden file input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={importGraphFromFile}
      />

      {/* Overlays via portal (always above editor) */}
      {templatesOpen && (
        <OverlayPortal>
          <div className="fixed inset-0 z- flex items-stretch justify-center">
            <div className="absolute inset-0 z- bg-black/40" onClick={closeTemplates} aria-hidden="true" />
            <div className="relative top-10 z- w-full max-w-[900px] h-[85vh] mt-10 overflow-auto rounded-xl bg-white shadow-2xl">
              <TemplatesPage
                onUseTemplate={(slug) => { loadTemplateBySlug(slug); closeTemplates(); }}
                onPreviewTemplate={(slug) => { loadTemplateBySlug(slug); }}
                onClose={closeTemplates}
              />
            </div>
          </div>
        </OverlayPortal>
      )}

      {shortcutsOpen && (
        <OverlayPortal>
          <div className="fixed inset-0 z- flex items-center justify-center">
            <div className="absolute inset-0 z- bg-black/40" onClick={closeShortcuts} aria-hidden="true" />
            <div className="relative z- w-[680px] max-w-[92vw] rounded-xl border bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                <button className="text-sm px-2 py-1 rounded border" onClick={closeShortcuts}>Close</button>
              </div>
              <ul className="text-sm space-y-1">
                <li><span className="font-mono">M</span> — Toggle sidebar</li>
                <li><span className="font-mono">Ctrl/Cmd+S</span> — Save</li>
                <li><span className="font-mono">Del/Backspace</span> — Delete selected edge(s)</li>
                <li><span className="font-mono">T</span> — Toggle theme</li>
              </ul>
              <div className="mt-3 text-xs text-neutral-600">Press Esc to close</div>
            </div>
          </div>
        </OverlayPortal>
      )}

      {settingsOpen && (
        <OverlayPortal>
          <div className="fixed inset-0 z- flex items-center justify-center">
            <div className="absolute inset-0 z- bg-black/40" onClick={closeSettings} aria-hidden="true" />
            <div className="relative z- w-[560px] max-w-[92vw] rounded-xl border bg-white p-4 shadow-2xl">
              <SettingsPanel
                isDark={isDark}
                onToggleTheme={toggleTheme}
                autosaveDelay={autosaveDelay}
                onChangeAutosaveDelay={(ms) => setAutosaveDelay(ms)}
                onClose={closeSettings}
              />
            </div>
          </div>
        </OverlayPortal>
      )}

      <SidebarLeft
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((o) => !o)}
        projects={projects}
        loading={loadingProjects}
        currentProjectId={projectId}
        onSelectProject={onSelectProject}
        projectFilter={projectFilter}
        onChangeProjectFilter={setProjectFilter}
        // creators
        onAddTask={addNode}
        onAddBanner={addBanner}
        onAddRectangle={addRectangle}
        onAddCircle={addCircle}
        onAddDiamond={addDiamond}
        onAddHexagon={addHexagon}
        onAddTag={addTag}
        onSave={saveRoadmap}
        onAddMilestone={() => addMilestone('Sulfuric Acid', '⚗️')}
        onAddStatusOrb={() => addStatusOrb('Implement Feature', '💻')}
        // stickers
        onAddStartSticker={addStartSticker}
        onAddGoalSticker={addGoalSticker}
        onAddWarnSticker={addWarnSticker}
        onAddInfoSticker={addInfoSticker}
        onAddTipSticker={addTipSticker}
        onAddNoteSticker={addNoteSticker}
        onAddBugSticker={addBugSticker}
        onAddMilestoneSticker={addMilestoneSticker2}
        onAddDeadlineSticker={addDeadlineSticker}
        onAddDecisionSticker={addDecisionSticker}
        onAddCheckpointSticker={addCheckpointSticker}
        // theme & selection
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onDeleteSelectedEdges={deleteSelectedEdges}
        hasSelectedEdges={selectedEdges.length > 0}
        showSaveAs={sessionMode === 'ephemeral'}
        onSaveAs={() => setSaveAsOpen(true)}
        // selection context
        selectedNodes={nodes}
        onBatchUpdateSelected={(patchFn) => {
          setNodes((nds) =>
            withAttach(
              nds.map((node) => {
                if (!node.selected) return node;
                const patch = patchFn(node);
                if (!patch) return node;
                return { ...node, ...patch };
              })
            )
          );
        }}
        // More actions (wired)
        onExport={exportGraph}
        onOpenImportExport={triggerImport}
        onOpenTemplates={openTemplates}
        onOpenShortcuts={openShortcuts}
        onOpenSettings={openSettings}
      />

      {savedVisible && (
        <div
          className="absolute top-3 right-3 z-50 px-3 py-1.5 rounded-full text-xs font-semibold border shadow bg-emerald-500/10 text-emerald-800 border-emerald-500/40"
          aria-live="polite"
        >
          Saved
        </div>
      )}

      <div className={canvasContainerClass} style={{ pointerEvents: canvasBlocked ? 'none' : 'auto' }}>
        <div className="relative w-full h-full transition-none">
          <CanvasBackdrop>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={onSelectionChange}
              nodeTypes={NODE_TYPES}
              edgeTypes={EDGE_TYPES}
              defaultEdgeOptions={{ type: 'rough' }}
              fitView
              panOnDrag
              zoomOnScroll
              proOptions={{ hideAttribution: true }}
              deleteKeyCode={['Delete', 'Backspace']}
              panOnScroll={false}
            >
              <MiniMap
                pannable
                zoomable
                maskColor="rgba(43,43,43,0.06)"
                style={{ borderRadius: 12, bottom: 12, right: 12 }}
              />
              <Controls showInteractive />
              <Background color="rgba(43,43,43,0.12)" gap={18} />
            </ReactFlow>
          </CanvasBackdrop>

          <SaveAsModal
            open={saveAsOpen}
            onClose={() => (!saveAsBusy ? setSaveAsOpen(false) : null)}
            onSubmit={onSaveAs}
            initialName="My Roadmap"
            busy={saveAsBusy}
            error={saveAsError}
          />
        </div>
      </div>
    </div>
  );
}
