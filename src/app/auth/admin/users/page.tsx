"use client";

import { useEffect } from "react";
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
import { Plus } from "lucide-react";
import DataTable from "@/components/shared/data-table/index";
import EmptyUsers from "@/components/users/empty-users";
import { useUsersTableStore, type User } from "@/stores/users-table.store";
import { useState } from "react";
import { buildColumns, BUYER_FILTERS } from "@/constants/user";

const UsersPage = () => {
  const [activeMenu, setActiveMenu] = useState("buyers");

  const {
    users,
    isLoading,
    page,
    pageSize,
    total,
    activeFilter,
    setPage,
    setPageSize,
    setFilter,
    fetchUsers,
  } = useUsersTableStore();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = buildColumns();

  return (
    <UIContentLayout>
      <Card className="bg-transparent ring-0">
        <CardHeader className="px-0">
          <CardTitle className="font-playfair text-xl font-medium">
            Users
          </CardTitle>
          <CardAction className="flex gap-2">
            <Button className="bg-gold-400 text-green" size="lg">
              <Plus className="w-4 h-4" /> Share Link
            </Button>
            <Button className="bg-green text-white" size="lg">
              <Plus className="w-4 h-4" /> Add a User
            </Button>
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
          <DataTable<User>
            columns={columns}
            data={users}
            isLoading={isLoading}
            keyField="id"
            emptyState={<EmptyUsers />}
            filters={BUYER_FILTERS}
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </UIContentLayout>
  );
};

export default UsersPage;