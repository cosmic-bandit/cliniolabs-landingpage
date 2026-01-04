"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    RefreshCw,
    Shield,
    Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase, Patient, Message } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";

interface UniqueDashboardProps {
    token: string;
}

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

function dotForSentiment(s: string | null) {
    switch (s) {
        case "positive": return "bg-emerald-500";
        case "neutral": return "bg-amber-500";
        case "hesitant": return "bg-orange-500";
        case "negative": return "bg-red-500";
        default: return "bg-zinc-400";
    }
}

function labelForSentiment(s: string | null) {
    switch (s) {
        case "positive": return "Pozitif";
        case "neutral": return "Nötr";
        case "hesitant": return "Tereddütlü";
        case "negative": return "Negatif";
        default: return "Bilinmiyor";
    }
}

function donorLabel(q: string | null) {
    switch (q) {
        case "excellent": case "İYİ": return "Mükemmel";
        case "good": case "ORTA": return "İyi";
        case "average": case "SINIRLI": return "Orta";
        case "poor": return "Zayıf";
        default: return "Orta";
    }
}

function donorTone(q: string | null) {
    switch (q) {
        case "excellent": case "İYİ": return "text-emerald-700 bg-emerald-50 border-emerald-200";
        case "good": case "ORTA": return "text-sky-700 bg-sky-50 border-sky-200";
        case "average": case "SINIRLI": return "text-amber-700 bg-amber-50 border-amber-200";
        case "poor": return "text-red-700 bg-red-50 border-red-200";
        default: return "text-amber-700 bg-amber-50 border-amber-200";
    }
}

function hasRisk(patient: Patient) {
    return (
        (patient.chronic_disease && patient.chronic_disease !== "None" && patient.chronic_disease !== null && patient.chronic_disease !== "Yok") ||
        (patient.allergies && patient.allergies !== "None" && patient.allergies !== null && patient.allergies !== "Yok")
    );
}

function labelForStage(stage: string | null) {
    switch (stage) {
        case "GREETING": return "Hoş Geldin";
        case "ASK_PHOTO": return "Fotoğraf Bekleniyor";
        case "ANALYSIS_PENDING": return "Analiz Yapılıyor";
        case "ANALYSIS_COMPLETE": return "Analiz Tamamlandı";
        case "QUALIFIED": return "Uygun Aday";
        case "PRICE_GIVEN": return "Fiyat Verildi";
        case "APPOINTMENT_PENDING": return "Randevu Bekleniyor";
        case "BOOKED": return "Randevu Alındı";
        case "FOLLOW_UP": return "Takip";
        case "CLOSED": return "Kapandı";
        default: return stage || "Bilinmiyor";
    }
}

// Stage order for progress calculation
const STAGE_ORDER = [
    "GREETING",
    "ASK_PHOTO",
    "ANALYSIS_PENDING",
    "ANALYSIS_COMPLETE",
    "QUALIFIED",
    "PRICE_GIVEN",
    "APPOINTMENT_PENDING",
    "BOOKED"
];

function stageProgress(stage: string | null): { current: number; total: number } {
    const index = STAGE_ORDER.indexOf(stage || "GREETING");
    return {
        current: index >= 0 ? index + 1 : 1,
        total: STAGE_ORDER.length
    };
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

function ProgressBar({ value }: { value: number | null }) {
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

function MetricCard({ title, value, hint, icon: Icon, live = false }: { title: string; value: string | number; hint?: string; icon: any; live?: boolean }) {
    return (
        <div className="bg-white rounded-2xl border border-zinc-200/70 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">{title}</div>
                <div className="flex items-center gap-2">
                    {live && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    <Icon className="w-4 h-4 text-zinc-400" />
                </div>
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

// Message bubble component
function MessageBubble({ message, index }: { message: Message; index: number }) {
    const isOutbound = message.direction === "outbound";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            className={cn("flex", isOutbound ? "justify-end" : "justify-start")}
        >
            <div className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl",
                isOutbound
                    ? "bg-emerald-500 text-white rounded-br-md"
                    : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-md"
            )}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={cn(
                    "text-[10px] mt-1",
                    isOutbound ? "text-emerald-100" : "text-zinc-400"
                )}>
                    {formatRelativeTime(message.created_at)}
                </p>
            </div>
        </motion.div>
    );
}

// Loading spinner
function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-zinc-500">Yükleniyor...</p>
        </div>
    );
}

// Empty state
function EmptyStateMessage({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">Veri Bulunamadı</h3>
            <p className="text-sm text-zinc-500 max-w-sm">{message}</p>
            <a
                href="https://wa.me/905XXXXXXXXX?text=Demo%20test"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
            >
                <MessageSquare className="w-5 h-5" />
                WhatsApp'tan Yaz
            </a>
        </div>
    );
}

