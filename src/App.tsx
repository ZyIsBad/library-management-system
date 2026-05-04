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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('lib_isLoggedIn') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksRes, membersRes, loansRes] = await Promise.all([
          fetch('/api/books'),
          fetch('/api/members'),
          fetch('/api/loans'),
        ]);

        if (!booksRes.ok || !membersRes.ok || !loansRes.ok) return;

        setBooks(await booksRes.json());
        setMembers(await membersRes.json());
        setLoans(await loansRes.json());
      } catch (error) {
        console.error('Failed to load library data', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('lib_isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleAddMember = (newMember: Omit<Member, 'id' | 'joinedDate' | 'borrowedCount' | 'status'>) => {
    const member: Member = {
      ...newMember,
      id: Math.random().toString(36).slice(2, 11),
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'active',
      borrowedCount: 0
    };
    setMembers([member, ...members]);
  };

  const handleUpdateMember = (id: string, updatedFields: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddBook = async (newBook: Omit<Book, 'id' | 'availableCount' | 'color'>) => {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook),
  });

  if (!res.ok) {
    console.error('Failed to add book');
    return;
  }

  const createdBook = await res.json();
  setBooks(prev => [createdBook, ...prev]);
};

  const handleUpdateBook = (id: string, updatedFields: Partial<Book>) => {
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updatedFields } : book));
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  const handleBorrowBook = async (bookId: string, memberId: string) => {
    const res = await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, memberId }),
    });

    if (!res.ok) {
      console.error('Failed to borrow book');
      return;
    }

    const newLoan = await res.json();
    setLoans(prev => [newLoan, ...prev]);
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCount: b.availableCount - 1 } : b));
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, borrowedCount: m.borrowedCount + 1 } : m));
  };

  const handleReturnBook = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    setBooks(prev => prev.map(b => 
      b.title === loan.bookTitle ? { ...b, availableCount: b.availableCount + 1 } : b
    ));
    setMembers(prev => prev.map(m => 
      m.name === loan.memberName ? { ...m, borrowedCount: Math.max(0, m.borrowedCount - 1) } : m
    ));
    setLoans(prev => prev.filter(l => l.id !== loanId));
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
    <div className="flex h-screen bg-[#F9F7F5] overflow-hidden" id="app-container">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={() => setIsLoggedIn(false)} />
      
      <main className="flex-1 flex flex-col overflow-y-auto" id="main-content">
        <div className="px-8 pt-6 flex justify-between items-center" id="page-header">
          <div className="text-sm font-medium text-slate-400 capitalize">{getTitle()}</div>
          <div className="text-sm font-medium text-slate-500">Today: April 14, 2026</div>
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
