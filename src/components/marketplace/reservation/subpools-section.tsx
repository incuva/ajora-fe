"use client";

import type { Subpool, SubpoolSelection } from "@/lib/types/marketplace.types";

interface SubpoolsSectionProps {
  hasSubpools: boolean;
  subpools: Subpool[];
  subpoolsEnabled: boolean;
  selection: SubpoolSelection;
  onToggle: (enabled: boolean) => void;
  onQtyChange: (subpoolId: string, name: string, price: number, qty: number) => void;
}

const SubpoolsSection = ({
  hasSubpools,
  subpools,
  subpoolsEnabled,
  selection,
  onToggle,
  onQtyChange,
}: SubpoolsSectionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium font-inter text-green">
            Subpools / Add-ons
          </span>
          <span className="text-xs font-inter text-gold-muted">
            Add subpools to your reservation
          </span>
        </div>

        {hasSubpools ? (
          <button
            role="switch"
            aria-checked={subpoolsEnabled}
            onClick={() => onToggle(!subpoolsEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${
              subpoolsEnabled ? "bg-green" : "bg-input-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                subpoolsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        ) : (
          <span className="text-xs font-inter text-muted shrink-0">
            No subpools available
          </span>
        )}
      </div>

      {/* Per-subpool items */}
      {hasSubpools && subpoolsEnabled && (
        <div className="flex flex-col gap-3">
          {subpools.map((subpool) => {
            const qty = selection[subpool.id]?.qty ?? 0;
            return (
              <div
                key={subpool.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border-light bg-neutral-50/50"
              >
                <div className="flex flex-col gap-0.5 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium font-inter text-green">
                      {subpool.name}
                    </span>
                    <span className="text-xs font-inter text-offal-green">
                      ({subpool.available_slots} available)
                    </span>
                  </div>
                  {subpool.description && (
                    <p className="text-xs font-inter text-muted">
                      {subpool.description}
                    </p>
                  )}
                  <span className="text-xs font-semibold font-inter text-green">
                    ₦{subpool.price.toLocaleString()} / slot
                  </span>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onQtyChange(
                        subpool.id,
                        subpool.name,
                        subpool.price,
                        Math.max(0, qty - 1)
                      )
                    }
                    disabled={qty === 0}
                    aria-label={`Decrease ${subpool.name}`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors disabled:opacity-30 ${
                      qty > 0
                        ? "bg-soft-green border-soft-green"
                        : "bg-white border-input-border"
                    }`}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 4h6"
                        stroke="#114B3A"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>

                  <span
                    className={`text-xs font-medium font-inter w-5 text-center ${
                      qty > 0 ? "text-green font-bold" : "text-muted"
                    }`}
                  >
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onQtyChange(
                        subpool.id,
                        subpool.name,
                        subpool.price,
                        Math.min(subpool.available_slots, qty + 1)
                      )
                    }
                    disabled={qty >= subpool.available_slots}
                    aria-label={`Increase ${subpool.name}`}
                    className="w-6 h-6 rounded-full flex items-center justify-center bg-soft-green border border-soft-green disabled:opacity-30 transition-colors"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 1v6M1 4h6"
                        stroke="#114B3A"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubpoolsSection;
