"use client";

import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import OverlaySheet, { OverlayHeader } from "@/components/shared/overlay-sheet";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { normalizePoolStatus } from "@/constants/pool";
import type { Pool, Subpool } from "@/lib/types/marketplace.types";

interface PoolDetailsOverlayProps {
  pool: Pool | null;
  isOpen: boolean;
  onClose: () => void;
  onEditPool?: (pool: Pool) => void;
  onAddSubpool?: (pool: Pool) => void;
  onEditSubpool?: (pool: Pool, subpool: Subpool) => void;
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
 * Pool Details overlay 
 */
const PoolDetailsOverlay = ({
  pool,
  isOpen,
  onClose,
  onEditPool,
  onAddSubpool,
  onEditSubpool,
}: PoolDetailsOverlayProps) => {
  const filled = pool ? Math.max(0, pool.total_slots - pool.available_slots) : 0;
  const raised = pool ? filled * pool.slot_price : 0;
  const target = pool ? pool.total_slots * pool.slot_price : 0;
  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  const createdOn = pool?.created_at
    ? new Date(pool.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <OverlaySheet isOpen={isOpen} onClose={onClose}>
      {pool && (
        <div className="flex flex-col gap-5 p-6">
          <OverlayHeader
            title={pool.name}
            subtitle={pool.description || `${pool.name} pool`}
            onClose={onClose}
          />

          <div>
            <StatusBadge
              status={normalizePoolStatus(pool.status)}
              className="px-4 py-1"
            />
          </div>

          {/* Collective progress */}
          <div className="flex flex-col gap-2">
            <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
              Collective Progress
            </span>
            <div className="flex items-end justify-between gap-2">
              <p className="font-inter">
                <span className="text-lg font-bold text-near-black">
                  ₦{raised.toLocaleString()}
                </span>{" "}
                <span className="text-base text-text-sec">
                  of ₦{target.toLocaleString()}
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
              <span>{filled} Slots taken</span>
              <span>{pool.available_slots} Slots Left</span>
            </div>
          </div>

          {/* Item image */}
          <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-grey">
            <Image
              src={pool.imageUrl || "/assets/cow.png"}
              alt={pool.name}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
            />
          </div>

          {/* Detail fields */}
          <div className="flex flex-col gap-4">
            <DetailRow label="Item" value={pool.name} />
            <DetailRow
              label="Quantity"
              value={pool.weight_per_slot ? `${pool.weight_per_slot}kg` : "N/A"}
            />
            <DetailRow
              label="Amount per Slot"
              value={`₦${pool.slot_price.toLocaleString()}`}
            />
            <DetailRow
              label="Total Value"
              value={`₦${pool.total_value.toLocaleString()}`}
            />
            <DetailRow label="Created On" value={createdOn} />
          </div>

          {/* Subpools */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-grey-800 font-inter">
                Subpools ({pool.subpools?.length ?? 0})
              </h3>
              <button
                type="button"
                onClick={() => onAddSubpool?.(pool)}
                className="flex items-center gap-1 text-sm font-semibold text-green font-inter hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Subpool
              </button>
            </div>

            {pool.subpools && pool.subpools.length > 0 ? (
              <div className="flex flex-col gap-3">
                {pool.subpools.map((sub) => {
                  const subFilled = Math.max(
                    0,
                    sub.total_slots - sub.available_slots,
                  );
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-input-border p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-near-black font-inter">
                          {sub.name}
                        </span>
                        <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                          {subFilled}/{sub.total_slots} slots • ₦
                          {sub.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onEditSubpool?.(pool, sub)}
                        aria-label={`Edit ${sub.name}`}
                        className="flex items-center gap-1 text-sm font-semibold text-green font-inter hover:underline"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-sec font-inter">
                No subpools yet.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={() => onEditPool?.(pool)}
              className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90"
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
