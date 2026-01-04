"use client"

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    SlidersHorizontal,
    Calendar,
    Phone,
    MessageSquare,
    ChevronRight,
    X,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Activity,
    Heart,
    Scissors,
    Star,
    Download,
    ArrowLeft,
    Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ===== SHOWCASE DATA =====
const showcasePatients = [
    {
        id: 1,
        phone: "+49 152 XXX XX XX",
        name: "Ahmet Yılmaz",
        age: 34,
        country: "🇩🇪",
        norwood: 4,
        graft_min: 3200,
        graft_max: 3800,
        technique: "DHI",
        donor_quality: "excellent",
        sentiment: "positive",
        purchase_rate: 85,
        appointment_date: "2025-01-15",
        chronic_disease: "None",
        medications: "None",
        allergies: "None",
        previous_transplant: false,
        family_history: true,
        summary: "Vertex bölgesinde yoğun seyrelme. DHI tekniği ile tek seansta mümkün. Hasta motivasyonu yüksek.",
        last_message: "2 saat önce",
        messages_count: 12,
    },
    {
        id: 2,
        phone: "+44 7700 XXX XXX",
        name: "John Davies",
        age: 41,
        country: "🇬🇧",
        norwood: 5,
        graft_min: 4000,
        graft_max: 4500,
        technique: "FUE",
        donor_quality: "good",
        sentiment: "neutral",
        purchase_rate: 60,
        appointment_date: null,
        chronic_disease: "Diabetes Type 2",
        medications: "Metformin",
        allergies: "Penicillin",
        previous_transplant: true,
        family_history: true,
        summary: "Önceki operasyondan 5 yıl sonra. Donör alan hala uygun. 2 seans gerekebilir.",
        last_message: "5 saat önce",
        messages_count: 8,
    },
    {
        id: 3,
        phone: "+966 50 XXX XXXX",
        name: "Mohammed Al-Rashid",
        age: 29,
        country: "🇸🇦",
        norwood: 3,
        graft_min: 2500,
        graft_max: 3000,
        technique: "DHI",
        donor_quality: "excellent",
        sentiment: "positive",
        purchase_rate: 92,
        appointment_date: "2025-01-20",
        chronic_disease: "None",
        medications: "None",
        allergies: "None",
        previous_transplant: false,
        family_history: false,
        summary: "Erken aşama saç dökülmesi. Hairline düzeltme ve ön bölge güçlendirme. Mükemmel aday.",
        last_message: "30 dk önce",
        messages_count: 18,
    },
    {
        id: 4,
        phone: "+7 985 XXX XX XX",
        name: "Ivan Petrov",
        age: 38,
        country: "🇷🇺",
        norwood: 4,
        graft_min: 3500,
        graft_max: 4000,
        technique: "FUE",
        donor_quality: "average",
        sentiment: "hesitant",
        purchase_rate: 35,
        appointment_date: null,
        chronic_disease: "Hypertension",
        medications: "Lisinopril",
        allergies: "None",
        previous_transplant: false,
        family_history: true,
        summary: "Fiyat karşılaştırması yapıyor. Farklı kliniklerden teklif aldı. Takip gerekli.",
        last_message: "1 gün önce",
        messages_count: 5,
    },
];

// ===== UTILS =====
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

function formatDateTR(iso: string | null) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function dotForSentiment(s: string) {
    switch (s) {
        case "positive": return "bg-emerald-500";
        case "neutral": return "bg-amber-500";
        case "hesitant": return "bg-orange-500";
        case "negative": return "bg-red-500";
        default: return "bg-zinc-400";
    }
}

function labelForSentiment(s: string) {
    switch (s) {
        case "positive": return "Pozitif";
        case "neutral": return "Nötr";
        case "hesitant": return "Tereddütlü";
        case "negative": return "Negatif";
        default: return "Bilinmiyor";
    }
}

function donorLabel(q: string) {
    switch (q) {
        case "excellent": return "Mükemmel";
        case "good": return "İyi";
        case "average": return "Orta";
        case "poor": return "Zayıf";
        default: return "Orta";
    }
}

