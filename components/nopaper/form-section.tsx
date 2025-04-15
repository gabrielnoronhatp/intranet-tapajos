'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function FormSection({ title, children, className }: FormSectionProps) {
    return (
        <Card className={cn('shadow-sm', className)}>
            <CardHeader className="bg-primary/10 rounded-t-lg">
                <CardTitle className="text-primary text-lg font-semibold">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">{children}</CardContent>
        </Card>
    );
}
