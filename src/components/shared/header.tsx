import UISidebar from "./sidebar";
import Image from "next/image";
import UserMenu from "./user-menu";
import { cn } from "@/lib/utils";

const UIHeader = ({ className }: { className?: string }) => {
  return (
    <main className={cn("w-3xs flex flex-col justify-between border-r border-slate-200", className)}>
      <section className="w-full flex flex-col">
        {/* Table Icon View */}
        <section className="lg:hidden w-full h-18 p-2">
          <Image
            src="/logo-icon.png"
            alt="Àjọrà"
            width={160}
            height={32}
            priority
            className="object-contain"
            style={{ height: "100%", width: "100%" }}
          />
        </section>

        {/* Desktop View */}
        <section className="hidden lg:block w-full h-18 p-2">
          <Image
            src="/logo.png"
            alt="Àjọrà"
            width={160}
            height={32}
            priority
            className="object-cover"
            style={{ height: "100%", width: "60%" }}
          />
        </section>
        <UISidebar />
      </section>

      {/* User Badge + logout */}
      <section className="hidden lg:block w-52 self-end p-2">
        <UserMenu />
      </section>
    </main>
  );
};

export default UIHeader;
