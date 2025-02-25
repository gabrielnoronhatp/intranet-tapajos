'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FloatingActionButton(props: { href: string }) {
    return (
        <Link href={props.href}>
            <Button
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                size="icon"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </Link>
    );
}
