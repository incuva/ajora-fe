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

const BackArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M10 13L5 8L10 3"
      stroke="#114B3A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Spinner = () => (
  <div className="w-6 h-6 rounded-full border-2 border-green border-t-transparent animate-spin" />
);

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

  useEffect(() => {
    getPoolById(id).then((data) => {
      setPool(data);
      setLoading(false);
    });
  }, [id]);

  const availableSlots = pool ? pool.totalSlots - pool.filledSlots : 0;

  const handleOffalQtyChange = useCallback((offalId: string, qty: number) => {
    setOffalSelection((prev) => ({ ...prev, [offalId]: qty }));
  }, []);

  const offalsTotalQty = Object.values(offalSelection).reduce(
    (sum, qty) => sum + qty,
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
      const result = await confirmReservation({
        poolId: pool.id,
        slotCount,
        offalsSelection: offalEnabled ? offalSelection : {},
        ...formData,
      });

      setOverlayOpen(false);

      if (result.success) {
        const params = new URLSearchParams({
          orderId: result.orderId ?? "",
          description: `${pool.name} — Share`,
          slotCount: String(slotCount),
          offals: offalEnabled ? String(offalsTotalQty) : "--",
          amount: String(slotCount * pool.pricePerSlot),
          callbackUrl: result.callbackUrl ?? "",
        });
       router.push(`/marketplace/${id}/confirmation?status=success`);
      } else {
        router.push(`/marketplace/${id}/confirmation?status=fail`);
      }
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
            max={Math.min(availableSlots, 7)}
            pricePerSlot={pool.pricePerSlot}
            onChange={setSlotCount}
          />

          <div className="h-px w-full bg-soft-green" />

          <OffalsSection
            hasOffals={pool.hasOffals}
            offals={pool.offals}
            offalEnabled={offalEnabled}
            selection={offalSelection}
            pricePerOffalSlot={pool.offals[0]?.pricePerUnit ?? 10000}
            onToggle={setOffalEnabled}
            onQtyChange={handleOffalQtyChange}
          />

          <div className="h-px w-full bg-soft-green" />

          <ReservationSummary
            slotCount={slotCount}
            offalsTotalQty={offalEnabled ? offalsTotalQty : 0}
            amountPerSlot={pool.pricePerSlot}
            offalPricePerSlot={pool.offals[0]?.pricePerUnit ?? 10000}
          />
        </motion.div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 py-3 border-t border-border-light">
          <div className="md:max-w-xl md:mx-auto">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setOverlayOpen(true)}
              className="w-full h-10 rounded-md flex items-center justify-center text-sm font-semibold font-inter text-soft-green bg-green"
            >
              Confirm Reservation
            </motion.button>
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
