import { cn } from "@/lib/utils";

export type StatusVariant =
  | "active"
  | "flagged"
  | "suspended"
  | "delivered"
  | "processing"
  | "cancelled"
  | "closed"
  | "filled"
  | "distributed";

const STATUS_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  active:      { label: "Active",      className: "bg-green text-white" },
  flagged:     { label: "Flagged",     className: "bg-gold-400 text-white" },
  suspended:   { label: "Suspended",   className: "bg-red-500 text-white" },
  delivered:   { label: "Delivered",   className: "bg-green text-white" },
  processing:  { label: "Processing",  className: "bg-gold-400 text-white" },
  cancelled:   { label: "Cancelled",   className: "bg-red-500 text-white" },
  closed:      { label: "Closed",      className: "bg-gray-400 text-white" },
  filled:      { label: "Filled",      className: "bg-blue-500 text-white" },
  distributed: { label: "Distributed", className: "bg-emerald-600 text-white" },
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-300 text-gray-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
