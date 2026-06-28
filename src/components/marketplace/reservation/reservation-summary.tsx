interface ReservationSummaryProps {
  weightPerSlot?: number;
  slotCount: number;
  offalsTotalQty: number;
  amountPerSlot: number;
  offalPricePerSlot: number;
}

const formatNaira = (n: number) =>
  n > 0 ? `₦${n.toLocaleString()}` : "---";

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

const SummaryRow = ({ label, value, bold }: SummaryRowProps) => (
  <div className="flex items-center justify-between w-full">
    <span
      className={`text-xs font-inter ${
        bold ? "text-green font-semibold" : "text-pool-green"
      }`}
    >
      {label}
    </span>
    <span
      className={`text-xs font-inter ${
        bold ? "text-green font-semibold" : "text-active-green"
      }`}
    >
      {value}
    </span>
  </div>
);

const ReservationSummary = ({
  weightPerSlot,
  slotCount,
  offalsTotalQty,
  amountPerSlot,
  offalPricePerSlot,
}: ReservationSummaryProps) => {
  const slotAmount = slotCount > 0 ? slotCount * amountPerSlot : 0;
  const offalAmount = offalsTotalQty * offalPricePerSlot;
  const total = slotAmount + offalAmount;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <p className="text-[13px] font-medium font-inter text-black">
          Reservation Summary
        </p>

        <div className="flex flex-col gap-2.5">
          <SummaryRow
            label="Weight per Slot"
            value={`${weightPerSlot} kg`}
          />
          <SummaryRow
            label="Number of Slots"
            value={slotCount > 0 ? String(slotCount) : "--"}
          />
          <SummaryRow
            label="Offals"
            value={offalsTotalQty > 0 ? String(offalsTotalQty) : "--"}
          />
          <SummaryRow
            label="Amount"
            value={slotAmount > 0 ? formatNaira(slotAmount) : "---"}
          />
          <div className="w-full h-px bg-soft-green" />
          <SummaryRow
            label="Total"
            value={total > 0 ? formatNaira(total) : "-------"}
            bold
          />
        </div>
      </div>

      {/* Notification hint */}
      <div className="flex items-start gap-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        >
          <circle cx="6" cy="6" r="5.5" stroke="#114B3A" />
          <path
            d="M6 5.5v3M6 4V3.5"
            stroke="#114B3A"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[10px] font-inter text-green leading-normal">
          You would be notified to make payment immediately the pool is full.
        </p>
      </div>
    </div>
  );
};

export default ReservationSummary;
