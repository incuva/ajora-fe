"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/marketplace/common/button";
import { useReservationStore } from "@/stores/reservation-store";
import { VerifyReservationFormValues, verifyReservationSchema } from "@/utils/validators";

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
  const { fullname, phone, setReservationDetails } = useReservationStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<VerifyReservationFormValues>({
    resolver: zodResolver(verifyReservationSchema),
    defaultValues: {
      fullname,
      phone,
    },
    mode: "onChange",
  });

  // Sync with store when overlay opens
  useEffect(() => {
    if (isOpen) {
      setValue("fullname", fullname);
      setValue("phone", phone);
    }
  }, [isOpen, fullname, phone, setValue]);

  const onSubmit = (data: VerifyReservationFormValues) => {
    setReservationDetails(data);
    onContinue({ fullName: data.fullname, whatsappNumber: data.phone });
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
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                      htmlFor="mp-whatsapp"
                      className="text-[13px] font-medium font-inter text-label"
                    >
                      Whatsapp number
                    </label>
                    <input
                      id="mp-whatsapp"
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
