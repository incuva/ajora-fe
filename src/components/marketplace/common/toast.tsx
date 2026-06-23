"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

const Toast = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoCloseDuration = 5000,
}: ToastProps) => {
  useEffect(() => {
    if (isOpen && autoCloseDuration > 0) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDuration, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto bg-white rounded-xl border flex items-center justify-between p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${
            isSuccess ? "border-green-600 text-green-600" : "border-red-600 text-red-600"
          }`}
          style={{ minHeight: "58px" }}
        >
          {/* Main Content (Icon + Texts) */}
          <div className="flex items-center gap-3 flex-1 mr-3">
            {/* Status Icon Indicator */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isSuccess ? "bg-badge-green" : "bg-red-400"
              }`}
            >
              {isSuccess ? (
                // Checkmark SVG
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 4L5 8L3 6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Cross SVG
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 3L9 9M9 3L3 9"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            {/* Title & Body */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-relaxed font-inter">
                {title}
              </span>
              <span className="text-[10px] leading-snug font-inter opacity-90">
                {message}
              </span>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onClose}
            aria-label="Dismiss toast"
            className="p-1 cursor-pointer shrink-0"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
