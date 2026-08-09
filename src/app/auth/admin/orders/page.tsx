"use client";

import { useEffect, useState } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/shared/data-table/index";
import EmptyOrders from "@/components/orders/empty-orders";
import OrderDetailsOverlay from "@/components/orders/order-details-overlay";
import { useOrdersTableStore, type Order } from "@/stores/orders-table.store";
import { useToastStore } from "@/stores/toast-store";
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
    updateOrderStatus,
    fetchOrders,
  } = useOrdersTableStore();

  const { toastSuccess, toastInfo } = useToastStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => setIsDetailsOpen(false);

  const handleMarkDelivered = (order: Order) => {
    updateOrderStatus(order.id, "delivered");
    setSelectedOrder((prev) =>
      prev && prev.id === order.id ? { ...prev, status: "delivered" } : prev
    );
    toastSuccess(
      "Order updated",
      `${order.orderId} has been marked as delivered.`
    );
  };

  const handleCancelOrder = (order: Order) => {
    updateOrderStatus(order.id, "cancelled");
    setSelectedOrder((prev) =>
      prev && prev.id === order.id ? { ...prev, status: "cancelled" } : prev
    );
    toastInfo("Order cancelled", `${order.orderId} has been cancelled.`);
  };

  const columns = buildColumns({
    onView: openDetails,
    onMarkDelivered: handleMarkDelivered,
    onCancel: handleCancelOrder,
  });

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
          <CardContent className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 overflow-x-auto md:overflow-visible pb-1">
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
          onRowClick={openDetails}
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

      <OrderDetailsOverlay
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        onMarkDelivered={handleMarkDelivered}
        onCancelOrder={handleCancelOrder}
      />
    </UIContentLayout>
  );
};

export default OrdersPage;
