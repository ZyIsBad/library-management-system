import { useState, useEffect } from 'react';
import { View, Book, Member, Loan } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import BorrowedBooks from './components/BorrowedBooks';
import Members from './components/Members';
import LoginPage from './components/LoginPage';
import { AnimatePresence } from 'motion/react';
import { MOCK_BOOKS, MOCK_MEMBERS, MOCK_LOANS } from './constants';
import { Menu } from 'lucide-react';

const STORAGE_KEYS = {
  books: 'lib_books',
  members: 'lib_members',
  loans: 'lib_loans',
};

const loadStoredData = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
};

const formatDisplayDate = (date: Date) => date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const isLoanOverdue = (dueDate: string) => {
  const dueTime = new Date(dueDate).getTime();
  return Number.isFinite(dueTime) && dueTime < new Date().setHours(0, 0, 0, 0);
};

const bookColors = [
  'bg-indigo-800',
  'bg-slate-900',
  'bg-emerald-900',
  'bg-amber-700',
  'bg-red-900',
  'bg-blue-700',
  'bg-green-800',
  'bg-teal-700',
  'bg-violet-700',
  'bg-cyan-800',
];

const normalizeBook = (book: any): Book => ({
  id: String(book.id),
  title: book.title,
  author: book.author,
  genre: book.genre,
  availableCount: Number(book.availableCount ?? book.available_count ?? book.totalCount ?? book.total_count ?? 0),
  totalCount: Number(book.totalCount ?? book.total_count ?? 0),
  color: book.color || 'bg-slate-900',
});

const normalizeMember = (member: any): Member => ({
  id: String(member.id),
  name: member.name,
  email: member.email,
  phone: member.phone,
  joinedDate: member.joinedDate ?? member.joined_date ?? formatDisplayDate(new Date()),
  status: member.status === 'inactive' ? 'inactive' : 'active',
  borrowedCount: Number(member.borrowedCount ?? member.borrowed_count ?? 0),
  section: member.section,
  yearLevel: member.yearLevel ?? member.year_level,
});

const normalizeLoan = (loan: any): Loan => {
  const dueDate = loan.dueDate ?? loan.due_date;
  return {
    id: String(loan.id),
    bookTitle: loan.bookTitle ?? loan.book_title,
    author: loan.author,
    memberName: loan.memberName ?? loan.member_name,
    borrowedDate: loan.borrowedDate ?? loan.borrowed_date,
    dueDate,
    isOverdue: Boolean(loan.isOverdue ?? loan.is_overdue ?? isLoanOverdue(dueDate)),
  };
};

