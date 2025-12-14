"use client"

import type React from "react"
import Image from "next/image"

import { useState, useEffect, useRef, useId } from "react"
import {
  Link as LinkIcon, // Renamed to avoid conflict with next/link
  Gear,
  RocketLaunch,
} from "@phosphor-icons/react"
import { ChevronRight, Star, ArrowRight, Phone, Mail, Check, Menu } from "lucide-react"
import { Linkedin, Twitter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedList } from "@/components/ui/animated-list"
import { Meteors } from "@/components/ui/meteors"
import { Button } from "@/components/ui/button"
import { AnimatedBeam, Circle } from "@/components/ui/animated-beam"
import { motion, useScroll, useTransform } from "framer-motion"

// Dot Grid Pattern Background Component
const DotPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg width="100%" height="100%" className="opacity-[0.30]">
      <defs>
        <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#94a3b8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  </div>
)

// Grid Pattern Components for Feature Cards
const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][]
  size?: number
}) => {
  // Sabit pattern kullanarak hydration hatasını önlüyoruz
  const p = pattern ?? [
    [10, 3],
    [8, 5],
    [11, 2],
    [9, 4],
    [7, 6],
  ]
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-100/30 to-zinc-300/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  )
}

const GridPattern = ({ width, height, x, y, squares, ...props }: any) => {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}


// AnimatedBeam for Integrations - 2 Left, 4 Right Layout
const IntegrationsBeam = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Left side (2 icons)
  const leftTopRef = useRef<HTMLDivElement>(null)
  const leftBottomRef = useRef<HTMLDivElement>(null)

  // Center (The Brain)
  const centerRef = useRef<HTMLDivElement>(null)

  // Right side (4 icons)
  const rightTop1Ref = useRef<HTMLDivElement>(null)
  const rightTop2Ref = useRef<HTMLDivElement>(null)
  const rightBottom1Ref = useRef<HTMLDivElement>(null)
  const rightBottom2Ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative flex h-[500px] w-full items-center justify-between overflow-hidden rounded-lg bg-transparent p-10 max-w-4xl mx-auto">
      {/* Animated Beams - 2 Left to Center, Center to 4 Right */}
      {/* Left-Side Beams (2 inputs -> Center) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={leftTopRef}
        toRef={centerRef}
        curvature={-30}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={leftBottomRef}
        toRef={centerRef}
        curvature={30}
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />

      {/* Right-Side Beams (Center -> 4 outputs) */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightTop1Ref}
        curvature={-60}
        reverse
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightTop2Ref}
        curvature={-20}
        reverse
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightBottom1Ref}
        curvature={20}
        reverse
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightBottom2Ref}
        curvature={60}
        reverse
        gradientStartColor="#10b981"
        gradientStopColor="#34d399"
      />

      {/* LEFT COLUMN (2 Inputs) */}
      <div className="flex flex-col justify-center gap-16 z-10">
        <div ref={leftTopRef} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/camera.fill.svg" alt="Camera" width={40} height={40} />
        </div>
        <div ref={leftBottomRef} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/whatsapp-8.svg" alt="WhatsApp" width={40} height={40} />
        </div>
      </div>

      {/* CENTER COLUMN (The Brain) */}
      <div className="flex flex-col justify-center z-20">
        <div ref={centerRef} className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white shadow-2xl">
          <Image src="/logos/cliniolabs-logo-vertical.svg" alt="ClinicLabs Logo" width={80} height={80} className="object-contain" />
        </div>
      </div>

      {/* RIGHT COLUMN (4 Outputs) */}
      <div className="flex flex-col justify-center gap-8 z-10">
        <div ref={rightTop1Ref} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/chatgpt-6.svg" alt="Chat GPT" width={40} height={40} />

        </div>
        <div ref={rightTop2Ref} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/new-logo-drive-google.svg" alt="Google Drive" width={40} height={40} />
        </div>
        <div ref={rightBottom1Ref} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/google-sheets-logo-icon.svg" alt="Google Sheets" width={32} height={32} />
        </div>
        <div ref={rightBottom2Ref} className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
          <Image src="/logos/google-calendar-icon-2020-.svg" alt="Google Calendar" width={40} height={40} />
        </div>
      </div>
    </div>
  )
}

const conversationsByLanguage: Record<
  string,
  {
    greeting: string
    askPhotos: string
    analysis: {
      title: string
      norwood: string
      graft: string
      technique: string
      sessions: string
    }
    conclusion: string
  }
