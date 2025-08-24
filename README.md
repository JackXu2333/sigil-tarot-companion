# Sigil Tarot Companion

A modern, AI-enhanced tarot reading application built with React, TypeScript, and Supabase. This comprehensive platform helps tarot readers manage clients, conduct interactive readings, and leverage AI insights for deeper interpretation.

## ✨ Key Features

### 📱 **Client Management Dashboard**
- **Multi-tab interface**: Clients, Activity timeline, and Reading workspace
- **Advanced client profiles** with comprehensive personality assessments:
  - MBTI personality typing with visual sliders
  - Attachment style matrix visualization
  - Six-dimensional ability radar charts (Intuition, Empathy, Ambition, Intellect, Creativity, Self-Awareness)
  - Demographic and preference tracking
- **Smart search & filtering** by name, tags, and attributes
- **Activity timeline** showing all readings and notes chronologically

### 🔮 **Interactive Tarot Readings**
- **78-card tarot deck** with complete Major and Minor Arcana
- **Dynamic card drawing** with upright/reversed positioning
- **Visual card interface** with emoji representations and detailed meanings
- **Live reading workspace** with card selection and interpretation tools
- **S.O.A.P. Notes system** for professional reading documentation:
  - **Subjective**: Client's words and emotional state
  - **Objective**: Cards drawn and their positions
  - **Assessment**: Reader's interpretation and synthesis
  - **Plan**: Actionable guidance and next steps

### 🤖 **AI-Powered Copilot Insights**
- **Sentiment analysis**: Overall, emotional, and practical sentiment scoring
- **Reading metrics**: Clarity, agency, timing, difficulty, and opportunity scales
- **Energy balance visualization**: Active/receptive and mental/emotional/spiritual/material energies
- **Elemental analysis**: Fire, water, air, earth distribution with visual indicators
- **Archetypal patterns**: Identification of dominant personality archetypes
- **Contextual insights**: Key themes, narrative potential, and suggested questions
- **Card synergy analysis**: Interpretation of card combinations and interactions
- **Actionable guidance**: Specific action points and warning signals

### 📊 **Data Visualization & Analytics**
- **Radar charts** for client ability assessments using Recharts
- **Progress bars** and visual indicators for all metrics
- **Attachment style quadrant mapping**
- **Color-coded sentiment and energy displays**
- **Real-time insight highlighting** based on significance thresholds

### 🎨 **Modern UI/UX Design**
- **shadcn/ui components** with "New York" style variant
- **Tailwind CSS v4** with advanced OKLCH color spaces
- **Dark/light theme support** with next-themes integration
- **Mobile-responsive design** with touch-friendly interfaces
- **Accessibility-first approach** with proper ARIA labels and keyboard navigation
- **Toast notifications** for user feedback using Sonner

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1, TypeScript 5.8.3, Vite 7.1.2
- **Styling**: Tailwind CSS v4.1.12, shadcn/ui components, Radix UI primitives
- **Backend**: Supabase (authentication, database, real-time)
- **State Management**: TanStack Query 5.85.5 for server state
- **Routing**: React Router DOM 7.8.2
- **Charts**: Recharts 3.1.2 for data visualization
- **Forms**: React Hook Form 7.62.0 with Zod validation
- **Icons**: Lucide React with 500+ icons
- **Development**: ESLint 9.33.0, TypeScript strict mode

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (17 components)
│   ├── Dashboard.tsx          # Main dashboard with three tabs
│   ├── ClientChart.tsx        # Detailed client profile & editing
│   ├── ReadingWorkspace.tsx   # Interactive tarot reading interface
│   ├── CopilotInsightsCard.tsx # AI insights visualization
│   ├── AuthPage.tsx           # Authentication flow
│   └── NewClientForm.tsx      # Client creation wizard
├── services/                  # API services and business logic
├── hooks/                     # Custom React hooks
├── data/                      # Static data (tarot deck, form options)
├── integrations/supabase/     # Database configuration and types
└── lib/                       # Utilities and helper functions
```

## 🎯 Use Cases

- **Professional tarot readers** managing client relationships and reading history
- **Spiritual counselors** seeking AI-enhanced interpretation assistance
- **Tarot students** learning card meanings and reading techniques
- **Personal development coaches** using tarot as a therapeutic tool
- **Anyone interested** in structured, documented tarot practice

## 🔐 Authentication & Data

- Secure user authentication via Supabase Auth
- Personal data isolation - each user sees only their own clients and readings
- Real-time data synchronization across devices
- Comprehensive data backup and export capabilities

---

Built with modern web technologies and designed for professional tarot practitioners who want to combine traditional divination with contemporary digital tools and AI insights.
