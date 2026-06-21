"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MakePaymentOverlayProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onContinue: (data: { fullName: string; whatsappNumber: string }) => void;
}

const MakePaymentOverlay = ({
  isOpen,
  isLoading,
  onClose,
  onContinue,
}: MakePaymentOverlayProps) => {
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleContinue = () => {
    onContinue({ fullName, whatsappNumber });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="mp-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-2xl bg-white p-4 pb-safe flex flex-col gap-6"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full mx-auto bg-soft-green" />

            {/* Header */}
            <div className="flex flex-col gap-1">
              <h2 className="font-playfair text-lg font-medium text-green">
                Make Payment
              </h2>
              <p className="text-[10px] font-inter text-gold-muted">
                Enter your details to locate your reservation
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="mp-full-name"
                  className="text-[13px] font-medium font-inter text-label"
                >
                  Full name
                </label>
                <input
                  id="mp-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="mp-whatsapp"
                  className="text-[13px] font-medium font-inter text-label"
                >
                  Whatsapp number
                </label>
                <input
                  id="mp-whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Enter your whatsapp number"
                  className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-md border border-green bg-bg flex items-center justify-center text-sm font-semibold font-inter text-green"
              >
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={isLoading || !fullName.trim() || !whatsappNumber.trim()}
                className="flex-1 h-10 rounded-md bg-green flex items-center justify-center text-sm font-semibold font-inter text-soft-green transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Checking…" : "Continue"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MakePaymentOverlay;
