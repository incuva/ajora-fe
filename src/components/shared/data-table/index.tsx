"use client";

import React from "react";
import { cn } from "@/lib/utils";
import TableLoader from "./table-loader";
import TablePagination from "./table-pagination";
import ListFilterBadge from "@/components/shared/list-filter-badge";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  /** Tailwind width class, e.g. "w-48" or "w-1/4" */
  width?: string;
  align?: "left" | "center" | "right";
  render: (row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableFilter {
  key: string;
  label: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  keyField?: keyof T;

  emptyState?: React.ReactNode;

  filters?: DataTableFilter[];
  activeFilter?: string;
  onFilterChange?: (key: string) => void;
  headerRight?: React.ReactNode;

  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  className?: string;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  keyField,
  emptyState,
  filters,
  activeFilter = "all",
  onFilterChange,
  headerRight,
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
}: DataTableProps<T>) {
  const hasData = data.length > 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Filter bar */}
      {(filters?.length || headerRight) && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {filters?.length ? (
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <ListFilterBadge
                  key={f.key}
                  active={activeFilter === f.key}
                  label={f.label}
                  onClick={() => onFilterChange?.(f.key)}
                />
              ))}
            </div>
          ) : (
            <div />
          )}
          {headerRight && (
            <div className="flex items-center">{headerRight}</div>
          )}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100">
        {/* Scrollable wrapper keeps responsiveness on smaller tablets */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            {/* Head */}
            <thead>
              <tr className="bg-grey-100 border-b border-gray-100">
                {/* Row-number column */}
                <th className="w-10 px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wide select-none" />
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap",
                      col.width,
                      alignClass[col.align ?? "left"]
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {!isLoading && hasData &&
                data.map((row, rowIdx) => {
                  const rowKey = keyField
                    ? String((row as Record<string, unknown>)[keyField as string])
                    : rowIdx;
                  const rowNum = String(
                    (page - 1) * pageSize + rowIdx + 1
                  ).padStart(2, "0");

                  return (
                    <tr
                      key={rowKey}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Row number */}
                      <td className="px-4 py-3.5 text-sm text-gray-400 font-medium select-none w-10">
                        {rowNum}
                      </td>

                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-4 py-3.5 text-sm text-gray-700",
                            col.width,
                            alignClass[col.align ?? "left"]
                          )}
                        >
                          {col.render(row, rowIdx)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Loading state */}
        {isLoading && <TableLoader />}

        {/* Empty state */}
        {!isLoading && !hasData && (
          <div>{emptyState ?? <DefaultEmpty />}</div>
        )}

        {/* Pagination */}
        {!isLoading && hasData && (
          <div className="px-4 pb-3">
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              pageSizeOptions={pageSizeOptions}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback empty state
const DefaultEmpty = () => (
  <div className="flex flex-col items-center justify-center min-h-[35vh] gap-2 text-gray-400 font-inter">
    <p className="text-base font-semibold text-gray-600">No data found</p>
    <p className="text-sm">Try adjusting your filters.</p>
  </div>
);

export default DataTable;
