"use client";

import type { OffalSlot, OffalsSelection } from "@/lib/types/marketplace.types";

interface OffalsSectionProps {
  hasOffals: boolean;
  offals: OffalSlot[];
  offalEnabled: boolean;
  selection: OffalsSelection;
  pricePerOffalSlot: number;
  onToggle: (enabled: boolean) => void;
  onQtyChange: (offalId: string, qty: number) => void;
}

const OffalsSection = ({
  hasOffals,
  offals,
  offalEnabled,
  selection,
  pricePerOffalSlot,
  onToggle,
  onQtyChange,
}: OffalsSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium font-inter text-green">
          Offals
        </span>

        {hasOffals ? (
          <button
            role="switch"
            aria-checked={offalEnabled}
            onClick={() => onToggle(!offalEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
              offalEnabled ? "bg-green" : "bg-input-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                offalEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        ) : (
          <span className="text-[11px] font-inter text-muted">
            No offals on this pool
          </span>
        )}
      </div>

      {/* Per-offal steppers */}
      {hasOffals && offalEnabled && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {offals.map((offal) => {
              const qty = selection[offal.id] ?? 0;
              return (
                <div key={offal.id} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQtyChange(offal.id, Math.max(0, qty - 1))}
                      disabled={qty === 0}
                      aria-label={`Decrease ${offal.name}`}
                      className={`w-4 h-4 rounded-full flex items-center justify-center disabled:opacity-30 ${
                        qty > 0 ? "bg-soft-green" : "bg-transparent"
                      }`}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path d="M1 4h6" stroke="#114B3A" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>

                    <span
                      className={`text-xs font-inter min-w-2 text-center ${
                        qty > 0 ? "text-green" : "text-muted"
                      }`}
                    >
                      {qty}
                    </span>

                    <button
                      onClick={() => onQtyChange(offal.id, Math.min(offal.total_slots, qty + 1))}
                      disabled={qty >= offal.total_slots}
                      aria-label={`Increase ${offal.name}`}
                      className="w-4 h-4 rounded-full flex items-center justify-center bg-soft-green disabled:opacity-30"
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                        <path d="M4 1v6M1 4h6" stroke="#114B3A" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-inter text-green">
                      {offal.name}
                    </span>
                    <span className="text-[10px] font-inter text-offal-green">
                      ({offal.total_slots})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price note */}
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5.5" stroke="#A87D2E" />
              <path d="M6 5.5v3M6 4V3.5" stroke="#A87D2E" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-inter text-gold-muted">
              Each offal slot is{" "}
              <strong className="text-green text-xs">
                ₦{pricePerOffalSlot.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffalsSection;
