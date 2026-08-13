"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/auth-store";
import Spinner from "@/components/shared/spinner";

/** Routes under /auth/admin that must NOT be gated (they ARE the gate). */
const PUBLIC_AUTH_ROUTES = ["/auth/admin/login"];

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin shell boundary. Hydrates the persisted session on mount and redirects
 * unauthenticated users to the login screen. All /auth/admin/* pages inherit
 * this gate, except the login route which render standalone.
 */
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);

  // `checked` gates the redirect until hydrate() has actually run — without it,
  // the redirect effect would fire on first render with the pre-hydrate
  // isAuthenticated=false and bounce a valid session to login.
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    hydrate();
    queueMicrotask(() => setChecked(true));
  }, [hydrate]);

  useEffect(() => {
    if (checked && !isPublicAuthRoute && !isAuthenticated) {
      router.replace(
        `/auth/admin/login?redirect=${encodeURIComponent(pathname)}`,
      );
    }
  }, [checked, isPublicAuthRoute, isAuthenticated, router, pathname]);

  // Login: render directly, no shell, no gate.
  if (isPublicAuthRoute) {
    return <>{children}</>;
  }

  // Gate: while hydrate → redirect resolves, hold on a spinner instead of
  // flashing protected content.
  if (!checked || !isAuthenticated) {
    return (
      <div className="h-[calc(100vh-4.5rem)] w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4.5rem)] w-full rounded-md px-2 mb-4">
      {children}
    </ScrollArea>
  );
};

export default AdminLayout;
