"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/utils';

interface MessageFeedProps {
    messages: Message[];
    isLoading?: boolean;
}

// Single message bubble
const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
    const isOutbound = message.direction === 'outbound';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`
        max-w-[80%] px-4 py-2.5 rounded-2xl
        ${isOutbound
                    ? 'bg-emerald-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }
      `}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-[10px] mt-1 ${isOutbound ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {formatRelativeTime(message.created_at)}
                </p>
            </div>
        </motion.div>
    );
};

// Typing indicator
const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-end"
    >
        <div className="bg-emerald-500 px-4 py-3 rounded-2xl rounded-br-md">
            <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>
        </div>
    </motion.div>
);

export default function MessageFeed({ messages, isLoading }: MessageFeedProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length]);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">WhatsApp Sohbet</span>
                    <span className="text-xs text-gray-400 ml-auto">{messages.length} mesaj</span>
                </div>
            </div>

            {/* Messages Container */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]"
                style={{ minHeight: '300px', maxHeight: '500px' }}
            >
                <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                        <MessageBubble key={message.id} message={message} index={index} />
                    ))}
                </AnimatePresence>

                {isLoading && <TypingIndicator />}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-400 text-center">
                    Bu demo sohbetidir • Gerçek mesajlar görüntülenmektedir
                </p>
            </div>
        </div>
    );
}
