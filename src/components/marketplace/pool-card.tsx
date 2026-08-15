"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolStatusBadge from "@/components/marketplace/item-page/pool-status-badge";
import SlotFillBar from "@/components/marketplace/item-page/slot-fill-bar";
import { CowIllustration } from "@/components/shared/icons";

interface PoolCardProps {
  pool: Pool;
  /** Stagger index for the entrance animation. */
  index?: number;
}

/**
 * Compact pool summary card used on the marketplace listing. Mirrors the
 * item-page styling (soft-green media well, playfair name, status badge, slot
 * fill bar) and links through to the full pool at /marketplace/{id}.
 */
const PoolCard = ({ pool, index = 0 }: PoolCardProps) => {
  const filled = Math.max(0, pool.total_slots - pool.available_slots);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 12) * 0.05,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/marketplace/${pool.id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-border-light hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Media */}
        <div className="relative w-full aspect-16/10 bg-soft-green flex items-center justify-center overflow-hidden">
          {pool.imageUrl ? (
            <Image
              src={pool.imageUrl}
              alt={pool.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CowIllustration />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-playfair text-lg font-bold text-near-black truncate">
              {pool.name}
            </h3>
            <PoolStatusBadge status={pool.status} />
          </div>

          {pool.description && (
            <p className="text-sm font-inter text-text-sec line-clamp-2">
              {pool.description}
            </p>
          )}

          {pool.total_slots > 0 && (
            <SlotFillBar filled={filled} total={pool.total_slots} />
          )}

          <div className="mt-auto flex items-center justify-between pt-1">
            <span className="text-sm font-inter text-text-sec">
              Price per slot
            </span>
            <span className="text-base font-semibold font-inter text-near-black">
              ₦{pool.slot_price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PoolCard;
