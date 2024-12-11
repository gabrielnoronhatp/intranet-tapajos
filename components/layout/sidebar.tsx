"use client";

import routes from "@/app/routes";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  MessageSquare,
  StickyNote 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "NoPaper",
      icon: StickyNote ,
      href: "/noPaper/list", 
    },
    {
      name: "Departamentos",
      icon: Building2,
      href: "/departments",
    },
    
    {
      name: "Configurações",
      icon: Settings,
      href: "/settings",
    },
    {
      name: "Ajuda",
      icon: HelpCircle,
      href: "/help",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
        isOpen ? "w-64" : "w-0 -translate-x-full"
      )}
    >
      <div className="flex flex-col p-4 gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}