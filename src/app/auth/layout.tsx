import UIHeader from "@/components/ui/header";
import UITopbar from "@/components/ui/topbar";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <main className="flex h-screen w-full">
    <UIHeader />
    <section className="w-full flex flex-col">
      <UITopbar />
      {children}  
    </section>
    </main>;
};  

export default AuthLayout;
