"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Phone, Calendar, User, Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Heart, Pill, Scissors, Users, MessageSquare, Star, Filter, Search, Download, MoreHorizontal } from 'lucide-react';

// Sample patient data
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
        summary: "Vertex bölgesinde yoğun seyrelme. DHI tekniği ile tek seansta mümkün. Hasta motivasyonu yüksek.",
        last_message: "2 saat önce",
        messages_count: 12
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
        messages_count: 8
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
        messages_count: 18
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
        messages_count: 5
    },
];

// Sentiment badge component
const SentimentBadge = ({ sentiment }) => {
    const config = {
        positive: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Pozitif', icon: '😊' },
        neutral: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Nötr', icon: '😐' },
        hesitant: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Tereddütlü', icon: '🤔' },
        negative: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Negatif', icon: '😟' },
    };
    const c = config[sentiment] || config.neutral;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
            <span>{c.icon}</span>
            {c.label}
        </span>
    );
};

// Donor quality indicator
const DonorQualityBar = ({ quality }) => {
    const config = {
        excellent: { width: '100%', color: 'bg-emerald-500', label: 'Mükemmel' },
        good: { width: '75%', color: 'bg-cyan-500', label: 'İyi' },
        average: { width: '50%', color: 'bg-amber-500', label: 'Orta' },
        poor: { width: '25%', color: 'bg-red-500', label: 'Zayıf' },
    };
    const c = config[quality] || config.average;

    return (
        <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: c.width }} />
            </div>
            <span className="text-xs text-gray-500">{c.label}</span>
        </div>
    );
};

// Purchase rate circular progress
const PurchaseRateCircle = ({ rate }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (rate / 100) * circumference;

    const getColor = (r) => {
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
                    stroke={getColor(rate)}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                %{rate}
            </span>
        </div>
    );
};

