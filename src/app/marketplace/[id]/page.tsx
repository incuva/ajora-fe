"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getPoolById, makePayment } from "@/lib/api/marketplace.service";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolStatusBadge from "@/components/marketplace/item-page/pool-status-badge";
import SlotFillBar from "@/components/marketplace/item-page/slot-fill-bar";
import PoolInfoRow from "@/components/marketplace/item-page/pool-info-row";
// import PoolInfoCallout from "@/components/marketplace/item-page/pool-info-callout";
import MakePaymentOverlay from "@/components/marketplace/overlays/make-payment-overlay";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";
import { useToastStore } from "@/stores/toast-store";
import { CowIllustration, ShareIcon } from "@/components/shared/icons";

function ItemPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [makePaymentLoading, setMakePaymentLoading] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  // Toast State
  const { toastSuccess, toastError } = useToastStore();

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

  const handleMakePaymentContinue = async ({
    fullName,
    whatsappNumber,
  }: {
    fullName: string;
    whatsappNumber: string;
  }) => {
    if (!pool) return;
    setMakePaymentLoading(true);
    try {
      const result = await makePayment({
        pool_id: pool.id,
        fullname: fullName,
        phone: whatsappNumber,
        email:  "incuvaltd@gmail.com",
        callbackUrl: `${url}/marketplace/${pool.id}/payment-success?status=success`
      });

      if (result.data) {
        toastSuccess(
          "Reservation Found",
          "Redirecting to payment gateway..."
        );
        setMakePaymentOpen(false);
        window.location.replace(result.data.payment_link)
      } else {
        setMakePaymentOpen(false);
        toastError(
          "Reservation not found",
          "Couldn't find a reservation matching the name and phone number provided.",
        );
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setMakePaymentOpen(false);
      toastError(
        "Verification Error",
        error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setMakePaymentLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toastSuccess("Copied to clipboard", "The item link has been copied successfully.");
    } catch (err) {
      toastError("Error", "Could not copy URL");
      console.error("Could not copy URL: ", err);
    }
  };

  if (loading || !pool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  const canPay = pool
    ? pool.available_slots < 1 && pool.status === "open"
    : false;

  return (
    <>
      <div className="flex flex-col bg-white overflow-x-hidden relative">
        {/* Hero image with floating action buttons */}
        <div className="relative w-full h-32 md:h-60 flex items-center justify-center bg-soft-green">
          {/* Floating Back/Close (x) Button */}
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute left-2 top-4 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10 cursor-pointer hover:bg-neutral-50 transition-colors border border-border-light/10"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="#114B3A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Floating Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share page"
            className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center bg-active-green shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <ShareIcon />
          </button>

          {/* {pool.imageUrl ? (
            <Image
              src={pool.imageUrl}
              alt={pool.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <CowIllustration />
            )} */}
            <CowIllustration />

        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 px-4 pt-5 pb-32 flex-1 md:max-w-xl md:mx-auto md:w-full">
          {/* Name + badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-playfair text-2xl font-bold text-near-black">
              {pool.name}
            </h1>
            <PoolStatusBadge status={pool.status} />
          </div>

          {/* Description */}
          <p className="text-xs font-inter text-black leading-relaxed">
            {pool.description}
          </p>

          {/* Info rows */}
          <div className="flex flex-col gap-3">
            <PoolInfoRow
              label="Number of Slots"
              value={String(pool.total_slots)}
            />
            <PoolInfoRow
              label="Price per slot"
              value={`₦${pool.slot_price.toLocaleString()}`}
            />
          </div>

          {/* Slot fill bar */}
          <SlotFillBar
            filled={pool.total_slots - pool.available_slots}
            total={pool.total_slots}
          />

          {/* Total value */}
          <PoolInfoRow
            label="Total value"
            value={`₦${(pool.total_slots - pool.available_slots) * pool.slot_price}`}
          />

          {/* Info callout */}
          {/* <PoolInfoCallout note={pool.info_note} /> */}
        </div>

        {/* Sticky CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white flex gap-3 px-4 pt-3 pb-4 border-t border-border-light max-w-screen">
          <div className="flex gap-3 w-full md:max-w-xl md:mx-auto">
            {/* Reserve Slot — primary */}
            <Button
              variant="primary"
              onClick={() => router.push(`/marketplace/${id}/reserve`)}
            >
              Reserve Slot
            </Button>

            {/* Make Payment — secondary (outlined) */}
            <Button
              variant="secondary"
              onClick={() => setMakePaymentOpen(true)}
              disabled={!canPay}
            >
              Make Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Verify Reservation Overlay */}
      <MakePaymentOverlay
        isOpen={makePaymentOpen}
        isLoading={makePaymentLoading}
        onClose={() => setMakePaymentOpen(false)}
        onContinue={handleMakePaymentContinue}
      />
    </>
  );
}

export default function ItemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <ItemPageContent />
    </Suspense>
  );
}
