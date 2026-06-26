"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { confirmPayment } from "@/lib/api/marketplace.service";
import type { ConfirmPaymentResult } from "@/lib/types/marketplace.types";
import { useToastStore } from "@/stores/toast-store";
import Button from "@/components/marketplace/common/button";
import Spinner from "@/components/shared/spinner";

function PaymentSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toastSuccess } = useToastStore();

  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? "");
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(() =>
    reference ? "verifying" : "failed"
  );
  const [paymentData, setPaymentData] = useState<ConfirmPaymentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(() =>
    reference ? null : "No payment reference found in the URL."
  );

  useEffect(() => {
    if (!reference) {
      return;
    }

    confirmPayment(reference)
      .then((res) => {
        if (res.status === "paid") {
          setPaymentData(res);
          setStatus("success");
          toastSuccess(
            "Payment Confirmed",
            "Your payment has been verified successfully!"
          );
        } else {
          setStatus("failed");
          setErrorMsg(`Payment status: ${res.status}. Payment has not been marked as paid.`);
        }
      })
      .catch((err) => {
        console.error("Error verifying payment:", err);
        setStatus("failed");
        setErrorMsg(
          err?.response?.data?.message || err?.message || "Unable to confirm payment. Please contact support."
        );
      });
  }, [reference, toastSuccess]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleBackToPool = () => {
    router.push(`/marketplace/${id}`);
  };

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] px-4">
        <Spinner />
        <p className="mt-4 font-inter text-sm text-muted animate-pulse">
          Verifying your payment...
        </p>
        <p className="mt-1 font-inter text-xs text-muted/70">
          Please do not refresh or close this page.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col flex-1 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col flex-1 items-center justify-center px-4 pt-8 pb-16 md:max-w-xl md:mx-auto md:w-full gap-6"
        >
          {/* Error Illustration */}
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-red-50">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <div className="text-center gap-2 flex flex-col">
            <h1 className="font-playfair text-2xl font-bold text-red-600">
              Verification Failed
            </h1>
            <p className="font-inter text-sm text-near-black max-w-sm mx-auto leading-relaxed">
              {errorMsg || "We encountered an issue confirming your payment."}
            </p>
          </div>

          {/* Details Card */}
          {reference && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gold-800 font-inter">Transaction Reference</span>
                <span className="font-mono text-near-black font-medium select-all">
                  {reference}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="p-4 md:max-w-xl md:mx-auto md:w-full flex flex-col gap-3">
          {reference && (
            <Button variant="primary" fullWidth onClick={handleRetry}>
              Retry Verification
            </Button>
          )}
          <Button variant="secondary" fullWidth onClick={handleBackToPool}>
            Return to Item Page
          </Button>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="flex flex-col flex-1 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col flex-1 items-center justify-center px-4 pt-8 pb-16 md:max-w-xl md:mx-auto md:w-full gap-6"
      >
        {/* Success Checkmark Ring */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-soft-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <div className="text-center gap-2 flex flex-col">
          <h1 className="font-playfair text-2xl font-bold text-green">
            Payment Confirmed!
          </h1>
          <p className="font-inter text-sm text-near-black max-w-sm mx-auto leading-relaxed">
            Your payment was verified successfully. You will be contacted shortly for the delivery/pickup setup.
          </p>
        </div>

        {/* Payment details summary */}
        {paymentData && (
          <div className="w-full bg-soft-green/30 border border-soft-green/70 rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-green/80 border-b border-soft-green pb-2">
              Payment Summary
            </h3>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gold-800 font-inter">Amount Paid</span>
              <span className="text-green font-bold font-inter text-sm">
                ₦{paymentData.amount.toLocaleString()}
              </span>
            </div>

            <div className="h-px bg-soft-green/75" />

            <div className="flex justify-between items-center text-xs">
              <span className="text-gold-800 font-inter">Transaction Reference</span>
              <span className="font-mono text-near-black font-medium">
                {paymentData.reference}
              </span>
            </div>

            <div className="h-px bg-soft-green/75" />

            <div className="flex justify-between items-center text-xs">
              <span className="text-gold-800 font-inter w-2/5">Reservation ID</span>
              <span className="font-mono text-near-black font-medium w-3/5 text-right">
                {paymentData.reservation_id}
              </span>
            </div>

            <div className="h-px bg-soft-green/75" />

            <div className="flex justify-between items-center text-xs">
              <span className="text-gold-800 font-inter w-2/5">Status</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {paymentData.status}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Done Button */}
      <div className="p-4 md:max-w-xl md:mx-auto md:w-full">
        <Button variant="primary" fullWidth onClick={handleBackToPool}>
          Done
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