// ===== PATIENT LIST ROW (Showcase style) =====
function PatientListRow({ patient, onOpen, messagesCount, lastMessage }: {
    patient: Patient;
    onOpen: () => void;
    messagesCount: number;
    lastMessage: string;
}) {
    const graftRange = patient.graft_min && patient.graft_max
        ? `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`
        : "—";
    const isRisk = hasRisk(patient);
    const norwood = patient.norwood?.replace(/[^0-9]/g, '') || "?";

    return (
        <motion.button
            layoutId={`patient-${patient.id}`}
            onClick={onOpen}
            className="w-full text-left group"
            whileTap={{ scale: 0.995 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
            {/* Desktop */}
            <div className="hidden md:grid px-4 py-4 items-center gap-6 grid-cols-[360px_1fr_340px]">
                <div className="min-w-0 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-100 flex items-center justify-center text-xl shrink-0">
                        {patient.country || "🌍"}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="font-semibold text-zinc-900 truncate text-[16px] max-w-[240px]">
                                {patient.name || "İsimsiz"}
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
                        {patient.norwood && <KeyChip tone="dark">NW{norwood}</KeyChip>}
                        {patient.recommended_technique && <KeyChip>{patient.recommended_technique}</KeyChip>}
                        {patient.graft_min && (
                            <KeyChip>
                                <span className="tabular-nums whitespace-nowrap">{graftRange}</span>&nbsp;greft
                            </KeyChip>
                        )}
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
                        {patient.country || "🌍"}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="font-semibold text-zinc-900 truncate text-[16px]">{patient.name || "İsimsiz"}</div>
                            <span className={cn("w-2.5 h-2.5 rounded-full", dotForSentiment(patient.sentiment))} />
                        </div>
                        <div className="mt-2 text-[12px] text-zinc-500 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{lastMessage}</span>
                            <span className="text-zinc-300">•</span>
                            <span className="tabular-nums">{messagesCount} mesaj</span>
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

// ===== CENTER MORPH SHEET (Same style as ShowcaseDashboard) =====
function CenterMorphSheet({
    patient,
    onClose,
    onDelete,
    isDeleting
}: {
    patient: Patient | null;
    onClose: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    useEffect(() => {
        if (!patient) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [patient, onClose]);

    if (!patient) return null;

    const graftRange = patient.graft_min && patient.graft_max
        ? `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`
        : "—";
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
                    "w-[min(920px,96vw)] h-[min(85vh,820px)]",
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
                                    {patient.country || "🌍"}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl font-semibold text-zinc-900 truncate">{patient.name || "İsimsiz"}</div>
                                    <div className="text-sm text-zinc-500 font-medium truncate">
                                        {patient.phone} • {patient.age || "?"} yaş
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
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Real-time güncellemeler aktif</span>
                        </div>
                    </div>
                </div>

                {/* Body - Same as ShowcaseDashboard */}
                <div className="h-[calc(100%-172px)] overflow-auto bg-zinc-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* AI Summary */}
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                <Star className="w-4 h-4 text-zinc-400" />
                                AI Değerlendirme Özeti
                            </div>
                            <div className="mt-3 text-[15px] text-zinc-900 leading-relaxed">
                                {patient.analysis_summary || "Henüz analiz yapılmadı. Fotoğraf gönderdiğinizde AI değerlendirmesi burada görünecek."}
                            </div>
                            <div className="mt-5 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs text-zinc-500">Satın alma olasılığı</div>
                                    <div className="mt-1 text-2xl font-semibold text-zinc-900 tabular-nums">%{patient.purchase_rate || 0}</div>
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
                                <div className="mt-2 text-sm text-zinc-500">Randevu durumu</div>
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
                                value={!patient.chronic_disease || patient.chronic_disease === "None" || patient.chronic_disease === "Yok" ? "Yok" : patient.chronic_disease}
                                rightTag={
                                    !patient.chronic_disease || patient.chronic_disease === "None" || patient.chronic_disease === "Yok" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">OK</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-semibold">Noted</span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="İlaçlar"
                                value={!patient.medications || patient.medications === "None" || patient.medications === "Yok" ? "Yok" : patient.medications}
                                rightTag={
                                    !patient.medications || patient.medications === "None" || patient.medications === "Yok" ? (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">-</span>
                                    ) : (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold">Med</span>
                                    )
                                }
                            />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Alerji"
                                value={!patient.allergies || patient.allergies === "None" || patient.allergies === "Yok" ? "Yok" : patient.allergies}
                                rightTag={
                                    !patient.allergies || patient.allergies === "None" || patient.allergies === "Yok" ? (
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
                            <InfoRow label="Yaş" value={`${patient.age || "?"}`} />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow
                                label="Donör kalitesi"
                                value={donorLabel(patient.donor_quality)}
                                rightTag={
                                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-semibold", donorTone(patient.donor_quality))}>
                                        {patient.donor_quality || "Orta"}
                                    </span>
                                }
                            />
                        </div>
                    </div>

                    {/* Footer with Delete Button */}
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Shield className="w-4 h-4 text-zinc-400" />
                            Verileriniz KVKK kapsamında korunmaktadır.
                        </div>
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-xl border border-red-200 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "Siliniyor..." : "Verilerimi Sil"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ===== MAIN COMPONENT =====
export default function UniqueDashboard({ token }: UniqueDashboardProps) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    // Fetch patient by token
    const fetchPatient = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("patients")
                .select("*")
                .eq("dashboard_token", token)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    setPatient(null);
                } else {
                    throw error;
                }
            } else {
                setPatient(data);
            }
        } catch (err) {
            console.error("Error fetching patient:", err);
            setError("Hasta bilgileri yüklenirken bir hata oluştu.");
        }
    }, [token]);

    // Fetch messages by phone
    const fetchMessages = useCallback(async (phone: string) => {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("phone", phone)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    }, []);

    // Initial load
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await fetchPatient();
            setIsLoading(false);
        };
        load();
    }, [fetchPatient]);

    // Load messages when patient is available
    useEffect(() => {
        if (patient?.phone) {
            fetchMessages(patient.phone);
        }
    }, [patient?.phone, fetchMessages]);

    // Real-time subscription for patient updates
    useEffect(() => {
        if (!token) return;

        const patientChannel = supabase
            .channel("patient-updates")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "patients",
                    filter: `dashboard_token=eq.${token}`,
                },
                (payload) => {
                    console.log("Patient update:", payload);
                    if (payload.eventType === "DELETE") {
                        setPatient(null);
                    } else {
                        setPatient(payload.new as Patient);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(patientChannel);
        };
    }, [token]);

    // Real-time subscription for messages by phone
    useEffect(() => {
        if (!patient?.phone) return;

        const messageChannel = supabase
            .channel("message-updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `phone=eq.${patient.phone}`,
                },
                (payload) => {
                    console.log("New message:", payload);
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageChannel);
        };
    }, [patient?.phone]);

    // Retry handler
    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        fetchPatient().finally(() => setIsLoading(false));
    };

    // Delete handler
    const handleDelete = async () => {
        if (!patient) return;
        if (!confirm("Tüm verilerinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) return;

        setIsDeleting(true);
        try {
            await supabase.from("messages").delete().eq("patient_id", patient.id);
            await supabase.from("patients").delete().eq("id", patient.id);
            window.location.href = "/demo-dashboard";
        } catch (err) {
            console.error("Delete error:", err);
            alert("Silme işlemi başarısız oldu.");
            setIsDeleting(false);
        }
    };

    // Derived metrics
    const metrics = useMemo(() => {
        if (!patient) return { messages: 0, analysisComplete: false, purchaseRate: 0, stage: "GREETING" };
        return {
            messages: messages.length,
            analysisComplete: patient.current_stage !== "GREETING" && patient.current_stage !== "ANALYSIS_PENDING",
            purchaseRate: patient.purchase_rate || 0,
            stage: patient.current_stage || "GREETING",
        };
    }, [patient, messages]);

    const lastMessageTime = useMemo(() => {
        if (messages.length === 0) return "Henüz yok";
        const last = messages[messages.length - 1];
        return formatRelativeTime(last.created_at);
    }, [messages]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-black transition"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    // No patient found
    if (!patient) {
        return (
            <div className="min-h-screen bg-zinc-50">
                <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Link href="/demo-dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm">Showcase'e Dön</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <EmptyStateMessage message="Bu token ile ilişkili veri bulunamadı. WhatsApp'tan mesaj göndererek demo'yu başlatın." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Header - Showcase Style */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/demo-dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm">Showcase</span>
                            </Link>
                            <div className="h-6 w-px bg-zinc-200" />
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                <h1 className="text-lg font-semibold">Sizin Dashboard'unuz</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Canlı
                            </span>
                            <button
                                onClick={handleRetry}
                                className="flex items-center gap-2 px-3 py-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
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
                </div>

                {/* Metrics */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard title="Toplam Mesaj" value={metrics.messages} hint="Real-time" icon={MessageSquare} live />
                    <MetricCard title="Analiz Durumu" value={metrics.analysisComplete ? "Tamamlandı" : "Bekliyor"} icon={Activity} />
                    <MetricCard title="Satın Alma" value={`%${metrics.purchaseRate}`} hint="Satın alma olasılığı" icon={TrendingUp} />
                    <MetricCard title="Aşama" value={`${stageProgress(metrics.stage).current}/${stageProgress(metrics.stage).total}`} hint={labelForStage(metrics.stage)} icon={Clock} />
                </div>

                {/* List - Same as Showcase */}
                <div className="mt-6 bg-white rounded-3xl border border-zinc-200/70 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                    <div className="px-4 py-3 text-sm text-zinc-500 flex items-center justify-between bg-zinc-50/60 border-b border-zinc-100">
                        <div>
                            <span className="font-medium text-zinc-700">1</span> sonuç
                        </div>
                        <div className="text-[11px] text-zinc-500">
                            Tıkla: satır → panel (morph)
                        </div>
                    </div>

                    <PatientListRow
                        patient={patient}
                        onOpen={() => setShowPanel(true)}
                        messagesCount={messages.length}
                        lastMessage={lastMessageTime}
                    />
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

            {/* Center Morph Sheet */}
            {showPanel && (
                <CenterMorphSheet
                    patient={patient}
                    onClose={() => setShowPanel(false)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
