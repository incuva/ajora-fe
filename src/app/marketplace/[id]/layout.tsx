import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full min-h-screen flex flex-col bg-white">
      {/* Shared logo header */}
      <header className="flex items-center px-4 h-14 bg-white sticky top-0 z-20 border-b border-border-light shrink-0">
        <Image
          src="/logo.png"
          alt="Àjọrà"
          width={400}
          height={200}
          priority
          className="object-contain h-16 w-auto"
        />
      </header>

      {/* Page content sits below the sticky logo header */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </section>
  );
};

export default Layout;
