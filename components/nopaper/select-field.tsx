'use client';
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';

interface SelectFieldProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SelectField({
    label,
    options,
    value,
    onChange,
    className,
}: SelectFieldProps) {
    return (
        <div className={className}>
            <SelectGroup>
                <SelectLabel className="text-xs font-semibold text-primary uppercase mb-1">
                    {label}
                </SelectLabel>
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </SelectGroup>
        </div>
    );
}
