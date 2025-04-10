'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Upload, Radio } from 'antd';
import { FornecedorSelect } from '@/components/nopaper/supplier-select';
import FinancialData from '@/components/contracts/duplicated-components/financial-data-form';

import { useDispatch, useSelector } from 'react-redux';
import { FormSection } from '@/components/nopaper/form-section';
import { AuthGuard } from '@/components/ProtectedRoute/AuthGuard';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import {
    setCurrentContract,
    createContract,
    uploadContractFile,
} from '@/hooks/slices/contracts/contractSlice';
import { AppDispatch, RootState } from '@/hooks/store';
import { ServiceTypeSelect } from '@/components/contracts/service-type-select';
import { fetchLojas } from '@/hooks/slices/noPaper/noPaperSlice';
import { toast } from 'react-hot-toast';
import { NumericFormat } from 'react-number-format';
import { IContract } from '@/types/Contracts/Contracts';
import { IFilial } from '@/types/noPaper/Supplier/SupplierType';
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
    const dispatch = useDispatch<AppDispatch>();
    const { currentContract } = useSelector(
        (state: RootState) => state.contracts
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [tipoMulta, setTipoMulta] = useState<'valor' | 'percentual'>('valor');
    const [error, setError] = useState<string | null>(null);
    const { lojas } = useSelector((state: RootState) => state.noPaper);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


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
