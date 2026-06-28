interface SlotAvailableBarProps {
  available: number;
  total: number;
}

const WIDTH_CLASSES: Record<number, string> = {
  0: "w-0",
  10: "w-[10%]",
  14: "w-[14%]",
  17: "w-[17%]",
  20: "w-[20%]",
  25: "w-[25%]",
  29: "w-[29%]",
  30: "w-[30%]",
  33: "w-[33%]",
  40: "w-[40%]",
  43: "w-[43%]",
  50: "w-[50%]",
  57: "w-[57%]",
  60: "w-[60%]",
  67: "w-[67%]",
  70: "w-[70%]",
  71: "w-[71%]",
  75: "w-[75%]",
  80: "w-[80%]",
  83: "w-[83%]",
  86: "w-[86%]",
  90: "w-[90%]",
  100: "w-full",
};

const SlotAvailableBar = ({ available, total }: SlotAvailableBarProps) => {
  const pct = Math.min(100, Math.round((available / total) * 100));

  // Find the closest percentage key in our compiled classes map
  const nearestPct = Object.keys(WIDTH_CLASSES)
    .map(Number)
    .reduce((prev, curr) => (Math.abs(curr - pct) < Math.abs(prev - pct) ? curr : prev), 0);

  const widthClass = WIDTH_CLASSES[nearestPct] || "w-0";

  return (
    <div className="rounded-xl p-4 flex flex-col gap-4 bg-slot-fill">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold font-inter text-black">
          {available}/{total}
        </span>
        <span className="text-xs font-medium font-inter text-black">
          Slots Remaining
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-xl overflow-hidden bg-soft-green">
        <div
          className={`h-full rounded-xl bg-green transition-all duration-500 ${widthClass}`}
        />
      </div>
    </div>
  );
};

export default SlotAvailableBar;

