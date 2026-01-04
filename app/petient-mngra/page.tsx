"use client"

import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/** ----------------------------
 * Sample patient data (unchanged)
 * ---------------------------- */
const samplePatients = [
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
        summary:
            "Vertex bölgesinde yoğun seyrelme. DHI tekniği ile tek seansta mümkün. Hasta motivasyonu yüksek.",
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
        summary:
            "Önceki operasyondan 5 yıl sonra. Donör alan hala uygun. 2 seans gerekebilir.",
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
        summary:
            "Erken aşama saç dökülmesi. Hairline düzeltme ve ön bölge güçlendirme. Mükemmel aday.",
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
        summary:
            "Fiyat karşılaştırması yapıyor. Farklı kliniklerden teklif aldı. Takip gerekli.",
        last_message: "1 gün önce",
        messages_count: 5,
    },
];

/** ----------------------------
 * Utils + UI primitives
 * ---------------------------- */
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

function formatDateTR(iso) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function dotForSentiment(s) {
    switch (s) {
        case "positive":
            return "bg-emerald-500";
        case "neutral":
            return "bg-amber-500";
        case "hesitant":
            return "bg-orange-500";
        case "negative":
            return "bg-red-500";
        default:
            return "bg-zinc-400";
    }
}

function labelForSentiment(s) {
    switch (s) {
        case "positive":
            return "Pozitif";
        case "neutral":
            return "Nötr";
        case "hesitant":
            return "Tereddütlü";
        case "negative":
            return "Negatif";
        default:
            return "Bilinmiyor";
    }
}

function donorLabel(q) {
    switch (q) {
        case "excellent":
            return "Mükemmel";
        case "good":
            return "İyi";
        case "average":
            return "Orta";
        case "poor":
            return "Zayıf";
        default:
            return "Orta";
    }
}

function donorTone(q) {
    switch (q) {
        case "excellent":
            return "text-emerald-700 bg-emerald-50 border-emerald-200";
        case "good":
            return "text-sky-700 bg-sky-50 border-sky-200";
        case "average":
            return "text-amber-700 bg-amber-50 border-amber-200";
        case "poor":
            return "text-red-700 bg-red-50 border-red-200";
        default:
            return "text-amber-700 bg-amber-50 border-amber-200";
    }
}

function riskTone({ chronic_disease, allergies, previous_transplant }) {
    const risk =
        (chronic_disease && chronic_disease !== "None") ||
        (allergies && allergies !== "None") ||
        previous_transplant;
    return risk;
}

function KeyChip({ children, tone = "default" }) {
    const toneMap = {
        default: "bg-sky-50 border border-sky-200 text-sky-800",
        dark: "bg-amber-50/90 border-amber-200/90 text-black",
        subtle: "bg-purple-100 border-purple-200 text-purple-800",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full border text-[13px] font-semibold leading-none",
                toneMap[tone] || toneMap.default
            )}
        >
            {children}
        </span>
    );
}

function ProgressBar({ value }) {
    const v = Math.max(0, Math.min(100, value ?? 0));

    return (
        <div className="shrink-0 flex items-center gap-3">
            {/* Outer mint frame */}
            <div className="relative w-[100px] h-7 rounded-full bg-emerald-50 border-1 border-emerald-200/90">
                {/* Inner padding area */}
                <div className="absolute inset-[2px] rounded-full bg-emerald-50 overflow-hidden">
                    {/* Fill */}
                    <div
                        className="h-full rounded-full bg-emerald-900"
                        style={{ width: `${v}%` }}
                    />
                </div>
            </div>

            {/* Percent label */}
            <div className="w-[44px] text-right text-sm font-extrabold tabular-nums text-zinc-700">
                %{v}
            </div>
        </div>
    );
}

function Segmented({ value, onChange, items }) {
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
                        <span
                            className={cn(
                                "ml-2 text-[11px] px-2 py-0.5 rounded-full tabular-nums",
                                active ? "bg-zinc-100 text-zinc-700" : "bg-zinc-300/60 text-zinc-600"
                            )}
                        >
                            {it.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function MetricCard({ title, value, hint, icon: Icon }) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">{title}</div>
                <Icon className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900 tabular-nums">{value}</div>
            {hint ? <div className="mt-1 text-sm text-zinc-500">{hint}</div> : null}
        </div>
    );
}

