import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reportsService, type ActiveBorrowRow } from '@/services/reports.service';
import { QUERY_KEYS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';
import ExportButton from '@/components/ExportButton';
import { BookThumb, MemberAvatar } from '@/components/CatalogVisuals';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, ArrowLeftRight } from 'lucide-react';

const statusVariant: Record<ActiveBorrowRow['status'], 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  RETURNED: 'secondary',
  OVERDUE: 'destructive',
};

const statusLabel: Record<ActiveBorrowRow['status'], string> = {
  ACTIVE: 'Active',
  RETURNED: 'Returned',
  OVERDUE: 'Overdue',
};

export default function ActiveBorrowsReportPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.reports.activeBorrows, page, q],
    queryFn: () => reportsService.getActiveBorrows({ page, limit: 20, q: q || undefined }),
  });

  const rows = (data?.data as { data?: ActiveBorrowRow[] })?.data ?? [];
  const meta = (data?.data as { meta?: { totalPages?: number; total?: number } })?.meta;

  const columns = [
    {
      key: 'book',
      header: 'Book',
      sortValue: (r: ActiveBorrowRow) => r.bookTitle,
      className: 'min-w-[18rem]',
      render: (r: ActiveBorrowRow) => (
        <div className="flex items-center gap-3">
          <BookThumb book={{ coverUrl: r.bookCoverUrl ?? undefined }} />
          <div className="min-w-0">
            <p className="truncate font-medium text-text-primary">{r.bookTitle}</p>
            <p className="truncate text-xs text-text-secondary">{r.bookAuthor}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'member',
      header: 'Borrower',
      sortValue: (r: ActiveBorrowRow) => r.memberName,
      className: 'min-w-[14rem]',
      render: (r: ActiveBorrowRow) => (
        <div className="flex items-center gap-3">
          <MemberAvatar name={r.memberName} />
          <div className="min-w-0">
            <p className="truncate font-medium text-text-primary">{r.memberName}</p>
            <p className="truncate text-xs text-text-secondary">{r.membershipNumber}</p>
          </div>
        </div>
      ),
    },
    { key: 'borrowedAt', header: 'Borrowed', sortValue: (r: ActiveBorrowRow) => r.borrowedAt, render: (r: ActiveBorrowRow) => <span className="text-sm text-text-secondary">{formatDate(r.borrowedAt)}</span> },
    { key: 'dueDate', header: 'Due', sortValue: (r: ActiveBorrowRow) => r.dueDate, render: (r: ActiveBorrowRow) => <span className="text-sm text-text-secondary">{formatDate(r.dueDate)}</span> },
    { key: 'status', header: 'Status', sortValue: (r: ActiveBorrowRow) => r.status, render: (r: ActiveBorrowRow) => <Badge variant={statusVariant[r.status]}>{statusLabel[r.status]}</Badge> },
  ];

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-1 gap-1.5 text-text-secondary" onClick={() => navigate('/reports')}>
            <ArrowLeft size={15} /> Back to Reports
          </Button>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-text-primary">
            <ArrowLeftRight size={22} className="text-accent" /> Book Borrowing Report
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {meta?.total ?? rows.length} borrow record{(meta?.total ?? rows.length) === 1 ? '' : 's'} found.
          </p>
        </div>
        <ExportButton report="active-borrows" label="Export CSV" />
      </div>

      <Card className="py-0">
        <CardHeader className="border-b border-border bg-surface-hover/40 py-4">
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Input
            placeholder="Search by book title, member name, or membership number…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="max-w-sm"
          />
          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            page={page}
            totalPages={meta?.totalPages}
            onPageChange={setPage}
            emptyMessage="No borrowing records found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
