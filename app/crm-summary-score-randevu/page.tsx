"use client"

import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, Clock, CheckCircle, TrendingUp, MessageSquare, FileText, Sparkles, ArrowRight, Bell } from 'lucide-react';

// ============================================
// 1. CRM ENTEGRASYONU - Google Sheets Mockup
// ============================================
export const CRMMockup = () => {
  const [highlightedRow, setHighlightedRow] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedRow(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const patients = [
    { name: "Ahmet Y.", country: "🇩🇪", norwood: "NW4", graft: "3.2K-3.8K", status: "🔥 Sıcak", score: "85%", color: "bg-emerald-50" },
    { name: "John D.", country: "🇬🇧", norwood: "NW5", graft: "4.0K-4.5K", status: "📞 Takip", score: "60%", color: "bg-amber-50" },
    { name: "Mohammed", country: "🇸🇦", norwood: "NW3", graft: "2.5K-3.0K", status: "✅ Randevu", score: "92%", color: "bg-blue-50" },
    { name: "Ivan P.", country: "🇷🇺", norwood: "NW4", graft: "3.5K-4.0K", status: "🤔 Bekliyor", score: "35%", color: "bg-gray-50" },
  ];

  return (
    <div className="relative">
      {/* Browser Window */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Browser Bar */}
        <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 3h-15A2.5 2.5 0 002 5.5v13A2.5 2.5 0 004.5 21h15a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0019.5 3z"/>
              </svg>
              docs.google.com/spreadsheets/hairclinic-crm
            </div>
          </div>
        </div>

        {/* Sheets Header */}
        <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Istanbul_Hair_Clinic_CRM</p>
              <p className="text-xs text-gray-400">Hasta Listesi</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Canlı Senkron
            </span>
          </div>
        </div>

        {/* Spreadsheet */}
        <div className="p-2">
          {/* Column Headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t overflow-hidden text-xs">
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Hasta</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Ülke</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Norwood</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Greft</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Durum</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Skor</div>
            <div className="bg-gray-50 px-2 py-1.5 font-semibold text-gray-600">Aksiyon</div>
          </div>

          {/* Rows */}
          <div className="grid gap-px bg-gray-200">
            {patients.map((patient, i) => (
              <div 
                key={i}
                className={`grid grid-cols-7 gap-px text-xs transition-all duration-500 ${
                  highlightedRow === i ? 'ring-2 ring-emerald-400 ring-offset-1 rounded z-10' : ''
                }`}
              >
                <div className={`${patient.color} px-2 py-2 font-medium text-gray-800`}>{patient.name}</div>
                <div className={`${patient.color} px-2 py-2 text-center`}>{patient.country}</div>
                <div className={`${patient.color} px-2 py-2`}>
                  <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">{patient.norwood}</span>
                </div>
                <div className={`${patient.color} px-2 py-2 font-mono text-gray-700`}>{patient.graft}</div>
                <div className={`${patient.color} px-2 py-2`}>{patient.status}</div>
                <div className={`${patient.color} px-2 py-2`}>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          parseInt(patient.score) >= 70 ? 'bg-emerald-500' : 
                          parseInt(patient.score) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: patient.score }}
                      />
                    </div>
                    <span className="text-gray-600">{patient.score}</span>
                  </div>
                </div>
                <div className={`${patient.color} px-2 py-2`}>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">Mesaj →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-update indicator */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Son güncelleme: 2 saniye önce</span>
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI tarafından otomatik güncelleniyor
          </span>
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-bounce">
        +1 Yeni hasta eklendi!
      </div>
    </div>
  );
};

// ============================================
// 2. HASTA ÖZETİ - AI Patient Card
// ============================================
export const PatientSummaryMockup = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsAnalyzing(false), 2000);
    const timer2 = setTimeout(() => setShowResult(true), 2200);
    
    const resetTimer = setTimeout(() => {
      setIsAnalyzing(true);
      setShowResult(false);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(resetTimer);
    };
  }, [isAnalyzing]);

  return (
    <div className="flex gap-4 items-start">
      {/* WhatsApp Chat */}
      <div className="w-64 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-emerald-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">AY</div>
          <div>
            <p className="text-white text-sm font-medium">Ahmet Yılmaz</p>
            <p className="text-emerald-100 text-xs">çevrimiçi</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-3 space-y-2 bg-[#e5ded8] min-h-[180px]">
          <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-xs text-gray-800">Merhaba, saç ekimi için bilgi almak istiyorum</p>
            <p className="text-[10px] text-gray-400 text-right mt-1">14:22</p>
          </div>
          <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-xs text-gray-800">34 yaşındayım, 5 yıldır dökülme var</p>
            <p className="text-[10px] text-gray-400 text-right mt-1">14:23</p>
          </div>
          <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-xs text-gray-800">Almanya'da yaşıyorum</p>
            <p className="text-[10px] text-gray-400 text-right mt-1">14:23</p>
          </div>
          <div className="bg-white rounded-lg px-3 py-2 max-w-[85%] shadow-sm">
            <p className="text-xs text-gray-800">Bütçem 3000-4000€ arası</p>
            <p className="text-[10px] text-gray-400 text-right mt-1">14:24</p>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAnalyzing ? 'bg-amber-100' : 'bg-emerald-100'}`}>
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isAnalyzing ? 'AI Analiz\nEdiyor...' : 'Özet\nHazır!'}
        </p>
      </div>

      {/* Patient Summary Card */}
      <div className={`w-72 transition-all duration-500 ${showResult ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Ahmet Yılmaz</p>
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  🇩🇪 Almanya • 34 yaş
                </p>
              </div>
            </div>
          </div>

          {/* Summary Content */}
          <div className="p-4 space-y-3">
            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                <p className="text-[10px] text-orange-600 font-medium">Dökülme Süresi</p>
                <p className="text-sm font-bold text-orange-700">5 Yıl</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                <p className="text-[10px] text-blue-600 font-medium">Bütçe</p>
                <p className="text-sm font-bold text-blue-700">€3-4K</p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-gray-700">AI Değerlendirme</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Orta-ileri seviye dökülme bekleniyor. Bütçe uygun, motivasyon yüksek. 
                <span className="text-emerald-600 font-medium"> Fotoğraf talep edilmeli.</span>
              </p>
            </div>

            {/* Suggested Action */}
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-800 mb-1">📸 Önerilen Aksiyon</p>
              <p className="text-xs text-emerald-700">"Detaylı analiz için fotoğraf rica edin"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 3. SATIN ALMA NİYET SKORU - Gauge + List
// ============================================
export const PurchaseIntentMockup = () => {
  const [currentScore, setCurrentScore] = useState(45);
  const [animatedScore, setAnimatedScore] = useState(45);

  useEffect(() => {
    const scores = [45, 62, 78, 85, 85, 85];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % scores.length;
      setCurrentScore(scores[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const step = currentScore > animatedScore ? 1 : -1;
    if (animatedScore !== currentScore) {
      const timer = setTimeout(() => {
        setAnimatedScore(prev => prev + step);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentScore, animatedScore]);

  const getScoreColor = (score) => {
    if (score >= 70) return { ring: 'stroke-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Yüksek' };
    if (score >= 40) return { ring: 'stroke-amber-500', bg: 'bg-amber-500', text: 'text-amber-600', label: 'Orta' };
    return { ring: 'stroke-red-500', bg: 'bg-red-500', text: 'text-red-600', label: 'Düşük' };
  };

  const colors = getScoreColor(animatedScore);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const factors = [
    { label: "Fotoğraf gönderdi", active: animatedScore >= 50, points: "+15" },
    { label: "Bütçe belirtti", active: animatedScore >= 55, points: "+12" },
    { label: "Tarih sordu", active: animatedScore >= 70, points: "+20" },
    { label: "Fiyat onayladı", active: animatedScore >= 85, points: "+25" },
  ];

  return (
    <div className="flex gap-6 items-center">
      {/* Score Gauge */}
      <div className="relative">
        <div className="w-40 h-40 relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="54" stroke="#f1f5f9" strokeWidth="12" fill="none" />
            <circle
              cx="80" cy="80" r="54"
              className={`${colors.ring} transition-all duration-300`}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${colors.text}`}>%{animatedScore}</span>
            <span className="text-sm text-gray-500">{colors.label} Niyet</span>
          </div>
        </div>

        {/* Pulse effect when high */}
        {animatedScore >= 70 && (
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-20" />
        )}
      </div>

      {/* Factors List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-72">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Satın Alma Sinyalleri
          </h4>
        </div>
        <div className="p-3 space-y-2">
          {factors.map((factor, i) => (
            <div 
              key={i}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-500 ${
                factor.active ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  factor.active ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {factor.active && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs ${factor.active ? 'text-emerald-800 font-medium' : 'text-gray-500'}`}>
                  {factor.label}
                </span>
              </div>
              <span className={`text-xs font-bold ${factor.active ? 'text-emerald-600' : 'text-gray-400'}`}>
                {factor.points}
              </span>
            </div>
          ))}
        </div>

        {/* Action suggestion */}
        {animatedScore >= 70 && (
          <div className="px-4 py-3 bg-emerald-500 text-white">
            <p className="text-xs font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              🔥 Sıcak Lead! Hemen arayın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 4. RANDEVU OTOMASYONU - Chat + Calendar
// ============================================
export const AppointmentMockup = () => {
  const [step, setStep] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const steps = [0, 1, 2, 3];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % 5;
      if (index === 4) {
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
        setStep(index);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const messages = [
    { from: "patient", text: "Ocak ayında randevu alabilir miyim?" },
    { from: "ai", text: "Tabii! 15-20 Ocak arası müsait günlerimiz var. Hangi tarih size uygun?" },
    { from: "patient", text: "17 Ocak Cuma olabilir" },
    { from: "ai", text: "17 Ocak Cuma 10:00 için randevunuz oluşturuldu! ✅ Detayları mail olarak gönderdim." },
  ];

  return (
    <div className="flex gap-4 items-start">
      {/* WhatsApp Chat */}
      <div className="w-72 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-emerald-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">MA</div>
          <div>
            <p className="text-white text-sm font-medium">Mohammed Al-Rashid</p>
            <p className="text-emerald-100 text-xs">🇸🇦 Suudi Arabistan</p>
          </div>
        </div>

        <div className="p-3 space-y-2 bg-[#e5ded8] min-h-[200px]">
          {messages.slice(0, step + 1).map((msg, i) => (
            <div 
              key={i}
              className={`${msg.from === 'patient' ? 'bg-white ml-0 mr-auto' : 'bg-emerald-100 ml-auto mr-0'} 
                rounded-lg px-3 py-2 max-w-[85%] shadow-sm animate-fadeIn`}
            >
              <p className="text-xs text-gray-800">{msg.text}</p>
              <p className="text-[10px] text-gray-400 text-right mt-1">
                {msg.from === 'ai' && '🤖'} 14:2{i}
              </p>
            </div>
          ))}

          {step === 3 && (
            <div className="flex justify-center">
              <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                📅 Randevu otomatik oluşturuldu
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arrow & Sync */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          showCalendar ? 'bg-emerald-100 scale-110' : 'bg-gray-100'
        }`}>
          {showCalendar ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <ArrowRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">Auto-sync</p>
      </div>

      {/* Google Calendar */}
      <div className={`transition-all duration-500 ${showCalendar ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 w-64">
          {/* Calendar Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">31</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Google Calendar</p>
              <p className="text-xs text-gray-400">Ocak 2025</p>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(d => (
                <div key={d} className="text-gray-400 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {[13, 14, 15, 16, 17, 18, 19].map(d => (
                <div 
                  key={d}
                  className={`py-1.5 rounded transition-all ${
                    d === 17 
                      ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300 ring-offset-1' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Card */}
          {showCalendar && (
            <div className="mx-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 animate-fadeIn">
              <div className="flex items-start gap-2">
                <div className="w-1 h-full bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Saç Ekimi Konsültasyon</p>
                  <p className="text-xs text-emerald-600">Mohammed Al-Rashid</p>
                  <p className="text-xs text-gray-500 mt-1">🕐 10:00 - 10:30</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Google Sheets sync indicator */}
        {showCalendar && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2 animate-fadeIn">
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            <span className="text-xs text-green-700">Sheets'e de eklendi ✓</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// ============================================
// DEMO: All mockups together
// ============================================
export default function FeatureMockupsDemo() {
  const [activeFeature, setActiveFeature] = useState('crm');

  const features = [
    { id: 'crm', label: 'CRM Entegrasyonu', component: CRMMockup },
    { id: 'summary', label: 'Hasta Özeti', component: PatientSummaryMockup },
    { id: 'intent', label: 'Satın Alma Niyet Skoru', component: PurchaseIntentMockup },
    { id: 'appointment', label: 'Randevu Otomasyonu', component: AppointmentMockup },
  ];

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component || CRMMockup;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Feature Mockups Preview</h1>
        
        {/* Feature Selector */}
        <div className="flex gap-2 mb-8">
          {features.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFeature === f.id 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Active Mockup */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 flex items-center justify-center min-h-[400px]">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}