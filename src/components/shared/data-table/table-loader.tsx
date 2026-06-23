"use client";

import Image from "next/image";

/**
 * TableLoader
 *
 * Displays the Àjọrà logo-icon with a spinning arc ring — used as the
 * loading state inside DataTable.
 */
const TableLoader = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[35vh] gap-4"
      aria-label="Loading data"
      role="status"
    >
      {/* Spinning ring + centred logo */}
      <div className="relative w-20 h-20">
        {/* Track ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-grey" />

        {/* Spinning arc — green top, gold right */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent animate-spin"
          style={{
            borderTopColor: "#114B3A",
            borderRightColor: "#DEAF4A",
            animationDuration: "1.1s",
          }}
        />

        {/* Logo mark */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <Image
            src="/logo-icon.png"
            alt="Àjọrà"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <p className="text-sm text-gray-400 font-inter tracking-wide select-none">
        Loading…
      </p>
    </div>
  );
};

export default TableLoader;
