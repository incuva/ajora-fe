import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-4.5rem)] w-full rounded-md px-2 mb-4">
      {children}
    </ScrollArea>
  );
};

export default AdminLayout;
