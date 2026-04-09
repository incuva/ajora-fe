import UISidebar from "./sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronsUpDown } from "lucide-react";

const UIHeader = () => {
  return (
    <main className="w-3xs flex flex-col justify-between border-r border-slate-200">
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

      {/* User Badge  */}
      <section className="hidden lg:flex w-52 self-end justify-between items-center gap-2 p-4 rounded-md">
        <section className="flex gap-2 items-center">
          <Avatar className="w-9 h-9">
            <AvatarImage
              className="rounded-md"
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
            <AvatarFallback>GU</AvatarFallback>
          </Avatar>
          <div className="flex flex-col font-inter gap-1">
            <p className="font-bold text-sm text-gray-900">Arme Inc</p>
            <p className="text-xs text-gray-600">Admin</p>
          </div>
        </section>
        <ChevronsUpDown className="w-5 h-5 text-slate-700" />
      </section>
    </main>
  );
};

export default UIHeader;
