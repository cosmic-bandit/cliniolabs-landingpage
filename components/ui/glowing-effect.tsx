"use client";

import React, { useEffect, useRef, useState } from "react";

interface GlowingEffectProps {
    spread?: number;
    glow?: boolean;
    disabled?: boolean;
    proximity?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
    spread = 40,
    glow = true,
    disabled = false,
    proximity = 64,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (disabled || !glow) return;

        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ x, y });
        };

        card.addEventListener("mousemove", handleMouseMove);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
        };
    }, [disabled, glow]);

    if (disabled || !glow) return null;

    return (
        <>
            {/* Glowing border effect */}
            <div
                ref={cardRef}
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[1]"
                style={{
                    background: `radial-gradient(${proximity}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.4), transparent 40%)`,
                }}
            />
            {/* Border overlay */}
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/0 group-hover:border-emerald-500/20 transition-colors duration-500 pointer-events-none z-[2]" />
        </>
    );
};
