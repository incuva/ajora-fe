"use client";

import UIHeader from "@/components/shared/header";
import UITopbar from "@/components/shared/topbar";
import React from "react";
import DeviceRestriction from "@/components/shared/device-restriction";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/auth/admin");

  // Only apply restriction to admin routes
  if (isAdminRoute) {
    return (
      <DeviceRestriction>
        <main className="flex h-screen w-full bg-bg">
          <UIHeader />
          <section className="w-full flex flex-col">
            <UITopbar />
            {children}
          </section>
        </main>
      </DeviceRestriction>
    );
  }

  return (
    <main className="flex h-screen w-full bg-bg">
      <UIHeader />
      <section className="w-full flex flex-col">
        <UITopbar />
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;

