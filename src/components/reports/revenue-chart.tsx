"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "JAN", value: 0.61 },
  { name: "FEB", value: 0.73 },
  { name: "MAR", value: 0.65 },
  { name: "APR", value: 0.62 },
  { name: "MAY", value: 0.78 },
  { name: "JUN", value: 0.69 },
  { name: "JUL", value: 0.82 },
  { name: "AUG", value: 0.88 },
  { name: "SEP", value: 0.74 },
];

const RevenueChart = () => {
  return (
    <div className="w-full h-[300px] bg-white rounded-2xl p-6 ring-1 ring-gray-100">
      <h3 className="font-playfair text-lg font-medium text-gray-900 mb-6">
        Monthly Revenue
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C89B3C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#F3F4F6"
            />
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
              ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#C89B3C"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
