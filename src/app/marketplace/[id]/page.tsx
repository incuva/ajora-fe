"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getPoolById, makePayment } from "@/lib/api/marketplace.service";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolStatusBadge from "@/components/marketplace/item-page/pool-status-badge";
import PoolInfoRow from "@/components/marketplace/item-page/pool-info-row";
// import PoolInfoCallout from "@/components/marketplace/item-page/pool-info-callout";
import MakePaymentOverlay from "@/components/marketplace/overlays/make-payment-overlay";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";
import { useToastStore } from "@/stores/toast-store";
import { CowIllustration, ShareIcon } from "@/components/shared/icons";
import { X } from "lucide-react";
import SlotAvailableBar from "@/components/marketplace/item-page/slot-available-bar";

// Custom icons for the share overlay
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.774 9.774 0 0 0-6.976-2.868c-5.441 0-9.869 4.372-9.873 9.802-.002 1.777.478 3.513 1.393 5.061l-.91 3.327 3.466-.888zm11.233-5.32c-.3-.149-1.771-.864-2.046-.963-.274-.1-.474-.149-.674.149-.2.3-.773.963-.948 1.162-.175.2-.349.224-.649.075-.3-.149-1.265-.462-2.41-1.474-.89-.785-1.492-1.753-1.666-2.05-.175-.3-.019-.462.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.498.1-.2.05-.374-.025-.523-.075-.15-.674-1.609-.924-2.199-.243-.578-.49-.5-.674-.51-.175-.01-.374-.01-.573-.01-.2 0-.523.074-.797.373-.274.3-1.047 1.01-1.047 2.464 0 1.454 1.072 2.859 1.22 3.058.15.2 2.11 3.184 5.111 4.466.714.305 1.272.487 1.708.625.717.226 1.37.194 1.886.118.575-.085 1.771-.715 2.021-1.405.25-.69.25-1.284.175-1.405-.075-.122-.275-.197-.575-.347z" />
  </svg>
);

const CopyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 fill-none stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const NativeShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 fill-none stroke-current"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

function ItemPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [makePaymentLoading, setMakePaymentLoading] = useState(false);
  const [shareOverlayOpen, setShareOverlayOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  // Toast State
  const { toastSuccess, toastError } = useToastStore();

  useEffect(() => {
    getPoolById(id)
      .then((data) => {
        setPool(data);
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
        email: "incuvaltd@gmail.com",
        callbackUrl: `${url}/marketplace/${pool.id}/payment-success?status=success`,
      });

      if (result.data) {
        toastSuccess("Reservation Found", "Redirecting to payment gateway...");
        setMakePaymentOpen(false);
        window.location.replace(result.data.payment_link);
      } else {
        setMakePaymentOpen(false);
        toastError(
          "Reservation not found",
          "Couldn't find a reservation matching the name and phone number provided.",
        );
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      setMakePaymentOpen(false);
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (error && typeof error === "object") {
        const errObj = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errorMsg = errObj.response?.data?.message || errObj.message || errorMsg;
      }
      toastError("Verification Error", errorMsg);
    } finally {
      setMakePaymentLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toastSuccess(
        "Copied to clipboard",
        "The item link has been copied successfully.",
      );
      setShareOverlayOpen(false);
    } catch (err) {
      toastError("Error", "Could not copy URL");
      console.error("Could not copy URL: ", err);
    }
  };

  const handleWhatsAppShare = () => {
    if (!pool) return;
    const shareText = `Check out ${pool.name} on Ajora!`;
    const shareUrl = window.location.href;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setShareOverlayOpen(false);
  };

  const handleSystemShare = async () => {
    if (!pool) return;
    try {
      await navigator.share({
        title: pool.name,
        text: `Check out ${pool.name} on Ajora!`,
        url: window.location.href,
      });
      setShareOverlayOpen(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error("Error sharing: ", err);
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

  const canPay = pool
    ? pool.available_slots < 1 && pool.status === "open"
    : false;

  return (
    <>
      <div className="flex flex-col bg-white overflow-x-hidden relative">
        {/* Hero image with floating action buttons */}
        <div className="relative w-full h-72 md:h-120 flex items-center justify-center bg-soft-green">
          {/* Floating Back/Close (x) Button */}
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute left-2 top-4 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10 cursor-pointer hover:bg-neutral-50 transition-colors border border-border-light/10"
          >
            <X className="size-4" />
          </button>

          {/* Floating Share Button & Overlay */}
          <div className="absolute right-4 top-4 z-20">
            <button
              onClick={() => setShareOverlayOpen(!shareOverlayOpen)}
              aria-label="Share page"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-active-green shadow-[0_2px_8px_rgba(0,0,0,0.12)] cursor-pointer hover:opacity-90 transition-opacity"
            >
              <ShareIcon />
            </button>

            <AnimatePresence>
              {shareOverlayOpen && (
                <>
                  {/* Transparent overlay backdrop to close on click outside */}
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setShareOverlayOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-2 flex flex-col gap-1 z-20 origin-top-right"
                  >
                    <button
                      onClick={handleWhatsAppShare}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-inter font-medium text-near-black hover:bg-soft-green/50 active:bg-soft-green rounded-lg transition-colors text-left"
                    >
                      <WhatsAppIcon />
                      Share via WhatsApp
                    </button>

                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-inter font-medium text-near-black hover:bg-soft-green/50 active:bg-soft-green rounded-lg transition-colors text-left"
                    >
                      <CopyIcon />
                      Copy Link
                    </button>

                    {typeof navigator !== "undefined" &&
                      "share" in navigator && (
                        <button
                          onClick={handleSystemShare}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-inter font-medium text-near-black hover:bg-soft-green/50 active:bg-soft-green rounded-lg transition-colors text-left"
                        >
                          <NativeShareIcon />
                          More Options
                        </button>
                      )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {pool.imageUrl ? (
            <Image
              src={pool.imageUrl}
              alt={pool.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              fetchPriority="high"
            />
          ) : (
            <CowIllustration />
          )}
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
          <p className="text-sm md:text-base font-inter text-black leading-relaxed">
            {pool.description}
          </p>

          {/* Info rows */}
          <div className="flex flex-col gap-3">
            <PoolInfoRow
              label="Number of Slots"
              value={String(pool.total_slots)}
            />
            <PoolInfoRow
              label="Remaining Slots"
              value={String(pool.available_slots)}
            />
            <PoolInfoRow
              label="Weight per Slot"
              value={`${pool.weight_per_slot}kg`}
            />
            <PoolInfoRow
              label="Price per slot"
              value={`₦${pool.slot_price.toLocaleString()}`}
            />
          </div>

          {/* Slot available bar */}
          {/* <SlotAvailableBar
            available={pool.available_slots}
            total={pool.total_slots}
          /> */}

          {/* Total value */}
          {/* <PoolInfoRow
            label="Total value"
            value={`₦${(pool.total_slots - pool.available_slots) * pool.slot_price}`}
          /> */}

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
              disabled={pool.available_slots < 1}
            >
              Book Now
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
