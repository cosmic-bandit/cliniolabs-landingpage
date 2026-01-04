"use client";

import React from 'react';
import { MessageSquare, Activity, TrendingUp, Clock } from 'lucide-react';

interface StatsBarProps {
    totalMessages: number;
    analysisComplete: boolean;
    purchaseRate: number | null;
    currentStage: string;
}

export default function StatsBar({ totalMessages, analysisComplete, purchaseRate, currentStage }: StatsBarProps) {
    const stats = [
        {
            icon: MessageSquare,
            label: 'Mesaj Sayısı',
            value: totalMessages.toString(),
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: Activity,
            label: 'Analiz Durumu',
            value: analysisComplete ? 'Tamamlandı' : 'Bekliyor',
            color: analysisComplete ? 'text-emerald-600' : 'text-amber-600',
            bg: analysisComplete ? 'bg-emerald-50' : 'bg-amber-50',
        },
        {
            icon: TrendingUp,
            label: 'Satın Alma Oranı',
            value: purchaseRate ? `%${purchaseRate}` : '-',
            color: (purchaseRate || 0) >= 70 ? 'text-emerald-600' : (purchaseRate || 0) >= 40 ? 'text-amber-600' : 'text-red-600',
            bg: (purchaseRate || 0) >= 70 ? 'bg-emerald-50' : (purchaseRate || 0) >= 40 ? 'bg-amber-50' : 'bg-red-50',
        },
        {
            icon: Clock,
            label: 'Mevcut Aşama',
            value: getStageLabel(currentStage),
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={`${stat.bg} rounded-xl p-4 border border-gray-100`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs text-gray-500">{stat.label}</span>
                    </div>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
            ))}
        </div>
    );
}

function getStageLabel(stage: string): string {
    const labels: Record<string, string> = {
        'GREETING': 'Karşılama',
        'ANALYSIS_PENDING': 'Analiz Bekliyor',
        'ANALYSIS_COMPLETE': 'Analiz Tamam',
        'FOLLOWUP': 'Takip',
        'APPOINTMENT_SET': 'Randevu Alındı',
        'CLOSED': 'Kapandı',
    };
    return labels[stage] || stage;
}
