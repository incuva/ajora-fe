"use client";

import { useEffect, useState } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Person16Regular } from "@fluentui/react-icons";
import DataTable from "@/components/shared/data-table/index";
import EmptyUsers from "@/components/users/empty-users";
import ShareLinkOverlay from "@/components/users/share-link-overlay";
import UserDetailsOverlay from "@/components/users/user-details-overlay";
import CreateAdminOverlay from "@/components/users/create-admin-overlay";
import { useUsersTableStore, type User } from "@/stores/users-table.store";
import { useToastStore } from "@/stores/toast-store";
import { buildColumns, BUYER_FILTERS } from "@/constants/user";

const UsersPage = () => {
  const [activeMenu, setActiveMenu] = useState("buyers");
  const [isShareOpen, setShareOpen] = useState(false);
  const [isCreateAdminOpen, setCreateAdminOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Local search text, debounced into the store so we don't refetch per keystroke.
  const [searchInput, setSearchInput] = useState("");

  const {
    users,
    isLoading,
    page,
    pageSize,
    total,
    activeFilter,
    search,
    setPage,
    setPageSize,
    setFilter,
    setSearch,
    suspendUser,
    fetchUsers,
  } = useUsersTableStore();

  const { toastSuccess, toastInfo, toastError } = useToastStore();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce the search box → store (which refetches page 1).
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) setSearch(searchInput);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  /**
   * Toggle a buyer's suspension. Confirms before the destructive direction
   */
  const handleToggleSuspend = async (user: User): Promise<boolean> => {
    const suspending = user.is_active; // currently active → about to suspend
    if (
      suspending &&
      !window.confirm(
        `Suspend ${user.fullname}? They will lose access to their account until reactivated.`,
      )
    ) {
      return user.is_active; // cancelled — state unchanged
    }
    try {
      const nowActive = await suspendUser(user.id);
      if (nowActive) {
        toastSuccess(
          "User reactivated",
          `${user.fullname} can access their account again.`,
        );
      } else {
        toastInfo("User suspended", `${user.fullname} has been suspended.`);
      }
      return nowActive;
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not update this user.";
      toastError("Update failed", message);
      return user.is_active; // unchanged on failure
    }
  };

  const columns = buildColumns({
    onView: setSelectedUser,
    onSuspend: handleToggleSuspend,
  });

  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Users
          </CardTitle>
          <CardAction className="flex gap-2">
            <Button
              className="bg-gold-400 text-green hidden"
              size="lg"
              onClick={() => setShareOpen(true)}
            >
              <Plus className="w-4 h-4" /> Share Link
            </Button>
            {/* Add an Admin  */}
            {activeMenu === "admins" && (
              <Button
                className="bg-green text-white"
                size="lg"
                onClick={() => setCreateAdminOpen(true)}
              >
                <Plus className="w-4 h-4" /> Add an Admin
              </Button>
            )}
          </CardAction>
          <CardDescription className="mt-2 flex flex-col gap-3">
            {/* Buyers / Admins toggle */}
            <div className="flex items-center gap-1 border w-fit p-1 bg-white font-inter rounded-lg">
              <div
                className={`text-gray-900 p-2 rounded-md cursor-pointer ${activeMenu === "buyers" && "bg-gold-100"}`}
                onClick={() => setActiveMenu("buyers")}
              >
                <p className="font-sans leading-5 text-sm font-medium">Buyers</p>
              </div>
              <div
                className={`text-gray-900 p-2 rounded-md cursor-pointer ${activeMenu === "admins" && "bg-gold-100"}`}
                onClick={() => setActiveMenu("admins")}
              >
                <p className="font-sans leading-5 text-sm font-medium">Admins</p>
              </div>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {activeMenu === "buyers" ? (
            <DataTable<User>
              columns={columns}
              data={users}
              isLoading={isLoading}
              keyField="id"
              emptyState={<EmptyUsers />}
              filters={BUYER_FILTERS}
              activeFilter={activeFilter}
              onFilterChange={setFilter}
              onRowClick={setSelectedUser}
              headerRight={
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search users…"
                    className="h-10 w-full sm:w-64 rounded-lg border border-input-border bg-white pl-9 pr-3 text-sm font-inter text-near-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green/20"
                  />
                </div>
              }
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          ) : (
            // No admin-directory endpoint exists — admins are created, not listed.
            <div className="bg-white h-[55svh] rounded-2xl flex justify-center items-center font-inter">
              <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="border border-gray-200 px-3 py-2 rounded-md">
                  <Person16Regular className="text-gray-400" />
                </div>
                <p className="text-lg font-bold text-green">Admin accounts</p>
                <p className="text-sm text-gray-500 max-w-xs">
                  There&apos;s no admin directory to display here yet. Use
                  &ldquo;Add an Admin&rdquo; to create a new admin account.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ShareLinkOverlay
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
      />

      {/* Add an Admin  */}
      <CreateAdminOverlay
        isOpen={isCreateAdminOpen}
        onClose={() => setCreateAdminOpen(false)}
      />

      <UserDetailsOverlay
        user={selectedUser}
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        onSuspend={handleToggleSuspend}
      />
    </UIContentLayout>
  );
};

export default UsersPage;