// Norwood badge
const NorwoodBadge = ({ level }) => {
    const colors = {
        1: 'from-green-400 to-green-500',
        2: 'from-emerald-400 to-emerald-500',
        3: 'from-cyan-400 to-cyan-500',
        4: 'from-amber-400 to-amber-500',
        5: 'from-orange-400 to-orange-500',
        6: 'from-red-400 to-red-500',
        7: 'from-red-500 to-red-600',
    };

    return (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[level]} flex items-center justify-center shadow-lg shadow-gray-200/50`}>
            <span className="text-white font-bold text-sm">NW{level}</span>
        </div>
    );
};

// Expandable patient row
const PatientRow = ({ patient, isExpanded, onToggle }) => {
    return (
        <div className={`border-b border-gray-100 transition-all duration-300 ${isExpanded ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}>
            {/* Main Row - Always Visible */}
            <div
                className="grid grid-cols-12 gap-4 items-center px-5 py-4 cursor-pointer"
                onClick={onToggle}
            >
                {/* Expand Arrow + Patient Info */}
                <div className="col-span-3 flex items-center gap-3">
                    <button className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg">
                            {patient.country}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {patient.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Norwood Level */}
                <div className="col-span-1 flex justify-center">
                    <NorwoodBadge level={patient.norwood} />
                </div>

                {/* Graft Estimate */}
                <div className="col-span-2">
                    <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium">Greft Tahmini</p>
                        <p className="text-sm font-bold text-blue-700">
                            {patient.graft_min.toLocaleString()} - {patient.graft_max.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Technique */}
                <div className="col-span-1">
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold ${patient.technique === 'DHI'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                        {patient.technique}
                    </span>
                </div>

                {/* Sentiment */}
                <div className="col-span-2">
                    <SentimentBadge sentiment={patient.sentiment} />
                </div>

                {/* Purchase Rate */}
                <div className="col-span-1 flex justify-center">
                    <PurchaseRateCircle rate={patient.purchase_rate} />
                </div>

                {/* Appointment */}
                <div className="col-span-2 flex items-center justify-between">
                    {patient.appointment_date ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {new Date(patient.appointment_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Randevu yok
                        </span>
                    )}

                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="ml-9 grid grid-cols-4 gap-4">
                        {/* Medical Info Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                Tıbbi Bilgiler
                            </h4>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Kronik Hastalık</span>
                                    <span className={`text-xs font-medium ${patient.chronic_disease === 'None' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {patient.chronic_disease === 'None' ? 'Yok' : patient.chronic_disease}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">İlaçlar</span>
                                    <span className="text-xs font-medium text-gray-700">
                                        {patient.medications === 'None' ? 'Yok' : patient.medications}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Alerji</span>
                                    <span className={`text-xs font-medium ${patient.allergies === 'None' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {patient.allergies === 'None' ? 'Yok' : patient.allergies}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* History Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-purple-400" />
                                Geçmiş
                            </h4>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Önceki Operasyon</span>
                                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${patient.previous_transplant ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {patient.previous_transplant ? (
                                            <><AlertCircle className="w-3 h-3" /> Var</>
                                        ) : (
                                            <><CheckCircle className="w-3 h-3" /> Yok</>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Aile Geçmişi</span>
                                    <span className="text-xs font-medium text-gray-700">
                                        {patient.family_history ? 'Evet' : 'Hayır'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Yaş</span>
                                    <span className="text-xs font-medium text-gray-700">{patient.age}</span>
                                </div>
                            </div>
                        </div>

                        {/* Donor Quality Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                Donör Kalitesi
                            </h4>
                            <div className="flex flex-col items-center justify-center h-16">
                                <DonorQualityBar quality={patient.donor_quality} />
                            </div>
                        </div>

                        {/* Communication Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-400" />
                                İletişim
                            </h4>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Son Mesaj</span>
                                    <span className="text-xs font-medium text-gray-700">{patient.last_message}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Toplam Mesaj</span>
                                    <span className="text-xs font-medium text-emerald-600">{patient.messages_count}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Summary - Full Width */}
                        <div className="col-span-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">AI Değerlendirme Özeti</h4>
                                    <p className="text-sm text-gray-200 leading-relaxed">{patient.summary}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-9 mt-4 flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            Mesaj Gönder
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                            <Calendar className="w-4 h-4" />
                            Randevu Oluştur
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors">
                            <Phone className="w-4 h-4" />
                            Ara
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Table Component
export default function PatientTable() {
    const [expandedRows, setExpandedRows] = useState(new Set([1])); // First row expanded by default
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const toggleRow = (id) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const filters = [
        { id: 'all', label: 'Tümü', count: 4 },
        { id: 'positive', label: 'Sıcak Lead', count: 2 },
        { id: 'appointment', label: 'Randevulu', count: 2 },
        { id: 'followup', label: 'Takip Gerekli', count: 1 },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes slide-in-from-top-2 {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: slide-in-from-top-2 0.2s ease-out; }
      `}</style>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasta Yönetimi</h1>
                    <p className="text-gray-500">WhatsApp üzerinden gelen tüm hasta adaylarını yönetin</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Toplam Hasta</span>
                            <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">127</p>
                        <p className="text-xs text-emerald-600">+12 bu hafta</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Sıcak Lead</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">34</p>
                        <p className="text-xs text-gray-500">%27 dönüşüm</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Bu Ay Randevu</span>
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">18</p>
                        <p className="text-xs text-gray-500">8 onaylandı</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Ort. Yanıt Süresi</span>
                            <Clock className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold text-purple-600">2.3 dk</p>
                        <p className="text-xs text-emerald-600">-45% iyileşme</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Table Header / Toolbar */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {filters.map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.id
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter.label}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
                                        }`}>
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Hasta ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-all w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                <Filter className="w-4 h-4" />
                                Filtrele
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                                Dışa Aktar
                            </button>
                        </div>
                    </div>

                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-4 items-center px-5 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-3 pl-9">Hasta</div>
                        <div className="col-span-1 text-center">Norwood</div>
                        <div className="col-span-2">Greft</div>
                        <div className="col-span-1">Teknik</div>
                        <div className="col-span-2">Sentiment</div>
                        <div className="col-span-1 text-center">Satın Alma</div>
                        <div className="col-span-2">Randevu</div>
                    </div>

                    {/* Patient Rows */}
                    <div>
                        {samplePatients.map(patient => (
                            <PatientRow
                                key={patient.id}
                                patient={patient}
                                isExpanded={expandedRows.has(patient.id)}
                                onToggle={() => toggleRow(patient.id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">4</span> hastadan <span className="font-medium text-gray-700">1-4</span> arası gösteriliyor
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                Önceki
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg">
                                1
                            </button>
                            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                2
                            </button>
                            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                3
                            </button>
                            <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                Sonraki
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}