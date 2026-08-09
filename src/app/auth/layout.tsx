"use client";

import UIHeader from "@/components/shared/header";
import UITopbar from "@/components/shared/topbar";
import MobileNav from "@/components/shared/mobile-nav";
import { usePathname } from "next/navigation";
import React from "react";

/** Auth routes that render standalone, without the admin sidebar/header shell. */
const PUBLIC_AUTH_ROUTES = ["/auth/admin/login"];

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Login — no shell.
  if (isPublicAuthRoute) {
    return <>{children}</>;
  }

  return (
    <main className="flex h-screen w-full bg-bg overflow-y-hidden">
      <UIHeader className="hidden md:flex" />
      <section className="w-full min-w-0 flex flex-col">
        <MobileNav />
        <UITopbar className="hidden md:flex" />
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
