"use client";

import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form primitives for the admin overlays (Add Pool / Subpool / Item, etc.).
 * Tokens taken from Figma: label = Inter Medium 13px #555550, input = white,
 * border #cbd5e1, rounded-6, 16px text.
 */

const labelClass = "text-[13px] font-medium text-label font-inter";
const controlClass =
  "w-full bg-white border border-input-border rounded-md px-3 py-2.5 text-base text-near-black font-inter placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green/40";

export const FormField = ({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
    </label>
    {children}
  </div>
);

export const TextInput = ({
  className,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { suffix?: ReactNode }) => {
  if (suffix) {
    return (
      <div className="relative flex items-center">
        <input
          className={cn(controlClass, "pr-10", className)}
          {...props}
        />
        <span className="absolute right-3 text-base font-bold text-near-black font-inter pointer-events-none">
          {suffix}
        </span>
      </div>
    );
  }
  return <input className={cn(controlClass, className)} {...props} />;
};

export const SelectInput = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      className={cn(controlClass, "appearance-none pr-10 cursor-pointer", className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

export const TextArea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(controlClass, "min-h-20 resize-y", className)}
    {...props}
  />
);
