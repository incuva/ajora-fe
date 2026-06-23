"use client";

import { useEffect } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/shared/data-table/index";
import EmptyOrders from "@/components/orders/empty-orders";
import { useOrdersTableStore, type Order } from "@/stores/orders-table.store";
import StatsCard from "@/components/shared/stats-card";
import { GoArrowUpRight } from "react-icons/go";
import { buildColumns, ORDER_FILTERS, PoolDropdown } from "@/constants/order";


const OrdersPage = () => {
  const {
    orders,
    isLoading,
    page,
    pageSize,
    total,
    activeFilter,
    selectedPool,
    setPage,
    setPageSize,
    setFilter,
    setSelectedPool,
    fetchOrders,
  } = useOrdersTableStore();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = buildColumns();

  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-4">
        {/* Stats cards */}
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-xl font-medium">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0">
            <StatsCard
              title="Total Active Orders"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Total Revenue"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Cancelled Orders"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Pending Orders"
              value="--"
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
          </CardContent>
        </Card>

        {/* Orders table */}
        <DataTable<Order>
          columns={columns}
          data={orders}
          isLoading={isLoading}
          keyField="id"
          emptyState={<EmptyOrders />}
          filters={ORDER_FILTERS}
          activeFilter={activeFilter}
          onFilterChange={setFilter}
          headerRight={
            <PoolDropdown value={selectedPool} onChange={setSelectedPool} />
          }
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </UIContentLayout>
  );
};

export default OrdersPage;
