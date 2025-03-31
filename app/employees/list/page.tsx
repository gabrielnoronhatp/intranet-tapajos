'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { EmployeeList } from '@/components/employees/employee-list';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { FloatingActionButton } from '@/components/nopaper/floating-action-button';

export default function EmployeeListPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <AuthGuard>
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
                        <h1 className="text-2xl font-bold text-primary mb-6">
                            Candidatos
                        </h1>
                        <EmployeeList />
                        <FloatingActionButton href="/vacancies" />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
