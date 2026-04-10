"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ListFilterBadge from "@/components/shared/list-filter-badge";
import TableLoader from "../shared/data-table/table-loader";
import TablePagination from "../shared/data-table/table-pagination";
import { Items } from "@/stores/items-table.store";
import Image from "next/image";
import { Edit24Regular } from "@fluentui/react-icons";

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
      {filters?.length && (
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
        </div>
      )}

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden ring-1 ring-gray-100 p-3">
        {/* Scrollable wrapper keeps responsiveness on smaller tablets */}
        <div className="overflow-x-auto">
          <div className="w-full min-w-[600px] border-collapse">
            {/* Body */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
              {!isLoading &&
                hasData &&
                data.map((item: Items, id) => {
                  return (
                    <div
                      key={id}
                      className="w-full min-w-80 h-80 rounded-md bg-white flex flex-col"
                    >
                      <div className="h-3/5 flex-1 relative">
                        <div className="absolute top-2 left-2">
                          <ListFilterBadge label={item.category} active={true} onClick={() => {}}/>
                        </div>
                        <Image
                          src={item.img}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover rounded-t-md"
                          loading="eager"
                        />
                      </div>
                      <div className="px-4 pb-6 pt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <p className="font-playfair text-lg text-green font-medium">
                            {item.name}
                          </p>
                          <Edit24Regular />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col font-inter">
                            <p className="text-xs text-grey-500">
                              MARKET PRICE
                            </p>
                            <p className="text-lg font-playfair text-gold-800 font-medium">
                              ₦{item.price}
                            </p>
                          </div>
                          <div className="flex flex-col items-end font-inter">
                            <p className="text-xs text-grey-500">
                              ACTIVE POOLS
                            </p>
                            <p className="text-lg text-grey-800 font-bold">
                              {item.activePools}
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
