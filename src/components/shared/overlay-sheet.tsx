"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverlaySheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Extra classes for the card wrapper (e.g. max width). */
  className?: string;
  /**
   * "sheet"  → bottom-sheet on mobile, centered card on md+ (forms, details).
   * "center" → always a centered card (small modals like Share Link).
   */
  variant?: "sheet" | "center";
}

/**
 * Shared modal shell used by every admin overlay. Handles the backdrop, entrance animation,
 * body-scroll lock and Escape-to-close. Consumers provide their own header/body
 * via children — usually starting with <OverlayHeader />.
 */
const OverlaySheet = ({
  isOpen,
  onClose,
  children,
  className,
  variant = "sheet",
}: OverlaySheetProps) => {
  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const isCenter = variant === "center";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />

          <motion.div
            key="sheet"
            initial={isCenter ? { opacity: 0, scale: 0.96 } : { y: "100%" }}
            animate={isCenter ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={isCenter ? { opacity: 0, scale: 0.96 } : { y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed inset-0 z-50 flex justify-center w-full p-0 md:p-4 pointer-events-none",
              isCenter ? "items-center p-4" : "items-end md:items-center"
            )}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "pointer-events-auto w-full mx-auto bg-bg md:bg-white max-h-[92vh] overflow-y-auto",
                isCenter
                  ? "max-w-sm rounded-2xl bg-white"
                  : "max-w-md rounded-t-2xl md:rounded-2xl",
                className
              )}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OverlaySheet;

/** Standard overlay header: green Playfair title, grey subtitle, dismiss button. */
export const OverlayHeader = ({
  title,
  subtitle,
  onClose,
  align = "left",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  align?: "left" | "center";
}) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4",
      align === "center" && "flex-col items-center text-center"
    )}
  >
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" && "items-center"
      )}
    >
      <h2 className="font-playfair text-[28px] leading-tight font-bold text-green">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm font-inter text-text-sec">{subtitle}</p>
      )}
    </div>
    <button
      onClick={onClose}
      aria-label="Close"
      className={cn(
        "shrink-0 text-gray-500 hover:text-gray-800 transition-colors",
        align === "center" && "absolute right-4 top-4"
      )}
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);
