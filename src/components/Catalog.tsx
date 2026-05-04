import React, { useState } from 'react';
import { Search, Filter, BookIcon, Plus, HandIcon, Edit3 } from 'lucide-react';
import { Book, Member } from '../types';
import { motion } from 'motion/react';
import AddBookModal from './AddBookModal';
import BorrowBookModal from './BorrowBookModal';
import EditBookModal from './EditBookModal';

interface CatalogProps {
  books: Book[];
  members: Member[];
  onBorrow: (bookId: string, memberId: string) => void;
  onAddBook: (book: Omit<Book, 'id' | 'availableCount' | 'color'>) => void;
  onUpdateBook: (id: string, updatedFields: Partial<Book>) => void;
  onDeleteBook: (id: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ books, members, onBorrow, onAddBook, onUpdateBook, onDeleteBook }) => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleBorrowInitiate = (book: Book) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  const handleEditInitiate = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation();
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-8 max-w-7xl mx-auto"
      id="catalog-view"
    >
      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={onAddBook} 
      />

      <EditBookModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        book={selectedBook} 
        onUpdate={onUpdateBook}
        onDelete={onDeleteBook}
      />

      <BorrowBookModal 
        isOpen={isBorrowModalOpen} 
        onClose={() => setIsBorrowModalOpen(false)} 
        book={selectedBook} 
        members={members} 
        onBorrow={onBorrow} 
      />

      <div className="flex justify-between items-end mb-10" id="catalog-header">
        <div>
          <h2 className="font-serif text-5xl text-slate-900 mb-2" id="catalog-title">Book Catalog</h2>
          <p className="text-slate-500 text-lg font-outfit" id="catalog-subtitle">Browse and manage your library collection</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#712A2A] text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-900/10 hover:bg-[#5d2222] transition-colors"
        >
          <Plus size={20} />
          <span>Add Book</span>
        </button>
      </div>

      <div className="flex gap-4 mb-10" id="catalog-filters">
        <div className="relative flex-1" id="search-container">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-14 pr-4 py-4 bg-[#F2ECE4] border-none rounded-xl focus:ring-2 focus:ring-[#712A2A] text-slate-700 font-medium transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="book-search"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-[#F2ECE4] border-none rounded-xl text-slate-700 font-bold hover:bg-[#EAE2D8] transition-colors" id="filter-button">
          <Filter size={20} />
          <span>All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="books-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group" id={`book-card-${book.id}`}>
            <div className={`${book.color} h-44 flex items-center justify-center text-white/90 relative overflow-hidden`} id={`book-cover-${book.id}`}>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              <div className="relative z-10 border-2 border-white/20 rounded-xl p-5 bg-white/5 backdrop-blur-md group-hover:scale-90 transition-transform duration-500">
                <BookIcon size={52} strokeWidth={1.5} />
              </div>

              {/* Edit Button - Top Right */}
              <button 
                onClick={(e) => handleEditInitiate(e, book)}
                className="absolute top-4 right-4 z-30 p-2 bg-white/20 backdrop-blur-md text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900"
              >
                <Edit3 size={18} />
              </button>
              
              {/* Overlay Borrow Button on Hover */}
              <div className="absolute inset-0 bg-[#712A2A]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-20">
                {book.availableCount > 0 ? (
                  <button 
                    onClick={() => handleBorrowInitiate(book)}
                    className="bg-white text-[#712A2A] px-6 py-3 rounded-xl font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform flex items-center gap-2"
                  >
                    <HandIcon size={18} />
                    Borrow Now
                  </button>
                ) : (
                  <span className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl">Out of Stock</span>
                )}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col" id={`book-details-${book.id}`}>
              <h3 className="font-bold text-slate-900 text-xl mb-1 leading-tight group-hover:text-[#712A2A] transition-colors">{book.title}</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium capitalize">{book.author}</p>
              <div className="mt-auto flex flex-col gap-4" id={`book-meta-${book.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{book.genre}</span>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${book.availableCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {book.availableCount > 0 ? `${book.availableCount} available` : 'Unavailable'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1">Total: {book.totalCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Catalog;
