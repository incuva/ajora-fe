"use client";

import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import StatusBadge from "@/components/shared/data-table/status-badge";
import type { User } from "@/stores/users-table.store";

interface UserDetailsOverlayProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend?: (user: User) => void;
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
  <div className={`flex flex-col gap-1 border-b border-[#c8c8c2] pb-2 ${className}`}>
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-700 font-inter">
      {label}
    </span>
    <span className="text-lg font-medium text-near-black font-inter">
      {value}
    </span>
  </div>
);

// Mock order history — replace with real data once the endpoint lands.
const MOCK_HISTORY = Array.from({ length: 5 }, () => ({
  date: "January 12th, 2025",
  orderId: "#AJ-0123",
  amount: 20000,
}));

/**
 * User Details overlay. Shows the buyer's profile fields, a
 * scrollable order history and the Suspend Account action.
 */
const UserDetailsOverlay = ({
  user,
  isOpen,
  onClose,
  onSuspend,
}: UserDetailsOverlayProps) => {
  const [firstName, ...rest] = user?.name.split(" ") ?? [""];
  const lastName = rest.join(" ");

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      {user && (
        <div className="flex flex-col gap-5 p-6">
          <OverlayHeader
            title={user.name}
            subtitle="See user details below"
            onClose={onClose}
          />

          <div>
            <StatusBadge status="active" className="px-4 py-1 bg-green" />
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <DetailRow label="First Name" value={firstName} />
            <DetailRow label="Last Name" value={lastName} />
            <DetailRow
              label="Phone Number"
              value="+2348123817151"
              className="col-span-2"
            />
            <DetailRow
              label="Delivery Address"
              value="12, Olutokun community, Agbowo, Ibadan."
              className="col-span-2"
            />
            <DetailRow label="Account Created On" value="January 14th" />
            <DetailRow label="Last Order" value={user.dateJoined} />
          </div>

          {/* Order history */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-grey-800 font-inter">
                Order History
              </h3>
              <button className="text-sm font-semibold text-green font-inter hover:underline">
                See all
              </button>
            </div>
            <div className="flex flex-col">
              {MOCK_HISTORY.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 border-b border-[#c8c8c2] py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-badge font-medium uppercase tracking-wide text-neutral-700 font-inter">
                      {h.date}
                    </span>
                    <span className="text-base font-medium text-near-black font-inter">
                      {h.orderId}
                    </span>
                  </div>
                  <span className="text-base font-semibold text-near-black font-inter">
                    ₦{h.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-1">
            <button
              onClick={() => onSuspend?.(user)}
              className="w-full h-12 rounded-md border border-fail bg-bg text-sm font-semibold font-inter text-fail transition-colors hover:bg-fail-bg"
            >
              Suspend Account
            </button>
          </div>
        </div>
      )}
    </OverlaySheet>
  );
};

export default UserDetailsOverlay;
