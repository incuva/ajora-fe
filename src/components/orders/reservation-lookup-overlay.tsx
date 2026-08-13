"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import { FormField, TextInput } from "@/components/shared/form-fields";
import StatusBadge, {
  type StatusVariant,
} from "@/components/shared/data-table/status-badge";
import { getReservationById } from "@/lib/api/marketplace.service";
import type { PoolReservation } from "@/lib/types/marketplace.types";

interface ReservationLookupOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Read-only labelled field with the underline treatment from the design. */
const DetailField = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1 border-b border-gray-200 pb-2 ${className}`}>
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
      {label}
    </span>
    <span className="text-sm font-medium text-near-black font-inter wrap-break-word">
      {value}
    </span>
  </div>
);

/** Map a reservation status to a StatusBadge variant (falls back to gold). */
const reservationStatusVariant = (status: string): StatusVariant => {
  if (status === "confirmed") return "active";
  if (status === "cancelled") return "cancelled";
  return "processing";
};

/**
 * Reservation lookup overlay.
 */
const ReservationLookupOverlay = ({
  isOpen,
  onClose,
}: ReservationLookupOverlayProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [reservation, setReservation] = useState<PoolReservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setQuery("");
    setReservation(null);
    setError(null);
    setIsSearching(false);
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = query.trim();
    if (!id) {
      setError("Enter a reservation or order ID to search.");
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const result = await getReservationById(id);
      setReservation(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "No reservation found for that ID.";
      setReservation(null);
      setError(message);
    } finally {
      setIsSearching(false);
    }
  };

  const total = reservation
    ? reservation.subpools.reduce((sum, s) => sum + s.price * s.quantity, 0)
    : 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  };

  return (
    <OverlaySheet isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-5 p-6">
        <OverlayHeader
          title="Look up Reservation"
          subtitle="Find an order by its Reservation ID or Order ID"
          onClose={handleClose}
        />

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <FormField label="Reservation / Order ID">
            <TextInput
              placeholder="e.g. AJ-0001 or a reservation UUID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </FormField>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Search
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-inter">
            {error}
          </div>
        )}

        {reservation && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                  Order ID
                </span>
                <span className="font-mono text-base font-bold text-near-black">
                  {reservation.order_id || "—"}
                </span>
              </div>
              <StatusBadge
                status={reservationStatusVariant(reservation.status)}
                className="px-4 py-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <DetailField
                label="Reservation ID"
                value={reservation.id}
                className="col-span-2"
              />
              <DetailField
                label="Slots Reserved"
                value={String(reservation.no_of_reservation)}
              />
              <DetailField label="Delivery" value={reservation.delivery} />
              <DetailField
                label="Payment Option"
                value={reservation.payment_option}
              />
              <DetailField
                label="Location"
                value={reservation.location || "N/A"}
              />
              <DetailField
                label="Created On"
                value={formatDate(reservation.created_at)}
              />
              <DetailField
                label="Last Updated"
                value={formatDate(reservation.updated_at)}
              />
            </div>

            {/* Subpool breakdown */}
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-grey-800 font-inter">
                Items ({reservation.subpools.length})
              </h3>
              {reservation.subpools.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {reservation.subpools.map((sub) => (
                    <div
                      key={sub.subpool_id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-input-border p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-near-black font-inter">
                          {sub.name}
                        </span>
                        <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                          {sub.quantity} × ₦{sub.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-near-black font-inter">
                        ₦{(sub.price * sub.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-sec font-inter">
                  No items on this reservation.
                </p>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-semibold text-grey-800 font-inter">
                  Total
                </span>
                <span className="text-base font-bold text-green font-inter">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </OverlaySheet>
  );
};

export default ReservationLookupOverlay;
