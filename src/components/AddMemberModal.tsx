import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: { name: string; email: string; phone: string }) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto px-4 py-6 sm:py-20" id="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
              id="modal-content"
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 sm:p-8 sm:items-center" id="modal-header">
                <div className="min-w-0">
                  <h2 className="text-2xl font-serif font-bold text-slate-900">Add New Member</h2>
                  <p className="text-slate-500 text-sm mt-1 font-outfit">Register a new library member</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-6 sm:p-8" id="add-member-form">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all"
                    placeholder="e.g. (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#712A2A] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#5d2222] transition-colors"
                  >
                    Register Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddMemberModal;
