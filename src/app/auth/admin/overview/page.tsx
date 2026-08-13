"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoArrowUpRight, GoArrowDownRight } from "react-icons/go";
import { AppsListRegular } from "@fluentui/react-icons";
import UIContentLayout from "@/components/shared/content-layout";
import StatsCard from "@/components/shared/stats-card";
import StatusBadge from "@/components/shared/data-table/status-badge";
import { normalizePoolStatus } from "@/constants/pool";
import { getAdminOverview } from "@/lib/api/admin-overview.service";
import type { AdminOverview } from "@/lib/types/admin.types";
import { useToastStore } from "@/stores/toast-store";

const formatNaira = (value: number) =>
  `₦${Math.round(value).toLocaleString("en-NG")}`;

const formatChange = (pct: number, trend: string) => {
  const sign = trend === "decrease" ? "-" : "+";
  return `${sign}${Math.abs(pct)}% this month`;
};

const OverviewPage = () => {
  const { toastError } = useToastStore();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getAdminOverview()
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (err as Error)?.message ||
          "Could not load the overview.";
        toastError("Load failed", message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendIcon = (trend?: string) =>
    trend === "decrease" ? (
      <GoArrowDownRight className="w-5 h-5 text-red-500" />
    ) : (
      <GoArrowUpRight className="w-5 h-5 text-green" />
    );

  const dash = isLoading ? "…" : "--";
  const recentPools = overview?.recent_pools ?? [];

  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-4">
        <Card className="bg-transparent ring-0 pt-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-xl font-medium">
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0 overflow-x-auto md:overflow-visible pb-1">
            <StatsCard
              title="Total Active Pools"
              value={
                overview ? overview.active_pools.total.toLocaleString() : dash
              }
              change={
                overview
                  ? formatChange(
                      overview.active_pools.change_percentage,
                      overview.active_pools.trend,
                    )
                  : "- -"
              }
              icon={trendIcon(overview?.active_pools.trend)}
            />
            <StatsCard
              title="Total Revenue"
              value={overview ? formatNaira(overview.total_revenue) : dash}
              change=" "
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
            <StatsCard
              title="New Users"
              value={
                overview
                  ? overview.new_users.total_last_30_days.toLocaleString()
                  : dash
              }
              change={
                overview
                  ? formatChange(
                      overview.new_users.change_percentage,
                      overview.new_users.trend,
                    )
                  : "- -"
              }
              icon={trendIcon(overview?.new_users.trend)}
            />
            <StatsCard
              title="Pending Orders"
              value={
                overview ? overview.pending_orders.toLocaleString() : dash
              }
              change=" "
              icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
            />
          </CardContent>
        </Card>

        <Card className="bg-transparent ring-0">
          <CardHeader className="px-0">
            <CardTitle className="font-playfair text-lg font-medium">
              Recent Pools
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {recentPools.length > 0 ? (
              <div className="bg-white rounded-2xl ring-1 ring-gray-100 divide-y divide-gray-50">
                {recentPools.map((pool) => {
                  const filled = Math.max(
                    0,
                    pool.total_slots - pool.available_slots,
                  );
                  return (
                    <Link
                      key={pool.id}
                      href={`/auth/admin/pools/${pool.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-semibold text-near-black font-inter truncate">
                          {pool.name}
                        </span>
                        <span className="text-xs text-text-sec font-inter">
                          {pool.category} • {filled}/{pool.total_slots} slots
                          taken
                        </span>
                      </div>
                      <StatusBadge
                        status={normalizePoolStatus(pool.status)}
                        className="px-3 py-1 shrink-0"
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white h-80 rounded-2xl flex justify-center items-center font-inter">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="border border-gray-200 p-2 rounded-md">
                    <AppsListRegular className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-green">
                    {isLoading ? "Loading…" : "No Pools Yet"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UIContentLayout>
  );
};

export default OverviewPage;