> = {
  tr: {
    greeting: "Merhaba, saç ektirmeyi düşünüyorum fiyat bilgisi alabilir miyim.",
    askPhotos:
      "Merhaba Ahmet bey, Hair Klinik saç ekim danışmanıyım, durumunuzu daha iyi değerlendirebilmem için saçınızın ön önden yandan ve arkadan fotoğrafını çekip gönderebilir misiniz?",
    analysis: {
      title: "✅ Saç Analizi Tamamlandı",
      norwood: "📊 Norwood Seviyesi: 4",
      graft: "💉 Tahmini Greft: 2500 - 3500",
      technique: "🔬 Önerilen Teknik: DHI",
      sessions: "📅 Seans Sayısı: 2",
    },
    conclusion:
      "Saç çizgilerinizde belirgin gerileme var ama saç köklerinizin kalınlığı ve donör verimliliğiniz, yüksek kapatıcılık sağlayacak potansiyele sahip. Ön bölgeden tepeye doğru kademeli bir yoğunluk planlamasıyla, yüz hatlarınıza uygun, estetik ve kalıcı bir çerçeve oluşturulabilir.",
  },
  en: {
    greeting: "Hello, I'm considering a hair transplant. Can I get pricing information?",
    askPhotos:
      "Hello John, I'm a Hair Clinic hair transplant consultant. To better evaluate your situation, could you please send photos of your hair from the front, side, and back?",
    analysis: {
      title: "✅ Hair Analysis Complete",
      norwood: "📊 Norwood Level: 4",
      graft: "💉 Estimated Grafts: 2500 - 3500",
      technique: "🔬 Recommended Technique: DHI",
      sessions: "📅 Number of Sessions: 2",
    },
    conclusion:
      "There is noticeable recession in your hairline, but the thickness of your hair follicles and donor efficiency have high coverage potential. With gradual density planning from front to crown, we can create an aesthetic and permanent frame that suits your facial features.",
  },
  ar: {
    greeting: "مرحبا، أفكر في زراعة الشعر. هل يمكنني الحصول على معلومات الأسعار؟",
    askPhotos:
      "مرحبا محمد، أنا مستشار زراعة الشعر في عيادة Hair. لتقييم حالتك بشكل أفضل، هل يمكنك إرسال صور لشعرك من الأمام والجانب والخلف؟",
    analysis: {
      title: "✅ اكتمل تحليل الشعر",
      norwood: "📊 مستوى نوروود: 4",
      graft: "💉 البصيلات المقدرة: 2500 - 3500",
      technique: "🔬 التقنية الموصى بها: DHI",
      sessions: "📅 عدد الجلسات: 2",
    },
    conclusion:
      "هناك تراجع ملحوظ في خط شعرك، لكن سماكة بصيلات شعرك وكفاءة المنطقة المانحة لديها إمكانية تغطية عالية. مع التخطيط التدريجي للكثافة من الأمام إلى التاج، يمكننا إنشاء إطار جمالي ودائم يناسب ملامح وجهك.",
  },
  ru: {
    greeting: "Здравствуйте, рассматриваю пересадку волос. Можно узнать цены?",
    askPhotos:
      "Здравствуйте Иван, я консультант по пересадке волос клиники Hair. Чтобы лучше оценить вашу ситуацию, не могли бы вы прислать фотографии волос спереди, сбоку и сзади?",
    analysis: {
      title: "✅ Анализ волос завершен",
      norwood: "📊 Уровень Норвуда: 4",
      graft: "💉 Расчетные графты: 2500 - 3500",
      technique: "🔬 Рекомендуемая техника: DHI",
      sessions: "📅 Количество сеансов: 2",
    },
    conclusion:
      "Заметен регресс линии волос, но толщина волосяных фолликулов и эффективность донорской зоны имеют высокий потенциал покрытия. При постепенном планировании плотности от передней части до макушки мы можем создать эстетичное и долговечное обрамление, подходящее вашим чертам лица.",
  },
}

