import { Bell, MessageCircleQuestionMark } from "lucide-react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full min-h-screen flex flex-col bg-white">
      {/* Shared logo header */}
      <header className="flex justify-between items-center px-4 h-14 md:h-20 bg-white sticky top-0 z-20 border-b border-border-light shrink-0">
        <Image
          src="/logo.png"
          alt="Àjọrà"
          width={400}
          height={200}
          priority
          className="object-contain h-20 md:h-24 w-auto"
        />

        <section className="flex gap-3.5">
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-soft-green">
            <MessageCircleQuestionMark className="size-4" color="#114B3A" />
          </div>
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-soft-green">
            <Bell className="size-4" color="#114B3A" />
          </div>
        </section>
      </header>

      {/* Page content sits below the sticky logo header */}
      <main className="flex-1 flex flex-col">{children}</main>
    </section>
  );
};

export default Layout;
