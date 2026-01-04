import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Phone number masking for privacy (KVKK compliant)
export const maskPhone = (phone: string): string => {
  if (!phone) return "---";
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  // Format: +90 552 *** **33
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 *** **$5');
};

// Name display with fallback
export const maskName = (name: string | null, phone: string): string => {
  if (name) return name;
  // Generate placeholder from phone
  return `Demo ${phone.slice(-4)}`;
};

// Format relative time
export const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Şimdi';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  return then.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
};

// Country flag emoji from country code or name
export const getCountryFlag = (country: string | null): string => {
  if (!country) return '🌍';

  const flagMap: Record<string, string> = {
    'TR': '🇹🇷', 'Turkey': '🇹🇷', 'Türkiye': '🇹🇷',
    'DE': '🇩🇪', 'Germany': '🇩🇪', 'Almanya': '🇩🇪',
    'GB': '🇬🇧', 'UK': '🇬🇧', 'England': '🇬🇧', 'İngiltere': '🇬🇧',
    'SA': '🇸🇦', 'Saudi Arabia': '🇸🇦', 'Suudi Arabistan': '🇸🇦',
    'RU': '🇷🇺', 'Russia': '🇷🇺', 'Rusya': '🇷🇺',
    'FR': '🇫🇷', 'France': '🇫🇷', 'Fransa': '🇫🇷',
    'IT': '🇮🇹', 'Italy': '🇮🇹', 'İtalya': '🇮🇹',
    'ES': '🇪🇸', 'Spain': '🇪🇸', 'İspanya': '🇪🇸',
    'NL': '🇳🇱', 'Netherlands': '🇳🇱', 'Hollanda': '🇳🇱',
    'AE': '🇦🇪', 'UAE': '🇦🇪', 'BAE': '🇦🇪',
  };

  return flagMap[country] || country || '🌍';
};
