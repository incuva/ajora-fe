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

/**
 * User Details overlay. Shows the buyer's profile fields, their
 * order history and the Suspend Account action.
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
              value="N/A"
              className="col-span-2"
            />
            <DetailRow
              label="Delivery Address"
              value="N/A"
              className="col-span-2"
            />
            <DetailRow label="Account Created On" value={user.dateJoined} />
            <DetailRow label="Last Order" value="N/A" />
          </div>

          {/* Order history */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-grey-800 font-inter">
                Order History
              </h3>
            </div>
            <p className="text-sm text-text-sec font-inter py-3">
              No order history to display yet.
            </p>
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