function donorTone(q: string) {
    switch (q) {
        case "excellent": return "text-emerald-700 bg-emerald-50 border-emerald-200";
        case "good": return "text-sky-700 bg-sky-50 border-sky-200";
        case "average": return "text-amber-700 bg-amber-50 border-amber-200";
        case "poor": return "text-red-700 bg-red-50 border-red-200";
        default: return "text-amber-700 bg-amber-50 border-amber-200";
    }
}

function hasRisk(patient: typeof showcasePatients[0]) {
    return (
        (patient.chronic_disease && patient.chronic_disease !== "None") ||
        (patient.allergies && patient.allergies !== "None") ||
        patient.previous_transplant
    );
}

// ===== UI COMPONENTS =====
function KeyChip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "dark" | "subtle" }) {
    const toneMap = {
        default: "bg-sky-50 border border-sky-200 text-sky-800",
        dark: "bg-amber-50/90 border-amber-200/90 text-black",
        subtle: "bg-purple-100 border-purple-200 text-purple-800",
    };
    return (
        <span className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full border text-[13px] font-semibold leading-none",
            toneMap[tone]
        )}>
            {children}
        </span>
    );
}

function ProgressBar({ value }: { value: number }) {
    const v = Math.max(0, Math.min(100, value ?? 0));
    return (
        <div className="shrink-0 flex items-center gap-3">
            <div className="relative w-[100px] h-7 rounded-full bg-emerald-50 border border-emerald-200/90">
                <div className="absolute inset-[2px] rounded-full bg-emerald-50 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-900" style={{ width: `${v}%` }} />
                </div>
            </div>
            <div className="w-[44px] text-right text-sm font-extrabold tabular-nums text-zinc-700">
                %{v}
            </div>
        </div>
    );
}

