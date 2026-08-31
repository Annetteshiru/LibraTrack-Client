import { api } from './api';

export const reportsService = {
  getSummary: () => api.get<{
    totalBooks: number; totalMembers: number;
    totalCopies?: number; availableBooks?: number; availableCopies?: number;
    borrowedBooks?: number; reservedBooks?: number;
    activeBorrows: number; overdueCount: number; unpaidFinesTotal: number;
    pendingReservations?: number;
  }>('/reports/summary/'),
  getInventory: () => api.get('/reports/inventory/'),
  getBorrowing: () => api.get('/reports/borrowing/'),
  getOverdue: () => api.get('/reports/overdue/'),
  getFines: () => api.get('/reports/fines/'),
  getMembers: () => api.get('/reports/members/'),
  getPopularBooks: () => api.get('/reports/popular-books/'),
  getActiveBorrows: (params: { page?: number; limit?: number; q?: string }) =>
    api.get('/reports/active-borrows/', { params }),
  export: (type: 'csv', report: string) =>
    api.post('/reports/export', { type, report }, { responseType: 'blob' }),
};

export interface ActiveBorrowRow {
  itemId: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
  bookCoverUrl: string | null;
  memberId: number;
  memberName: string;
  membershipNumber: string;
  borrowedAt: string;
  dueDate: string;
  status: 'ACTIVE' | 'OVERDUE' | 'RETURNED';
}
