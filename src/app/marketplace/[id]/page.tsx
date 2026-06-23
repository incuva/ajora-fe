"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getPoolById, makePayment } from "@/lib/api/marketplace.service";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolStatusBadge from "@/components/marketplace/item-page/pool-status-badge";
import SlotFillBar from "@/components/marketplace/item-page/slot-fill-bar";
import PoolInfoRow from "@/components/marketplace/item-page/pool-info-row";
import PoolInfoCallout from "@/components/marketplace/item-page/pool-info-callout";
import MakePaymentOverlay from "@/components/marketplace/overlays/make-payment-overlay";
import Button from "@/components/marketplace/common/button";
import Toast from "@/components/marketplace/common/toast";
import Spinner from "@/components/shared/spinner";

const ShareIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="4" r="1.5" stroke="#fff" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="1.5" stroke="#fff" strokeWidth="1.2" />
    <circle cx="4" cy="8" r="1.5" stroke="#fff" strokeWidth="1.2" />
    <path
      d="M10.5 4.75L5.5 7.25M10.5 11.25L5.5 8.75"
      stroke="#fff"
      strokeWidth="1.2"
    />
  </svg>
);

const CowIllustration = () => (
  <div className="flex items-center justify-center w-full h-full">
    <span className="text-[96px] leading-none" role="img" aria-label="cow">
      🐄
    </span>
  </div>
);


function ItemPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [makePaymentLoading, setMakePaymentLoading] = useState(false);

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastTitle, setToastTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    getPoolById(id).then((data) => {
      setPool(data);
      setLoading(false);
    });
  }, [id]);

  // Check URL query parameters for completion redirects
  useEffect(() => {
    const status = searchParams.get("status");
    const payment = searchParams.get("payment");

    if (status === "success" || payment === "success") {
      setToastType("success");
      setToastTitle("Payment Successful");
      setToastMessage("Your payment was successful, you’d be contacted for delivery of your share.");
      setToastOpen(true);

      // Clean the query parameters from browser history
      const newUrl = window.location.pathname;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }
  }, [searchParams]);

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
        poolId: pool.id,
        fullName,
        whatsappNumber,
      });

      if (result.reserved) {
        setMakePaymentOpen(false);
        // Successful verification -> redirect to local Checkout Page
        const checkoutParams = new URLSearchParams({
          orderId: "#2345678",
          description: `${pool.name} — Share`,
          slotCount: "1",
          offals: "--",
          amount: String(pool.pricePerSlot),
          callbackUrl: result.callbackUrl ?? "",
        });
        router.push(`/marketplace/${id}/checkout?${checkoutParams.toString()}`);
      } else {
        // Failed verification -> show reservation not found toast
        setMakePaymentOpen(false);
        setToastType("error");
        setToastTitle("Reservation not found");
        setToastMessage("Couldn't find a reservation matching the name and phone number provided.");
        setToastOpen(true);
      }
    } catch (error) {
      console.error(error);
      setMakePaymentOpen(false);
      setToastType("error");
      setToastTitle("Verification Error");
      setToastMessage("An unexpected error occurred. Please try again.");
      setToastOpen(true);
    } finally {
      setMakePaymentLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastType("success");
      setToastTitle("Copied to clipboard");
      setToastMessage("The item link has been copied successfully.");
      setToastOpen(true);
    } catch (err) {
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

  return (
    <>
      <div className="flex flex-col bg-white overflow-x-hidden relative">
        {/* Toast Container */}
        <Toast
          isOpen={toastOpen}
          type={toastType}
          title={toastTitle}
          message={toastMessage}
          onClose={() => setToastOpen(false)}
        />

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
              value={String(pool.totalSlots)}
            />
            <PoolInfoRow
              label="Price per slot"
              value={`₦${pool.pricePerSlot.toLocaleString()}`}
            />
          </div>

          {/* Slot fill bar */}
          <SlotFillBar filled={pool.filledSlots} total={pool.totalSlots} />

          {/* Total value */}
          <PoolInfoRow
            label="Total value"
            value={`₦${pool.totalValue.toLocaleString()}`}
          />

          {/* Info callout */}
          <PoolInfoCallout note={pool.infoNote} />
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
            <Button variant="secondary" onClick={() => setMakePaymentOpen(true)}>
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
