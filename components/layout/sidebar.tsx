'use client';

import React from 'react';
import { Menu } from 'antd';
import {
    StickyNote,
    FilePen,
    FileChartColumnIncreasing,
    UserRoundSearch,
    BarChart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            key: '/noPaper/list',
            icon: <StickyNote className="h-6 w-6" />,
            label: <Link href="/noPaper/list">NoPaper</Link>,
        },
        {
            key: '/contracts/list',
            icon: <FilePen className="h-6 w-6" />,
            label: <Link href="/contracts/list">Contratos</Link>,
        },
        {
            key: '/trade',
            icon: <FileChartColumnIncreasing className="h-6 w-6" />,
            label: 'Trade',
            children: [
                {  
                    icon: <FileChartColumnIncreasing className="h-6 w-6" />,
                    key: '/trade/list',
                    label: <Link href="/trade/list">Campanhas </Link>,
                    className: 'iconsidebar',

                },
                {
                    icon: <FileChartColumnIncreasing className="h-6 w-6" />,
                    key: '/tradeNegotiations',
                    label: <Link href="/tradeNegotiations">Negociações</Link>,
                    className: 'iconsidebar',
                },
            ],
        },
        {
            key: '/vacancies',
            icon: <UserRoundSearch className="h-6 w-6" />,
            label: <Link href="/vacancies">Candidatos</Link>,
        },
        {
            key: '/charts',
            icon: <BarChart className="h-6 w-6" />,
            label: <Link href="/charts">Gráficos</Link>,
        },
    ];

    return (
        <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40 ${
            isOpen ? 'w-64' : 'w-16'
        }`}
    >
        <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            className={`h-full [&_.ant-menu-item]:flex [&_.ant-menu-item]:items-center ${
                !isOpen ? '[&_.ant-menu-submenu-arrow]:mt-4' : ''
            }`}

        />
    </aside>
    );
}








