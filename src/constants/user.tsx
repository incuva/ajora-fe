import { TableColumn } from "@/components/shared/data-table";
import RowActions, { RowAction } from "@/components/shared/data-table/row-actions";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/stores/users-table.store";
import { Ban, Eye, Trash2 } from "lucide-react";

export const BUYER_FILTERS = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

export const buildColumns = (): TableColumn<User>[] => [
  {
    key: "name",
    header: "Pool Name",
    width: "w-56",
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm">
          <AvatarImage src={row.avatar} alt={row.name} />
          <AvatarFallback className="bg-gold-100 text-green text-xs font-semibold">
            {row.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-gray-800 whitespace-nowrap">
          {row.name}
        </span>
      </div>
    ),
  },
  {
    key: "userId",
    header: "User ID",
    render: (row) => (
      <span className="text-gray-600 font-mono text-xs">{row.userId}</span>
    ),
  },
  {
    key: "poolsParticipation",
    header: "Pools Participation",
    align: "left",
    render: (row) => (
      <span className="text-gray-700">{row.poolsParticipation} pools</span>
    ),
  },
  {
    key: "amountSpent",
    header: "Amount Spent",
    render: (row) => (
      <span className="text-gray-700 font-medium">
        ₦{row.amountSpent.toLocaleString()}
      </span>
    ),
  },
  {
    key: "dateJoined",
    header: "Date Joined",
    render: (row) => <span className="text-gray-600">{row.dateJoined}</span>,
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
          label: "View details",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => console.log("View", row.id),
        },
        {
          label: "Suspend user",
          icon: <Ban className="w-4 h-4" />,
          onClick: () => console.log("Suspend", row.id),
        },
        {
          label: "Delete user",
          icon: <Trash2 className="w-4 h-4" />,
          onClick: () => console.log("Delete", row.id),
          variant: "destructive",
        },
      ];
      return <RowActions actions={actions} />;
    },
  },
];