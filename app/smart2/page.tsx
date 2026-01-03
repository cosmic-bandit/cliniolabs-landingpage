"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmartPage2({ paused = false }: { paused?: boolean }) {
    // State for Day/Night cycle messages
    const [isNight, setIsNight] = useState(false);
    const [messageState, setMessageState] = useState<'typing' | 'visible'>('typing');

    // Sync with the 12s CSS animation
    // 0s-12s Cycle. 0s = Noon. 3s = Sunset. 6s = Midnight. 9s = Sunrise.
    useEffect(() => {
        if (paused) return; // Don't run cycle logic if paused

        // Initial state: Noon (Day, Visible)
        setIsNight(false);
        setMessageState('visible');

        const cycleDuration = 12000;

        const runCycle = () => {
            // SUNSET PHASE (~3000ms) -> Switch to Night
            // Trigger slightly before visual sunset (3s) so typing starts
            setTimeout(() => {
                setIsNight(true);
                setMessageState('typing');
            }, 2800);

            // Show Night Message (~1.5s typing) -> 4300ms
            setTimeout(() => {
                setMessageState('visible');
            }, 4300);

            // SUNRISE PHASE (~9000ms) -> Switch to Day
            setTimeout(() => {
                setIsNight(false);
                setMessageState('typing');
            }, 8800);

            // Show Day Message (~1.5s typing) -> 10300ms
            setTimeout(() => {
                setMessageState('visible');
            }, 10300);
        };

        runCycle(); // Run immediately
        const interval = setInterval(runCycle, cycleDuration);

        return () => clearInterval(interval);
    }, [paused]);

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-900 pointer-events-none">
            {/* Fixed 600x600 Display Area */}
            <div className={`relative w-[600px] h-[600px] overflow-hidden shadow-2xl rounded-xl font-sans ${paused ? 'is-paused' : ''}`}>
                <style jsx>{`
                    .is-paused *, .is-paused {
                        animation-play-state: paused !important;
                    }
                    .container-smart2 {
                        height: 100%;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        overflow: hidden;
                    }

                    /* BACKGROUND LAYERS */
                    .bg-layer {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 0; /* Background level */
                    }

                    .bg-day {
                        /* Day Background Image */
                        background-image: url('/images/2x/day@2x.webp');
                        background-size: cover;
                        background-position: center;
                        z-index: 1;
                    }

                    .bg-night {
                        /* Night Background Image */
                        background-image: url('/images/2x/night@2x.webp');
                        background-size: cover;
                        background-position: center;
                        z-index: 2;
                        animation: nightFade 12s infinite linear;
                    }

                    /* 
                        TIMING LOGIC (12s Cycle):
                        0% (0s): Noon (Sun Top). Night Opacity: 0.
                        25% (3s): Sunset. Fade Day -> Night.
                        50% (6s): Midnight (Moon Top). Night Opacity: 1.
                        75% (9s): Sunrise. Fade Night -> Day.
                        100% (12s): Noon.
                        
                        Fades occur around 25% and 75%.
                    */
                    @keyframes nightFade {
                        0% { opacity: 0; }
                        20% { opacity: 0; }   /* Start sunset fade */
                        30% { opacity: 1; }   /* End sunset fade (Night fully visible) */
                        70% { opacity: 1; }   /* Start sunrise fade */
                        80% { opacity: 0; }   /* End sunrise fade (Day fully visible) */
                        100% { opacity: 0; }
                    }

                    /* 
                       POSITIONING LOGIC - UPDATED:
                       - Constraint 1: Orbit Center MUST be same as Rings Center (Bottom: -147px).
                       - Constraint 2: Gap at Zenith MUST be 20px.
                       - Ring Top (Zenith): 243px from bottom through Center (-147 + 390).
                       - Logo Group Bottom (Zenith) needs to be: 243 + 20 = 263px.
                       - Logo Group Center (Zenith): 263 + 67.5 (radius of 135px box) = 330.5px.
                       - Orbit Radius = Distance from Center (-147) to Zenith (330.5).
                       - Radius = 330.5 - (-147) = 477.5px.
                       - Diameter = 955px.
                       
                       Spinner Box:
                       - Width/Height: 955px.
                       - Top Edge Position: 
                         Center Y (from Top) = 600 + 147 = 747px.
                         Top Edge = 747 - 477.5 = 269.5px.
                    */
                    /* 
                       Spinner Box:
                       - Width/Height: 955px.
                       - Top Edge Position: 
                         Center Y (from Top) = 600 + 147 = 747px.
                         Top Edge = 747 - 477.5 = 269.5px.
                    */
                    .spinner {
                        position: absolute;
                        width: 955px;
                        height: 955px;
                        left: 50%;
                        margin-left: -477.5px;
                        top: 269.5px; 
                        transform-origin: center center;
                        animation: spin 12s infinite linear;
                        z-index: 10;
                    }

                    /* 
                       SPIN ANIMATION WITH PAUSES
                       Cycle: 12s.
                       Goal: 1s Pause at Zenith (Top).
                       
                       0% (0s): Sun Zenith. Start Pause (0.5s).
                       4% (0.5s): End Sun Pause. Start Move.
                       46% (5.5s): Moon Arrives Zenith. Start Moon Pause.
                       54% (6.5s): End Moon Pause. Start Move.
                       96% (11.5s): Sun Arrives Zenith. Start Sun Pause.
                       100% (12s): End Cycle (0.5s).
                    */
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        4% { transform: rotate(0deg); }
                        46% { transform: rotate(180deg); }
                        54% { transform: rotate(180deg); }
                        96% { transform: rotate(360deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .celestial-body {
                        width: 140px; /* Accommodate 135px circle */
                        height: 140px;
                        position: absolute;
                        left: 50%;
                        margin-left: -70px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .sun-container {
                        /* Position centered on the top edge of spinner */
                        top: -70px; /* Half of height to center on the Spinner line */
                    }

                    .moon-container {
                        /* Position centered on the bottom edge of spinner */
                        bottom: -70px;
                    }

                    .counter-rotate {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: counter-spin 12s infinite linear;
                    }

                    /* Counter-spin must match spin keyframes exactly with negative values */
                    @keyframes counter-spin {
                        0% { transform: rotate(0deg); }
                        4% { transform: rotate(0deg); }
                        46% { transform: rotate(-180deg); }
                        54% { transform: rotate(-180deg); }
                        96% { transform: rotate(-360deg); }
                        100% { transform: rotate(-360deg); }
                    }

                    /* Sun Styling: Pure White */
                    .sun-logo {
                        filter: grayscale(1) brightness(100);
                    }
                    
                    /* Moon Styling: Pure White */
                    .moon-logo {
                        filter: grayscale(1) brightness(100);
                    }

                    /* LOGO BACKGROUND CIRCLES */
                    .logo-bg-circle {
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(255, 255, 255, 0.1);
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 0; /* Behind logo */
                    }

                    /* STARS */
                    .stars {
                        height: 2px;
                        width: 2px;
                        background-color: #ffffff;
                        position: absolute;
                        top: 20%;
                        left: 20%;
                        border-radius: 50%;
                        box-shadow: 
                            3em 5em #ffffff, 
                            5em 15em #ffffff, 
                            -5em 10em #ffffff, 
                            10em 2em #ffffff, 
                            -8em -5em #ffffff, 
                            15em 8em #ffffff,
                            20em 5em #ffffff,
                            -15em 12em #ffffff;
                        animation: twinkle 12s infinite forwards;
                        opacity: 0;
                        z-index: 5;
                    }

                    @keyframes twinkle {
                        0% { opacity: 0; }
                        20% { opacity: 0; }
                        30% { opacity: 0.8; }
                        70% { opacity: 0.8; }
                        80% { opacity: 0; }
                        100% { opacity: 0; }
                    }

                    /* GLOW RINGS - Precise Geometry Implementation */
                    /* 
                       Ref: Red Box = 147px height. Top touches container bottom. Bottom touches center of rings.
                       Therefore, Center of Rings is 147px BELOW the container.
                       Container is 600x600 relative.
                       "Lower center" means left: 50%, bottom: -147px.
                    */
                    .glow-rings-anchor {
                        position: absolute;
                        left: 50%;
                        bottom: -147px; /* The calculated anchor point */
                        transform: translateX(-50%);
                        width: 0;
                        height: 0; /* It's a point */
                        pointer-events: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 3; /* Above backgrounds (z-2), below spinner (z-10) */
                    }
                    
                    .glow-ring {
                        position: absolute;
                        border-radius: 50%;
                        background-color: rgba(255, 255, 255, 0.1);
                        /* Centered on the anchor point */
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    /* Typing Dot Animation */
                    .typing-dot {
                        width: 6px;
                        height: 6px;
                        background-color: #333;
                        border-radius: 50%;
                        display: inline-block;
                        animation: typing 1.4s infinite ease-in-out both;
                        margin: 0 1px;
                    }
                    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                    
                    @keyframes typing {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }

                `}</style>

                <div className="container-smart2">
                    {/* Background Layers for Smooth Fade */}
                    <div className="bg-layer bg-day"></div>
                    <div className="bg-layer bg-night"></div>

                    <div className="stars"></div>

                    {/* Concentric Glow Rings - Anchored 147px below bottom */}
                    <div className="glow-rings-anchor">
                        {/* 
                            Sizes requested: 
                            Inner: 540px
                            Middle: 660px
                            Outer: 780px
                         */}

                        {/* Outer Ring: 780px */}
                        <div className="glow-ring" style={{ width: '780px', height: '780px' }} />

                        {/* Middle Ring: 660px */}
                        <div className="glow-ring" style={{ width: '660px', height: '660px' }} />

                        {/* Inner Ring: 540px */}
                        <div className="glow-ring" style={{ width: '540px', height: '540px' }} />
                    </div>

                    {/* UI OVERLAYS - TOP TITLE */}
                    <div className="absolute top-24 left-0 w-full text-center z-50 px-8">
                        <h1 className="text-white text-3xl font-bold mb-2 tracking-tight">7/24 Akıllı Asistan</h1>
                        <p className="text-white/90 text-sm font-medium">Gece gündüz demeden hastalarınıza yanıt verir.</p>
                    </div>

                    <div className="spinner">

                        {/* SUN */}
                        <div className="celestial-body sun-container">
                            <div className="counter-rotate flex items-center justify-center relative w-full h-full">
                                {/* Logo Background Circles */}
                                <div className="logo-bg-circle w-[135px] h-[135px]"></div>
                                <div className="logo-bg-circle w-[100px] h-[100px]"></div>

                                {/* Sun Logo */}
                                <div className="relative w-[67px] h-[67px] sun-logo z-10 hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src="/logos/cliniolabs-favicon-color.svg"
                                        alt="Sun"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MOON */}
                        <div className="celestial-body moon-container">
                            <div className="counter-rotate flex items-center justify-center relative w-full h-full">
                                {/* Logo Background Circles */}
                                <div className="logo-bg-circle w-[135px] h-[135px]"></div>
                                <div className="logo-bg-circle w-[100px] h-[100px]"></div>

                                {/* Moon Logo */}
                                <div className="relative w-[67px] h-[67px] moon-logo z-10 hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src="/logos/cliniolabs-favicon-color.svg"
                                        alt="Moon"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* UI OVERLAYS - BOTTOM MESSAGE */}
                    <div className="absolute bottom-24 left-0 w-full flex justify-center z-50">
                        <AnimatePresence mode="wait">
                            {messageState === 'typing' ? (
                                <motion.div
                                    key="typing"
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-1 min-h-[60px]"
                                >
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="message"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white rounded-2xl px-6 py-4 shadow-lg max-w-[320px] text-center"
                                >
                                    <p className="text-gray-900 text-sm leading-relaxed font-medium">
                                        {isNight
                                            ? "İyi geceler. Ben Mila. Cliniolabs saç ekim danışmanı. Size nasıl yardımcı olabilirim?"
                                            : "İyi günler. Ben Mila. Cliniolabs saç ekim danışmanı. Size nasıl yardımcı olabilirim?"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
