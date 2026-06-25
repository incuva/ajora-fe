"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPoolById, confirmReservation } from "@/lib/api/marketplace.service";
import type {
  Pool,
  OffalsSelection,
  DeliveryMode,
} from "@/lib/types/marketplace.types";
import SlotStepper from "@/components/marketplace/reservation/slot-stepper";
import OffalsSection from "@/components/marketplace/reservation/offals-section";
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
  const [offalEnabled, setOffalEnabled] = useState(false);
  const [offalSelection, setOffalSelection] = useState<OffalsSelection>({});
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const { toastError} = useToastStore();


  useEffect(() => {
    getPoolById(id)
      .then((data) => {
        setPool(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pool:", err);
        setLoading(false);
        toastError(
          "Error Loading Pool",
          err?.response?.data?.message || err?.message || "Unable to retrieve pool details. Please reload the page."
        );
      });
  }, [id, toastError]);

  const availableSlots = pool ? pool.available_slots : 0;

  const handleOffalQtyChange = useCallback((offalId: string, name: string | null, qty: number) => {
    setOffalSelection((prev) => ({ ...prev, [offalId]: { name, qty }}));
  }, []);

  const offalsTotalQty = Object.values(offalSelection).reduce(
    (sum, qty) => sum + qty.qty,
    0,
  );

  const handleProceed = async (formData: {
    fullName: string;
    whatsappNumber: string;
    deliveryMode: DeliveryMode;
    location: string;
  }) => {
    if (!pool) return;
    setOverlayLoading(true);
    try {
      const offalsPayload = offalEnabled
        ? Object.entries(offalSelection)
            .filter(([_, item]) => item && item.qty > 0)
            .map(([id, item]) => ({
              food_item_part_id: id,
              name: item.name,
              quantity: item.qty,
            }))
        : [];

      const result = await confirmReservation({
        pool_id: pool.id,
        no_of_reservation: slotCount,
        offals: offalsPayload,
        phone: formData.whatsappNumber,
        fullname: formData.fullName,
        delivery: formData.deliveryMode,
        location: formData.location,
      });

      setOverlayOpen(false);

      if (result.data) {
        router.push(`/marketplace/${id}/confirmation?status=success`);
      } else {
        router.push(`/marketplace/${id}/confirmation?status=fail`);
        toastError(
          "Reservation Failed",
          result.message ?? "An error occurred while reserving a slot for the pool."
        )
      }
    } catch(error: any) {
      console.error("Reservation error:", error);
      setOverlayOpen(false);
      toastError(
        "Reservation Failed",
        error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setOverlayLoading(false);
    }
  };

  if (loading || !pool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner />
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
            {pool.name} — Share
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
            max={Math.min(availableSlots, pool.total_slots)}
            pricePerSlot={pool.slot_price}
            onChange={setSlotCount}
          />

          <div className="h-px w-full bg-soft-green" />

          <OffalsSection
            hasOffals={pool.offals.length > 0}
            offals={pool.offals}
            offalEnabled={offalEnabled}
            selection={offalSelection}
            pricePerOffalSlot={pool.offals[0]?.price ?? 10000}
            onToggle={setOffalEnabled}
            onQtyChange={handleOffalQtyChange}
          />

          <div className="h-px w-full bg-soft-green" />

          <ReservationSummary
            orderId={pool.id}
            slotCount={slotCount}
            offalsTotalQty={offalEnabled ? offalsTotalQty : 0}
            amountPerSlot={pool.slot_price}
            offalPricePerSlot={pool.offals[0]?.price ?? 10000}
          />
        </motion.div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 py-3 border-t border-border-light">
          <div className="md:max-w-xl md:mx-auto">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setOverlayOpen(true)}
            >
              Confirm Reservation
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
