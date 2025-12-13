"use client";

import React from "react";

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
}) => {
    if (disabled || !glow) return null;

    return (
        <div className="absolute inset-0 overflow-hidden rounded-3xl z-[5] pointer-events-none">
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle ${spread}px at 50% 50%, rgba(16, 185, 129, 0.25), transparent 80%)`,
                }}
            />
        </div>
    );
};
