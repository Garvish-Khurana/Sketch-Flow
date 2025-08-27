import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TemplatesPage({ onUseTemplate, onPreviewTemplate, onClose }) {
  const navigate = useNavigate();
  
  const cards = [
    { slug: 'chem',   emoji: '🧪', title: 'Chemistry Sprint', desc: 'Acids, distillation, electrolysis.' },
    { slug: 'learn',  emoji: '💻', title: 'Learning Path',    desc: 'Modules, quizzes, capstone.' },
    { slug: 'launch', emoji: '🚀', title: 'Product Launch',   desc: 'Backlog, QA, release checklist.' },
    { slug: 'empty',  emoji: '🗒️', title: 'Empty Canvas',     desc: 'Start from scratch.' },
  ];

  const handleUseTemplateClick = (slug) => {
    if (onUseTemplate) onUseTemplate(slug);
    else navigate(`/projects/template/${slug}`);
  };

  const handlePreviewTemplateClick = (slug) => {
    if (onPreviewTemplate) onPreviewTemplate(slug);
    else navigate(`/projects/template/${slug}`, { state: { previewOnly: true } });
  };

  return (
    <div className="min-h-screen bg-parchment bg-cover bg-center bg-fixed bg-[#fcfbf7]">
      <div className="bg-white/75">
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-['Caveat',cursive] text-stone-900 mb-8">Templates</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="h-9 px-3 rounded-md border bg-white hover:bg-neutral-50"
                aria-label="Close templates"
              >
                Close
              </button>
            )}
          </div>

          <p className="text-center text-stone-700 max-w-2xl mx-auto mb-10">
            Start faster with pre-built roadmaps. Customize anything once you’re in the editor.
          </p>

          {/* 4 cards now, will flow to next row on small screens; on md+ you can switch to 4 columns if preferred */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((c) => (
              <div
                key={c.slug}
                className="p-5 rounded-lg bg-stone-100/90 border-2 border-stone-800 shadow-[4px_4px_0_0] shadow-stone-800 hover:bg-stone-200/90 transition"
              >
                <div className="text-4xl">{c.emoji}</div>
                <h3 className="mt-2 text-xl font-semibold text-stone-900">{c.title}</h3>
                <p className="text-stone-700 mb-4">{c.desc}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUseTemplateClick(c.slug)}
                    className="text-sm underline underline-offset-4 hover:text-stone-900"
                    aria-label={`Use ${c.title} template`}
                  >
                    Use template
                  </button>
                  <button
                    onClick={() => handlePreviewTemplateClick(c.slug)}
                    className="text-sm text-stone-600 hover:text-stone-900"
                    aria-label={`Preview ${c.title} template`}
                    title="Open as preview (no save)"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
