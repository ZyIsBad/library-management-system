import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onUpdate: (id: string, updatedFields: Partial<Book>) => void;
  onDelete: (id: string) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, book, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    totalCount: 0,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        totalCount: book.totalCount,
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (book) {
      const diff = book.totalCount - formData.totalCount;
      onUpdate(book.id, {
        ...formData,
        availableCount: Math.max(0, book.availableCount - diff)
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (book) {
      onDelete(book.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && book && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto px-4 py-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 sm:p-8 sm:items-center">
              <div className="min-w-0">
                <h2 className="text-2xl font-serif font-bold text-slate-900">Edit Resource</h2>
                <p className="text-slate-500 text-sm mt-1 font-outfit">Modify library item details</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDelete}
                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                  title="Delete Book"
                >
                  <Trash2 size={20} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 ml-2">
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 sm:p-8">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Book Title</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#000096] outline-none transition-all font-medium text-slate-700"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Author</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#000096] outline-none transition-all font-medium text-slate-700"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Genre</label>
                  <select
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#000096] outline-none transition-all font-medium text-slate-700 appearance-none font-outfit"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Literature</option>
                    <option>Biology</option>
                    <option>Economics</option>
                    <option>Psychology</option>
                    <option>Engineering</option>
                    <option>Philosophy</option>
                    <option>Earth Science</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Total Stock</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#000096] outline-none transition-all font-medium text-slate-700"
                    value={formData.totalCount}
                    onChange={(e) => setFormData({ ...formData, totalCount: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-slate-900/10 hover:bg-black transition-all transform active:scale-95"
                >
                  Update Information
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditBookModal;
