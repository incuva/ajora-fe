"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

/**
 * Admin identity + logout menu, shared by the desktop sidebar header and the
 * mobile drawer footer. Shows the signed-in admin's name/role when available.
 *
 * NOTE: hydrate() restores only the token (not the admin record), so after a
 * hard refresh `admin` is null until the next login. We fall back to a generic
 * label in that case; the session is still valid via the persisted token.
 */
const UserMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const { toastSuccess } = useToastStore();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const name = admin
    ? `${admin.first_name} ${admin.last_name}`.trim()
    : "Àjọrà Admin";
  const roleLabel = admin?.role === "super-admin" ? "Super Admin" : "Admin";
  const initials = admin
    ? `${admin.first_name?.[0] ?? ""}${admin.last_name?.[0] ?? ""}`.toUpperCase()
    : "AA";

  const handleLogout = () => {
    logout();
    toastSuccess("Signed out", "You have been logged out.");
    router.replace("/auth/admin/login");
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-2 p-2 rounded-md hover:bg-gold-100/60 transition-colors"
      >
        <span className="flex gap-2 items-center min-w-0">
          <Avatar className="w-9 h-9">
            <AvatarImage
              className="rounded-md"
              src="https://github.com/shadcn.png"
              alt={name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="flex flex-col font-inter gap-0.5 min-w-0 text-left">
            <span className="font-bold text-sm text-gray-900 truncate">{name}</span>
            <span className="text-xs text-gray-600 truncate">{roleLabel}</span>
          </span>
        </span>
        <ChevronsUpDown className="w-4 h-4 text-slate-700 shrink-0" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-white rounded-xl shadow-lg ring-1 ring-black/5 py-1 overflow-hidden"
        >
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors font-inter"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
