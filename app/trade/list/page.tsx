'use client';

import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { FloatingActionButton } from '@/components/nopaper/floating-action-button';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { useState } from 'react';
import { TableTrade } from '@/components/trade/trade-list';

export default function TradeList() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <AuthGuard>
            <div>
                <div className="min-h-screen bg-background">
                    <Navbar
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                    <Sidebar isOpen={isSidebarOpen} />

                    <main
                        className={`pt-16 transition-all duration-300 ${
                            isSidebarOpen ? 'ml-64' : 'ml-16'
                        }`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-primary">
                                        Trade
                                    </h1>
                                    <p className="text-muted-foreground mt-1">
                                        Listagem de Campanhas
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card">
                                <TableTrade />
                            </div>

                            <FloatingActionButton href="/trade" />
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
