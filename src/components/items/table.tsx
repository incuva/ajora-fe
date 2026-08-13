"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ListFilterBadge from "@/components/shared/list-filter-badge";
import TableLoader from "../shared/data-table/table-loader";
import TablePagination from "../shared/data-table/table-pagination";
import { Items } from "@/stores/items-table.store";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Edit24Regular, Delete24Regular } from "@fluentui/react-icons";

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

export interface ItemsDataTableProps {
  data: Items[];
  isLoading?: boolean;

  emptyState?: React.ReactNode;

  filters?: DataTableFilter[];
  activeFilter?: string;
  onFilterChange?: (key: string) => void;

  /** Fired when the edit icon on a card is clicked. */
  onEditItem?: (item: Items) => void;
  /** Fired when the delete icon on a card is clicked. */
  onDeleteItem?: (item: Items) => void;

  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  className?: string;
}

function ItemsDataTable({
  data,
  isLoading = false,
  emptyState,
  filters,
  activeFilter = "all",
  onFilterChange,
  onEditItem,
  onDeleteItem,
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
}: ItemsDataTableProps) {
  const hasData = data.length > 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Filter bar */}
      {filters && filters.length ? (
        <div className="flex items-center justify-between gap-3 flex-wrap">
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
        </div>
      ): null}

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden ring-1 ring-gray-100">
        {/* Scrollable wrapper keeps responsiveness on smaller tablets */}
        <div className="overflow-x-auto">
          <div className="w-full md:min-w-150 border-collapse">
            {/* Body */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
              {!isLoading &&
                hasData &&
                data.map((item: Items, id) => {
                  return (
                    <div
                      key={item.id ?? id}
                      className="w-full min-w-80 h-80 rounded-md bg-white flex flex-col ring-1 ring-gray-100"
                    >
                      <Link
                        href={`/auth/admin/items/${item.id}`}
                        aria-label={`View ${item.name}`}
                        className="h-3/5 flex-1 relative bg-neutral-100 block"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover rounded-t-md"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-grey-500">
                            <ImageOff className="w-8 h-8" />
                          </div>
                        )}
                      </Link>
                      <div className="px-4 pb-6 pt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/auth/admin/items/${item.id}`}
                            className="font-playfair text-lg text-green font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              aria-label={`Edit ${item.name}`}
                              onClick={() => onEditItem?.(item)}
                              className="text-grey-800 hover:text-green transition-colors"
                            >
                              <Edit24Regular />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${item.name}`}
                              onClick={() => onDeleteItem?.(item)}
                              className="text-grey-800 hover:text-fail transition-colors"
                            >
                              <Delete24Regular />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex flex-col font-inter min-w-0">
                            <p className="text-xs text-grey-500">DESCRIPTION</p>
                            <p className="text-sm text-grey-800 line-clamp-2">
                              {item.description || "—"}
                            </p>
                          </div>
                          <div className="flex flex-col items-end font-inter shrink-0">
                            <p className="text-xs text-grey-500">UNIT</p>
                            <p className="text-lg text-grey-800 font-bold">
                              {item.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && <TableLoader />}

        {/* Empty state */}
        {!isLoading && !hasData && <div>{emptyState ?? <DefaultEmpty />}</div>}

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

export default ItemsDataTable;
