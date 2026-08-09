"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import UIContentLayout from "@/components/shared/content-layout";
import StatusBadge from "@/components/shared/data-table/status-badge";
import PoolEditOverlay from "@/components/pools/pool-edit-overlay";
import SubpoolFormOverlay from "@/components/pools/subpool-form-overlay";
import PoolReservationsTable from "@/components/pools/pool-reservations-table";
import { normalizePoolStatus } from "@/constants/pool";
import { getPoolById } from "@/lib/api/marketplace.service";
import { getAdminPoolById } from "@/lib/api/admin-pools.service";
import type { Pool, Subpool } from "@/lib/types/marketplace.types";
import type { AdminPoolDetail } from "@/lib/types/admin.types";
import { useToastStore } from "@/stores/toast-store";

const formatDate = (iso?: string) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 border-b border-[#c8c8c2] pb-2">
    <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
      {label}
    </span>
    <span className="text-lg font-medium text-near-black font-inter wrap-break-word">
      {value}
    </span>
  </div>
);

const PoolDetailsPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { toastError } = useToastStore();

  const [pool, setPool] = useState<Pool | null>(null);
  const [detail, setDetail] = useState<AdminPoolDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isEditOpen, setEditOpen] = useState(false);
  const [subpoolTarget, setSubpoolTarget] = useState<{
    poolId: string;
    subpool: Subpool | null;
  } | null>(null);

  const load = () => {
    if (!id) return;
    setIsLoading(true);
    Promise.allSettled([getPoolById(id), getAdminPoolById(id)])
      .then(([poolRes, detailRes]) => {
        if (poolRes.status === "fulfilled") {
          setPool(poolRes.value);
          setNotFound(false);
        } else {
          setNotFound(true);
          const err = poolRes.reason;
          const message =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            (err as Error)?.message ||
            "Could not load this pool.";
          toastError("Load failed", message);
        }
        setDetail(detailRes.status === "fulfilled" ? detailRes.value : null);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filled = pool ? Math.max(0, pool.total_slots - pool.available_slots) : 0;
  const raised = pool ? filled * pool.slot_price : 0;
  const target = pool ? pool.total_slots * pool.slot_price : 0;
  const pct = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const revenue = detail ? Number(detail.total_purchase) : raised;

  return (
    <UIContentLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/auth/admin/pools")}
          className="flex items-center gap-2 text-sm font-medium text-grey-800 hover:text-green transition-colors font-inter w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pools
        </button>

        {isLoading ? (
          <div className="h-80 rounded-2xl bg-white ring-1 ring-gray-100 flex items-center justify-center text-text-sec font-inter">
            Loading…
          </div>
        ) : notFound || !pool ? (
          <div className="h-80 rounded-2xl bg-white ring-1 ring-gray-100 flex items-center justify-center text-text-sec font-inter">
            Pool not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: pool summary */}
            <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-gray-100 p-6 flex flex-col gap-5 h-fit">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <h1 className="font-playfair text-2xl font-bold text-green truncate">
                    {pool.name}
                  </h1>
                  {pool.description && (
                    <p className="text-sm text-text-sec font-inter line-clamp-2">
                      {pool.description}
                    </p>
                  )}
                </div>
                <StatusBadge
                  status={normalizePoolStatus(pool.status)}
                  className="px-4 py-1 shrink-0"
                />
              </div>

              {/* Collective progress */}
              <div className="flex flex-col gap-2">
                <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                  Collective Progress
                </span>
                <div className="flex items-end justify-between gap-2">
                  <p className="font-inter">
                    <span className="text-lg font-bold text-near-black">
                      ₦{raised.toLocaleString()}
                    </span>{" "}
                    <span className="text-base text-text-sec">
                      of ₦{target.toLocaleString()}
                    </span>
                  </p>
                  <span className="text-sm font-bold text-near-black">
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gold-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm font-inter text-grey-800">
                  <span>{filled} Slots taken</span>
                  <span>{pool.available_slots} Slots Left</span>
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden bg-grey">
                <Image
                  src={pool.imageUrl || "/assets/cow.png"}
                  alt={pool.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-4">
                <DetailRow label="Item" value={detail?.item_name || pool.name} />
                <DetailRow
                  label="Quantity per Slot"
                  value={
                    pool.weight_per_slot
                      ? `${pool.weight_per_slot}${detail?.unit ? detail.unit : "kg"}`
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Amount per Slot"
                  value={`₦${pool.slot_price.toLocaleString()}`}
                />
                <DetailRow
                  label="Total Value"
                  value={`₦${pool.total_value.toLocaleString()}`}
                />
                <DetailRow
                  label="Revenue Collected"
                  value={`₦${revenue.toLocaleString()}`}
                />
                <DetailRow
                  label="Reservation Deadline"
                  value={formatDate(detail?.deadline)}
                />
                <DetailRow
                  label="Created On"
                  value={formatDate(pool.created_at || detail?.created_at)}
                />
              </div>

              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="w-full h-12 rounded-md bg-green text-primary-foreground text-sm font-semibold font-inter transition-colors hover:bg-green/90"
              >
                Edit Pool
              </button>
            </div>

            {/* Right: subpools + reservations */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Subpools */}
              <div className="bg-white rounded-2xl ring-1 ring-gray-100 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-grey-800 font-inter">
                    Subpools ({pool.subpools?.length ?? 0})
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setSubpoolTarget({ poolId: pool.id, subpool: null })
                    }
                    className="flex items-center gap-1 text-sm font-semibold text-green font-inter hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Subpool
                  </button>
                </div>

                {pool.subpools && pool.subpools.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {pool.subpools.map((sub) => {
                      const subFilled = Math.max(
                        0,
                        sub.total_slots - sub.available_slots,
                      );
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-input-border p-3"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-near-black font-inter">
                              {sub.name}
                            </span>
                            <span className="text-badge font-medium uppercase tracking-wide text-neutral-300 font-inter">
                              {subFilled}/{sub.total_slots} slots • ₦
                              {sub.price.toLocaleString()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSubpoolTarget({ poolId: pool.id, subpool: sub })
                            }
                            aria-label={`Edit ${sub.name}`}
                            className="flex items-center gap-1 text-sm font-semibold text-green font-inter hover:underline"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-text-sec font-inter">
                    No subpools yet.
                  </p>
                )}
              </div>

              {/* Reservations */}
              <PoolReservationsTable poolId={pool.id} />
            </div>
          </div>
        )}
      </div>

      <PoolEditOverlay
        pool={pool}
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={load}
      />

      <SubpoolFormOverlay
        isOpen={subpoolTarget !== null}
        onClose={() => setSubpoolTarget(null)}
        poolId={subpoolTarget?.poolId ?? null}
        subpool={subpoolTarget?.subpool ?? null}
        onSaved={load}
      />
    </UIContentLayout>
  );
};

export default PoolDetailsPage;
