export type View = 'dashboard' | 'catalog' | 'borrowed' | 'members';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  availableCount: number;
  totalCount: number;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  borrowedCount: number;
  section?: string;
  yearLevel?: string;
}

export interface Loan {
  id: string;
  bookTitle: string;
  author: string;
  memberName: string;
  borrowedDate: string;
  dueDate: string;
  isOverdue: boolean;
}

export interface Activity {
  id: string;
  type: 'borrowed' | 'returned' | 'new_member';
  item: string;
  user: string;
  time: string;
}