const persistData = (books: Book[], members: Member[], loans: Loan[]) => {
  localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(books));
  localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(members));
  localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('lib_isLoggedIn') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [books, setBooks] = useState<Book[]>(() => loadStoredData(STORAGE_KEYS.books, MOCK_BOOKS));
  const [members, setMembers] = useState<Member[]>(() => loadStoredData(STORAGE_KEYS.members, MOCK_MEMBERS));
  const [loans, setLoans] = useState<Loan[]>(() => loadStoredData(STORAGE_KEYS.loans, MOCK_LOANS).map(loan => ({
    ...loan,
    isOverdue: isLoanOverdue(loan.dueDate),
  })));
  const todayLabel = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksRes, membersRes, loansRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/members'),
          fetch('/api/loans'),
        ]);

        if (!booksRes.ok || !membersRes.ok || !loansRes.ok) return;

        const [apiBooks, apiMembers, apiLoans] = await Promise.all([
          booksRes.json(),
          membersRes.json(),
          loansRes.json(),
        ]);

        setBooks(apiBooks.map(normalizeBook));
        setMembers(apiMembers.map(normalizeMember));
        setLoans(apiLoans.map(normalizeLoan));
      } catch (error) {
        console.error('Failed to load library data', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('lib_isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    persistData(books, members, loans);
  }, [books, members, loans]);

  const handleAddMember = async (newMember: Omit<Member, 'id' | 'joinedDate' | 'borrowedCount' | 'status'>) => {
    const member: Member = {
      ...newMember,
      id: crypto.randomUUID(),
      joinedDate: formatDisplayDate(new Date()),
      status: 'active',
      borrowedCount: 0
    };

    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });

      if (res.ok) {
        const createdMember = normalizeMember(await res.json());
        setMembers(prev => [createdMember, ...prev]);
        return;
      }
    } catch (error) {
      console.info('Using local member storage because API is unavailable.', error);
    }

    setMembers([member, ...members]);
  };

  const handleUpdateMember = async (id: string, updatedFields: Partial<Member>) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const updatedMember = { ...member, ...updatedFields };
    setMembers(prev => prev.map(m => m.id === id ? updatedMember : m));

    try {
      await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember),
      });
    } catch (error) {
      console.info('Member update saved locally only.', error);
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const member = members.find(m => m.id === id);
      setMembers(prev => prev.filter(m => m.id !== id));
      if (member) {
        setLoans(prev => prev.filter(loan => loan.memberName !== member.name));
      }
      try {
        await fetch(`/api/members/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.info('Member deleted locally only.', error);
      }
    }
  };

  const handleAddBook = async (newBook: Omit<Book, 'id' | 'availableCount' | 'color'>) => {
    const book: Book = {
      ...newBook,
      id: crypto.randomUUID(),
      availableCount: newBook.totalCount,
      color: bookColors[books.length % bookColors.length],
    };

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });

      if (res.ok) {
        const createdBook = normalizeBook(await res.json());
        setBooks(prev => [createdBook, ...prev]);
        return;
      }
    } catch (error) {
      console.info('Using local book storage because API is unavailable.', error);
    }

    setBooks(prev => [book, ...prev]);
  };

  const handleUpdateBook = async (id: string, updatedFields: Partial<Book>) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    const updatedBook = { ...book, ...updatedFields };
    setBooks(prev => prev.map(item => item.id === id ? updatedBook : item));

    try {
      await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });
    } catch (error) {
      console.info('Book update saved locally only.', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const book = books.find(b => b.id === id);
      setBooks(prev => prev.filter(book => book.id !== id));
      if (book) {
        setLoans(prev => prev.filter(loan => loan.bookTitle !== book.title));
      }
      try {
        await fetch(`/api/books/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.info('Book deleted locally only.', error);
      }
    }
  };

  const handleBorrowBook = async (bookId: string, memberId: string) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);
    if (!book || !member || book.availableCount <= 0) return;

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, memberId }),
      });

      if (res.ok) {
        const newLoan = normalizeLoan(await res.json());
        setLoans(prev => [newLoan, ...prev]);
        setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCount: Math.max(0, b.availableCount - 1) } : b));
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, borrowedCount: m.borrowedCount + 1 } : m));
        return;
      }
    } catch (error) {
      console.info('Loan saved locally because API is unavailable.', error);
    }

    const borrowedDate = formatDisplayDate(new Date());
    const dueDate = formatDisplayDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      bookTitle: book.title,
      author: book.author,
      memberName: member.name,
      borrowedDate,
      dueDate,
      isOverdue: false,
    };
    setLoans(prev => [newLoan, ...prev]);
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCount: Math.max(0, b.availableCount - 1) } : b));
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, borrowedCount: m.borrowedCount + 1 } : m));
  };

  const handleReturnBook = async (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    setBooks(prev => prev.map(b => 
      b.title === loan.bookTitle ? { ...b, availableCount: b.availableCount + 1 } : b
    ));
    setMembers(prev => prev.map(m => 
      m.name === loan.memberName ? { ...m, borrowedCount: Math.max(0, m.borrowedCount - 1) } : m
    ));
    setLoans(prev => prev.filter(l => l.id !== loanId));

    try {
      await fetch(`/api/loans/${loanId}`, { method: 'DELETE' });
    } catch (error) {
      console.info('Loan returned locally only.', error);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': 
        return <Dashboard books={books} members={members} loans={loans} />;
      case 'catalog': 
        return <Catalog 
          books={books} 
          members={members} 
          onBorrow={handleBorrowBook} 
          onAddBook={handleAddBook}
          onUpdateBook={handleUpdateBook}
          onDeleteBook={handleDeleteBook}
        />;
      case 'borrowed': 
        return <BorrowedBooks loans={loans} onReturn={handleReturnBook} />;
      case 'members': 
        return <Members 
          members={members} 
          onAddMember={handleAddMember} 
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />;
      default: 
        return <Dashboard books={books} members={members} loans={loans} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'catalog': return 'Catalog';
      case 'borrowed': return 'Borrowed Books';
      case 'members': return 'Members';
      default: return 'Library Management';
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F7F5] lg:h-screen lg:flex-row lg:overflow-hidden" id="app-container">
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={() => setIsLoggedIn(false)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 flex flex-col overflow-y-auto" id="main-content">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6" id="page-header">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2ECE4] text-[#000096] transition-colors hover:bg-[#EAE2D8] lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-400 capitalize">{getTitle()}</div>
              <div className="text-xs font-medium text-slate-500 sm:hidden">Today: {todayLabel}</div>
            </div>
          </div>
          <div className="hidden text-sm font-medium text-slate-500 sm:block">Today: {todayLabel}</div>
        </div>
        
        <div className="flex-1" id="view-container">
          <AnimatePresence mode="wait">
            {renderView()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
