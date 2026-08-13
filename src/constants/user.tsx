import { TableColumn } from "@/components/shared/data-table";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/stores/users-table.store";
import { Ban, Eye, UserCheck } from "lucide-react";

export const BUYER_FILTERS = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

/** Initials for the avatar fallback, resilient to blank names. */
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

export const buildColumns = (actions?: {
  onView?: (user: User) => void;
  onSuspend?: (user: User) => void;
}): TableColumn<User>[] => [
  {
    key: "fullname",
    header: "Name",
    width: "w-56",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback className="bg-gold-100 text-green text-xs font-semibold">
            {initials(row.fullname)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-800 whitespace-nowrap">
          {row.fullname}
        </span>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (row) => (
      <span className="text-gray-600 font-mono text-xs">{row.phone}</span>
    ),
  },
  {
    key: "total_pool_participation",
    header: "Pools Participation",
    align: "left",
    render: (row) => (
      <span className="text-gray-700">
        {row.total_pool_participation} pools
      </span>
    ),
  },
  {
    key: "total_amount_spent",
    header: "Amount Spent",
    render: (row) => (
      <span className="text-gray-700 font-medium">
        ₦{Number(row.total_amount_spent).toLocaleString()}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Date Joined",
    render: (row) => (
      <span className="text-gray-600">{formatDate(row.created_at)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <StatusBadge status={row.is_active ? "active" : "suspended"} />
    ),
  },
  {
    key: "actions",
    header: "",
    width: "w-10",
    align: "right",
    render: (row) => {
      const rowActions: RowAction[] = [
        {
          label: "View details",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => actions?.onView?.(row),
        },
        row.is_active
          ? {
              label: "Suspend user",
              icon: <Ban className="w-4 h-4" />,
              onClick: () => actions?.onSuspend?.(row),
              variant: "destructive",
            }
          : {
              label: "Reactivate user",
              icon: <UserCheck className="w-4 h-4" />,
              onClick: () => actions?.onSuspend?.(row),
            },
      ];
      return <RowActions actions={rowActions} />;
    },
  },
];
