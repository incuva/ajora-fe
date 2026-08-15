"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, MessageCircleQuestionMark } from "lucide-react";
import { getPools } from "@/lib/api/marketplace.service";
import type { Pool } from "@/lib/types/marketplace.types";
import PoolCard from "@/components/marketplace/pool-card";
import Spinner from "@/components/shared/spinner";
import { useToastStore } from "@/stores/toast-store";

/**
 * Marketplace listing — every open pool from GET /user/pools.
 * Reuses the item-page header treatment and PoolCard styling. The [id]/layout
 * header is scoped to detail routes, so this index renders its own to match.
 */
export default function MarketplacePage() {
  const router = useRouter();
  const { toastError } = useToastStore();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPools()
      .then((data) =>
        setPools((data ?? []).filter((p) => p.status === "open")),
      )
      .catch((err) => {
        toastError(
          "Error loading pools",
          err?.response?.data?.message ||
            err?.message ||
            "Unable to retrieve pools. Please reload the page.",
        );
        setPools([]);
      })
      .finally(() => setLoading(false));
  }, [toastError]);

  return (
    <section className="w-full min-h-screen flex flex-col bg-white">
      {/* Shared logo header (mirrors marketplace/[id]/layout.tsx) */}
      <header className="flex justify-between items-center px-4 h-14 md:h-20 bg-white sticky top-0 z-50 border-b border-border-light shrink-0">
        <Image
          src="/logo.png"
          alt="Àjọrà"
          width={160}
          height={80}
          priority
          className="object-contain h-20 md:h-24 w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />

        <section className="flex gap-3.5">
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-soft-green">
            <MessageCircleQuestionMark className="size-4" color="#114B3A" />
          </div>
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-soft-green">
            <Bell className="size-4" color="#114B3A" />
          </div>
        </section>
      </header>

      <main className="flex-1 flex flex-col px-4 py-6 md:py-8 w-full md:max-w-5xl md:mx-auto">
        {/* Title */}
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-near-black">
            Active Pools
          </h1>
          <p className="text-sm md:text-base font-inter text-text-sec">
            Browse open pools and join the ones you like.
          </p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : pools.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20 text-center">
            <p className="font-playfair text-lg font-bold text-green">
              No active pools right now
            </p>
            <p className="text-sm font-inter text-text-sec">
              New pools are opening soon — check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {pools.map((pool, i) => (
              <PoolCard key={pool.id} pool={pool} index={i} />
            ))}
          </div>
        )}
      </main>
    </section>
  );
}
