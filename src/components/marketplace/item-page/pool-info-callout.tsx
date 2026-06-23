interface PoolInfoCalloutProps {
  note: string;
}

const PoolInfoCallout = ({ note }: PoolInfoCalloutProps) => (
  <div className="rounded-xl p-4 flex flex-col gap-2 bg-soft-green">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.5" stroke="#114B3A" />
      <path
        d="M8 7v4M8 5.5V5"
        stroke="#114B3A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>

    <p className="text-[10px] font-medium font-inter text-black leading-relaxed">
      {note}
    </p>
  </div>
);

export default PoolInfoCallout;