const HeroMessageBubbles = () => {
  // Messages from desktop mockup conversation
  const messages = [
    {
      type: "received" as const,
      content: "Merhaba, saç ektirmeyi düşünüyorum fiyat bilgisi alabilir miyim.",
      time: "10:30",
    },
    {
      type: "sent" as const,
      content:
        "Merhaba Ahmet bey, Hair Klinik saç ekim danışmanıyım, durumunuzu daha iyi değerlendirebilmem için saçınızın fotoğrafını gönderebilir misiniz?",
      time: "10:31",
    },
    {
      type: "received" as const,
      content: "Tabii, şimdi gönderiyorum.",
      time: "10:32",
    },
    {
      type: "sent" as const,
      content:
        "✅ Saç Analizi Tamamlandı\n📊 Norwood Seviyesi: 4\n💉 Tahmini Greft: 2500 - 3500\n🔬 Önerilen Teknik: DHI",
      time: "10:33",
    },
    {
      type: "received" as const,
      content: "Çok teşekkürler, fiyat ne kadar olur?",
      time: "10:34",
    },
    {
      type: "sent" as const,
      content: "DHI tekniği ile 2500-3500 greft için fiyatımız $2,500 - $3,500 aralığındadır. Randevu oluşturalım mı?",
      time: "10:35",
    },
  ]

  return (
    <div className="relative h-[380px] w-full flex flex-col justify-end overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <AnimatedList delay={3000} maxItems={3} className="w-full px-2 pb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} w-full`}>
            <div
              className={`
                max-w-[85%] rounded-2xl px-4 py-3 shadow-lg
                backdrop-blur-xl border
                ${msg.type === "sent"
                  ? "bg-emerald-500/10 border-emerald-200/50 text-gray-800"
                  : "bg-white/70 border-white/50 text-gray-800"
                }
              `}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
              <span className="text-[10px] text-gray-500 float-right mt-1 ml-2">{msg.time}</span>
            </div>
          </div>
        ))}
      </AnimatedList>
    </div>
  )
}

const WhatsAppMobileMockup = ({ activeContact }: { activeContact: string }) => {
  const lang =
    activeContact === "Ahmet Y."
      ? "tr"
      : activeContact === "John D."
        ? "en"
        : activeContact === "Mohammed A."
          ? "ar"
          : "ru"
  const conv = conversationsByLanguage[lang]
  const contactName = activeContact

  const messages = [
    { type: "received", content: conv.greeting, time: "17:20" },
    { type: "sent", content: conv.askPhotos, time: "17:21" },
    { type: "received", content: "photos", time: "17:22" },
    { type: "sent", content: "analysis", time: "17:23" },
    { type: "sent", content: conv.conclusion, time: "17:24" },
  ]

  return (
    <div className="relative w-[240px] h-[490px]">
      <img
        src="/images/whatsapp-mobileartboard-201-402x.webp"
        alt="WhatsApp Mobile"
        className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
      />

      <div className="absolute top-[52px] left-[72px] text-[13px] font-semibold text-black">{contactName}</div>

      <div className="absolute top-[130px] left-[12px] right-[12px] bottom-[52px] overflow-hidden flex flex-col justify-end">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#efeae2] to-transparent z-10 pointer-events-none" />
        <AnimatedList delay={3500} maxItems={4} className="w-full px-1 pb-2">
          {messages.map((msg, idx) => {
            if (msg.content === "photos") {
              return (
                <div key={idx} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} w-full`}>
                  <div
                    className={`${msg.type === "sent" ? "bg-[#dcf8c6]" : "bg-white"} rounded-lg p-1 max-w-[90%] shadow-sm`}
                  >
                    <div className="grid grid-cols-3 gap-0.5">
                      <img src="/images/layer-201.jpg" alt="Front" className="w-12 h-12 object-cover rounded" />
                      <img src="/images/layer-203.jpg" alt="Top" className="w-12 h-12 object-cover rounded" />
                      <img src="/images/layer-202.jpg" alt="Back" className="w-12 h-12 object-cover rounded" />
                    </div>
                    <span className="text-[8px] text-gray-500 float-right mt-0.5">{msg.time}</span>
                  </div>
                </div>
              )
            }
            if (msg.content === "analysis") {
              return (
                <div key={idx} className="flex justify-end w-full">
                  <div className="bg-[#dcf8c6] rounded-lg p-2 max-w-[90%] shadow-sm">
                    <div className="text-[9px] space-y-0.5">
                      <p className="font-semibold">{conv.analysis.title}</p>
                      <p>{conv.analysis.norwood}</p>
                      <p>{conv.analysis.graft}</p>
                      <p>{conv.analysis.technique}</p>
                      <p>{conv.analysis.sessions}</p>
                    </div>
                    <span className="text-[8px] text-gray-500 float-right mt-0.5">{msg.time}</span>
                  </div>
                </div>
              )
            }
            return (
              <div key={idx} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} w-full`}>
                <div
                  className={`${msg.type === "sent" ? "bg-[#dcf8c6]" : "bg-white"} rounded-lg px-2 py-1.5 max-w-[85%] shadow-sm`}
                >
                  <p className="text-[9px] leading-tight">{msg.content}</p>
                  <span className="text-[8px] text-gray-500 float-right mt-0.5">{msg.time}</span>
                </div>
              </div>
            )
          })}
        </AnimatedList>
      </div>
    </div>
  )
}

const WhatsAppDesktopMockup = ({
  activeContact,
  onContactSelect,
}: {
  activeContact: string
  onContactSelect: (contact: string) => void
}) => {
  const lang =
    activeContact === "Ahmet Y."
      ? "tr"
      : activeContact === "John D."
        ? "en"
        : activeContact === "Mohammed A."
          ? "ar"
          : "ru"
  const conv = conversationsByLanguage[lang]

  const contacts = [
    { name: "Ahmet Y.", preview: "Merhaba, saç ektirmeyi...", time: "17:20", unread: 1 },
    { name: "John D.", preview: "Hello, I'm considering...", time: "16:45", unread: 0 },
    { name: "Mohammed A.", preview: "مرحبا، أفكر في زراعة...", time: "15:30", unread: 0 },
    { name: "Ivan P.", preview: "Здравствуйте, рассматриваю...", time: "14:15", unread: 0 },
  ]

  const messages = [
    { type: "received", content: conv.greeting, time: "17:20" },
    { type: "sent", content: conv.askPhotos, time: "17:21" },
    { type: "received", content: "photos", time: "17:22" },
    { type: "sent", content: "analysis", time: "17:23" },
    { type: "sent", content: conv.conclusion, time: "17:24" },
  ]

  return (
    <div className="relative w-[890px] h-[600px]">
      <img
        src="/images/whatsapp-desktopartboard-201-402x.webp"
        alt="WhatsApp Desktop"
        className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
      />

      {/* Contacts list overlay - left sidebar */}
      <div className="absolute top-[98px] left-[103px] w-[232px] bottom-[49px] overflow-hidden">
        <div className="space-y-0">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              onClick={() => onContactSelect(contact.name)}
              className={`flex items-center gap-2 px-2 py-3 cursor-pointer transition-colors ${activeContact === contact.name ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-gray-900 truncate">{contact.name}</span>
                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{contact.preview}</p>
              </div>
              {contact.unread > 0 && (
                <span className="w-5 h-5 bg-emerald-500 rounded-full text-white text-[10px] flex items-center justify-center flex-shrink-0">
                  {contact.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active contact name in header */}
      <div className="absolute top-[14px] left-[385px] text-[14px] font-semibold text-gray-800">{activeContact}</div>

      <div className="absolute top-[68px] left-[345px] right-[11px] bottom-[49px] overflow-hidden flex flex-col justify-end">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#efeae2] to-transparent z-10 pointer-events-none" />
        <AnimatedList delay={3500} maxItems={4} className="w-full px-3 pb-2">
          {messages.map((msg, idx) => {
            if (msg.content === "photos") {
              return (
                <div key={idx} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} w-full`}>
                  <div
                    className={`${msg.type === "sent" ? "bg-[#dcf8c6]" : "bg-white"} rounded-lg p-2 max-w-[70%] shadow-sm`}
                  >
                    <div className="grid grid-cols-3 gap-1">
                      <img src="/images/layer-201.jpg" alt="Front" className="w-24 h-24 object-cover rounded" />
                      <img src="/images/layer-203.jpg" alt="Top" className="w-24 h-24 object-cover rounded" />
                      <img src="/images/layer-202.jpg" alt="Back" className="w-24 h-24 object-cover rounded" />
                    </div>
                    <span className="text-[10px] text-gray-500 float-right mt-1">{msg.time}</span>
                  </div>
                </div>
              )
            }
            if (msg.content === "analysis") {
              return (
                <div key={idx} className="flex justify-end w-full">
                  <div className="bg-[#dcf8c6] rounded-lg p-3 max-w-[70%] shadow-sm">
                    <div className="text-[13px] space-y-1">
                      <p className="font-semibold">{conv.analysis.title}</p>
                      <p>{conv.analysis.norwood}</p>
                      <p>{conv.analysis.graft}</p>
                      <p>{conv.analysis.technique}</p>
                      <p>{conv.analysis.sessions}</p>
                    </div>
                    <span className="text-[10px] text-gray-500 float-right mt-1">{msg.time}</span>
                  </div>
                </div>
              )
            }
            return (
              <div key={idx} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"} w-full`}>
                <div
                  className={`${msg.type === "sent" ? "bg-[#dcf8c6]" : "bg-white"} rounded-lg px-3 py-2 max-w-[70%] shadow-sm`}
                >
                  <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-gray-500 float-right mt-1">{msg.time}</span>
                </div>
              </div>
            )
          })}
        </AnimatedList>
      </div>
    </div>
  )
}

