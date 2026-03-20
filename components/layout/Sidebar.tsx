"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  ConciergeBell,
  CreditCard,
  Package,
  Users,
  ChevronRight,
  ChevronLeft,
  List,
  PlusCircle,
  LayoutGrid,
  Calendar,
  Wrench,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubItem {
  href: string;
  label: string;
  icon?: React.ElementType;
}

interface NavItemProps {
  href?: string;
  icon: React.ElementType;
  label: string;
  subItems?: SubItem[];
  isCollapsed?: boolean;
}

const items = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/room",
    icon: BedDouble,
    label: "Rooms",
    subItems: [
      { href: "/room", label: "List room", icon: List },
      { href: "/room/create", label: "Create room", icon: PlusCircle },
    ],
  },
  {
    href: "/booking",
    icon: CalendarCheck,
    label: "Bookings",
    subItems: [
      { href: "/booking", label: "List booking", icon: List },
      { href: "/booking/create", label: "Create booking", icon: PlusCircle },
    ],
  },
  {
    href: "/service",
    icon: ConciergeBell,
    label: "Services",
    subItems: [
      { href: "/service", label: "List service", icon: List },
      { href: "/service/create", label: "Create service", icon: PlusCircle }
    ],
  },
  {
    href: "/payment",
    icon: CreditCard,
    label: "Payments",
  },
  {
    href: "/inventory",
    icon: Package,
    label: "Inventory",
  },
  {
    href: "/room-types",
    icon: LayoutGrid,
    label: "Room Types",
  },
  {
    href: "/roomcalendar",
    icon: Calendar,
    label: "Room Calendar",
  },
  {
    href: "/housekeepingtask",
    icon: ClipboardList,
    label: "Housekeeping",
  },
  {
    href: "/maintenanceticket",
    icon: Wrench,
    label: "Maintenance",
  },
  {
    href: "/users",
    icon: Users,
    label: "Users",
    subItems: [
      { href: "/users", label: "All Users", icon: List }
    ],
  },

];

const NavItem = ({
  href,
  icon: Icon,
  label,
  subItems,
  isCollapsed,
}: NavItemProps) => {
  const pathname = usePathname();
  const isChildActive = subItems?.some((child) => pathname === child.href);
  const [isOpen, setIsOpen] = useState(isChildActive);

  const isActive = href
    ? pathname === href || pathname.startsWith(`${href}/`)
    : isChildActive;

  const handleClick = (e: React.MouseEvent) => {
    if (subItems && !isCollapsed) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <Link
        href={href || "#"}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative select-none cursor-pointer",
          isActive
            ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20"
            : "text-white/70 hover:text-white hover:bg-white/5",
          isCollapsed && "justify-center"
        )}
      >
        <Icon className={cn("w-5 h-5 flex-shrink-0")} />
        {!isCollapsed && (
          <span className="text-sm font-medium flex-1">{label}</span>
        )}
        {!isCollapsed && subItems && (
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        )}
      </Link>

      {/* Sub Items */}
      {subItems && !isCollapsed && (
        <div
          className={cn(
            "ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {subItems.map((child) => {
            const isSubActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative",
                  isSubActive
                    ? "bg-white/10 text-[#ffa500] font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                {isSubActive && (
                  <div className="absolute left-0 w-1 h-4 bg-[#ffa500] rounded-full" />
                )}
                {child.icon ? (
                  <child.icon className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 flex-shrink-0" />
                )}
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (value: boolean) => void;
}

export function SideBar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SideBarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          "bg-[#0a101f] h-full flex flex-col transition-all duration-300 border-r border-[#1a2235] z-[70]",
          "fixed inset-y-0 left-0 transform md:relative md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-[80px]" : "w-72"
        )}
      >
        {/* Brand Header */}
        <div className={cn(
          "flex items-center gap-3 px-6 transition-all duration-300 border-b border-white/5 shrink-0",
          isCollapsed ? "h-24 justify-center" : "h-28"
        )}>
          <div className="relative group shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-amber-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className={cn(
              "relative rounded-2xl bg-white p-2 flex items-center justify-center shadow-2xl overflow-hidden border border-white/20 transition-all duration-300",
              isCollapsed ? "h-12 w-12" : "h-14 w-14"
            )}>
              <Image
                src="/images/logo.png"
                alt="RN HOTEL Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-xl font-black text-white tracking-tighter leading-none">
                RNHOTEL
              </h1>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-bold mt-1.5">
                Admin Suite
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {items.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              subItems={item.subItems}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Footer / User Profile or Collapse */}
        <div className="p-4 border-t border-white/5 bg-black/10 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-300 border border-white/5 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="text-xs font-medium text-white/50 group-hover:text-white uppercase tracking-widest"></span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}