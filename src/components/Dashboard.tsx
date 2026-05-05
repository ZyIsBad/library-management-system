import React from 'react';
import { Book, Clock, Users, Calendar } from 'lucide-react';
import { Book as BookType, Member, Loan } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  books: BookType[];
  members: Member[];
  loans: Loan[];
}

const Dashboard: React.FC<DashboardProps> = ({ books, members, loans }) => {
  const stats = [
    { label: 'Total Books', value: books.reduce((acc, b) => acc + b.totalCount, 0).toString(), icon: Book, color: 'bg-red-50 text-red-600' },
    { label: 'Currently Borrowed', value: loans.length.toString(), icon: Clock, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Members', value: members.filter(m => m.status === 'active').length.toString(), icon: Users, color: 'bg-orange-50 text-orange-600' },
    { label: 'Overdue Books', value: loans.filter(l => l.isOverdue).length.toString(), icon: Calendar, color: 'bg-rose-50 text-rose-600' },
  ];

  const popularBooks = [...books].sort((a, b) => b.totalCount - a.totalCount).slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      id="dashboard-view"
    >
      <div className="mb-8 lg:mb-10" id="dashboard-header">
        <h2 className="font-serif text-4xl text-slate-900 mb-2 sm:text-5xl" id="dashboard-title">Library Overview</h2>
        <p className="text-slate-500 text-base font-outfit sm:text-lg" id="dashboard-subtitle">Welcome to your library management system</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8 lg:mb-12" id="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow" id={`stat-${stat.label}`}>
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-800 mb-1">{stat.value}</p>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8" id="activity-popularity-grid">
        <div className="bg-white p-5 sm:p-8 rounded-xl border border-slate-100 shadow-sm" id="recent-activity">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 sm:mb-8">Recent Activity</h3>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex gap-4">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-[#712A2A] shrink-0" />
              <div>
                <p className="text-slate-800 font-semibold leading-tight">System initialized with {books.length} books</p>
                <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">System Log</p>
              </div>
            </div>
            {loans.slice(0, 3).map((loan, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <p className="text-slate-800 font-semibold leading-tight">
                    <span className="font-bold">Borrowed: </span>
                    {loan.bookTitle} by {loan.memberName}
                  </p>
                  <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">{loan.borrowedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-xl border border-slate-100 shadow-sm" id="popular-books">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 sm:mb-8">Popular Books</h3>
          <div className="space-y-6">
            {popularBooks.map((book) => (
              <div key={book.id} className="flex flex-col gap-3 pb-6 border-b border-slate-50 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-lg">{book.title}</h4>
                  <p className="text-slate-500 text-sm">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#1A4D2E] font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">{book.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
