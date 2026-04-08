import Link from "next/link";
import React, { ReactElement } from "react";
import { CiBoxList, CiUser } from "react-icons/ci";
import { GiWallet } from "react-icons/gi";
import { GrAnalytics } from "react-icons/gr";
import { HiOutlineViewGrid } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";
import { PiStackThin } from "react-icons/pi";
import { TbApps } from "react-icons/tb";

const navLinks = [
  {
    name: "Overview",
    href: "/auth/admin/overview",
    icon: <HiOutlineViewGrid />,
  },
  {
    name: "Pools",
    href: "/auth/admin/pools",
    icon: <TbApps />,
  },
  {
    name: "Items",
    href: "/auth/admin/items",
    icon: <PiStackThin />,
  },
  {
    name: "Users",
    href: "/auth/admin/users",
    icon: <CiUser />,
  },
  {
    name: "Orders",
    href: "/auth/admin/orders",
    icon: <CiBoxList />,
  },
  {
    name: "Reports",
    href: "/auth/admin/reports",
    icon: <GrAnalytics />,
  },
  {
    name: "Payments",
    href: "/auth/admin/payments",
    icon: <GiWallet />,
  },
  {
    name: "Settings",
    href: "/auth/admin/settings",
    icon: <LuSettings />,
  },
];

const UISidebar = () => {
  return (
    <main className="px-4 w-full flex flex-col gap-1">
      {navLinks.map((link) => {
        return (
          <NavLink
            name={link.name}
            href={link.href}
            icon={link.icon}
            key={link.name}
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
}: {
  name: string;
  href: string;
  icon: ReactElement;
}) => {
  return (
    <Link href={href} className="w-full flex items-center gap-3 p-2 font-inter">
      {icon}
      <p className="font-normal">{name}</p>
    </Link>
  );
};
