"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ShowcaseDashboard from '@/components/demo/ShowcaseDashboard';
import UniqueDashboard from '@/components/demo/UniqueDashboard';
import EmptyState from '@/components/demo/EmptyState';

function DemoDashboardContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('t');

    // If token is provided, show unique dashboard with real data
    if (token) {
        return <UniqueDashboard token={token} />;
    }

    // Otherwise show showcase with sample data
    return <ShowcaseDashboard />;
}

export default function DemoDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><EmptyState type="loading" /></div>}>
            <DemoDashboardContent />
        </Suspense>
    );
}
