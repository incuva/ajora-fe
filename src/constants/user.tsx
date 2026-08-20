import { TableColumn } from "@/components/shared/data-table";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/stores/users-table.store";
import type { AdminAccount } from "@/lib/types/admin.types";
import { Ban, Eye, UserCheck } from "lucide-react";

export const BUYER_FILTERS = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

export const ADMIN_FILTERS = [
  { key: "all", label: "All Admins" },
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

/** Human-readable label for an admin role. */
const roleLabel = (role: string) =>
  role === "super-admin" ? "Super Admin" : "Admin";

/**
 * Columns for the admin directory. Suspend/reinstate is available only to a
 * super-admin (`canManage`) and never against the acting admin themselves
 * (matched by `currentEmail`), which would otherwise lock them out.
 */
export const buildAdminColumns = (opts: {
  canManage: boolean;
  currentEmail?: string;
  onToggleSuspend?: (admin: AdminAccount) => void;
}): TableColumn<AdminAccount>[] => [
  {
    key: "name",
    header: "Name",
    width: "w-56",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarFallback className="bg-gold-100 text-green text-xs font-semibold">
            {initials(`${row.first_name} ${row.last_name}`)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-800 whitespace-nowrap">
          {row.first_name} {row.last_name}
        </span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (row) => <span className="text-gray-600">{row.email}</span>,
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <span className="inline-flex rounded-full bg-soft-green px-2.5 py-0.5 text-xs font-medium text-green">
        {roleLabel(row.role)}
      </span>
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
      const isSelf = !!opts.currentEmail && row.email === opts.currentEmail;
      // No actions for non-super-admins or against oneself.
      if (!opts.canManage || isSelf) {
        return <span className="text-gray-300">—</span>;
      }
      const rowActions: RowAction[] = [
        row.is_active
          ? {
              label: "Suspend admin",
              icon: <Ban className="w-4 h-4" />,
              onClick: () => opts.onToggleSuspend?.(row),
              variant: "destructive",
            }
          : {
              label: "Reinstate admin",
              icon: <UserCheck className="w-4 h-4" />,
              onClick: () => opts.onToggleSuspend?.(row),
            },
      ];
      return <RowActions actions={rowActions} />;
    },
  },
];
