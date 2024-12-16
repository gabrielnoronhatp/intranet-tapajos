"use client";

import { Menu } from "antd";
import {
  StickyNote,
  Building2,
  Settings,
  HelpCircle,
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
      key: "/noPaper/list",
      icon: <StickyNote className="h-5 w-5" />,
      label: <Link href="/noPaper/list">NoPaper</Link>,
    },
    {
      key: "/departments",
      icon: <Building2 className="h-5 w-5" />,
      label: <Link href="/departments">Departamentos</Link>,
    },
    {
      key: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: <Link href="/settings">Configurações</Link>,
    },
    {
      key: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
      label: <Link href="/help">Ajuda</Link>,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        className="h-full"
      />
    </aside>
  );
}