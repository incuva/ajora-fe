"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import CheckoutSummaryRow from "@/components/marketplace/checkout/checkout-summary-row";

const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function CheckoutContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");

  const orderId = searchParams.get("orderId") ?? "#---";
  const description = searchParams.get("description") ?? "---";
  const slotCount = searchParams.get("slotCount") ?? "--";
  const offals = searchParams.get("offals") ?? "--";
  const amount = Number(searchParams.get("amount") ?? 0);
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  const handleProceed = () => {
    if (callbackUrl) {
      window.location.href = callbackUrl;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <header className="flex items-center gap-2 px-4 h-14 bg-white sticky top-0 z-10 border-b border-border-light">
        <button
          onClick={() => router.push(`/marketplace/${id}`)}
          aria-label="Go back"
          className="flex items-center gap-1.5"
        >
          <BackArrow />
          <span className="text-xs font-inter text-green">Back</span>
        </button>
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-8 px-4 pt-6 pb-32 flex-1 md:max-w-xl md:mx-auto md:w-full"
      >
        <h1 className="font-playfair text-2xl font-bold text-black">
          Your reservation
        </h1>

        {/* Receipt rows */}
        <div className="flex flex-col gap-4">
          <CheckoutSummaryRow label="Description" value={description} />
          <div className="h-px w-full bg-border-light" />
          <CheckoutSummaryRow label="Order ID" value={orderId} />
          <div className="h-px w-full bg-border-light" />
          <CheckoutSummaryRow label="Number of Slots" value={slotCount} />
          <div className="h-px w-full bg-border-light" />
          <CheckoutSummaryRow label="Offals" value={offals} />
          <div className="h-px w-full bg-border-light" />
          <CheckoutSummaryRow
            label="Amount"
            value={amount > 0 ? `₦${amount.toLocaleString()}` : "--"}
          />
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white px-4 pt-3 pb-safe border-t border-border-light">
        <div className="md:max-w-xl md:mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleProceed}
            disabled={!callbackUrl}
            className="w-full h-10 rounded-md flex items-center justify-center text-sm font-semibold font-inter text-soft-green bg-green disabled:opacity-50"
          >
            {amount > 0
              ? `Proceed to Checkout (₦${amount.toLocaleString()})`
              : "Proceed to Checkout"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
