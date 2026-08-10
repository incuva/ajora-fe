"use client";

import { useEffect, useState } from "react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import StatusBadge from "@/components/shared/data-table/status-badge";
import {
  getAdminUserById,
  getUserOrders,
} from "@/lib/api/admin-users.service";
import type {
  User,
} from "@/stores/users-table.store";
import type {
  AdminUserDetail,
  AdminUserOrder,
} from "@/lib/types/admin.types";
import { useToastStore } from "@/stores/toast-store";

interface UserDetailsOverlayProps {
  /** The selected row (summary). Its id drives the detail + orders fetch. */
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  /** Toggle suspension; resolves to the user's new is_active state. */
  onSuspend?: (user: User) => Promise<boolean>;
}

/** Read-only labelled field with the underline treatment from the design. */
const DetailRow = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div
    className={`flex flex-col gap-1 border-b border-[#c8c8c2] pb-2 ${className}`}
  >
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-700 font-inter">
      {label}
    </span>
    <span className="text-lg font-medium text-near-black font-inter wrap-break-word">
      {value}
    </span>
  </div>
);

const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const orderStatusVariant = (status: string) => {
  if (status === "pending") return "processing" as const;
  if (status === "paid") return "paid" as const;
  if (status === "delivered") return "delivered" as const;
  return status as never;
};

/**
 * User Details overlay. Fetches the buyer's full profile
 * and order history when opened, and exposes the
 * Suspend / Reactivate action 
 */
const UserDetailsOverlay = ({
  user,
  isOpen,
  onClose,
  onSuspend,
}: UserDetailsOverlayProps) => {
  const { toastError } = useToastStore();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [orders, setOrders] = useState<AdminUserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  // Optimistic local copy of is_active so the badge + button react instantly.
  const [isActive, setIsActive] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!isOpen || !userId) return;
    let active = true;
    setIsLoading(true);
    setDetail(null);
    setOrders([]);
    setIsActive(user?.is_active ?? true);

    Promise.allSettled([
      getAdminUserById(userId),
      getUserOrders(userId, { page: 1, size: 20 }),
    ])
      .then(([detailRes, ordersRes]) => {
        if (!active) return;
        if (detailRes.status === "fulfilled") {
          setDetail(detailRes.value);
          setIsActive(detailRes.value.is_active);
        } else {
          const err = detailRes.reason;
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            (err as Error)?.message ||
            "Could not load this user.";
          toastError("Load failed", message);
        }
        setOrders(
          ordersRes.status === "fulfilled" ? (ordersRes.value.data ?? []) : [],
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const handleSuspend = async () => {
    if (!user || !onSuspend) return;
    setIsSuspending(true);
    try {
      const nowActive = await onSuspend(user);
      setIsActive(nowActive);
    } finally {
      setIsSuspending(false);
    }
  };

  const [firstName, ...rest] = (detail?.fullname ?? user?.fullname ?? "").split(
    " ",
  );
  const lastName = rest.join(" ");

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      {user && (
        <div className="flex flex-col gap-5 p-6">
          <OverlayHeader
            title={detail?.fullname ?? user.fullname}
            subtitle="See user details below"
            onClose={onClose}
          />

          <div>
            <StatusBadge
              status={isActive ? "active" : "suspended"}
              className="px-4 py-1"
            />
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <DetailRow label="First Name" value={firstName || "N/A"} />
            <DetailRow label="Last Name" value={lastName || "N/A"} />
            <DetailRow
              label="Email"
              value={detail?.email ?? "N/A"}
              className="col-span-2"
            />
            <DetailRow
              label="Phone Number"
              value={detail?.phone ?? user.phone ?? "N/A"}
            />
            <DetailRow
              label="Account Type"
              value={
                detail
                  ? String(detail.is_guest) === "true"
                    ? "Guest"
                    : "Registered"
                  : "N/A"
              }
            />
            <DetailRow
              label="Pools Participated"
              value={`${detail?.total_pool_participation ?? user.total_pool_participation} pools`}
            />
            <DetailRow
              label="Total Spent"
              value={`₦${Number(detail?.total_amount_spent ?? user.total_amount_spent).toLocaleString()}`}
            />
            <DetailRow
              label="Account Created On"
              value={formatDate(detail?.created_at ?? user.created_at)}
              className="col-span-2"
            />
          </div>

          {/* Order history */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-grey-800 font-inter">
              Order History{orders.length ? ` (${orders.length})` : ""}
            </h3>

            {isLoading ? (
              <p className="text-sm text-text-sec font-inter py-3">Loading…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-text-sec font-inter py-3">
                No order history to display yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.map((o) => (
                  <div
                    key={o.reservation_id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-input-border p-3"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-semibold text-near-black font-inter truncate">
                        {o.pool_name}
                      </span>
                      <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                        {o.order_id} • {o.no_of_slot} slots • ₦
                        {Number(o.total_amount).toLocaleString()}
                      </span>
                    </div>
                    <StatusBadge
                      status={orderStatusVariant(o.status)}
                      className="shrink-0"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          {onSuspend && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleSuspend}
                disabled={isSuspending}
                className={
                  isActive
                    ? "w-full h-12 rounded-md border border-fail bg-bg text-sm font-semibold font-inter text-fail transition-colors hover:bg-fail-bg disabled:opacity-50"
                    : "w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50"
                }
              >
                {isSuspending
                  ? "Working…"
                  : isActive
                    ? "Suspend Account"
                    : "Reactivate Account"}
              </button>
            </div>
          )}
        </div>
      )}
    </OverlaySheet>
  );
};

export default UserDetailsOverlay;
