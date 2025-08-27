import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-parchment bg-cover bg-center bg-fixed">
      <div className="bg-white/80">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="relative overflow-hidden rounded-xl border-2 border-stone-800 bg-stone-100/90 shadow-[8px_8px_0_#444]">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <svg className="w-full h-full opacity-20" role="img" aria-hidden="true">
                <defs>
                  <pattern id="about-rays" patternUnits="userSpaceOnUse" width="400" height="400">
                    <g transform="translate(200,200)">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <rect
                          key={i}
                          x="0"
                          y="-2"
                          width="200"
                          height="4"
                          fill="rgba(0,0,0,0.1)"
                          transform={`rotate(${i * 6})`}
                        />
                      ))}
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#about-rays)" />
              </svg>
            </div>

            <div className="relative p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-['Caveat',cursive] text-stone-900 mb-3">
                🪨 About Sketch Flow
              </h1>
              <p className="text-stone-800 max-w-3xl">
                Sketch Flow helps plan ideas like a scientist—map steps, connect discoveries
                with comic-style edges, and track progress on a hand‑drawn canvas. Built for fast sketching,
                playful iteration, and exporting results when it’s time to share.
              </p>
            </div>
          </div>
        </section>

        {/* What it is */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2 border-stone-800 bg-white shadow-[6px_6px_0_#444]">
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">What it does</h2>
              <ul className="list-disc pl-5 text-stone-800 space-y-1">
                <li>Visual node editor for tasks, status orbs, milestones, shapes, and stickers.</li>
                <li>Sketch-style “rough” edges for bold, readable connections.</li>
                <li>Autosave to the cloud and export/import JSON for portability.</li>
                <li>Starter templates and a live demo for zero‑setup exploration.</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border-2 border-stone-800 bg-white shadow-[6px_6px_0_#444]">
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Who it’s for</h2>
              <ul className="list-disc pl-5 text-stone-800 space-y-1">
                <li>Students mapping study plans and science sprints.</li>
                <li>Makers planning product releases and creative workflows.</li>
                <li>Teams sketching roadmaps before formalizing tickets.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features + Roadmap anatomy */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="p-6 rounded-xl border-2 border-stone-800 bg-stone-50 shadow-[6px_6px_0_#444]">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">Key features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444]">
                <div className="text-2xl mb-1">🧭</div>
                <div className="font-semibold">Visual mapping</div>
                <div className="text-stone-700 text-sm">Drop nodes, connect steps, and rearrange freely.</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444]">
                <div className="text-2xl mb-1">💾</div>
                <div className="font-semibold">Autosave</div>
                <div className="text-stone-700 text-sm">Changes persist automatically to keep momentum.</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444]">
                <div className="text-2xl mb-1">📤</div>
                <div className="font-semibold">Export / Import</div>
                <div className="text-stone-700 text-sm">Share or restore work via JSON files.</div>
              </div>
            </div>

            {/* Small “anatomy” card */}
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444]">
                <div className="font-semibold mb-1">Roadmap anatomy</div>
                <ul className="text-stone-700 text-sm list-disc pl-5 space-y-1">
                  <li>Task (editable) — freeform text panel for notes/plans.</li>
                  <li>Status Orb — emoji + status + percent done.</li>
                  <li>Milestone (badge) — compact, icon‑forward marker.</li>
                  <li>Shape — annotations or decision diamonds.</li>
                  <li>Sticker — START/GOAL and playful labels.</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border-2 border-stone-800 bg-white shadow-[4px_4px_0_#444]">
                <div className="font-semibold mb-1">Dark theme (purple/blue)</div>
                <p className="text-stone-700 text-sm">
                  Panels use a cozy dark purple; the canvas uses deep blue. This keeps contrast high without pure black,
                  so edges and nodes stay readable in low light.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech & design notes */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2 border-stone-800 bg-white shadow-[6px_6px_0_#444]">
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Under the hood</h2>
              <ul className="list-disc pl-5 text-stone-800 space-y-1">
                <li>React + modern hooks for state and effects.</li>
                <li>Tailwind CSS with a parchment/ink palette.</li>
                <li>Custom nodes and rough edges for a comic feel.</li>
                <li>REST API integration for projects and autosave.</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border-2 border-stone-800 bg-white shadow-[6px_6px_0_#444]">
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">Design choices</h2>
              <ul className="list-disc pl-5 text-stone-800 space-y-1">
                <li>Legible handwriting fonts for titles; system fonts for body.</li>
                <li>High-contrast borders and comic shadows for clarity.</li>
                <li>Parchment textures and rays to keep focus on content.</li>
                <li>Keyboard shortcuts for flow: save, theme, delete edges.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Credits & attribution */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="p-6 rounded-xl border-2 border-stone-800 bg-stone-100 shadow-[6px_6px_0_#444]">
            <h2 className="text-2xl font-semibold text-stone-900 mb-3">Credits</h2>
            <p className="text-stone-800">
              Inspired by the spirit of invention from Dr. Stone. Visual style blends parchment textures,
              bold ink borders, and playful stickers to make planning feel fun and fast.
            </p>
            <div className="mt-3 text-sm text-stone-700">
              Fonts: Patrick Hand, Architects Daughter. UI: Tailwind CSS. Icons: native emoji.
            </div>
          </div>
        </section>

        {/* Contact / footer note */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="text-center text-stone-700">
            Got feedback or ideas? Reach out via your preferred channel, or open an issue in your project tracker.
          </div>
        </section>
      </div>
    </div>
  );
}
