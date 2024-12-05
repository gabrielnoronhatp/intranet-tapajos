"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { tpLogo } from "@/app/assets";


interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "TI", href: "/departments/ti" },
    { name: "Marketing", href: "/departments/marketing" },
    { name: "Social Media", href: "/social-media" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-primary text-primary-foreground z-50 px-4">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-primary/90"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Image
            src={tpLogo} // Ajuste o caminho para seu arquivo de logo
            alt="Logo"
            width={120} // Ajuste o tamanho conforme necessário
            height={40} // Ajuste o tamanho conforme necessário
            className="object-contain"
          />
        </div>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white/90 transition-colors ${
                pathname === item.href ? "text-white font-medium" : "text-white/70"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="w-10" /> {/* Spacer for balance */}
      </div>
    </nav>
  );
}