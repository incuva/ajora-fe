"use client";

import UIHeader from "@/components/shared/header";
import UITopbar from "@/components/shared/topbar";
import MobileNav from "@/components/shared/mobile-nav";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
