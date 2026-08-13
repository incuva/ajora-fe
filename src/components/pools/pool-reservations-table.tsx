"use client";

import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import ListFilterBadge from "@/components/shared/list-filter-badge";
import StatusBadge, {
  type StatusVariant,
} from "@/components/shared/data-table/status-badge";
import TableLoader from "@/components/shared/data-table/table-loader";
import TablePagination from "@/components/shared/data-table/table-pagination";
import { getPoolReservations } from "@/lib/api/admin-pools.service";
import type {
  AdminPoolReservation,
  Pagination,
} from "@/lib/types/admin.types";
import { useToastStore } from "@/stores/toast-store";

interface PoolReservationsTableProps {
  poolId: string;
}

const RESERVATION_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "delivered", label: "Delivered" },
];

/** Reservation status → StatusBadge variant (unknown values fall back to gray). */
const reservationStatusVariant = (status: string): StatusVariant => {
  if (status === "pending") return "processing";
  if (status === "paid") return "paid";
  if (status === "delivered") return "delivered";
  return status as StatusVariant;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

/**
 * Reservations table for a pool → GET /admin/pool/{id}/reservations.
 * Server-paginated with an optional status filter.
 */
const PoolReservationsTable = ({ poolId }: PoolReservationsTableProps) => {
  const { toastError } = useToastStore();
  const [rows, setRows] = useState<AdminPoolReservation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPoolReservations(poolId, {
        page,
        size,
        status: filter === "all" ? undefined : filter,
      });
      setRows(res.data ?? []);
      setPagination(res.pagination ?? null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not load reservations.";
      toastError("Load failed", message);
      setRows([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [poolId, page, size, filter, toastError]);

  useEffect(() => {
    load();
  }, [load]);

  const hasData = rows.length > 0;
  const total = pagination?.totalItems ?? rows.length;

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-bold text-grey-800 font-inter">
          Reservations{pagination ? ` (${pagination.totalItems})` : ""}
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {RESERVATION_FILTERS.map((f) => (
            <ListFilterBadge
              key={f.key}
              active={filter === f.key}
              label={f.label}
              outlined
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableLoader />
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center font-inter">
          <div className="border border-gray-200 p-2 rounded-md">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">
            No reservations yet
          </p>
          <p className="text-sm text-text-sec">
            {filter === "all"
              ? "Reservations will appear here once customers join this pool."
              : "No reservations match this filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 border-collapse">
              <thead>
                <tr className="bg-grey-100 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Slots
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Delivery
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.order_id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm">
                      <span className="font-mono text-xs text-gray-600">
                        {r.order_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {r.fullname}
                        </span>
                        <span className="text-xs text-gray-400">{r.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {r.no_of_slot}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                      ₦{Number(r.reservation_value).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 capitalize">
                      {r.delivery}
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      <StatusBadge status={reservationStatusVariant(r.status)} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            pageSize={size}
            total={total}
            pageSizeOptions={[10, 20, 30]}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setSize(s);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
};

export default PoolReservationsTable;
