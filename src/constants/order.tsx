import { Order } from "@/stores/orders-table.store";
import { ChevronDown, Eye, Truck, XCircle } from "lucide-react";
import { type TableColumn } from "@/components/shared/data-table";
import StatusBadge, {
  type StatusVariant,
} from "@/components/shared/data-table/status-badge";
import RowActions, {
  RowAction,
} from "@/components/shared/data-table/row-actions";

export const ORDER_FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

/** Status string → badge variant ("pending" reads nicer as "Processing"). */
const statusVariant = (status: string): StatusVariant =>
  (status === "pending" ? "processing" : status) as StatusVariant;

export interface OrderColumnHandlers {
  onView: (order: Order) => void;
  onMarkDelivered: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const buildColumns = (
  handlers: OrderColumnHandlers,
): TableColumn<Order>[] => [
  {
    key: "orderId",
    header: "Order ID",
    render: (row) => (
      <span className="font-mono text-xs text-gray-600">{row.orderId}</span>
    ),
  },
  {
    key: "slot",
    header: "Slots",
    render: (row) => (
      <span className="text-gray-600">
        {row.slot} slot{row.slot !== 1 ? "s" : ""}
      </span>
    ),
  },
  {
    key: "paymentMethod",
    header: "Payment Method",
    render: (row) => (
      <span
        className={
          row.paymentMethod === "onsite"
            ? "inline-flex rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-near-black capitalize"
            : "inline-flex rounded-full bg-soft-green px-2.5 py-0.5 text-xs font-medium text-green capitalize"
        }
      >
        {row.paymentMethod || "—"}
      </span>
    ),
  },
  {
    key: "paymentStatus",
    header: "Payment Status",
    render: (row) => <StatusBadge status={statusVariant(row.paymentStatus)} />,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={statusVariant(row.status)} />,
  },
  {
    key: "actions",
    header: "",
    width: "w-10",
    align: "right",
    render: (row) => {
      // Backend rules: only paid orders may be delivered; delivered/cancelled
      // orders are terminal, so cancel is only offered while pending or paid.
      const canDeliver = row.status === "paid";
      const canCancel = row.status === "pending" || row.status === "paid";
      const actions: RowAction[] = [
        {
          label: "View order",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => handlers.onView(row),
        },
        ...(canDeliver
          ? [
              {
                label: "Mark delivered",
                icon: <Truck className="w-4 h-4" />,
                onClick: () => handlers.onMarkDelivered(row),
              },
            ]
          : []),
        ...(canCancel
          ? [
              {
                label: "Cancel order",
                icon: <XCircle className="w-4 h-4" />,
                onClick: () => handlers.onCancel(row),
                variant: "destructive" as const,
              },
            ]
          : []),
      ];
      return <RowActions actions={actions} />;
    },
  },
];

export const PoolDropdown = ({
  value,
  onChange,
  pools = [],
}: {
  value: string;
  onChange: (v: string) => void;
  pools?: { id: string; name: string }[];
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm text-gray-700 font-inter cursor-pointer focus:outline-none focus:ring-2 focus:ring-green/20"
      aria-label="Filter by pool"
    >
      <option value="all">All Pools</option>
      {pools.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
    </div>
  </div>
);
