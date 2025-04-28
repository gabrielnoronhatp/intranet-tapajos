'use client';

import React, { useState } from 'react';

import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import LineChartComponent from '@/components/charts/charts';
import { Card, Row, Col } from 'antd';
import { Line, Bar, Pie } from '@ant-design/charts';

const MultiChartComponent: React.FC = () => {
    const lineData = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];

    const barData = [
        { type: 'A', sales: 38 },
        { type: 'B', sales: 52 },
        { type: 'C', sales: 61 },
        { type: 'D', sales: 145 },
        { type: 'E', sales: 48 },
    ];

    const pieData = [
        { type: 'Category A', value: 27 },
        { type: 'Category B', value: 25 },
        { type: 'Category C', value: 18 },
        { type: 'Category D', value: 15 },
        { type: 'Category E', value: 10 },
    ];

    const lineConfig = {
        data: lineData,
        xField: 'year',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    const barConfig = {
        data: barData,
        xField: 'type',
        yField: 'sales',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
    };

    const pieConfig = {
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Card title="Line Chart">
                    <Line {...lineConfig} />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="Bar Chart">
                    <Bar {...barConfig} />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="Pie Chart">
                    <Pie {...pieConfig} />
                </Card>
            </Col>
        </Row>
    );
};

export default function ContractForm() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background p-4">
                <Navbar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Sidebar isOpen={isSidebarOpen} />
                <main
                    className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}
                >
                    <LineChartComponent />
                    <MultiChartComponent />
                </main>
            </div>
        </AuthGuard>
    );
}
