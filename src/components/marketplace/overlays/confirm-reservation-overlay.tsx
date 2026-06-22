"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DeliveryMode } from "@/lib/types/marketplace.types";

interface ConfirmReservationOverlayProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onProceed: (data: {
    fullName: string;
    whatsappNumber: string;
    deliveryMode: DeliveryMode;
    location: string;
  }) => void;
}

const ConfirmReservationOverlay = ({
  isOpen,
  isLoading,
  onClose,
  onProceed,
}: ConfirmReservationOverlayProps) => {
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");
  const [location, setLocation] = useState("");

  const handleProceed = () => {
    onProceed({ fullName, whatsappNumber, deliveryMode, location });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-2xl bg-white p-4 flex flex-col gap-6"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full mx-auto bg-soft-green" />

            {/* Header */}
            <div className="flex flex-col gap-1">
              <h2 className="font-playfair text-lg font-medium text-green">
                Confirm Reservation
              </h2>
              <p className="text-[10px] font-inter text-gold-muted">
                Enter your details to confirm your reservation
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cr-full-name"
                  className="text-[13px] font-medium font-inter text-label"
                >
                  Full name
                </label>
                <input
                  id="cr-full-name"
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
                  htmlFor="cr-whatsapp"
                  className="text-[13px] font-medium font-inter text-label"
                >
                  Whatsapp number
                </label>
                <input
                  id="cr-whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Enter your whatsapp number"
                  className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder"
                />
              </div>

              {/* Delivery Mode */}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-medium font-inter text-label">
                  Delivery
                </span>
                <div className="flex gap-4">
                  {(["pickup", "delivery"] as DeliveryMode[]).map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="delivery-mode"
                        value={mode}
                        checked={deliveryMode === mode}
                        onChange={() => setDeliveryMode(mode)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          deliveryMode === mode
                            ? "border-green"
                            : "border-input-border"
                        }`}
                      >
                        {deliveryMode === mode && (
                          <div className="w-2 h-2 rounded-full bg-green" />
                        )}
                      </div>
                      <span className="text-xs font-inter text-green capitalize">
                        {mode}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location — only when delivery is selected */}
              {deliveryMode === "delivery" && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="cr-location"
                    className="text-[13px] font-medium font-inter text-label"
                  >
                    Location
                  </label>
                  <input
                    id="cr-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full border border-input-border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder"
                  />
                </div>
              )}
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
                onClick={handleProceed}
                disabled={
                  isLoading ||
                  !fullName.trim() ||
                  !whatsappNumber.trim() ||
                  (deliveryMode === "delivery" && !location.trim())
                }
                className="flex-1 h-10 rounded-md bg-green flex items-center justify-center text-sm font-semibold font-inter text-soft-green transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Processing…" : "Proceed"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmReservationOverlay;