function Segmented({
    value,
    onChange,
    items
}: {
    value: string;
    onChange: (id: string) => void;
    items: { id: string; label: string; count: number }[]
}) {
    return (
        <div className="inline-flex rounded-full bg-zinc-200/70 p-1">
            {items.map((it) => {
                const active = it.id === value;
                return (
                    <button
                        key={it.id}
                        onClick={() => onChange(it.id)}
                        className={cn(
                            "px-3 py-1.5 text-sm rounded-full transition select-none",
                            active ? "bg-white shadow-sm text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
                        )}
                    >
                        {it.label}
                        <span className={cn(
                            "ml-2 text-[11px] px-2 py-0.5 rounded-full tabular-nums",
                            active ? "bg-zinc-100 text-zinc-700" : "bg-zinc-300/60 text-zinc-600"
                        )}>
                            {it.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function MetricCard({ title, value, hint, icon: Icon }: { title: string; value: string | number; hint?: string; icon: any }) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">{title}</div>
                <Icon className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900 tabular-nums">{value}</div>
            {hint && <div className="mt-1 text-sm text-zinc-500">{hint}</div>}
        </div>
    );
}

function InfoRow({ label, value, rightTag }: { label: string; value: string; rightTag?: React.ReactNode }) {
    return (
        <div className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="text-sm text-zinc-600">{label}</div>
            <div className="flex items-center gap-2 min-w-0">
                {rightTag}
                <div className="text-sm text-zinc-900 font-semibold text-right max-w-[340px] truncate">
                    {value}
                </div>
            </div>
        </div>
    );
}

// ===== PATIENT LIST ROW =====
function PatientListRow({ patient, onOpen }: { patient: typeof showcasePatients[0]; onOpen: (p: typeof showcasePatients[0]) => void }) {
    const graftRange = `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`;
    const isRisk = hasRisk(patient);

    return (
        <motion.button
            layoutId={`patient-${patient.id}`}
            onClick={() => onOpen(patient)}
            className="w-full text-left group"
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
            {/* Desktop */}
            <div className="hidden md:grid px-4 py-4 items-center gap-6 grid-cols-[360px_1fr_340px]">
                <div className="min-w-0 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                        {patient.country}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="font-semibold text-zinc-900 truncate text-[16px] max-w-[240px]">
                                {patient.name}
                            </div>
                            <span className={cn("w-2.5 h-2.5 rounded-full", dotForSentiment(patient.sentiment))} />
                            <span className="text-sm text-zinc-600 font-medium">
                                {labelForSentiment(patient.sentiment)}
                            </span>
                            {isRisk ? (
                                <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Risk
                                </span>
                            ) : (
                                <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Temiz
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="min-w-0 w-full flex justify-center pr-10">
                    <div className="min-w-0 flex items-center gap-2 overflow-hidden">
                        <KeyChip tone="dark">NW{patient.norwood}</KeyChip>
                        <KeyChip>{patient.technique}</KeyChip>
                        <KeyChip>
                            <span className="tabular-nums whitespace-nowrap">{graftRange}</span>&nbsp;greft
                        </KeyChip>
                    </div>
                </div>

                <div className="justify-self-end flex items-center gap-4">
                    <ProgressBar value={patient.purchase_rate} />
                    <div className="min-w-[150px] text-right">
                        {patient.appointment_date ? (
                            <div className="text-sm text-zinc-900 font-semibold">{formatDateTR(patient.appointment_date)}</div>
                        ) : (
                            <div className="text-sm text-zinc-500 font-medium">Randevu yok</div>
                        )}
                        <div className="text-[11px] text-zinc-500">Randevu durumu</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-zinc-100 group-hover:bg-zinc-200 flex items-center justify-center transition">
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center justify-between px-4 py-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                        {patient.country}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-zinc-900 truncate text-[16px]">{patient.name}</div>
                            <span className={cn("w-2.5 h-2.5 rounded-full", dotForSentiment(patient.sentiment))} />
                        </div>
                        <div className="mt-2 text-[12px] text-zinc-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{patient.last_message}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="tabular-nums">{patient.messages_count} mesaj</span>
                        </div>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>
            </div>
            <div className="h-px bg-zinc-100" />
        </motion.button>
    );
}

// ===== CENTER MORPH SHEET =====
function CenterMorphSheet({ patient, onClose }: { patient: typeof showcasePatients[0] | null; onClose: () => void }) {
    useEffect(() => {
        if (!patient) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [patient, onClose]);

    if (!patient) return null;

    const graftRange = `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`;
    const isRisk = hasRisk(patient);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[7px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={onClose}
            />

            <motion.div
                layoutId={`patient-${patient.id}`}
                className={cn(
                    "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "w-[min(860px,94vw)] h-[min(82vh,760px)]",
                    "rounded-[28px] bg-white border border-zinc-200 shadow-2xl overflow-hidden"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-5 border-b border-zinc-100 bg-white">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-xl">
                                    {patient.country}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl font-semibold text-zinc-900 truncate">{patient.name}</div>
                                    <div className="text-sm text-zinc-500 font-medium truncate">
                                        {patient.phone} • {patient.age} yaş
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-semibold", donorTone(patient.donor_quality))}>
                                    <Activity className="w-4 h-4" />
                                    Donör: {donorLabel(patient.donor_quality)}
                                </span>
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-[13px] font-semibold text-zinc-800">
                                    <span className={cn("w-2.5 h-2.5 rounded-full", dotForSentiment(patient.sentiment))} />
                                    {labelForSentiment(patient.sentiment)}
                                </span>
                                {isRisk ? (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[13px] font-semibold text-orange-800">
                                        <AlertCircle className="w-4 h-4" />
                                        Risk işareti var
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[13px] font-semibold text-emerald-800">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Medikal temiz
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 text-zinc-700" />
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <div className="ml-auto flex items-center gap-2 text-sm text-zinc-500">
                            <Clock className="w-4 h-4 text-zinc-400" />
                            <span>Son mesaj: <span className="font-semibold text-zinc-700">{patient.last_message}</span></span>
                            <span className="text-zinc-300">•</span>
                            <span>Toplam: <span className="font-semibold text-zinc-700 tabular-nums">{patient.messages_count}</span> mesaj</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="h-[calc(100%-172px)] overflow-auto bg-zinc-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* AI Summary */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Star className="w-4 h-4 text-zinc-400" />
                                AI Değerlendirme Özeti
                            </div>
                            <div className="mt-3 text-[15px] text-zinc-900 leading-relaxed">{patient.summary}</div>
                            <div className="mt-5 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs text-zinc-500">Satın alma olasılığı</div>
                                    <div className="mt-1 text-2xl font-semibold text-zinc-900 tabular-nums">%{patient.purchase_rate}</div>
                                </div>
                                <ProgressBar value={patient.purchase_rate} />
                            </div>
                        </div>

                        {/* Appointment */}
                        <div className="bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="text-sm text-zinc-500 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-zinc-400" />
                                Randevu
                            </div>
                            <div className="mt-3">
                                {patient.appointment_date ? (
                                    <div className="text-[18px] font-semibold text-zinc-900">{formatDateTR(patient.appointment_date)}</div>
                                ) : (
                                    <div className="text-[16px] font-semibold text-zinc-600">Randevu yok</div>
                                )}
                                <div className="mt-2 text-sm text-zinc-500">Demo: randevu görünümü</div>
                            </div>
                            <div className="mt-5">
                                <div className="text-xs text-zinc-500">Medikal durum</div>
                                <div className="mt-2">
                                    {isRisk ? (
                                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-sm font-semibold">
                                            <AlertCircle className="w-4 h-4" />
                                            Dikkat gerektiren bilgi var
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Risk işareti yok
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Info Cards */}
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="px-5 py-4 text-sm text-zinc-500 flex items-center gap-2 bg-white">
                                <Heart className="w-6 h-6 text-zinc-400" />
                                Tıbbi Bilgiler
                            </div>
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Kronik hastalık"
                                value={patient.chronic_disease === "None" ? "Yok" : patient.chronic_disease}
                                rightTag={
                                    patient.chronic_disease === "None" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">OK</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold">Noted</span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="İlaçlar"
                                value={patient.medications === "None" ? "Yok" : patient.medications}
                                rightTag={
                                    patient.medications === "None" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">-</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">Med</span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Alerji"
                                value={patient.allergies === "None" ? "Yok" : patient.allergies}
                                rightTag={
                                    patient.allergies === "None" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">OK</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold">Alert</span>
                                    )
                                }
                            />
                        </div>

                        <div className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="px-5 py-4 text-sm text-zinc-500 flex items-center gap-2 bg-white">
                                <Scissors className="w-6 h-6 text-zinc-400" />
                                Geçmiş ve Uygunluk
                            </div>
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Önceki operasyon"
                                value={patient.previous_transplant ? "Var" : "Yok"}
                                rightTag={
                                    patient.previous_transplant ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold">Noted</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">OK</span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow label="Aile geçmişi" value={patient.family_history ? "Evet" : "Hayır"} />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow label="Yaş" value={`${patient.age}`} />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Donör kalitesi"
                                value={donorLabel(patient.donor_quality)}
                                rightTag={
                                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-semibold", donorTone(patient.donor_quality))}>
                                        {patient.donor_quality}
                                    </span>
                                }
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-xs text-zinc-500 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                            Demo: Bu bir showcase görünümüdür. Gerçek veri için WhatsApp'tan test edin.
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ===== MAIN COMPONENT =====
export default function ShowcaseDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedPatient, setSelectedPatient] = useState<typeof showcasePatients[0] | null>(null);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return showcasePatients
            .filter((p) => {
                if (!q) return true;
                return p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q);
            })
            .filter((p) => {
                if (activeFilter === "all") return true;
                if (activeFilter === "positive") return p.sentiment === "positive";
                if (activeFilter === "appointment") return Boolean(p.appointment_date);
                if (activeFilter === "followup") return p.purchase_rate < 50 || p.sentiment === "hesitant";
                if (activeFilter === "risk") return hasRisk(p);
                return true;
            });
    }, [searchQuery, activeFilter]);

    const counts = useMemo(() => {
        const all = showcasePatients.length;
        const positive = showcasePatients.filter((p) => p.sentiment === "positive").length;
        const appointment = showcasePatients.filter((p) => p.appointment_date).length;
        const followup = showcasePatients.filter((p) => p.purchase_rate < 50 || p.sentiment === "hesitant").length;
        const risk = showcasePatients.filter((p) => hasRisk(p)).length;
        return { all, positive, appointment, followup, risk };
    }, []);

    const avgPurchase = useMemo(() => {
        const sum = showcasePatients.reduce((acc, p) => acc + (p.purchase_rate || 0), 0);
        return Math.round(sum / Math.max(1, showcasePatients.length));
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Demo Header */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/v2" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm">Ana Sayfa</span>
                            </Link>
                            <div className="h-6 w-px bg-zinc-200" />
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                <h1 className="text-lg font-semibold">Demo Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">Showcase Modu</span>
                            <a
                                href="https://wa.me/905XXXXXXXXX?text=Demo%20test"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Kendiniz Deneyin
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-sm text-zinc-500">WhatsApp Lead Panel</div>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Hasta Yönetimi</h1>
                        <div className="mt-2 text-sm text-zinc-500">
                            Kritik bilgiler görünür: <span className="font-semibold text-zinc-700">NW • Teknik • Greft</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filtre
                        </button>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 transition">
                            <Download className="w-4 h-4" />
                            Dışa Aktar
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <Segmented
                        value={activeFilter}
                        onChange={setActiveFilter}
                        items={[
                            { id: "all", label: "Tümü", count: counts.all },
                            { id: "positive", label: "Sıcak Lead", count: counts.positive },
                            { id: "appointment", label: "Randevulu", count: counts.appointment },
                            { id: "followup", label: "Takip", count: counts.followup },
                            { id: "risk", label: "Risk", count: counts.risk },
                        ]}
                    />
                    <div className="relative w-full md:w-[380px]">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Hasta ara (isim veya telefon)"
                            className="w-full pl-11 pr-4 py-3 rounded-3xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                        />
                    </div>
                </div>

                {/* Metrics */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard title="Toplam Hasta" value={counts.all} hint="Bu liste" icon={Users} />
                    <MetricCard title="Sıcak Lead" value={counts.positive} hint="Pozitif sentiment" icon={TrendingUp} />
                    <MetricCard title="Randevulu" value={counts.appointment} hint="Tarih girilmiş" icon={Calendar} />
                    <MetricCard title="Ort. Purchase" value={`%${avgPurchase}`} hint="Satın alma olasılığı" icon={Clock} />
                </div>

                {/* List */}
                <div className="mt-6 bg-white rounded-3xl border border-zinc-200/70 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                    <div className="px-4 py-3 text-sm text-zinc-500 flex items-center justify-between bg-zinc-50/60 border-b border-zinc-100">
                        <div>
                            <span className="font-medium text-zinc-700">{filtered.length}</span> sonuç
                        </div>
                        <div className="text-[11px] text-zinc-500">
                            Tıkla: satır → panel (morph)
                        </div>
                    </div>

                    {filtered.map((p) => (
                        <PatientListRow key={p.id} patient={p} onOpen={setSelectedPatient} />
                    ))}

                    {filtered.length === 0 && (
                        <div className="px-6 py-10 text-center text-sm text-zinc-500">
                            Sonuç yok. Arama veya filtreyi değiştir.
                        </div>
                    )}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">Kendi Kliniğinizde Deneyin</h3>
                        <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
                            WhatsApp numaramıza mesaj göndererek AI asistanımızı canlı test edin.
                        </p>
                        <a
                            href="https://wa.me/905XXXXXXXXX?text=Demo%20test%20etmek%20istiyorum"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp'tan Demo Başlat
                        </a>
                    </div>
                </motion.div>
            </div>

            <CenterMorphSheet patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        </div>
    );
}
