"use client";

import React from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const DeviceRestriction = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Mobile restriction overlay - hidden on md (768px) and above */}
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-green p-6 text-center md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xs"
        >
          <div className="mb-8 flex justify-center space-x-4">
            <Smartphone className="h-10 w-10 text-gold opacity-30" />
            <div className="relative">
              <Tablet className="h-12 w-12 text-gold" />
              <Monitor className="absolute -right-4 -top-2 h-8 w-8 text-gold" />
            </div>
          </div>

          <h2 className="font-playfair mb-4 text-3xl font-bold text-gold">
            Desktop View Required
          </h2>
          
          <p className="font-inter mb-8 text-sm leading-relaxed text-gold-light/80">
            To ensure the best experience and access to all administrative tools, 
            the Àjọrà Admin platform is optimized for tablets and desktop screens.
          </p>

          <div className="mx-auto h-px w-16 bg-gold/30 mb-8" />

          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-gold/60">
            Please switch to a larger device
          </p>
        </motion.div>
      </div>

      {/* Main content - only visible on md and above or hidden by overlay on mobile */}
      <div className="hidden md:block h-full w-full">
        {children}
      </div>
    </>
  );
};

export default DeviceRestriction;
