"use client";

import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import ListFilterBadge from "@/components/shared/list-filter-badge";
import StatusBadge, {
  type StatusVariant,
} from "@/components/shared/data-table/status-badge";
import TableLoader from "@/components/shared/data-table/table-loader";
import TablePagination from "@/components/shared/data-table/table-pagination";
import { getPoolReservations, confirmReservationPayment } from "@/lib/api/admin-pools.service";
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
 * Reservations table for a pool
 * Server-paginated with an optional status filter.
 */
const PoolReservationsTable = ({ poolId }: PoolReservationsTableProps) => {
  const { toastSuccess, toastError } = useToastStore();
  const [rows, setRows] = useState<AdminPoolReservation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState("all");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

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

  /**
   * Confirm an onsite payment.
   */
  const handleMarkPaid = async (r: AdminPoolReservation) => {
    const amount = Number(r.reservation_value);
    if (
      !window.confirm(
        `Mark ${r.fullname}'s onsite payment of ₦${amount.toLocaleString()} as paid?`,
      )
    ) {
      return;
    }
    setMarkingId(r.order_id);
    try {
      await confirmReservationPayment(r.order_id, amount);
      setPaidIds((prev) => new Set(prev).add(r.order_id));
      toastSuccess(
        "Payment confirmed",
        `${r.fullname}'s reservation is now marked as paid.`,
      );
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not confirm the payment. Please try again.";
      toastError("Update failed", message);
    } finally {
      setMarkingId(null);
    }
  };

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
            <table className="w-full min-w-250 border-collapse">
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
                    Subpools
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Payment
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isOnsite = r.payment_option === "onsite";
                  const effectiveStatus = paidIds.has(r.order_id)
                    ? "paid"
                    : r.status;
                  const canMarkPaid =
                    isOnsite && effectiveStatus === "pending";
                  return (
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
                          <span className="text-xs text-gray-400">
                            {r.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        {r.no_of_slot}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        {r.no_of_subpools ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                        ₦{Number(r.reservation_value).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                        <span
                          className={
                            isOnsite
                              ? "inline-flex rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-near-black capitalize"
                              : "inline-flex rounded-full bg-soft-green px-2.5 py-0.5 text-xs font-medium text-green capitalize"
                          }
                        >
                          {r.payment_option || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 capitalize">
                        {r.delivery}
                      </td>
                      <td className="px-4 py-3.5 text-sm">
                        <StatusBadge
                          status={reservationStatusVariant(effectiveStatus)}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-right whitespace-nowrap">
                        {canMarkPaid ? (
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(r)}
                            disabled={markingId === r.order_id}
                            className="inline-flex items-center justify-center rounded-md border border-green bg-bg px-3 py-1.5 text-xs font-semibold text-green transition-colors hover:bg-green/5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {markingId === r.order_id
                              ? "Confirming…"
                              : "Mark as paid"}
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
