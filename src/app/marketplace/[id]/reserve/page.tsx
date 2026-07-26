"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPoolById, confirmReservation } from "@/lib/api/marketplace.service";
import type {
  Pool,
  SubpoolSelection,
  DeliveryMode,
  PaymentOption,
} from "@/lib/types/marketplace.types";
import SlotStepper from "@/components/marketplace/reservation/slot-stepper";
import SubpoolsSection from "@/components/marketplace/reservation/subpools-section";
import ReservationSummary from "@/components/marketplace/reservation/reservation-summary";
import ConfirmReservationOverlay from "@/components/marketplace/overlays/confirm-reservation-overlay";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";
import { useToastStore } from "@/stores/toast-store";
import BackArrow from "@/components/shared/back-arrow";

export default function ReservePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);

  const [slotCount, setSlotCount] = useState(1);
  const [subpoolsEnabled, setSubpoolsEnabled] = useState(true);
  const [subpoolSelection, setSubpoolSelection] = useState<SubpoolSelection>({});
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const { toastError } = useToastStore();

  useEffect(() => {
    getPoolById(id)
      .then((data) => {
        setPool(data);
        if (data.available_slots === 0) {
          setSlotCount(0);
        }
      })
      .catch((err) => {
        console.error("Error fetching pool:", err);
        toastError(
          "Error Loading Pool",
          err?.response?.data?.message ||
            err?.message ||
            "Unable to retrieve pool details. Please reload the page.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, toastError]);

  const availableSlots = pool ? pool.available_slots : 0;
  const subpools = pool ? (pool.subpools || (pool as { offals?: typeof pool.subpools }).offals || []) : [];

  const handleSubpoolQtyChange = useCallback(
    (subpoolId: string, name: string, price: number, qty: number) => {
      setSubpoolSelection((prev) => ({
        ...prev,
        [subpoolId]: { name, price, qty },
      }));
    },
    [],
  );

  const subpoolsTotalQty = Object.values(subpoolSelection).reduce(
    (sum, item) => sum + item.qty,
    0,
  );

  const subpoolsTotalAmount = Object.values(subpoolSelection).reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  const isValidReservation = slotCount > 0 || (subpoolsEnabled && subpoolsTotalQty > 0);

  const handleProceed = async (formData: {
    fullName: string;
    whatsappNumber: string;
    deliveryMode: DeliveryMode;
    paymentOption: PaymentOption;
    location: string;
  }) => {
    if (!pool || !isValidReservation) return;
    setOverlayLoading(true);
    try {
      const subpoolsPayload = subpoolsEnabled
        ? Object.entries(subpoolSelection)
            .filter(([, item]) => item && item.qty > 0)
            .map(([subpoolId, item]) => ({
              id: subpoolId,
              quantity: item.qty,
            }))
        : [];

      const result = await confirmReservation({
        pool_id: pool.id,
        no_of_reservation: slotCount,
        subpools: subpoolsPayload,
        phone: formData.whatsappNumber,
        fullname: formData.fullName,
        delivery: formData.deliveryMode,
        payment_option: formData.paymentOption,
        location: formData.location,
      });

      setOverlayOpen(false);

      if (result.data) {
        router.push(`/marketplace/${id}/confirmation?status=success&orderId=${result.data.order_id}`);
      } else {
        router.push(`/marketplace/${id}/confirmation?status=fail`);
        toastError(
          "Reservation Failed",
          result.message ??
            "An error occurred while reserving a slot for the pool.",
        );
      }
    } catch (error: unknown) {
      console.error("Reservation error:", error);
      setOverlayOpen(false);
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error && typeof error === "object") {
        const errObj = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMsg = errObj.response?.data?.message || errObj.message || errorMsg;
      }
      toastError("Reservation Failed", errorMsg);
    } finally {
      setOverlayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">Pool not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col bg-white">
        {/* Top Bar */}
        <header className="flex items-center gap-2 px-4 h-12 bg-white sticky top-14 z-10 border-b border-border-light">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1.5"
          >
            <BackArrow />
            <span className="text-xs font-inter text-green">Back</span>
          </button>
          <span className="ml-2 font-playfair text-base font-bold text-near-black">
            {pool.name}
          </span>
        </header>

        {/* Scrollable body */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-6 px-4 pt-6 pb-40 flex-1 md:max-w-xl md:mx-auto md:w-full"
        >
          <SlotStepper
            value={slotCount}
            min={0}
            max={Math.min(availableSlots, pool.total_slots)}
            pricePerSlot={pool.slot_price}
            weightPerSlot={pool.weight_per_slot}
            onChange={setSlotCount}
          />

          <div className="h-px w-full bg-soft-green" />

          <SubpoolsSection
            hasSubpools={subpools.length > 0}
            subpools={subpools}
            subpoolsEnabled={subpoolsEnabled}
            selection={subpoolSelection}
            onToggle={setSubpoolsEnabled}
            onQtyChange={handleSubpoolQtyChange}
          />

          <div className="h-px w-full bg-soft-green" />

          <ReservationSummary
            slotCount={slotCount}
            subpoolsTotalQty={subpoolsEnabled ? subpoolsTotalQty : 0}
            subpoolsTotalAmount={subpoolsEnabled ? subpoolsTotalAmount : 0}
            amountPerSlot={pool.slot_price}
            weightPerSlot={pool.weight_per_slot}
          />
        </motion.div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 py-3 border-t border-border-light">
          <div className="md:max-w-xl md:mx-auto">
            <Button
              variant="primary"
              fullWidth
              disabled={!isValidReservation}
              onClick={() => setOverlayOpen(true)}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>

      <ConfirmReservationOverlay
        isOpen={overlayOpen}
        isLoading={overlayLoading}
        onClose={() => setOverlayOpen(false)}
        onProceed={handleProceed}
      />
    </>
  );
}
