# Clinio Labs Landing Page

## Project Overview

This is a Next.js landing page for Clinio - an AI-powered clinic automation platform that specializes in WhatsApp-based patient communication and management for hair transplant clinics.

**Primary Purpose**: Marketing landing page showcasing Clinio's AI assistant that handles patient inquiries, photo analysis, pricing, and appointment scheduling 24/7 through WhatsApp.

**Target Audience**: Hair transplant clinics in Turkey looking to automate patient communication and increase conversion rates.

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**:
  - shadcn/ui (Radix UI primitives)
  - Framer Motion 12.23.26 for animations
  - Phosphor Icons & Lucide Icons
- **Package Manager**: pnpm
- **Analytics**: Vercel Analytics

## Project Structure

```
/app
  ├── landing-page.tsx    # Main landing page component (1300+ lines)
  ├── layout.tsx          # Root layout with theme provider
  ├── page.tsx            # Route entry point
  └── globals.css         # Global styles

/components
  ├── ui/                 # shadcn/ui component library (60+ components)
  ├── theme-provider.tsx  # Dark/light mode provider
  └── integrations-beam.tsx

/public
  ├── images/             # WhatsApp mockup screenshots
  ├── clinio-logo.svg
  └── [various assets]

/styles
  └── globals.css

/hooks
  ├── use-mobile.ts
  └── use-toast.ts

/lib
  └── utils.ts           # Utility functions (cn, etc.)
```

## Key Features

### 1. **Interactive WhatsApp Mockups**
- Animated desktop and mobile WhatsApp interfaces
- Multi-language conversation demos (Turkish, English, Arabic, Russian)
- Real-time message animations with typing indicators
- Synchronized contact switching between mockups

### 2. **AI Features Showcase**
- AI photo analysis (Norwood level detection, graft estimation)
- Multilingual support (50+ countries)
- Automated appointment scheduling
- Before/after gallery matching
- Live reporting and analytics

### 3. **Landing Page Sections**
- Hero with scroll-based blur effects
- Interactive integrations visualization (AnimatedBeam)
- Features grid (6 key features)
- How it works (3-step process)
- Testimonials (3 clinic testimonials)
- Pricing (3 tiers with monthly/yearly toggle)
- CTA with meteors animation
- Comprehensive footer

### 4. **Animations & Effects**
- Scroll-triggered text blur/fade
- Dot pattern backgrounds
- Floating animations
- Meteor effects
- Message bubble animations
- Mockup convergence on scroll

## Component Architecture

### Main Component: `LandingPage`
Location: `app/landing-page.tsx`

Key subcomponents:
- `DotPattern` - SVG dot grid background
- `IntegrationsBeam` - Animated integration showcase
- `HeroMessageBubbles` - Animated chat preview
- `WhatsAppMobileMockup` - Mobile interface simulation
- `WhatsAppDesktopMockup` - Desktop interface simulation
- `FeatureCard` - Reusable feature display
- `TestimonialCard` - Customer testimonial display

### State Management
Uses React hooks for:
- Scroll position tracking (`isScrolled`, blur effects)
- Mockup animation (`mockupOffset`, `visibleMessages`)
- Contact selection (`activeContact`)
- Billing period toggle (`billingPeriod`)
- Animation sequences (`animationKey`)

## Styling Approach

- **Tailwind CSS** for utility-first styling
- **CSS-in-JS** for dynamic animations (style tags)
- **Custom gradients**: Green-blue gradient for brand elements
- **Responsive**: Mobile-first with `md:` and `lg:` breakpoints
- **Color palette**:
  - Primary: Emerald/Teal gradient (#059669 → #10b981 → #0ea5e9)
  - Neutral: Gray scale
  - Accents: Cyan, blue, purple, orange, rose

## Data & Content

### Pricing Tiers
- **Başlangıç (Starter)**: 2,000₺/month
- **Profesyonel (Pro)**: 5,000₺/month
- **Kurumsal (Enterprise)**: 15,000₺/month
- 25% discount for yearly billing

### Multi-language Support
Conversations available in:
- Turkish (`tr`) - Ahmet Y.
- English (`en`) - John D.
- Arabic (`ar`) - Mohammed A.
- Russian (`ru`) - Ivan P.

### Key Metrics Displayed
- 50+ Active Clinics
- 150K+ Processed Messages
- 34% Conversion Increase

## Development Notes

### Running the Project
```bash
pnpm install
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
```

### Key Dependencies
- `framer-motion`: Animation library
- `next-themes`: Theme switching
- `@radix-ui/*`: Accessible UI primitives
- `class-variance-authority`: Component variants
- `tailwind-merge`: Tailwind class merging

### Browser Compatibility
- Modern browsers (ES6+)
- Smooth scrolling support required
- RequestAnimationFrame for performance

## Future Considerations

### Potential Enhancements
- Add actual backend integration for demo requests
- Implement real contact form submission
- Add more language options
- Create admin dashboard preview
- Add video demos of the platform
- Implement A/B testing for CTAs
- Add chat widget for live support
- Create case study pages

### Performance Optimizations
- Image optimization (already using Next.js Image)
- Code splitting for mockup components
- Lazy loading for below-fold sections
- Reduce animation complexity on mobile

### Accessibility
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Add skip links
- Improve color contrast ratios
- Add screen reader announcements for animations

## Contact & Support

- **Phone**: +90 552 539 3433
- **Demo Request**: Via CTA buttons throughout page
- **Social**: LinkedIn, Twitter links in footer

## Notes for Claude

- This is a **client-facing marketing site**, not the actual Clinio platform
- The WhatsApp mockups are **visual demonstrations**, not functional chat interfaces
- All patient data shown is **fictional** for demo purposes
- The project uses **Turkish language** as primary, with multilingual demo content
- Focus is on **visual appeal and conversion optimization**
- Heavy use of animations - consider performance when making changes
- The component is very large (1300+ lines) - consider splitting if making major changes
