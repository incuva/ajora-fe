"use client";

import { useEffect, useState } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DataTable from "@/components/shared/data-table/index";
import EmptyOrders from "@/components/orders/empty-orders";
import OrderDetailsOverlay from "@/components/orders/order-details-overlay";
import ReservationLookupOverlay from "@/components/orders/reservation-lookup-overlay";
import {
  useOrdersTableStore,
  applyOrderDetail,
  type Order,
} from "@/stores/orders-table.store";
import { useToastStore } from "@/stores/toast-store";
import StatsCard from "@/components/shared/stats-card";
import { GoArrowUpRight } from "react-icons/go";
import { buildColumns, ORDER_FILTERS, PoolDropdown } from "@/constants/order";
import { getOrders, getOrderById } from "@/lib/api/admin-orders.service";
import { getAdminOverview } from "@/lib/api/admin-overview.service";
import { getAdminPools } from "@/lib/api/admin-pools.service";

const errMessage = (err: unknown, fallback: string) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ||
  (err as Error)?.message ||
  fallback;

const OrdersPage = () => {
  const {
    orders,
    isLoading,
    error,
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

  const { toastSuccess, toastInfo, toastError } = useToastStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  // Stats + pool filter (independent of the paginated table).
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [cancelledOrders, setCancelledOrders] = useState<number | null>(null);
  const [pools, setPools] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchOrders();

    // Dashboard figures: revenue + pending from the overview endpoint, the
    // order counts from the list endpoint's pagination totals.
    getAdminOverview()
      .then((o) => {
        setRevenue(o.total_revenue);
        setPendingOrders(o.pending_orders);
      })
      .catch(() => {});
    getOrders({ size: 1 })
      .then((res) => setTotalOrders(res.pagination?.totalItems ?? 0))
      .catch(() => {});
    getOrders({ size: 1, order_status: "cancelled" })
      .then((res) => setCancelledOrders(res.pagination?.totalItems ?? 0))
      .catch(() => {});
    getAdminPools({ size: 100 })
      .then((res) =>
        setPools((res.data ?? []).map((p) => ({ id: p.id, name: p.pool_name }))),
      )
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Surface a load failure (e.g. a backend error) once per failed fetch.
  useEffect(() => {
    if (error) toastError("Couldn't load orders", error);
  }, [error, toastError]);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
    // Enrich with the full detail payload (item / pool / buyer / amount).
    if (!order.detailLoaded) {
      getOrderById(order.id)
        .then((detail) =>
          setSelectedOrder((prev) =>
            prev && prev.id === order.id ? applyOrderDetail(prev, detail) : prev,
          ),
        )
        .catch(() => {});
    }
  };

  const closeDetails = () => setIsDetailsOpen(false);

  const handleMarkDelivered = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, "delivered");
      setSelectedOrder((prev) =>
        prev && prev.id === order.id ? { ...prev, status: "delivered" } : prev,
      );
      toastSuccess(
        "Order updated",
        `${order.orderId} has been marked as delivered.`,
      );
    } catch (err: unknown) {
      toastError(
        "Update failed",
        errMessage(err, "Could not mark this order as delivered."),
      );
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (
      !window.confirm(
        `Cancel ${order.orderId}? This restores the pool slots and cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await updateOrderStatus(order.id, "cancelled");
      setSelectedOrder((prev) =>
        prev && prev.id === order.id ? { ...prev, status: "cancelled" } : prev,
      );
      toastInfo("Order cancelled", `${order.orderId} has been cancelled.`);
    } catch (err: unknown) {
      toastError(
        "Cancel failed",
        errMessage(err, "Could not cancel this order."),
      );
    }
  };

  const columns = buildColumns({
    onView: openDetails,
    onMarkDelivered: handleMarkDelivered,
    onCancel: handleCancelOrder,
  });

  const stat = (v: number | null) => (v === null ? "--" : v.toLocaleString());

  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-4">
        {/* Stats cards */}
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-xl font-medium">
              Orders
            </CardTitle>
            <CardAction>
              <Button
                className="bg-green text-white"
                size="lg"
                onClick={() => setIsLookupOpen(true)}
              >
                <Search className="w-4 h-4" /> Look up Reservation
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 overflow-x-auto md:overflow-visible pb-1">
            <StatsCard
              title="Total Orders"
              value={stat(totalOrders)}
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Total Revenue"
              value={revenue === null ? "--" : `₦${revenue.toLocaleString()}`}
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Cancelled Orders"
              value={stat(cancelledOrders)}
              change="- -"
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="Pending Orders"
              value={stat(pendingOrders)}
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
            <PoolDropdown
              value={selectedPool}
              onChange={setSelectedPool}
              pools={pools}
            />
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

      {/* Look up a single reservation */}
      <ReservationLookupOverlay
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </UIContentLayout>
  );
};

export default OrdersPage;
