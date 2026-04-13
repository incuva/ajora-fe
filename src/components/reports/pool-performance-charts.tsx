"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

const completionData = [
  { name: "Jan", value: 0.62 },
  { name: "Feb", value: 0.75 },
  { name: "Mar", value: 0.68 },
  { name: "Apr", value: 0.72 },
  { name: "May", value: 0.67 },
  { name: "Jun", value: 0.82, highlighted: true },
  { name: "Jul", value: 0.65 },
  { name: "Aug", value: 0.74 },
  { name: "Sep", value: 0.58 },
];

const fillRateData = [
  { name: "JAN", value: 35 },
  { name: "FEB", value: 65 },
  { name: "MAR", value: 50 },
  { name: "APR", value: 60 },
  { name: "MAY", value: 68 },
  { name: "JUN", value: 72 },
  { name: "JUL", value: 78 },
  { name: "AUG", value: 85 },
  { name: "SEP", value: 72 },
];

const fillTimeData = [
  { name: "Meat", value: 0.62 },
  { name: "Frozen Food", value: 0.75 },
  { name: "Grains", value: 0.68 },
  { name: "Live Stock", value: 0.72 },
  { name: "Tubers", value: 0.67 },
  { name: "Protein", value: 0.78 },
];

export const PoolCompletionChart = () => (
  <div className="w-full h-[320px] bg-white rounded-2xl p-6 ring-1 ring-gray-100">
    <h3 className="font-playfair text-lg font-medium text-gray-900 mb-6">
      Pool Completion
    </h3>
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={completionData}>
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
            {completionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.highlighted ? "#114B3A" : "#F8E8C0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const AveragePoolFillRateChart = () => (
  <div className="w-full h-[320px] bg-white rounded-2xl p-6 ring-1 ring-gray-100">
    <h3 className="font-playfair text-lg font-medium text-gray-900 mb-6">
      Average Pool Fill Rate
    </h3>
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={fillRateData}>
          <defs>
            <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C89B3C" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#C89B3C"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const AveragePoolFillTimeChart = () => (
  <div className="w-full h-[320px] bg-white rounded-2xl p-6 ring-1 ring-gray-100">
    <h3 className="font-playfair text-lg font-medium text-gray-900 mb-6">
      Average Pool Fill Time
    </h3>
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={fillTimeData}>
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
          <Bar
            dataKey="value"
            fill="#F8E8C0"
            radius={[4, 4, 4, 4]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
