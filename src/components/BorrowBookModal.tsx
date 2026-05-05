import React, { useState } from 'react';
import { X, User, BookOpen, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Member, Book } from '../types';

interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  members: Member[];
  onBorrow: (bookId: string, memberId: string) => void;
}

const BorrowBookModal: React.FC<BorrowBookModalProps> = ({ isOpen, onClose, book, members, onBorrow }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const activeMembers = members.filter(m => m.status === 'active');
  const filteredMembers = activeMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const handleClose = () => {
    onClose();
    setSearchTerm('');
    setSelectedMemberId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (book && selectedMemberId) {
      onBorrow(book.id, selectedMemberId);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && book && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto px-4 py-6 sm:flex sm:items-center sm:justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="mx-auto w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 sm:p-8 sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`w-10 h-10 ${book.color} rounded-lg flex items-center justify-center text-white`}>
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">Borrow Book</h2>
                  <p className="text-slate-500 text-xs mt-0.5 font-bold uppercase tracking-wider">{book.title}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-6 sm:p-8">
              <div className="space-y-3 font-outfit text-slate-600 bg-[#F1F5F9] p-4 rounded-xl border border-slate-200">
                <div className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-slate-400 px-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>Loan Duration</span>
                  <span className="text-[#712A2A]">14 Days Standard</span>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  This item must be returned by <span className="font-bold text-[#712A2A]">{dueDate}</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Member</label>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{filteredMembers.length} active found</span>
                </div>
                
                {/* Search Input */}
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#712A2A] transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#712A2A]/20 focus:border-[#712A2A] transition-all text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredMembers.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                        selectedMemberId === member.id 
                        ? 'border-[#712A2A] bg-red-50/50 ring-1 ring-[#712A2A]' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm shrink-0">
                        {member.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{member.name}</p>
                        <p className="text-slate-500 text-xs truncate">{member.email}</p>
                      </div>
                    </button>
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <User className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-slate-500 text-sm font-medium">No members match your search.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedMemberId}
                  className="w-full bg-[#712A2A] disabled:bg-slate-300 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#5d2222] transition-all transform active:scale-95"
                >
                  Confirm Loan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BorrowBookModal;
