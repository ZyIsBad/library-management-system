import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Loan } from '../types';
import { motion } from 'motion/react';

interface BorrowedBooksProps {
  loans: Loan[];
  onReturn: (loanId: string) => void;
}

const BorrowedBooks: React.FC<BorrowedBooksProps> = ({ loans, onReturn }) => {
  const [search, setSearch] = useState('');

  const filteredLoans = loans.filter(l => 
    l.bookTitle.toLowerCase().includes(search.toLowerCase()) || 
    l.memberName.toLowerCase().includes(search.toLowerCase())
  );

  const overdue = filteredLoans.filter(loan => loan.isOverdue);
  const active = filteredLoans.filter(loan => !loan.isOverdue);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      id="borrowed-view"
    >
      <div className="mb-8 lg:mb-10" id="borrowed-header">
        <h2 className="font-serif text-4xl text-slate-900 mb-2 sm:text-5xl" id="borrowed-title">Borrowed Books</h2>
        <p className="text-slate-500 text-base font-outfit sm:text-lg" id="borrowed-subtitle">Track and manage book loans</p>
      </div>

      <div className="mb-8 lg:mb-10" id="borrowed-search-container">
        <div className="relative max-w-full" id="loan-search-wrapper">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by book or member..."
            className="w-full pl-12 pr-4 py-4 bg-[#F2ECE4] border-none rounded-xl focus:ring-2 focus:ring-[#000096] text-slate-700 font-medium transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="loan-search"
          />
        </div>
      </div>

      <div className="space-y-8 lg:space-y-12" id="loans-sections">
        {/* Overdue Section */}
        <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-4 sm:p-6 lg:p-8" id="overdue-section">
          <div className="flex items-center gap-2 mb-6 text-rose-800 sm:mb-8" id="overdue-label">
            <AlertCircle size={20} />
            <h3 className="font-serif text-2xl lowercase italic">Overdue Books <span className="font-sans not-italic text-lg font-bold">({overdue.length})</span></h3>
          </div>
          <div className="space-y-6" id="overdue-list">
            {overdue.map((loan) => (
              <div key={loan.id} className="bg-white border border-rose-100/50 rounded-xl p-5 sm:p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow lg:flex-row lg:items-center lg:justify-between" id={`loan-${loan.id}`}>
                <div className="min-w-0">
                  <h4 className="font-serif text-2xl text-slate-900 mb-2 sm:text-3xl">{loan.bookTitle}</h4>
                  <p className="text-slate-500 text-base mb-6 font-medium">{loan.author}</p>
                  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8" id={`loan-info-${loan.id}`}>
                    <span className="text-slate-600">Borrowed by: <span className="font-bold text-slate-900">{loan.memberName}</span></span>
                    <span className="text-slate-600">Borrowed: <span className="font-bold text-slate-900">{loan.borrowedDate}</span></span>
                    <span className="text-rose-600 font-bold">Due: {loan.dueDate}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onReturn(loan.id)}
                  className="w-full bg-[#1A4D2E] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-teal-900/10 hover:bg-[#143d24] transition-all transform active:scale-95 sm:w-auto" 
                  id={`return-btn-overdue-${loan.id}`}
                >
                  Mark Returned
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Section */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8" id="active-section">
          <div className="flex items-center gap-2 mb-6 text-emerald-800 sm:mb-8" id="active-label">
            <CheckCircle2 size={20} />
            <h3 className="font-serif text-2xl lowercase italic">Active Loans <span className="font-sans not-italic text-lg font-bold">({active.length})</span></h3>
          </div>
          <div className="space-y-6" id="active-list">
            {active.map((loan) => (
              <div key={loan.id} className="bg-white border border-slate-100 rounded-xl p-5 sm:p-8 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow lg:flex-row lg:items-center lg:justify-between" id={`loan-${loan.id}`}>
                <div className="min-w-0">
                  <h4 className="font-serif text-2xl text-slate-900 mb-2 sm:text-3xl">{loan.bookTitle}</h4>
                  <p className="text-slate-500 text-base mb-6 font-medium">{loan.author}</p>
                  <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8" id={`loan-info-${loan.id}`}>
                    <span className="text-slate-600">Borrowed by: <span className="font-bold text-slate-900">{loan.memberName}</span></span>
                    <span className="text-slate-600">Borrowed: <span className="font-bold text-slate-900">{loan.borrowedDate}</span></span>
                    <span className="text-slate-600">Due: <span className="font-bold text-slate-900">{loan.dueDate}</span></span>
                  </div>
                </div>
                <button 
                  onClick={() => onReturn(loan.id)}
                  className="w-full bg-[#1A4D2E] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-teal-900/10 hover:bg-[#143d24] transition-all transform active:scale-95 sm:w-auto" 
                  id={`return-btn-active-${loan.id}`}
                >
                  Mark Returned
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BorrowedBooks;