// Feature Card Component - Exact Reference Design Match
const FeatureCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string
  title: string
  description: string
}) => {
  return (
    <div className="group relative bg-[#F8F7F4] border border-gray-200/40 rounded-[32px] p-10 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Expand Icon - Top Right - Very Subtle */}
      <div className="absolute top-8 right-8 w-5 h-5 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </div>

      {/* Large 3D Icon Image */}
      <div className="mb-8 w-32 h-32 relative flex items-center justify-start">
        <Image
          src={imageSrc}
          alt={title}
          width={128}
          height={128}
          className="object-contain"
        />
      </div>

      {/* Title - Larger and Bolder */}
      <h3 className="text-[22px] font-bold text-gray-900 mb-3 leading-tight pr-10">{title}</h3>

      {/* Description - Smaller and More Subtle */}
      <p className="text-[14px] text-gray-600 leading-relaxed opacity-80">{description}</p>
    </div>
  )
}

// Testimonial Card
const TestimonialCard = ({
  quote,
  name,
  role,
  clinic,
}: { quote: string; name: string; role: string; clinic: string }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-8">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 leading-relaxed">{quote}</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">
          {role} • {clinic}
        </p>
      </div>
    </div>
  </div>
)

// Framer Motion Mockup Components for smooth scroll
const MockupMobile = ({ activeContact }: { activeContact: string }) => {
  const { scrollY } = useScroll()
  // Simple: scroll from 0 to 400px (same as desktop)
  const x = useTransform(scrollY, [0, 400], [-50, 50])

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: "5%",
        top: "50%",
        y: "-50%",
        x: x,
      }}
    >
      <WhatsAppMobileMockup activeContact={activeContact} />
    </motion.div>
  )
}

const MockupDesktop = ({
  activeContact,
  onContactSelect
}: {
  activeContact: string
  onContactSelect: (contact: string) => void
}) => {
  const { scrollY } = useScroll()
  // Simple: scroll from 0 to 400px (hero height)
  const x = useTransform(scrollY, [0, 400], [50, -50])

  return (
    <motion.div
      className="hidden md:block absolute z-10"
      style={{
        right: "0%",
        top: "50%",
        y: "-50%",
        x: x,
      }}
    >
      <WhatsAppDesktopMockup activeContact={activeContact} onContactSelect={onContactSelect} />
    </motion.div>
  )
}

