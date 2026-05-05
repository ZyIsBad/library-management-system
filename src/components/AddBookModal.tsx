import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: { title: string; author: string; genre: string; totalCount: number }) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    totalCount: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({ title: '', author: '', genre: 'Fiction', totalCount: 1 });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto px-4 py-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 sm:p-8 sm:items-center">
              <div className="min-w-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Add New Book</h2>
                <p className="text-slate-500 text-sm mt-1 font-outfit">Add a new resource to your library catalog</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 sm:p-8">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Book Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                  placeholder="e.g. The Great Gatsby"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Author</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Genre</label>
                  <select
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700 appearance-none font-outfit"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Science Fiction</option>
                    <option>Fantasy</option>
                    <option>History</option>
                    <option>Biography</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Initial Stock</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                    value={formData.totalCount}
                    onChange={(e) => setFormData({ ...formData, totalCount: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#712A2A] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#5d2222] transition-all transform active:scale-95"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddBookModal;
