"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getPoolById, makePayment } from "@/lib/api/marketplace.service";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolStatusBadge from "@/components/marketplace/item-page/pool-status-badge";
import SlotFillBar from "@/components/marketplace/item-page/slot-fill-bar";
import PoolInfoRow from "@/components/marketplace/item-page/pool-info-row";
import PoolInfoCallout from "@/components/marketplace/item-page/pool-info-callout";
import MakePaymentOverlay from "@/components/marketplace/overlays/make-payment-overlay";

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

const Spinner = () => (
  <div className="w-6 h-6 rounded-full border-2 border-green border-t-transparent animate-spin" />
);

export default function ItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const [pool, setPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(true);
  const [makePaymentOpen, setMakePaymentOpen] = useState(false);
  const [makePaymentLoading, setMakePaymentLoading] = useState(false);

  useEffect(() => {
    getPoolById(id).then((data) => {
      setPool(data);
      setLoading(false);
    });
  }, [id]);

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
      if (result.reserved && result.callbackUrl) {
        window.location.href = result.callbackUrl;
      } else {
        setMakePaymentOpen(false);
      }
    } finally {
      setMakePaymentLoading(false);
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
      <div className="flex flex-col bg-white overflow-x-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 h-12 bg-white border-b border-border-light">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-1.5"
          >
            <BackArrow />
            <span className="text-xs font-inter text-green">Back</span>
          </button>

          <div />

          {/* Share button */}
          <button
            aria-label="Share"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-active-green"
          >
            <ShareIcon />
          </button>
        </header>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-32 md:h-60 flex items-center justify-center bg-soft-green"
        >
          <CowIllustration />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col gap-4 px-4 pt-5 pb-32 flex-1 md:max-w-xl md:mx-auto md:w-full"
        >
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
        </motion.div>

        {/* Sticky CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white flex gap-3 px-4 pt-3 pb-4 border-t border-border-light max-w-screen">
          <div className="flex gap-3 w-full md:max-w-xl md:mx-auto">
            {/* Reserve Slot — primary */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/marketplace/${id}/reserve`)}
              className="flex-1 h-10 rounded-md flex items-center justify-center text-sm font-semibold font-inter text-soft-green bg-green"
            >
              Reserve Slot
            </motion.button>

            {/* Make Payment — secondary (outlined) */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMakePaymentOpen(true)}
              className="flex-1 h-10 rounded-md border border-green flex items-center justify-center text-sm font-semibold font-inter text-green bg-bg"
            >
              Make Payment
            </motion.button>
          </div>
        </div>
      </div>

      {/* Make Payment Overlay */}
      <MakePaymentOverlay
        isOpen={makePaymentOpen}
        isLoading={makePaymentLoading}
        onClose={() => setMakePaymentOpen(false)}
        onContinue={handleMakePaymentContinue}
      />
    </>
  );
}
