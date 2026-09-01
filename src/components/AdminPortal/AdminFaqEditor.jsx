import React, { useState } from 'react';
import {
  HelpCircle, Plus, Trash2, Edit3, Check, Eye, EyeOff, ArrowUp, ArrowDown, HelpCircle as FaqIcon
} from 'lucide-react';
import { apiSaveFaqItem, apiDeleteSiteImage } from '../../lib/supabase';

export default function AdminFaqEditor({ faqs = [], setFaqs }) {
  const categories = ['Booking', 'Shoot Day', 'Deliverables', 'Pricing & Payments', 'General'];

  // New FAQ Form State
  const [newFaq, setNewFaq] = useState({
    category: 'Booking',
    question: '',
    answer: ''
  });

  // Edit Modal State
  const [editingFaq, setEditingFaq] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const triggerNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;

    const item = {
      id: `faq-${Date.now()}`,
      category: newFaq.category,
      question: newFaq.question,
      answer: newFaq.answer,
      hidden: false
    };

    setFaqs([item, ...faqs]);
    await apiSaveFaqItem(item);
    setNewFaq({ category: 'Booking', question: '', answer: '' });
    triggerNotice();
  };

  const handleUpdateFaq = async (e) => {
    e.preventDefault();
    setFaqs(faqs.map(f => f.id === editingFaq.id ? editingFaq : f));
    await apiSaveFaqItem(editingFaq);
    setEditingFaq(null);
    triggerNotice();
  };

  const handleDeleteFaq = async (id, qText) => {
    if (window.confirm(`Permanently delete FAQ: "${qText}"?`)) {
      setFaqs(faqs.filter(f => f.id !== id));
      await apiDeleteSiteImage(id);
      triggerNotice();
    }
  };

  const handleToggleHideFaq = async (id) => {
    const target = faqs.find(f => f.id === id);
    if (target) {
      const updated = { ...target, hidden: !target.hidden };
      setFaqs(faqs.map(f => f.id === id ? updated : f));
      await apiSaveFaqItem(updated);
      triggerNotice();
    }
  };

  const handleReorderFaq = (id, direction) => {
    const idx = faqs.findIndex(f => f.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;

    const updated = [...faqs];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFaqs(updated);
    triggerNotice();
  };

  return (
    <div className="space-y-8 text-white max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Frequently Asked Questions (FAQ) Manager</h2>
          <p className="text-xs text-stone-400">Add, edit, reorder, hide or delete FAQ questions displayed to website visitors</p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" /> FAQs Updated Live
          </span>
        )}
      </div>

      {/* Add New FAQ Form */}
      <form onSubmit={handleAddFaq} className="bg-[#1C1C1C] rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New FAQ Question & Answer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Question *</label>
            <input
              type="text"
              required
              placeholder="e.g. How far in advance should we book our wedding date?"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Category</label>
            <select
              value={newFaq.category}
              onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs font-medium text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-3">
            <label className="text-[11px] font-bold text-stone-300 uppercase">Answer *</label>
            <textarea
              rows="3"
              required
              placeholder="Provide a helpful detailed response for prospective clients..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#8B0000] hover:bg-[#A61C1C] text-white text-xs font-semibold uppercase tracking-wider">
          Add FAQ Question
        </button>
      </form>

      {/* FAQ List Cards */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold">Active FAQ Items ({faqs.length})</h3>

        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-[#1C1C1C] rounded-2xl border border-stone-800 text-stone-400">
            No FAQ questions configured. Create a new question above.
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="bg-[#1C1C1C] rounded-2xl border border-stone-800 p-5 space-y-3 shadow-lg flex flex-col sm:flex-row items-start justify-between gap-4">
                
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                      {faq.category || 'General'}
                    </span>
                    {faq.hidden && (
                      <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 text-[9px] font-bold uppercase">
                        HIDDEN FROM WEBSITE
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-lg font-bold text-white leading-tight">
                    {faq.question}
                  </h4>

                  <p className="text-xs text-stone-300 font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-2 sm:pt-0">
                  {/* Reorder Buttons */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorderFaq(faq.id, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderFaq(faq.id, 'down')}
                      disabled={idx === faqs.length - 1}
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hide/Unhide Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleHideFaq(faq.id)}
                    className={`p-2 rounded-xl text-xs flex items-center gap-1 ${
                      faq.hidden ? 'bg-red-950/60 text-red-300 border border-red-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                    }`}
                    title={faq.hidden ? 'Show on Website' : 'Hide from Website'}
                  >
                    {faq.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => setEditingFaq(faq)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200"
                    title="Edit FAQ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id, faq.question)}
                    className="p-2 text-red-400 hover:bg-red-950 rounded-xl"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT FAQ MODAL */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleUpdateFaq} className="bg-[#1C1C1C] rounded-3xl p-6 max-w-xl w-full border border-stone-800 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold">Edit FAQ Question</h3>
              <button type="button" onClick={() => setEditingFaq(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Category</label>
                <select
                  value={editingFaq.category || 'Booking'}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-medium text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300 uppercase">Answer</label>
                <textarea
                  rows="4"
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-full bg-[#8B0000] text-white text-xs font-semibold uppercase">
              Save FAQ Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
