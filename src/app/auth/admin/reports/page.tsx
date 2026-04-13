"use client";

import React, { useState } from "react";
import UIContentLayout from "@/components/shared/content-layout";
import ReportsHeader from "@/components/reports/reports-header";
import ReportsTabs, { TabKey } from "@/components/reports/reports-tabs";
import StatsCard from "@/components/shared/stats-card";
import { GoArrowUpRight } from "react-icons/go";
import RevenueChart from "@/components/reports/revenue-chart";
import {
  PoolCompletionChart,
  AveragePoolFillRateChart,
  AveragePoolFillTimeChart,
} from "@/components/reports/pool-performance-charts";
import {
  PoolStatusChart,
  RevenueByCategoryChart,
} from "@/components/reports/distribution-charts";

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("revenue");

  return (
    <UIContentLayout>
      <div className="w-full flex flex-col gap-6">
        <ReportsHeader />

        {/* Stats Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total pools"
            value="142"
            change="+12.5% vs last period"
            icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
          />
          <StatsCard
            title="Total Revenue"
            value="₦1,425,000"
            change="+12.5% vs last month"
            icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
          />
          <StatsCard
            title="Active users"
            value="74"
            change="+12.5% vs last month"
            icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
          />
          <StatsCard
            title="Average pool fill rate"
            value="76.5%"
            change="+12.5% vs last month"
            icon={<GoArrowUpRight className="w-5 h-5 text-green" />}
          />
        </div>

        {/* Tabs section */}
        <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Charts Section */}
        <div className="flex flex-col gap-6 pb-10">
          {activeTab === "revenue" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <RevenueByCategoryChart />
            </div>
          )}

          {activeTab === "performance" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PoolCompletionChart />
                <AveragePoolFillRateChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AveragePoolFillTimeChart />
                <PoolStatusChart />
              </div>
            </>
          )}

          {activeTab === "growth" && (
            <div className="bg-white rounded-2xl p-10 flex flex-col items-center justify-center ring-1 ring-gray-100 min-h-[400px]">
              <p className="text-gray-500 font-inter">User Growth charts implementation pending design details.</p>
            </div>
          )}
        </div>
      </div>
    </UIContentLayout>
  );
};

export default ReportsPage;