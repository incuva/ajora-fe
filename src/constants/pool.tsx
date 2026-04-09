import { TableColumn } from "@/components/shared/data-table";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { Pool } from "@/stores/pools-table.store";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const POOL_FILTERS = [
  { key: "all", label: "All Pools" },
  { key: "active", label: "Active" },
  { key: "closed", label: "Closed" },
  { key: "filled", label: "Filled" },
  { key: "distributed", label: "Distributed" },
];

export const SlotProgress = ({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) => {
  const pct = Math.min(100, Math.round((filled / total) * 100));
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

export const buildColumns = (): TableColumn<Pool>[] => [
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
    key: "category",
    header: "Category",
    render: (row) => <span className="text-gray-600">{row.category}</span>,
  },
  {
    key: "slots",
    header: "Slot",
    render: (row) => (
      <SlotProgress filled={row.slotsFilled} total={row.slotsTotal} />
    ),
  },
  {
    key: "deadline",
    header: "Deadline",
    render: (row) => <span className="text-gray-600">{row.deadline}</span>,
  },
  {
    key: "slotAmount",
    header: "Slot Amount",
    render: (row) => (
      <span className="font-medium text-gray-700">
        ₦{row.slotAmount.toLocaleString()}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "",
    width: "w-10",
    align: "right",
    render: (row) => {
      const actions: RowAction[] = [
        {
          label: "View pool",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => console.log("View", row.id),
        },
        {
          label: "Edit pool",
          icon: <Pencil className="w-4 h-4" />,
          onClick: () => console.log("Edit", row.id),
        },
        {
          label: "Delete pool",
          icon: <Trash2 className="w-4 h-4" />,
          onClick: () => console.log("Delete", row.id),
          variant: "destructive",
        },
      ];
      return <RowActions actions={actions} />;
    },
  },
];
