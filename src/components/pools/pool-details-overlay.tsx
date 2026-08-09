"use client";

import Image from "next/image";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import StatusBadge, {
  StatusVariant,
} from "@/components/shared/data-table/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface PoolContributor {
  name: string;
  avatar?: string;
  slots: number;
  paid: boolean;
  amount: number;
}

export interface PoolDetails {
  name: string;
  description: string;
  status: StatusVariant;
  raised: number;
  target: number;
  slotsTaken: number;
  slotsLeft: number;
  image: string;
  item: string;
  quantity: string;
  amountPerSlot: number;
  createdOn: string;
  deadline: string;
  contributors: PoolContributor[];
}

interface PoolDetailsOverlayProps {
  pool: PoolDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onClosePool?: (pool: PoolDetails) => void;
  onEditPool?: (pool: PoolDetails) => void;
}

/** Read-only labelled field with the underline treatment from the design. */
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 border-b border-[#c8c8c2] pb-2">
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
      {label}
    </span>
    <span className="text-lg font-medium text-near-black font-inter">
      {value}
    </span>
  </div>
);

/**
 * Pool Details overlay (node 749:5205). Shows collective progress, item detail
 * fields, contributor list and the Close / Edit pool actions.
 */
const PoolDetailsOverlay = ({
  pool,
  isOpen,
  onClose,
  onClosePool,
  onEditPool,
}: PoolDetailsOverlayProps) => {
  const pct = pool
    ? Math.min(100, Math.round((pool.raised / pool.target) * 100))
    : 0;

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      {pool && (
        <div className="flex flex-col gap-5 p-6">
          <OverlayHeader
            title={pool.name}
            subtitle={pool.description}
            onClose={onClose}
          />

          <div>
            <StatusBadge status={pool.status} className="px-4 py-1" />
          </div>

          {/* Collective progress */}
          <div className="flex flex-col gap-2">
            <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
              Collective Progress
            </span>
            <div className="flex items-end justify-between gap-2">
              <p className="font-inter">
                <span className="text-lg font-bold text-near-black">
                  ₦{pool.raised.toLocaleString()}
                </span>{" "}
                <span className="text-base text-text-sec">
                  of ₦{pool.target.toLocaleString()}
                </span>
              </p>
              <span className="text-sm font-bold text-near-black">{pct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gold-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-green transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm font-inter text-grey-800">
              <span>{pool.slotsTaken} Slots taken</span>
              <span>{pool.slotsLeft} Slots Left</span>
            </div>
          </div>

          {/* Item image */}
          <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-grey">
            <Image
              src={pool.image}
              alt={pool.item}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
            />
          </div>

          {/* Detail fields */}
          <div className="flex flex-col gap-4">
            <DetailRow label="Item" value={pool.item} />
            <DetailRow label="Quantity" value={pool.quantity} />
            <DetailRow
              label="Amount per Slot"
              value={`₦${pool.amountPerSlot.toLocaleString()}`}
            />
            <DetailRow label="Created On" value={pool.createdOn} />
            <DetailRow label="Deadline" value={pool.deadline} />
          </div>

          {/* Contributors */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-grey-800 font-inter">
              Contributors
            </h3>
            <div className="flex flex-col gap-4">
              {pool.contributors.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback className="bg-gold-100 text-green text-sm font-semibold">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-near-black font-inter">
                        {c.name}
                      </span>
                      <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                        {c.slots} Slot{c.slots !== 1 ? "s" : ""} •{" "}
                        {c.paid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green font-inter">
                    ₦{c.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="text-sm font-semibold text-green font-inter text-center hover:underline"
            >
              See All Contributors
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={() => onClosePool?.(pool)}
              className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90"
            >
              Close Pool
            </button>
            <button
              onClick={() => onEditPool?.(pool)}
              className="w-full h-12 rounded-md border border-green bg-bg text-sm font-semibold font-inter text-green transition-colors hover:bg-soft-green"
            >
              Edit Pool
            </button>
          </div>
        </div>
      )}
    </OverlaySheet>
  );
};

export default PoolDetailsOverlay;
