"use client";

import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const poolStatusData = [
  { name: "Active", value: 45, fill: "#114B3A" },
  { name: "Distributed", value: 32, fill: "#2D6A4F" },
  { name: "Filled", value: 28, fill: "#876020" },
  { name: "Closed", value: 87, fill: "#C89B3C" },
];

const categoryRevenueData = [
  { name: "Jan", value: 0.62 },
  { name: "Feb", value: 0.76 },
  { name: "Mar", value: 0.68 },
  { name: "Apr", value: 0.71 },
  { name: "May", value: 0.67 },
  { name: "Jun", value: 0.82, highlighted: true },
  { name: "Jul", value: 0.65 },
  { name: "Aug", value: 0.77 },
  { name: "Sep", value: 0.53 },
];

export const PoolStatusChart = () => (
  <div className="w-full h-[320px] bg-white rounded-2xl p-6 ring-1 ring-gray-100 flex flex-col">
    <h3 className="font-playfair text-lg font-medium text-gray-900 mb-2">
      Pool Status
    </h3>
    <div className="flex-1 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="100%"
          barSize={12}
          data={poolStatusData}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            label={false}
          />
          <Tooltip />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "20px",
              fontSize: "13px",
              color: "#374151"
            }}
            formatter={(value, entry: any) => (
              <span className="flex items-center justify-between w-24 gap-4">
                <span className="text-gray-500">{value}</span>
                <span className="font-medium text-gray-900">%{entry.payload.value}</span>
              </span>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const RevenueByCategoryChart = () => (
  <div className="w-full h-[320px] bg-white rounded-2xl p-6 ring-1 ring-gray-100">
    <h3 className="font-playfair text-lg font-medium text-gray-900 mb-6">
      Revenue by category
    </h3>
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryRevenueData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            domain={[0.5, 1]}
          />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={32}>
            {categoryRevenueData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.highlighted ? "#0A2F25" : "#F8E8C0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
