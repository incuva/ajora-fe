"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Alert24Regular } from "@fluentui/react-icons";
import UserMenu from "./user-menu";
import { navLinks, NavLink } from "./sidebar";


const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the drawer whenever the route changes (adjust state during render —
  // the React-recommended alternative to a route-watching effect).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-bg">
        <Image
          src="/logo-icon.png"
          alt="Àjọrà"
          width={36}
          height={36}
          priority
          className="object-contain h-9 w-9"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 -mr-2 text-grey-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-75 max-w-[85vw] bg-bg border-r border-slate-200 flex flex-col"
            >
              {/* Logo header */}
              <div className="flex items-center justify-between bg-white px-3 h-16 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Àjọrà"
                  width={120}
                  height={32}
                  priority
                  className="object-contain h-8 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-grey-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    name={link.name}
                    href={link.href}
                    icon={link.icon}
                    active={link.href === pathname}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </nav>

              <div className="shrink-0 border-t border-slate-100">
                <div className="p-2 pt-0">
                  <UserMenu />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
