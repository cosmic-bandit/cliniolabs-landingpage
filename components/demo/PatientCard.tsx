"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, Activity, Star, Clock, MapPin } from 'lucide-react';
import { Patient } from '@/lib/supabase';
import { maskPhone, maskName, getCountryFlag, formatRelativeTime } from '@/lib/utils';

// Norwood Badge Component
const NorwoodBadge = ({ level }: { level: string | null }) => {
    if (!level) return null;

    const numLevel = parseInt(level.replace(/\D/g, '')) || 3;
    const colors: Record<number, string> = {
        1: 'from-green-400 to-green-500',
        2: 'from-emerald-400 to-emerald-500',
        3: 'from-cyan-400 to-cyan-500',
        4: 'from-amber-400 to-amber-500',
        5: 'from-orange-400 to-orange-500',
        6: 'from-red-400 to-red-500',
        7: 'from-red-500 to-red-600',
    };

    return (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[numLevel] || colors[3]} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-sm">{level}</span>
        </div>
    );
};

// Sentiment Badge Component
const SentimentBadge = ({ sentiment }: { sentiment: string | null }) => {
    const config: Record<string, { bg: string; text: string; label: string; icon: string }> = {
        positive: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Pozitif', icon: '😊' },
        neutral: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Nötr', icon: '😐' },
        hesitant: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Tereddütlü', icon: '🤔' },
        negative: { bg: 'bg-red-50', text: 'text-red-700', label: 'Negatif', icon: '😟' },
    };
    const c = config[sentiment || 'neutral'] || config.neutral;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
            <span>{c.icon}</span>
            {c.label}
        </span>
    );
};

// Donor Quality Bar
const DonorQualityBar = ({ quality }: { quality: string | null }) => {
    const config: Record<string, { width: string; color: string; label: string }> = {
        'ÇOK İYİ': { width: '100%', color: 'bg-emerald-500', label: 'Çok İyi' },
        'EXCELLENT': { width: '100%', color: 'bg-emerald-500', label: 'Mükemmel' },
        'İYİ': { width: '75%', color: 'bg-cyan-500', label: 'İyi' },
        'GOOD': { width: '75%', color: 'bg-cyan-500', label: 'İyi' },
        'ORTA': { width: '50%', color: 'bg-amber-500', label: 'Orta' },
        'AVERAGE': { width: '50%', color: 'bg-amber-500', label: 'Orta' },
        'ZAYIF': { width: '25%', color: 'bg-red-500', label: 'Zayıf' },
        'POOR': { width: '25%', color: 'bg-red-500', label: 'Zayıf' },
    };
    const c = config[quality?.toUpperCase() || 'ORTA'] || config['ORTA'];

    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: c.width }} />
            </div>
            <span className="text-xs text-gray-500">{c.label}</span>
        </div>
    );
};

// Purchase Rate Circle
const PurchaseRateCircle = ({ rate }: { rate: number | null }) => {
    const rateValue = rate || 0;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (rateValue / 100) * circumference;

    const getColor = (r: number) => {
        if (r >= 70) return '#10b981';
        if (r >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r={radius} stroke="#f1f5f9" strokeWidth="4" fill="none" />
                <circle
                    cx="24" cy="24" r={radius}
                    stroke={getColor(rateValue)}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                %{rateValue}
            </span>
        </div>
    );
};

// Stage Badge
const StageBadge = ({ stage }: { stage: string }) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        'GREETING': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Karşılama' },
        'ANALYSIS_PENDING': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Analiz Bekliyor' },
        'ANALYSIS_COMPLETE': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Analiz Tamamlandı' },
        'FOLLOWUP': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Takip' },
        'APPOINTMENT_SET': { bg: 'bg-green-100', text: 'text-green-700', label: 'Randevu Alındı' },
        'CLOSED': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Kapandı' },
    };
    const c = config[stage] || { bg: 'bg-gray-100', text: 'text-gray-600', label: stage };

    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
            {c.label}
        </span>
    );
};

interface PatientCardProps {
    patient: Patient;
    onClick?: () => void;
    isSelected?: boolean;
}

export default function PatientCard({ patient, onClick, isSelected }: PatientCardProps) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`
        bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200
        ${isSelected
                    ? 'border-emerald-500 shadow-lg shadow-emerald-100'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
      `}
        >
            {/* Header: Name, Country, Stage */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
                        {getCountryFlag(patient.country)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{maskName(patient.name, patient.phone)}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {maskPhone(patient.phone)}
                        </p>
                    </div>
                </div>
                <StageBadge stage={patient.current_stage} />
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Norwood */}
                <div className="flex flex-col items-center">
                    <NorwoodBadge level={patient.norwood} />
                    <span className="text-xs text-gray-500 mt-1">Norwood</span>
                </div>

                {/* Graft Estimate */}
                <div className="bg-blue-50 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-blue-600 font-medium">Greft</p>
                    <p className="text-sm font-bold text-blue-700">
                        {patient.graft_min?.toLocaleString() || '?'} - {patient.graft_max?.toLocaleString() || '?'}
                    </p>
                </div>

                {/* Technique */}
                <div className="flex flex-col items-center">
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold
            ${patient.recommended_technique === 'DHI'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                        {patient.recommended_technique || 'TBD'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Teknik</span>
                </div>
            </div>

            {/* Secondary Info */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <DonorQualityBar quality={patient.donor_quality} />
                    <SentimentBadge sentiment={patient.sentiment} />
                </div>
                <PurchaseRateCircle rate={patient.purchase_rate} />
            </div>

            {/* AI Summary (if exists) */}
            {patient.analysis_summary && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 line-clamp-2">
                            {patient.analysis_summary}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer: Appointment / Created */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                {patient.appointment_date ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(patient.appointment_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                    </span>
                ) : (
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Randevu yok
                    </span>
                )}
                <span>{formatRelativeTime(patient.created_at)}</span>
            </div>
        </motion.div>
    );
}

// Export sub-components for reuse
export { NorwoodBadge, SentimentBadge, DonorQualityBar, PurchaseRateCircle, StageBadge };
