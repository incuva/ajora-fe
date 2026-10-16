"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPoolById, confirmReservation, makePayment } from "@/lib/api/marketplace.service";
import type {
  Pool,
  SubpoolSelection,
  DeliveryMode,
} from "@/lib/types/marketplace.types";
import SlotStepper from "@/components/marketplace/reservation/slot-stepper";
import SubpoolsSection from "@/components/marketplace/reservation/subpools-section";
import ReservationSummary from "@/components/marketplace/reservation/reservation-summary";
import ConfirmReservationOverlay from "@/components/marketplace/overlays/confirm-reservation-overlay";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";
import { useToastStore } from "@/stores/toast-store";
import BackArrow from "@/components/shared/back-arrow";
import { SupportBanner } from "@/components/shared/support-contact";
import { SUPPORT_HINT } from "@/constants/support";

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
  const { toastError, toastSuccess } = useToastStore();

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

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === "object") {
      const errObj = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      return errObj.response?.data?.message || errObj.message || fallback;
    }
    return fallback;
  };

  /**
   * Every booking is paid online. We first create the reservation and wait for
   * a SUCCESS response; only then do we initiate payment and redirect to the
   * gateway. The slot is confirmed once payment succeeds (verified on
   * /payment-success).
   */
  const handleProceed = async (formData: {
    fullName: string;
    whatsappNumber: string;
    email: string;
    deliveryMode: DeliveryMode;
    location: string;
  }) => {
    if (!pool || !isValidReservation || overlayLoading) return;
    setOverlayLoading(true);

    // Step 1: create the reservation. `confirmReservation` throws unless the
    // backend returns a success response with the created reservation.
    try {
      const subpoolsPayload = subpoolsEnabled
        ? Object.entries(subpoolSelection)
            .filter(([, item]) => item && item.qty > 0)
            .map(([subpoolId, item]) => ({
              id: subpoolId,
              quantity: item.qty,
            }))
        : [];

      await confirmReservation({
        pool_id: pool.id,
        no_of_reservation: slotCount,
        subpools: subpoolsPayload,
        phone: formData.whatsappNumber,
        email: formData.email,
        fullname: formData.fullName,
        delivery: formData.deliveryMode,
        payment_option: "online",
        location: formData.location,
      });
    } catch (error: unknown) {
      console.error("Reservation error:", error);
      setOverlayLoading(false);
      toastError(
        "Reservation Failed",
        `${getErrorMessage(error, "An unexpected error occurred. Please try again.")} ${SUPPORT_HINT}`,
      );
      // Do NOT attempt payment when the reservation did not succeed.
      return;
    }

    // Step 2: reservation succeeded — initiate online payment.
    toastSuccess("Reservation successful", "Redirecting you to payment…");
    try {
      const origin = window.location.origin;
      const payment = await makePayment({
        pool_id: pool.id,
        fullname: formData.fullName,
        phone: formData.whatsappNumber,
        email: formData.email,
        callbackUrl: `${origin}/marketplace/${pool.id}/payment-success?status=success`,
      });

      if (payment.data?.payment_link) {
        // Keep the overlay in its loading state while the browser navigates away.
        window.location.replace(payment.data.payment_link);
        return;
      }
      throw new Error(payment.message || "Could not start payment.");
    } catch (error: unknown) {
      console.error("Payment initiation error:", error);
      setOverlayLoading(false);
      setOverlayOpen(false);
      toastError(
        "Payment not started",
        `${getErrorMessage(error, "Could not start payment.")} Your slot is not confirmed yet — use "Make Payment" on the pool page to complete it. ${SUPPORT_HINT}`,
      );
      router.push(`/marketplace/${id}`);
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

          <SupportBanner />
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
