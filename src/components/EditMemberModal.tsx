import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member } from '../types';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onUpdate: (id: string, updatedFields: Partial<Member>) => void;
  onDelete: (id: string) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, member, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        status: member.status,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      onUpdate(member.id, formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (member) {
      onDelete(member.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && member && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Edit Member</h2>
                <p className="text-slate-500 text-sm mt-1 font-outfit">Update member contact info</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDelete}
                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                  title="Delete Member"
                >
                  <Trash2 size={20} />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 ml-2">
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Member Status</label>
                <select
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#712A2A] outline-none transition-all font-medium text-slate-700 appearance-none font-outfit"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active Member</option>
                  <option value="inactive">Suspended / Inactive</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-slate-900/10 hover:bg-black transition-all transform active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditMemberModal;
