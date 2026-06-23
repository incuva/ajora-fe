import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

/** Build the visible page-number list with ellipsis */
function getPageNumbers(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "…")[] = [1];

  if (current > 3) items.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) items.push(i);

  if (current < totalPages - 2) items.push("…");

  items.push(totalPages);

  return items;
}

const TablePagination = ({
  page,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-2 pt-3 pb-1 border-t border-gray-100 mt-1">
      {/* Items per page */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-gray-600 whitespace-nowrap font-inter">
          Items per page
        </span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green/20 font-inter"
            aria-label="Items per page"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <ChevronLeft className="w-3.5 h-3.5 text-gray-500 -rotate-90" />
          </div>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* ← Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((num, idx) =>
          num === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num as number)}
              aria-label={`Page ${num}`}
              aria-current={page === num ? "page" : undefined}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === num
                  ? "bg-grey text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {num}
            </button>
          )
        )}

        {/* → Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
