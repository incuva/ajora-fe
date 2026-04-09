"use client";

import { Apps16Regular, AppsListRegular, ChartMultiple16Regular, Grid16Regular, Person16Regular, Settings16Regular, Shapes16Regular, WalletCreditCard16Regular } from "@fluentui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

const navLinks = [
  {
    name: "Overview",
    href: "/auth/admin/overview",
    icon: <Grid16Regular />,
  },
  {
    name: "Pools",
    href: "/auth/admin/pools",
    icon: <Apps16Regular />,
  },
  {
    name: "Items",
    href: "/auth/admin/items",
    icon: <Shapes16Regular />,
  },
  {
    name: "Users",
    href: "/auth/admin/users",
    icon: <Person16Regular />,
  },
  {
    name: "Orders",
    href: "/auth/admin/orders",
    icon: <AppsListRegular />,
  },
  {
    name: "Reports",
    href: "/auth/admin/reports",
    icon: <ChartMultiple16Regular />,
  },
  {
    name: "Payments",
    href: "/auth/admin/payments",
    icon: <WalletCreditCard16Regular />,
  },
  {
    name: "Settings",
    href: "/auth/admin/settings",
    icon: <Settings16Regular />,
  },
];

const UISidebar = () => {
  const pathname = usePathname();

  return (
    <main className="pl-3 pr-2 w-full flex flex-col gap-1">
      {navLinks.map((link) => {
        return (
          <NavLink
            name={link.name}
            href={link.href}
            icon={link.icon}
            key={link.name}
            active={link.href === pathname}
          />
        );
      })}
    </main>
  );
};

export default UISidebar;

const NavLink = ({
  name,
  href,
  icon,
  active
}: {
  name: string;
  href: string;
  icon: ReactElement;
  active: boolean;
}) => {
  return (
    <Link href={href} className={`w-full flex items-center gap-3 p-2 rounded-sm font-inter ${active ? "bg-gold-light text-primary" : ""}`}>
      {icon}
      <p className={`text-sm font-normal ${active ? "text-primary" : ""}`}>{name}</p>
    </Link>
  );
};
