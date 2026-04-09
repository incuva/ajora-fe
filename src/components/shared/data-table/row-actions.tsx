"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface RowActionsProps {
  actions: RowAction[];
}

/**
 * Three-dot context menu per table row.
 * Closes on outside click or Escape key.
 */
const RowActions = ({ actions }: RowActionsProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Row actions"
        aria-expanded={open}
        aria-haspopup="menu"
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-50 min-w-[160px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 py-1 overflow-hidden"
        >
          {actions.map((action, idx) => (
            <button
              key={idx}
              role="menuitem"
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors",
                action.variant === "destructive"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {action.icon && (
                <span className="shrink-0 w-4 h-4">{action.icon}</span>
              )}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RowActions;
