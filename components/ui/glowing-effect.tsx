"use client";

import React, { useEffect, useRef } from "react";

interface GlowingEffectProps {
    spread?: number;
    glow?: boolean;
    disabled?: boolean;
    proximity?: number;
    inactiveZone?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
    spread = 40,
    glow = true,
    disabled = false,
    proximity = 64,
    inactiveZone = 0.01,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || !glow) return;

        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        container.addEventListener("mousemove", handleMouseMove);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
        };
    }, [disabled, glow]);

    if (disabled || !glow) return null;

    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl"
            style={{
                opacity: 0.5,
            }}
        >
            <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                style={{
                    background: `radial-gradient(${spread}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15), transparent 80%)`,
                }}
            />
        </div>
    );
};
