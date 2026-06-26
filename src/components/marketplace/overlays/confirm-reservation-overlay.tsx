"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import type { DeliveryMode } from "@/lib/types/marketplace.types";
import Button from "@/components/marketplace/common/button";
import { useReservationStore } from "@/stores/reservation-store";
import { ConfirmReservationFormValues, confirmReservationSchema } from "@/utils/validators";

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
  const { fullname, phone, delivery, location, setReservationDetails } = useReservationStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<ConfirmReservationFormValues>({
    resolver: zodResolver(confirmReservationSchema),
    defaultValues: {
      fullname,
      phone,
      delivery,
      location,
    },
    mode: "onChange",
  });

  const watchDelivery = useWatch({
    control,
    name: "delivery",
  });

  useEffect(() => {
    if (isOpen) {
      setValue("fullname", fullname);
      setValue("phone", phone);
      setValue("delivery", delivery);
      setValue("location", location);
    }
  }, [isOpen, fullname, phone, delivery, location, setValue]);

  const onSubmit = (data: ConfirmReservationFormValues) => {
    setReservationDetails(data);
    onProceed({
      fullName: data.fullname,
      whatsappNumber: data.phone,
      deliveryMode: data.delivery,
      location: data.delivery === "delivery" ? (data.location || "") : "",
    });
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
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center w-full"
          >
            <div className="w-full max-w-md mx-auto rounded-t-2xl md:rounded-2xl bg-white p-4 flex flex-col gap-6 animate-in slide-in-from-bottom">
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
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                      placeholder="Enter your full name"
                      {...register("fullname")}
                      className={`w-full border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder ${
                        errors.fullname ? "border-red-500 focus:border-red-500" : "border-input-border focus:border-green"
                      }`}
                    />
                    {errors.fullname && (
                      <span className="text-red-500 text-xs font-inter mt-0.5">
                        {errors.fullname.message}
                      </span>
                    )}
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
                      placeholder="Enter your whatsapp number (e.g. 08012345678)"
                      {...register("phone")}
                      className={`w-full border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder ${
                        errors.phone ? "border-red-500 focus:border-red-500" : "border-input-border focus:border-green"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs font-inter mt-0.5">
                        {errors.phone.message}
                      </span>
                    )}
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
                            value={mode}
                            {...register("delivery")}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              watchDelivery === mode
                                ? "border-green"
                                : "border-input-border"
                            }`}
                          >
                            {watchDelivery === mode && (
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
                  {watchDelivery === "delivery" && (
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
                        placeholder="Enter your delivery address"
                        {...register("location")}
                        className={`w-full border rounded-md px-3 py-2.5 text-sm font-inter text-black outline-none bg-white placeholder:text-placeholder ${
                          errors.location ? "border-red-500 focus:border-red-500" : "border-input-border focus:border-green"
                        }`}
                      />
                      {errors.location && (
                        <span className="text-red-500 text-xs font-inter mt-0.5">
                          {errors.location.message}
                        </span>
                      )}
                    </div>
                  )}
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
                    disabled={!isValid}
                  >
                    Proceed
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

export default ConfirmReservationOverlay;