function InfoRow({ label, value, rightTag }) {
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

/** ----------------------------
 * List Row (Critical info is BIG)
 * ---------------------------- */
function PatientListRow({ patient, onOpen }) {
    const graftRange = `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`;
    const isRisk = riskTone(patient);

    return (
        <motion.button
            layoutId={`patient-${patient.id}`}
            onClick={() => onOpen(patient)}
            className="w-full text-left group"
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
            {/* Desktop / Tablet (MD+): Grid ile sabit hizalama */}
            <div className="hidden md:grid px-4 py-4 items-center gap-6
                            grid-cols-[360px_1fr_340px]">
                {/* Left (sabit kolon) */}
                <div className="min-w-0 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                        {patient.country}
                    </div>

                    <div className="min-w-0">
                        {/* Name row */}
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

                {/* Middle (tam ortada sabit) */}
                <div className="min-w-0 w-full flex justify-center pr-10">
                    <div className="min-w-0 flex items-center gap-2 overflow-hidden">
                        <KeyChip tone="dark">NW{patient.norwood}</KeyChip>
                        <KeyChip>{patient.technique}</KeyChip>

                        {/* Greft chip kırpılacaksa en sonda kırpılsın, bar'a “değmeden” */}
                        <KeyChip>
                            <span className="tabular-nums whitespace-nowrap">
                                {graftRange}
                            </span>
                            &nbsp;greft
                        </KeyChip>
                    </div>
                </div>

                {/* Right (sabit sağ kolon) */}
                <div className="justify-self-end flex items-center gap-4">
                    <ProgressBar value={patient.purchase_rate} />
                    <div className="min-w-[150px] text-right">
                        {patient.appointment_date ? (
                            <div className="text-sm text-zinc-900 font-semibold">
                                {formatDateTR(patient.appointment_date)}
                            </div>
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

            {/* Mobile (SM): Eski flex düzenin kalsın */}
            <div className="md:hidden flex items-center justify-between px-4 py-4">
                {/* Left */}
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                        {patient.country}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-zinc-900 truncate text-[16px]">
                                {patient.name}
                            </div>
                            <span className={cn("w-2.5 h-2.5 rounded-full", dotForSentiment(patient.sentiment))} />
                            <span className="text-sm text-zinc-600 font-medium">
                                {labelForSentiment(patient.sentiment)}
                            </span>
                        </div>

                        <div className="mt-2 text-[12px] text-zinc-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{patient.last_message}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="tabular-nums">{patient.messages_count} mesaj</span>
                        </div>
                    </div>
                </div>

                {/* Mobile chevron */}
                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>
            </div>
            <div className="h-px bg-zinc-100" />
        </motion.button>
    );
}

/** ----------------------------
 * Center Morph Sheet (not right drawer, not "demode popup")
 * ---------------------------- */
function CenterMorphSheet({ patient, onClose }) {
    useEffect(() => {
        if (!patient) return;

        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [patient, onClose]);

    if (!patient) return null;

    const graftRange = `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`;
    const isRisk = riskTone(patient);

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[7px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={onClose}
            />

            {/* Sheet */}
            <motion.div
                layoutId={`patient-${patient.id}`}
                className={cn(
                    "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "w-[min(860px,94vw)] h-[min(82vh,760px)]",
                    "rounded-[28px] bg-white border border-zinc-200 shadow-2xl overflow-hidden"
                )}
                initial={{ opacity: 0.0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.0 }}
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
                                    <div className="text-xl font-semibold text-zinc-900 truncate">
                                        {patient.name}
                                    </div>
                                    <div className="text-sm text-zinc-500 font-medium truncate">
                                        {patient.phone} • {patient.age} yaş
                                    </div>
                                </div>
                            </div>

                            {/* Critical bar stays BIG here */}
                            <div className="mt-4 flex flex-wrap items-center gap-2">

                                <span className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13px] font-semibold",
                                    donorTone(patient.donor_quality)
                                )}>
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

                    {/* Actions */}
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
                    {/* Top grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* AI Summary hero */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Star className="w-4 h-4 text-zinc-400" />
                                AI Değerlendirme Özeti
                            </div>
                            <div className="mt-3 text-[15px] text-zinc-900 leading-relaxed">
                                {patient.summary}
                            </div>

                            {/* Purchase emphasis */}
                            <div className="mt-5 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs text-zinc-500">Satın alma olasılığı</div>
                                    <div className="mt-1 text-2xl font-semibold text-zinc-900 tabular-nums">
                                        %{patient.purchase_rate}
                                    </div>
                                </div>
                                <ProgressBar value={patient.purchase_rate} />
                            </div>
                        </div>

                        {/* Appointment + quick status */}
                        <div className="bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="text-sm text-zinc-500 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-zinc-400" />
                                Randevu
                            </div>
                            <div className="mt-3">
                                {patient.appointment_date ? (
                                    <div className="text-[18px] font-semibold text-zinc-900">
                                        {formatDateTR(patient.appointment_date)}
                                    </div>
                                ) : (
                                    <div className="text-[16px] font-semibold text-zinc-600">
                                        Randevu yok
                                    </div>
                                )}
                                <div className="mt-2 text-sm text-zinc-500">
                                    Sekreter için: randevu oluştur veya takip planla.
                                </div>
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

                    {/* Grouped cards like iOS */}
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
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                                            OK
                                        </span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold">
                                            Noted
                                        </span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="İlaçlar"
                                value={patient.medications === "None" ? "Yok" : patient.medications}
                                rightTag={
                                    patient.medications === "None" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">
                                            -
                                        </span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                                                Med
                                            </span>
                                        </span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Alerji"
                                value={patient.allergies === "None" ? "Yok" : patient.allergies}
                                rightTag={
                                    patient.allergies === "None" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                                            OK
                                        </span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold">
                                            Alert
                                        </span>
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
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold">
                                            Noted
                                        </span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                                            OK
                                        </span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Aile geçmişi"
                                value={patient.family_history ? "Evet" : "Hayır"}
                            />
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

                    {/* Footer hint */}
                    <div className="mt-4 text-xs text-zinc-500 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                            İpucu: Bu paneli “teklif gönderildi / follow-up / randevu” aksiyonlarıyla genişletebiliriz.
                        </div>
                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

/** ----------------------------
 * Main Component
 * ---------------------------- */
export default function AppleClinicPatientDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedPatient, setSelectedPatient] = useState(null);

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return samplePatients
            .filter((p) => {
                if (!q) return true;
                return p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q);
            })
            .filter((p) => {
                if (activeFilter === "all") return true;
                if (activeFilter === "positive") return p.sentiment === "positive";
                if (activeFilter === "appointment") return Boolean(p.appointment_date);
                if (activeFilter === "followup") return p.purchase_rate < 50 || p.sentiment === "hesitant";
                if (activeFilter === "risk") return riskTone(p);
                return true;
            });
    }, [searchQuery, activeFilter]);

    const counts = useMemo(() => {
        const all = samplePatients.length;
        const positive = samplePatients.filter((p) => p.sentiment === "positive").length;
        const appointment = samplePatients.filter((p) => p.appointment_date).length;
        const followup = samplePatients.filter((p) => p.purchase_rate < 50 || p.sentiment === "hesitant").length;
        const risk = samplePatients.filter((p) => riskTone(p)).length;
        return { all, positive, appointment, followup, risk };
    }, []);

    const avgPurchase = useMemo(() => {
        const sum = samplePatients.reduce((acc, p) => acc + (p.purchase_rate || 0), 0);
        return Math.round(sum / Math.max(1, samplePatients.length));
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
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

                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-zinc-500">
                            Sonuç yok. Arama veya filtreyi değiştir.
                        </div>
                    ) : null}
                </div>
            </div>

            <CenterMorphSheet patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
        </div>
    );
}