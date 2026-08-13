"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/shared/data-table/status-badge";
import type { Order } from "@/stores/orders-table.store";

interface OrderDetailsOverlayProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkDelivered: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

/** Read-only labelled field with the underline treatment from the design. */
const DetailField = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1 border-b border-gray-200 pb-2 ${className}`}>
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
      {label}
    </span>
    <span className="text-sm font-medium text-near-black font-inter">
      {value}
    </span>
  </div>
);

const OrderDetailsOverlay = ({
  order,
  isOpen,
  onClose,
  onMarkDelivered,
  onCancelOrder,
}: OrderDetailsOverlayProps) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const markDeliveredDisabled =
    !order || order.status === "delivered" || order.status === "cancelled";
  const cancelDisabled =
    !order || order.status === "cancelled" || order.status === "delivered";

  const handlePrint = () => window.print();

  const buyerInitials = order?.buyerName
    ? order.buyerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "";

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet / centered card */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center w-full"
          >
            <div className="w-full max-w-md mx-auto rounded-t-2xl md:rounded-2xl bg-bg md:bg-white max-h-[92vh] overflow-y-auto">
              <div className="flex flex-col gap-5 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-playfair text-3xl font-bold text-green">
                      {order.orderId}
                    </h2>
                    <p className="text-sm font-inter text-text-sec">
                      Below are the details of this order
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="shrink-0 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={order.status} className="px-4 py-1" />
                </div>

                {/* Buyer */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-300 font-inter">
                    Buyer
                  </span>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src={order.buyerAvatar} alt={order.buyerName} />
                      <AvatarFallback className="bg-gold-100 text-green text-sm font-semibold">
                        {buyerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-base font-bold text-near-black font-inter">
                      {order.buyerName}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Order Details */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-grey-800 font-inter">
                    Order Details
                  </h3>

                  {/* Item image */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-grey">
                    <Image
                      src={order.itemImage}
                      alt={order.itemName}
                      fill
                      sizes="(max-width: 768px) 100vw, 448px"
                      className="object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <DetailField label="Item" value={order.itemName} />
                    <DetailField label="Category" value={order.itemCategory} />
                    <DetailField label="Quantity" value={order.quantityLabel} />
                    <DetailField
                      label="Amount"
                      value={`₦${order.amount.toLocaleString()}`}
                    />
                    <DetailField
                      label="Delivery Address"
                      value={order.deliveryAddress}
                      className="col-span-2"
                    />
                  </div>
                </div>

                {/* Pool Details */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold text-grey-800 font-inter">
                    Pool Details
                  </h3>

                  <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    <DetailField
                      label="Pool Name"
                      value={order.poolName}
                      className="col-span-2"
                    />
                    <DetailField label="Created On" value={order.poolCreatedDate} />
                    <DetailField label="Time" value={order.poolCreatedTime} />
                    <DetailField label="Deadline" value={order.poolDeadlineDate} />
                    <DetailField label="Time" value={order.poolDeadlineTime} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-1">
                  <button
                    onClick={handlePrint}
                    className="w-full h-12 rounded-lg bg-green text-white text-sm font-semibold font-inter transition-colors hover:bg-green/90"
                  >
                    Print Order Details
                  </button>

                  <button
                    onClick={() => order && onMarkDelivered(order)}
                    disabled={markDeliveredDisabled}
                    className="w-full h-12 rounded-lg border border-gray-200 bg-white text-sm font-semibold font-inter text-green transition-colors hover:bg-soft-green disabled:text-green/40 disabled:hover:bg-white disabled:cursor-not-allowed"
                  >
                    Mark as Delivered
                  </button>

                  <button
                    onClick={() => order && onCancelOrder(order)}
                    disabled={cancelDisabled}
                    className="w-full h-12 rounded-lg border border-gray-200 bg-white text-sm font-semibold font-inter text-fail transition-colors hover:bg-fail-bg disabled:text-fail/40 disabled:hover:bg-white disabled:cursor-not-allowed"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsOverlay;
