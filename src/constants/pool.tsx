import { TableColumn } from "@/components/shared/data-table";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";
import StatusBadge, {
  StatusVariant,
} from "@/components/shared/data-table/status-badge";
import type { Pool } from "@/lib/types/marketplace.types";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

export const POOL_FILTERS = [
  { key: "all", label: "All Pools" },
  { key: "active", label: "Active" },
  { key: "closed", label: "Closed" },
  { key: "filled", label: "Filled" },
  { key: "distributed", label: "Distributed" },
];

/**
 * Map an API pool status (`"open" | "closed" | "filled" | …`) onto the badge/
 * filter vocabulary the admin table uses (`"active"` for open pools).
 */
export const normalizePoolStatus = (status: string): StatusVariant => {
  if (status === "open") return "active";
  return status as StatusVariant;
};

export const SlotProgress = ({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) => {
  const pct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-gray-700 text-sm whitespace-nowrap font-medium">
        {filled}/{total}
      </span>
      <div className="w-24 h-2 rounded-full bg-gold-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-green transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const buildColumns = (actions?: {
  onView?: (pool: Pool) => void;
  onEdit?: (pool: Pool) => void;
  onAddSubpool?: (pool: Pool) => void;
  onDelete?: (pool: Pool) => void;
}): TableColumn<Pool>[] => [
  {
    key: "name",
    header: "Pool Name",
    width: "w-56",
    render: (row) => (
      <span className="font-medium text-gray-800 whitespace-nowrap">
        {row.name}
      </span>
    ),
  },
  {
    key: "slots",
    header: "Slot",
    render: (row) => (
      <SlotProgress
        filled={Math.max(0, row.total_slots - row.available_slots)}
        total={row.total_slots}
      />
    ),
  },
  {
    key: "slot_price",
    header: "Slot Amount",
    render: (row) => (
      <span className="font-medium text-gray-700">
        ₦{row.slot_price.toLocaleString()}
      </span>
    ),
  },
  {
    key: "total_value",
    header: "Total Value",
    render: (row) => (
      <span className="text-gray-600">₦{row.total_value.toLocaleString()}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={normalizePoolStatus(row.status)} />,
  },
  {
    key: "actions",
    header: "",
    width: "w-10",
    align: "right",
    render: (row) => {
      const rowActions: RowAction[] = [
        {
          label: "View pool",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => actions?.onView?.(row),
        },
        {
          label: "Edit pool",
          icon: <Pencil className="w-4 h-4" />,
          onClick: () => actions?.onEdit?.(row),
        },
        {
          label: "Add subpool",
          icon: <Plus className="w-4 h-4" />,
          onClick: () => actions?.onAddSubpool?.(row),
        },
      ];
      if (actions?.onDelete) {
        rowActions.push({
          label: "Delete pool",
          icon: <Trash2 className="w-4 h-4" />,
          onClick: () => actions.onDelete?.(row),
          variant: "destructive",
        });
      }
      return <RowActions actions={rowActions} />;
    },
  },
];
