import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Build-safe: env değişkenleri yoksa boş string kullan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client - sadece runtime'da çalışacak
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Build sırasında dummy client oluştur (kullanılmayacak)
    supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export { supabase };

// Type definitions for database tables
export interface Patient {
    id: string;
    phone: string;
    name: string | null;
    country: string | null;
    language: string;
    norwood: string | null;
    graft_min: number | null;
    graft_max: number | null;
    session_count: number | null;
    recommended_technique: string | null;
    donor_quality: string | null;
    analysis_summary: string | null;
    sentiment: string | null;
    purchase_rate: number | null;
    current_stage: string;
    created_at: string;
    appointment_date: string | null;
    age: number | null;
    chronic_disease: string | null;
    allergies: string | null;
    medications: string | null;
    dashboard_token?: string | null;
    previous_transplant?: boolean | null;
    family_history?: boolean | null;
}

export interface Message {
    id: string;
    patient_id: string;
    direction: 'inbound' | 'outbound';
    text: string;
    media_url: string | null;
    intent: string | null;
    sentiment: string | null;
    created_at: string;
    phone: string;
}
