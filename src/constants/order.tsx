import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Order } from "@/stores/orders-table.store";
import { ChevronDown, Eye, Truck, XCircle } from "lucide-react";
import { type TableColumn } from "@/components/shared/data-table";
import StatusBadge from "@/components/shared/data-table/status-badge";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";

export const ORDER_FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export const buildColumns = (): TableColumn<Order>[] => [
  {
    key: "orderId",
    header: "Order ID",
    render: (row) => (
      <span className="font-mono text-xs text-gray-600">{row.orderId}</span>
    ),
  },
  {
    key: "poolName",
    header: "Pool Name",
    width: "w-48",
    render: (row) => (
      <span className="font-medium text-gray-800 whitespace-nowrap">
        {row.poolName}
      </span>
    ),
  },
  {
    key: "category",
    header: "Category",
    width: "w-44",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarImage src={row.categoryAvatar} alt={row.categoryName} />
          <AvatarFallback className="bg-gold-100 text-green text-xs font-semibold">
            {row.categoryName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="text-gray-700 whitespace-nowrap">
          {row.categoryName}
        </span>
      </div>
    ),
  },
  {
    key: "slot",
    header: "Slot",
    render: (row) => (
      <span className="text-gray-600">
        {row.slot} slot{row.slot !== 1 ? "s" : ""}
      </span>
    ),
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
          label: "View order",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => console.log("View", row.id),
        },
        {
          label: "Mark delivered",
          icon: <Truck className="w-4 h-4" />,
          onClick: () => console.log("Deliver", row.id),
        },
        {
          label: "Cancel order",
          icon: <XCircle className="w-4 h-4" />,
          onClick: () => console.log("Cancel", row.id),
          variant: "destructive",
        },
      ];
      return <RowActions actions={actions} />;
    },
  },
];

export const PoolDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 font-inter cursor-pointer focus:outline-none focus:ring-2 focus:ring-green/20"
      aria-label="Filter by pool"
    >
      <option value="all">All Pools</option>
      <option value="pool-1">April Cow meat (B1)</option>
      <option value="pool-2">April Chicken (B1)</option>
      <option value="pool-3">April Rice (B1)</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
    </div>
  </div>
);
