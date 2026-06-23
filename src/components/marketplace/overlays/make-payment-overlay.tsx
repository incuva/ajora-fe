"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/marketplace/common/button";

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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsappNumber.trim()) return;
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
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center w-full"
          >
            {/* Wrapper  */}
            <div className="w-full max-w-md mx-auto rounded-t-2xl md:rounded-2xl bg-white p-4 flex flex-col gap-6">

            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full mx-auto bg-soft-green" />

            {/* Header */}
            <div className="flex flex-col gap-1">
              <h2 className="font-playfair text-lg font-medium text-green">
                Verify Reservation
              </h2>
              <p className="text-[10px] font-inter text-gold-muted">
                Enter your details to verify your reservation
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleContinue} className="flex flex-col gap-6">
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
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder focus:border-green"
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
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Enter your whatsapp number"
                    className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder focus:border-green"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={!fullName.trim() || !whatsappNumber.trim()}
                >
                  Verify
                </Button>
              </div>
            </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MakePaymentOverlay;
