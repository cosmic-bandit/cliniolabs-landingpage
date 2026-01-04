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
        case "excellent": return "Mükemmel";
        case "good": return "İyi";
        case "average": return "Orta";
        case "poor": return "Zayıf";
        default: return "Orta";
    }
}

function donorTone(q: string | null) {
    switch (q) {
        case "excellent": return "text-emerald-700 bg-emerald-50 border-emerald-200";
        case "good": return "text-sky-700 bg-sky-50 border-sky-200";
        case "average": return "text-amber-700 bg-amber-50 border-amber-200";
        case "poor": return "text-red-700 bg-red-50 border-red-200";
        default: return "text-amber-700 bg-amber-50 border-amber-200";
    }
}

function hasRisk(patient: Patient) {
    return (
        (patient.chronic_disease && patient.chronic_disease !== "None" && patient.chronic_disease !== null) ||
        (patient.allergies && patient.allergies !== "None" && patient.allergies !== null)
    );
}

// ===== UI COMPONENTS =====
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

// ===== MAIN COMPONENT =====
export default function UniqueDashboard({ token }: UniqueDashboardProps) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Fetch messages
    const fetchMessages = useCallback(async (patientId: string) => {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("patient_id", patientId)
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
        if (patient?.id) {
            fetchMessages(patient.id);
        }
    }, [patient?.id, fetchMessages]);

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

    // Real-time subscription for messages
    useEffect(() => {
        if (!patient?.id) return;

        const messageChannel = supabase
            .channel("message-updates")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `patient_id=eq.${patient.id}`,
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
    }, [patient?.id]);

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
            // Delete messages first
            await supabase.from("messages").delete().eq("patient_id", patient.id);
            // Then delete patient
            await supabase.from("patients").delete().eq("id", patient.id);
            // Redirect
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

    const graftRange = patient.graft_min && patient.graft_max
        ? `${patient.graft_min.toLocaleString()}–${patient.graft_max.toLocaleString()}`
        : "—";
    const isRisk = hasRisk(patient);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Header */}
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
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <MetricCard title="Toplam Mesaj" value={metrics.messages} hint="Real-time" icon={MessageSquare} live />
                    <MetricCard title="Analiz Durumu" value={metrics.analysisComplete ? "Tamamlandı" : "Bekliyor"} icon={Activity} />
                    <MetricCard title="Satın Alma" value={`%${metrics.purchaseRate}`} icon={TrendingUp} />
                    <MetricCard title="Aşama" value={metrics.stage} icon={Clock} />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Patient Info */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Patient Header Card */}
                        <div className="bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-xl">
                                    {patient.country || "🌍"}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-lg font-semibold text-zinc-900 truncate">{patient.name || "İsimsiz"}</div>
                                    <div className="text-sm text-zinc-500">{patient.phone} • {patient.age || "?"} yaş</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {patient.norwood && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[13px] font-semibold text-black">
                                        NW{patient.norwood.replace(/\D/g, '')}
                                    </span>
                                )}
                                {patient.recommended_technique && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[13px] font-semibold text-sky-800">
                                        {patient.recommended_technique}
                                    </span>
                                )}
                                {patient.graft_min && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[13px] font-semibold text-sky-800">
                                        {graftRange} greft
                                    </span>
                                )}
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
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="bg-white rounded-3xl border border-zinc-200/70 p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
                                <Star className="w-4 h-4 text-zinc-400" />
                                AI Değerlendirme Özeti
                            </div>
                            {patient.analysis_summary ? (
                                <div className="text-[15px] text-zinc-900 leading-relaxed">{patient.analysis_summary}</div>
                            ) : (
                                <div className="text-sm text-zinc-500 italic">Henüz analiz yapılmadı.</div>
                            )}
                            <div className="mt-5 flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs text-zinc-500">Satın alma olasılığı</div>
                                    <div className="mt-1 text-2xl font-semibold text-zinc-900 tabular-nums">%{patient.purchase_rate || 0}</div>
                                </div>
                                <ProgressBar value={patient.purchase_rate} />
                            </div>
                        </div>

                        {/* Medical Info */}
                        <div className="bg-white rounded-3xl border border-zinc-200/70 overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                            <div className="px-5 py-4 text-sm text-zinc-500 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-zinc-400" />
                                Tıbbi Bilgiler
                                {isRisk ? (
                                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Risk
                                    </span>
                                ) : (
                                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Temiz
                                    </span>
                                )}
                            </div>
                            <div className="h-px bg-zinc-100" />
                            <InfoRow label="Kronik hastalık" value={patient.chronic_disease || "Yok"} />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow label="İlaçlar" value={patient.medications || "Yok"} />
                            <div className="h-px bg-zinc-100" />
                            <InfoRow label="Alerji" value={patient.allergies || "Yok"} />
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-2xl border border-red-200 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "Siliniyor..." : "Verilerimi Sil (KVKK)"}
                        </button>
                    </div>

                    {/* Right: Messages */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl border border-zinc-200/70 shadow-[0_1px_0_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <MessageSquare className="w-5 h-5 text-zinc-400" />
                                    Mesaj Geçmişi
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Real-time güncelleme aktif
                                </div>
                            </div>

                            <div className="h-[500px] overflow-auto p-5 space-y-3 bg-zinc-50">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
                                        <MessageSquare className="w-10 h-10 text-zinc-300 mb-3" />
                                        <p className="text-sm">Henüz mesaj yok.</p>
                                        <p className="text-xs mt-1">WhatsApp'tan mesaj gönderdiğinizde burada görünecek.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <MessageBubble key={msg.id} message={msg} index={i} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="mt-4 bg-zinc-100 rounded-2xl p-4 flex items-start gap-3">
                            <Shield className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-zinc-700">Veri Gizliliği</h4>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Bu bir demo sayfasıdır. Verileriniz KVKK kapsamında korunmaktadır.
                                    İstediğiniz zaman tüm verilerinizi silebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
