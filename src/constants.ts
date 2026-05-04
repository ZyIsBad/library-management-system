import { Book, Member, Loan, Activity } from './types';

export const MOCK_BOOKS: Book[] = [
  { id: '1', title: 'Advanced Calculus', author: 'Dr. Maria Santos', genre: 'Mathematics', availableCount: 2, totalCount: 5, color: 'bg-indigo-800' },
  { id: '2', title: 'Physics for Scientists', author: 'John R. Taylor', genre: 'Science', availableCount: 1, totalCount: 3, color: 'bg-slate-900' },
  { id: '3', title: 'Organic Chemistry', author: 'David Klein', genre: 'Science', availableCount: 3, totalCount: 4, color: 'bg-emerald-900' },
  { id: '4', title: 'World History Volume I', author: 'Susan Wise Bauer', genre: 'History', availableCount: 2, totalCount: 2, color: 'bg-amber-700' },
  { id: '5', title: 'English Literature', author: 'Robert Barnard', genre: 'Literature', availableCount: 0, totalCount: 2, color: 'bg-red-900' },
  { id: '6', title: 'Life Sciences', author: 'Campbell & Reece', genre: 'Biology', availableCount: 2, totalCount: 3, color: 'bg-blue-700' },
  { id: '7', title: 'Macroeconomics', author: 'N. Gregory Mankiw', genre: 'Economics', availableCount: 4, totalCount: 5, color: 'bg-green-800' },
  { id: '8', title: 'Introduction to Psychology', author: 'Wayne Weiten', genre: 'Psychology', availableCount: 3, totalCount: 3, color: 'bg-teal-700' },
  { id: '9', title: 'Civil Engineering', author: 'Robert Falon', genre: 'Engineering', availableCount: 1, totalCount: 2, color: 'bg-slate-700' },
  { id: '10', title: 'Philosophy 101', author: 'Paul Kleinman', genre: 'Philosophy', availableCount: 2, totalCount: 2, color: 'bg-violet-700' },
  { id: '11', title: 'Modern Statistics', author: 'David Sullivan', genre: 'Mathematics', availableCount: 2, totalCount: 4, color: 'bg-yellow-800' },
  { id: '12', title: 'Geography & Earth Science', author: 'H.J. De Blij', genre: 'Earth Science', availableCount: 3, totalCount: 5, color: 'bg-cyan-800' },
];

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567', joinedDate: 'Jan 15, 2024', status: 'active', borrowedCount: 2 },
  { id: '2', name: 'Michael Chen', email: 'mchen@email.com', phone: '(555) 234-5678', joinedDate: 'Feb 3, 2024', status: 'active', borrowedCount: 1 },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789', joinedDate: 'Mar 12, 2024', status: 'active', borrowedCount: 3 },
  { id: '4', name: 'James Wilson', email: 'jwilson@email.com', phone: '(555) 456-7890', joinedDate: 'Jan 28, 2024', status: 'active', borrowedCount: 1 },
  { id: '5', name: 'Lisa Anderson', email: 'l.anderson@email.com', phone: '(555) 567-8901', joinedDate: 'Dec 5, 2023', status: 'inactive', borrowedCount: 0 },
  { id: '6', name: 'David Park', email: 'dpark@email.com', phone: '(555) 678-9012', joinedDate: 'Feb 20, 2024', status: 'active', borrowedCount: 2 },
];

export const MOCK_LOANS: Loan[] = [
  { id: 'L1', bookTitle: 'Advanced Calculus', author: 'Dr. Maria Santos', memberName: 'Sarah Johnson', borrowedDate: 'Apr 1, 2026', dueDate: 'Apr 15, 2026', isOverdue: true },
  { id: 'L2', bookTitle: 'Physics for Scientists', author: 'John R. Taylor', memberName: 'Sarah Johnson', borrowedDate: 'Mar 28, 2026', dueDate: 'Apr 11, 2026', isOverdue: true },
  { id: 'L3', bookTitle: 'Organic Chemistry', author: 'David Klein', memberName: 'Michael Chen', borrowedDate: 'Apr 8, 2026', dueDate: 'Apr 22, 2026', isOverdue: false },
  { id: 'L4', bookTitle: 'World History Volume I', author: 'Susan Wise Bauer', memberName: 'Emily Rodriguez', borrowedDate: 'Apr 5, 2026', dueDate: 'Apr 19, 2026', isOverdue: false },
  { id: 'L5', bookTitle: 'Macroeconomics', author: 'N. Gregory Mankiw', memberName: 'David Park', borrowedDate: 'Apr 10, 2026', dueDate: 'Apr 24, 2026', isOverdue: false },
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 'A1', type: 'borrowed', item: 'Advanced Calculus', user: 'Sarah Johnson', time: '2 hours ago' },
  { id: 'A2', type: 'returned', item: 'Physics for Scientists', user: 'Michael Chen', time: '5 hours ago' },
  { id: 'A3', type: 'new_member', item: 'Emily Rodriguez joined', user: '', time: '1 day ago' },
  { id: 'A4', type: 'borrowed', item: 'World History Volume I', user: 'James Wilson', time: '2 days ago' },
];
