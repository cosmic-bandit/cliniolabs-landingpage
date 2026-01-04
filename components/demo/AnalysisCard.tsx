"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Scissors, Activity, User } from 'lucide-react';
import { Patient } from '@/lib/supabase';
import { NorwoodBadge, DonorQualityBar } from './PatientCard';

interface AnalysisCardProps {
    patient: Patient;
}

export default function AnalysisCard({ patient }: AnalysisCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-semibold">AI Analiz Raporu</h3>
                    <p className="text-gray-400 text-xs">Otomatik değerlendirme sonuçları</p>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Norwood */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Norwood Seviyesi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <NorwoodBadge level={patient.norwood} />
                        <span className="text-white font-semibold">{patient.norwood || '-'}</span>
                    </div>
                </div>

                {/* Graft Estimate */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Greft Tahmini</span>
                    </div>
                    <p className="text-white font-semibold">
                        {patient.graft_min?.toLocaleString() || '?'} - {patient.graft_max?.toLocaleString() || '?'}
                    </p>
                </div>

                {/* Technique */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Scissors className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Önerilen Teknik</span>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold
            ${patient.recommended_technique === 'DHI'
                            ? 'bg-purple-500 text-white'
                            : 'bg-indigo-500 text-white'
                        }`}>
                        {patient.recommended_technique || 'Belirlenmedi'}
                    </span>
                </div>

                {/* Donor Quality */}
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Donör Kalitesi</span>
                    </div>
                    <DonorQualityBar quality={patient.donor_quality} />
                </div>
            </div>

            {/* Session Count */}
            {patient.session_count && (
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                    <span className="text-xs text-gray-400">Önerilen Seans Sayısı: </span>
                    <span className="text-white font-semibold">{patient.session_count}</span>
                </div>
            )}

            {/* AI Summary */}
            {patient.analysis_summary && (
                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Uzman Değerlendirmesi
                    </h4>
                    <p className="text-gray-200 text-sm leading-relaxed">
                        {patient.analysis_summary}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
