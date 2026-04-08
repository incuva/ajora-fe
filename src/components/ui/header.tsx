import React from "react";
import UISidebar from "./sidebar";
import Image from "next/image";

const UIHeader = () => {
  return (
    <main className="w-3xs flex flex-col items-start border-r border-slate-200">
      <section className="w-full flex h-18 p-2">
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
    </main>
  );
};

export default UIHeader;
