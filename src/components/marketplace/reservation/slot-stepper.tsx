"use client";

interface SlotStepperProps {
  value: number;
  max: number;
  pricePerSlot: number;
  weightPerSlot: number;
  onChange: (value: number) => void;
}

const SLOT_LABELS: Record<number, string> = {
  1: "1 slot",
  2: "2 slots",
  3: "3 slots",
  4: "4 slots",
  5: "5 slots",
  6: "6 slots",
  7: "7 slots",
};

const SlotStepper = ({ value, max, pricePerSlot, weightPerSlot, onChange }: SlotStepperProps) => {
  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-medium font-inter text-black">
        How many {`${weightPerSlot}kg Slots`} do you want?
      </p>

      {/* Price + stepper row */}
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-0.5">
          <span className="text-lg font-semibold font-inter text-green">
            ₦{pricePerSlot.toLocaleString()}
          </span>
          <span className="text-base font-inter text-pool-green">/slot</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <button
            onClick={decrement}
            disabled={value <= 1}
            aria-label="Decrease slot count"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-soft-green transition-opacity disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8" stroke="#114B3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <span className="text-sm font-semibold font-inter text-black min-w-4 text-center">
            {value}
          </span>

          <button
            onClick={increment}
            disabled={value >= max}
            aria-label="Increase slot count"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-soft-green transition-opacity disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2v8M2 6h8" stroke="#114B3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick-pick pills */}
      {/* <div className="flex gap-2 flex-wrap">
        {Array.from({ length: Math.min(max, 3) }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`px-3 py-1 rounded-full text-xs font-medium font-inter border transition-all ${
              value === n
                ? "bg-green text-soft-green border-green"
                : "bg-bg text-pool-green border-soft-green"
            }`}
          >
            {SLOT_LABELS[n] ?? `${n} slots`}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default SlotStepper;