export default function LandingPage() {
  // Optimized: Combined scroll states for better performance
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    heroLine1: { blur: 0, opacity: 1 },
    heroLine2: { blur: 0, opacity: 1 },
    mockupOffset: 100,
  })
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [activeContact, setActiveContact] = useState("Ahmet Y.")
  const [isTyping, setIsTyping] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const heroRef = useRef<HTMLDivElement>(null)
  const mockupSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const totalMessages = 5
    let currentMessage = 0
    let timeoutId: NodeJS.Timeout

    const showNextMessage = () => {
      if (currentMessage < totalMessages) {
        setIsTyping(true)

        timeoutId = setTimeout(() => {
          setIsTyping(false)
          currentMessage++
          setVisibleMessages(currentMessage)

          if (currentMessage < totalMessages) {
            timeoutId = setTimeout(showNextMessage, 1500)
          } else {
            timeoutId = setTimeout(() => {
              currentMessage = 0
              setVisibleMessages(0)
              setAnimationKey((prev) => prev + 1)
              timeoutId = setTimeout(showNextMessage, 1000)
            }, 3000)
          }
        }, 1000)
      }
    }

    // Auto-start immediately
    timeoutId = setTimeout(showNextMessage, 500)

    return () => clearTimeout(timeoutId)
  }, [animationKey, activeContact])

  // Reset messages when contact changes
  useEffect(() => {
    setVisibleMessages(0)
    setAnimationKey((prev) => prev + 1)
  }, [activeContact])

  useEffect(() => {
    let ticking = false
    // Cache hero height and thresholds to avoid recalculation
    let cachedHeroHeight = 0
    let cachedThresholds = {
      line1Start: 0,
      line1End: 0,
      line2Start: 0,
      line2End: 0,
    }

    const updateScroll = () => {
      const scrollY = window.scrollY
      const newState = { ...scrollState }
      let hasChanges = false

      const newIsScrolled = scrollY > 50
      if (newState.isScrolled !== newIsScrolled) {
        newState.isScrolled = newIsScrolled
        hasChanges = true
      }

      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight

        // Only recalculate thresholds if hero height changed
        if (heroHeight !== cachedHeroHeight) {
          cachedHeroHeight = heroHeight
          cachedThresholds = {
            line1Start: heroHeight * 0.15,
            line1End: heroHeight * 0.45,
            line2Start: heroHeight * 0.25,
            line2End: heroHeight * 0.55,
          }
        }

        // Line 1 blur - using cached thresholds
        let newLine1
        if (scrollY < cachedThresholds.line1Start) {
          newLine1 = { opacity: 1, blur: 0 }
        } else if (scrollY < cachedThresholds.line1End) {
          const progress = (scrollY - cachedThresholds.line1Start) / (cachedThresholds.line1End - cachedThresholds.line1Start)
          newLine1 = { opacity: 1 - progress, blur: progress * 8 }
        } else {
          newLine1 = { opacity: 0, blur: 8 }
        }

        if (newState.heroLine1.opacity !== newLine1.opacity || newState.heroLine1.blur !== newLine1.blur) {
          newState.heroLine1 = newLine1
          hasChanges = true
        }

        // Line 2 blur - using cached thresholds
        let newLine2
        if (scrollY < cachedThresholds.line2Start) {
          newLine2 = { opacity: 1, blur: 0 }
        } else if (scrollY < cachedThresholds.line2End) {
          const progress = (scrollY - cachedThresholds.line2Start) / (cachedThresholds.line2End - cachedThresholds.line2Start)
          newLine2 = { opacity: 1 - progress, blur: progress * 8 }
        } else {
          newLine2 = { opacity: 0, blur: 8 }
        }

        if (newState.heroLine2.opacity !== newLine2.opacity || newState.heroLine2.blur !== newLine2.blur) {
          newState.heroLine2 = newLine2
          hasChanges = true
        }
      }

      if (mockupSectionRef.current) {
        const rect = mockupSectionRef.current.getBoundingClientRect()
        const sectionTop = rect.top
        const windowHeight = window.innerHeight

        if (sectionTop < windowHeight && sectionTop > -rect.height) {
          const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight * 0.7)))
          // Start at 100px apart, end at -70px (mobile overlaps desktop by 70px)
          const newOffset = 100 - progress * 170
          if (Math.abs(newState.mockupOffset - newOffset) > 0.5) {
            newState.mockupOffset = newOffset
            hasChanges = true
          }
        }
      }

      if (hasChanges) {
        setScrollState(newState)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const monthlyPrices = { starter: 2000, pro: 5000, enterprise: 15000 }
  const yearlyPrices = {
    starter: Math.round(monthlyPrices.starter * 0.75),
    pro: Math.round(monthlyPrices.pro * 0.75),
    enterprise: Math.round(monthlyPrices.enterprise * 0.75),
  }
  const prices = billingPeriod === "monthly" ? monthlyPrices : yearlyPrices

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <style jsx global>{`
        .gradient-text-green-blue {
          background: linear-gradient(135deg, #059669 0%, #10b981 40%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        /* Smooth slide up animation for messages */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${scrollState.isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center">
              <img src="/logos/cliniolabs-logo-horizontal.svg" alt="ClinicLabs" className="h-[36px] w-auto" />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Özellikler
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Nasıl Çalışır
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Referanslar
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Fiyatlandırma
            </a>
          </div>
          <Button className="hidden md:flex bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors items-center gap-2">
            Ücretsiz deneyin
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-white border-l border-gray-100 p-0">
                <div className="flex flex-col h-full">
                  {/* Logo Area */}
                  <div className="px-6 py-5 border-b border-gray-100">
                    <img src="/logos/cliniolabs-logo-horizontal.svg" alt="ClinicLabs" className="h-8 w-auto" />
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-4 py-6">
                    <div className="space-y-1">
                      <a
                        href="#features"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-[color,background-color] duration-200 font-medium"
                      >
                        Özellikler
                      </a>
                      <a
                        href="#how-it-works"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-[color,background-color] duration-200 font-medium"
                      >
                        Nasıl Çalışır
                      </a>
                      <a
                        href="#testimonials"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-[color,background-color] duration-200 font-medium"
                      >
                        Referanslar
                      </a>
                      <a
                        href="#pricing"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-[color,background-color] duration-200 font-medium"
                      >
                        Fiyatlandırma
                      </a>
                    </div>
                  </nav>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-500 text-center">© 2025 Clinio</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen pt-32 pb-0 overflow-hidden">
        <DotPattern />

        {/* Static blur background - no animation, no flickering */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Left side - existing hero content */}
            <div className="flex-1 max-w-2xl">
              {/* Badge - No blur */}
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm font-medium text-emerald-700">Türkiye'nin #1 Klinik Otomasyon Platformu</span>
              </div>

              <h1 className="flex flex-col mb-8 text-left">
                <span
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 tracking-tight leading-[1.1] whitespace-nowrap"
                >
                  Kliniğiniz uyurken bile
                </span>
                <span
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] gradient-text-green-blue"
                >
                  çalışan akıllı asistan
                </span>
                <span
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 tracking-tight leading-[1.1]"
                >
                  clinio.
                </span>
              </h1>
            </div>

            <div className="hidden lg:block w-[420px] flex-shrink-0">
              <HeroMessageBubbles />
            </div>
          </div>

          {/* Separator and content - No blur */}
          <div className="relative mb-4 mt-4">
            <div className="w-full h-[1px] bg-gray-300" />
            <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex gap-12 mb-8 flex-row">
                <div className="text-left">
                  <p className="text-3xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-500">Aktif Klinik</p>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-gray-900">150K+</p>
                  <p className="text-sm text-gray-500">İşlenen Mesaj</p>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold text-gray-900">%34</p>
                  <p className="text-sm text-gray-500">Dönüşüm Artışı</p>
                </div>
              </div>
              <div className="w-full md:max-w-md text-left md:text-right">
                <p className="text-base text-gray-600 font-medium leading-relaxed mb-6">
                  WhatsApp üzerinden 7/24 hasta danışmanlığı, AI fotoğraf analizi, otomatik fiyatlandırma ve randevu
                  yönetimi. Tek platformda.
                </p>
                <button className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                  Ücretsiz deneyin
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={mockupSectionRef} className="relative min-h-[700px] bg-white overflow-hidden -mt-32">
        <DotPattern />

        <div className="relative max-w-7xl mx-auto px-6 h-full">
          <div className="relative flex items-center justify-center h-[650px]">
            {/* Mobile Mockup - Smooth parallax with Framer Motion */}
            <MockupMobile activeContact={activeContact} />

            {/* Desktop Mockup - Smooth parallax with Framer Motion */}
            <MockupDesktop activeContact={activeContact} onContactSelect={setActiveContact} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative pt-12 pb-0 bg-gray-50/50">
        <DotPattern />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-2">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Özellikler</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">Her Şey Tek Panelde</h2>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Hasta iletişiminden randevu yönetimine, tüm süreçleriniz otomatik.
            </p>
          </div>

          <IntegrationsBeam />

          {/* Bento Grid - Responsive: flex mobile, grid desktop */}
          <div
            className="flex flex-col md:grid md:grid-cols-12 gap-4 mt-16"
            style={{
              gridTemplateRows: 'repeat(6, 100px)',
            }}
          >

            {/* Title & Text Block - Full width mobile, 4 cols desktop */}
            <div className="min-h-[200px] md:min-h-0 md:col-span-4 md:row-span-4 bg-white rounded-3xl p-8 flex flex-col justify-start">
              <h3 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Kliniğinizin<br />Yeni Dijital Beyni
              </h3>
              <p className="text-base text-gray-600 font-medium leading-relaxed">
                Manuel işleri bırakın, yapay zeka 7/24 sizin yerinize çalışsın, analiz etsin ve kaydetsin.
              </p>
            </div>

            {/* Card 1: Otopilot Hasta Yönetimi - Full width mobile, 2 cols desktop */}
            <div className="min-h-[400px] md:min-h-0 md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-hasta-yonetim.webp"
                alt="Otopilot Hasta Yönetimi"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Otopilot<br />Hasta Yönetimi</h4>
                <div className="flex justify-start">
                  <Image
                    src="/images/2x/expand-icon.svg"
                    alt="Expand"
                    width={24}
                    height={24}
                    className="opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Tıbbi Düzeyde Fotoğraf Analizi - Full width mobile, 3 cols desktop */}
            <div className="min-h-[500px] md:min-h-0 md:col-span-3 md:row-span-4 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-foto-analiz.webp"
                alt="Tıbbi Düzeyde Fotoğraf Analizi"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="flex items-end gap-4">
                  <h4 className="text-2xl font-bold text-gray-900 leading-tight flex-[4]">Tıbbi Düzeyde<br />Fotoğraf Analizi</h4>
                  <div className="flex-[1] flex justify-end">
                    <Image
                      src="/images/2x/expand-icon.svg"
                      alt="Expand"
                      width={28}
                      height={28}
                      className="opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Akıllı Triaj & Ön Eleme - Full width mobile, 3 cols desktop */}
            <div className="min-h-[350px] md:min-h-0 md:col-span-3 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-smart-filter.webp"
                alt="Akıllı Triaj & Ön Eleme"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <div className="flex items-end gap-4">
                  <h4 className="text-lg font-bold text-gray-900 flex-[4]">Akıllı<br />Triaj & Ön Eleme</h4>
                  <div className="flex-[1] flex justify-end">
                    <Image
                      src="/images/2x/expand-icon.svg"
                      alt="Expand"
                      width={24}
                      height={24}
                      className="opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Otomatik Arşivleme - Full width mobile, 2 cols desktop */}
            <div className="min-h-[400px] md:min-h-0 md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-oto-arsiv.webp"
                alt="Otomatik Arşivleme"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Otomatik<br />Arşivleme</h4>
                <div className="flex justify-start">
                  <Image
                    src="/images/2x/expand-icon.svg"
                    alt="Expand"
                    width={24}
                    height={24}
                    className="opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: İkna Edici Satış Asistanı - Full width mobile, 3 cols desktop */}
            <div className="min-h-[350px] md:min-h-0 md:col-span-3 md:row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-persona.webp"
                alt="İkna Edici Satış Asistanı Personası"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                <div className="flex items-end gap-4">
                  <h4 className="text-lg font-bold text-gray-900 flex-[4]">İkna Edici Satış<br />Asistanı Personası</h4>
                  <div className="flex-[1] flex justify-end">
                    <Image
                      src="/images/2x/expand-icon.svg"
                      alt="Expand"
                      width={24}
                      height={24}
                      className="opacity-100"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section - 12 Column Grid Layout */}
      <section id="how-it-works" className="relative py-12">
        <DotPattern />

        <div className="max-w-7xl mx-auto px-6">
          {/* 12 Column Grid: Responsive - flex mobile, grid desktop */}
          <div
            className="flex flex-col md:grid md:grid-cols-12 gap-4"
            style={{
              gridTemplateRows: 'repeat(6, 70px)',
            }}
          >

            {/* LEFT: Title & Text - Full width mobile, 7 cols desktop */}
            <div className="min-h-[300px] md:min-h-0 md:col-span-7 md:row-span-3 bg-white rounded-3xl p-8 flex flex-col justify-start">
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Dakikalar İçinde Kurulur,<br />Saniyeler İçinde Yanıtlar
              </h2>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Karmaşık entegrasyonlar yok. WhatsApp ve Google hattınızı bağlayın, gerisini AI halletsin.
              </p>
            </div>

            {/* RIGHT TOP: Bağlantı Card - Full width mobile, 5 cols desktop */}
            <div className="min-h-[350px] md:min-h-0 md:col-span-5 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-baglantı.webp"
                alt="Bağlantı"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bağlantı</h3>
                    <p className="text-2xl font-semibold text-gray-700 leading-7">
                      Hasta WhatsApp hattınıza yazar<br />veya fotoğraf gönderir.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LEFT BOTTOM: Veri İşleme Card - Full width mobile, 7 cols desktop */}
            <div className="min-h-[400px] md:min-h-0 md:col-span-7 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-veri-isleme.webp"
                alt="Veri İşleme"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-start">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Veri İşleme</h3>
                    <p className="text-2xl font-semibold text-gray-700 leading-7 max-w-md">
                      AI motorumuz görseli analiz eder, greft hesaplar, kliniğinizin fiyat politikasına göre yanıt hazırlar.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT BOTTOM: Sonuç Card - Full width mobile, 5 cols desktop */}
            <div className="min-h-[350px] md:min-h-0 md:col-span-5 md:row-span-3 relative rounded-3xl overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/40 hover:shadow-xl hover:border-emerald-200/60 transition-all duration-300">
              <Image
                src="/images/2x/cliniolabs-sonuc.webp"
                alt="Sonuç"
                fill
                className="object-cover z-0"
              />
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-start">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sonuç</h3>
                    <p className="text-2xl font-semibold text-gray-700 leading-7">
                      Hasta analizi cebine gelir, tüm<br />veriler anında klinik panelinize işlenir.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">3</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 bg-gray-50/50">
        <DotPattern />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Referanslar</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">Klinikler Ne Diyor?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Gece 2'de gelen hastalarımızı artık kaybetmiyoruz. AI saniyeler içinde yanıt veriyor ve sabaha randevu alınmış oluyor."
              name="Dr. Mehmet Yılmaz"
              role="Klinik Direktörü"
              clinic="Premium Hair Clinic"
            />
            <TestimonialCard
              quote="Dönüşüm oranımız %40 arttı. Özellikle yabancı hastalarla iletişimde AI'ın çoklu dil desteği harika çalışıyor."
              name="Ayşe Demir"
              role="Hasta İlişkileri Müdürü"
              clinic="Istanbul Hair Center"
            />
            <TestimonialCard
              quote="Before/after eşleştirme özelliği hastalarımızı çok etkiliyor. Kendi durumlarına benzer vakaları görmek güven veriyor."
              name="Dr. Can Özkan"
              role="Baş Hekim"
              clinic="Aesthetic Plus"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32">
        <DotPattern />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Fiyatlandırma</p>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Herkes için basit fiyatlandırma.</h2>
            <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto mb-8">
              Kitlenizle etkileşim kurmak, müşteri sadakati oluşturmak ve satışları artırmak için{" "}
              <span className="font-semibold text-gray-900">size uygun bir plan</span> seçin.
            </p>

            <div className="inline-flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Yıllık</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${billingPeriod === "yearly" ? "bg-gray-900" : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <span className="bg-black text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide">
                  İlk Hafta Ücretsiz
                </span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="relative z-10 bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Başlangıç</h3>
              <p className="text-sm text-gray-500 mb-6">Küçük klinikler ve bireysel kullanıcılar için</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{prices.starter.toLocaleString("tr-TR")}₺</span>
                <span className="text-gray-500 text-lg"> / ay</span>
              </div>
              <button className="w-full py-3 bg-[#333333] text-white rounded-lg font-semibold transition-[box-shadow] duration-200 hover:ring-[2px] hover:ring-[#333333] hover:ring-offset-[3px] hover:ring-offset-white mb-8">
                Abone Ol
              </button>
              <ul className="space-y-4">
                {["AI destekli analiz", "Temel destek", "5 proje limiti", "Temel AI araçlarına erişim"].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Plan - Featured */}
            <div className="relative z-10 bg-white border-2 border-gray-900 rounded-3xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Profesyonel</h3>
              <p className="text-sm text-gray-500 mb-6">Büyüyen işletmeler için premium plan</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{prices.pro.toLocaleString("tr-TR")}₺</span>
                <span className="text-gray-500 text-lg"> / ay</span>
              </div>
              <button className="w-full py-3 bg-[#333333] text-white rounded-lg font-semibold transition-[box-shadow] duration-200 hover:ring-[2px] hover:ring-[#333333] hover:ring-offset-[3px] hover:ring-offset-white mb-8">
                Abone Ol
              </button>
              <ul className="space-y-4">
                {[
                  "Gelişmiş AI içgörüleri",
                  "Öncelikli destek",
                  "Sınırsız projeler",
                  "Tüm AI araçlarına erişim",
                  "Özel entegrasyonlar",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="relative z-10 bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Kurumsal</h3>
              <p className="text-sm text-gray-500 mb-6">Büyük organizasyonlar için gelişmiş özelliklerle</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{prices.enterprise.toLocaleString("tr-TR")}₺</span>
                <span className="text-gray-500 text-lg"> / ay</span>
              </div>
              <button className="w-full py-3 bg-[#333333] text-white rounded-lg font-semibold transition-[box-shadow] duration-200 hover:ring-[2px] hover:ring-[#333333] hover:ring-offset-[3px] hover:ring-offset-white mb-8">
                Abone Ol
              </button>
              <ul className="space-y-4">
                {[
                  "Özel AI çözümleri",
                  "7/24 özel destek",
                  "Sınırsız projeler",
                  "Tüm AI araçlarına erişim",
                  "Özel entegrasyonlar",
                  "Veri güvenliği ve uyumluluk",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        <Meteors number={30} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Kliniğinizi Dönüştürmeye Hazır mısınız?</h2>
          <p className="text-xl text-gray-400 font-medium mb-8">
            Hemen demo talep edin, 15 dakikada sistemi kurulumunu tamamlayalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-900 text-gray-900 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-5 h-5" />
              +90 552 539 3433
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-gray-900 border border-white hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Ücretsiz deneyin
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Main Section */}
          <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Side - CTA & Branding (2 columns on large screens) */}
            <div className="lg:col-span-2">
              <a href="#" className="inline-block mb-6">
                <img src="/logos/cliniolabs-logo-horizontal.svg" alt="ClinicLabs" className="h-10 w-auto" />
              </a>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Hemen başlayın.</h3>
              <p className="text-gray-500 font-medium mb-6">7 günlük ücretsiz denemeyi başlatın. Kredi kartı gerekmez.</p>
              <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Ücretsiz deneyin
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Side - Links Grid (3 columns on large screens) */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product Column */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">ÜRÜN</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Özellikler
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Nasıl Çalışır
                    </a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Referanslar
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Fiyatlandırma
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">ŞİRKET</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Hakkımızda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Kariyer
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      İletişim
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">KAYNAKLAR</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Dokümantasyon
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Yardım Merkezi
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Durum
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">YASAL</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Gizlilik
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Kullanım Koşulları
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Çerezler
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      Lisanslar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">Copyright © 2025 Cliniolabs. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
