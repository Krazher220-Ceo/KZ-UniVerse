# 🏗️ Архитектура KZ UniVerse

## Обзор системы

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │ Catalog  │  │ Compare  │  │Analytics │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server Components  │  Client Components  │  API     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Filters  │  │ Compare  │  │ AI Chat  │  │Analytics │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Universities JSON  │  Programs JSON  │  Types       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Технологический стек

### Frontend Framework
```
Next.js 14 (App Router)
├── React 18
├── TypeScript 5.3
└── Server & Client Components
```

### Styling
```
Tailwind CSS 3.4
├── Custom Design System
├── Glass Effects
├── Gradients
└── Animations (Framer Motion)
```

### Data Visualization
```
Recharts
├── BarChart
├── PieChart
├── LineChart
└── Custom Tooltips
```

### AI Integration
```
Pattern Matching (Built-in)
└── Optional: OpenAI API
```

---

## Структура файлов

```
kz-universe/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header, Footer, AI Chat
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   │
│   ├── universities/            # Universities section
│   │   ├── page.tsx            # Catalog page
│   │   └── [id]/
│   │       └── page.tsx        # University detail page
│   │
│   ├── compare/                 # Comparison tool
│   │   └── page.tsx
│   │
│   ├── analytics/               # Analytics dashboard
│   │   └── page.tsx
│   │
│   └── api/                     # API endpoints
│       └── chat/
│           └── route.ts        # AI chat endpoint
│
├── components/                  # React components
│   ├── Header.tsx              # Main navigation
│   ├── Footer.tsx              # Footer
│   ├── AIChat.tsx              # AI assistant widget
│   │
│   ├── home/                   # Home page components
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── TopUniversities.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   └── CTA.tsx
│   │
│   ├── universities/           # University components
│   │   ├── UniversityCatalog.tsx
│   │   └── UniversityDetail.tsx
│   │
│   ├── compare/                # Comparison components
│   │   └── ComparisonTool.tsx
│   │
│   └── analytics/              # Analytics components
│       └── AnalyticsDashboard.tsx
│
├── data/                       # Data files
│   ├── universities.json       # 10 universities with full data
│   └── programs.json          # 18+ academic programs
│
├── types/                      # TypeScript definitions
│   └── index.ts               # All type definitions
│
├── public/                     # Static assets
│   └── images/                # Images (if any)
│
├── config files
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.js     # Tailwind config
│   ├── next.config.js         # Next.js config
│   └── postcss.config.js      # PostCSS config
│
└── documentation
    ├── README.md              # Main documentation
    ├── QUICKSTART.md          # Quick start guide
    ├── PRESENTATION.md        # Presentation guide
    └── ARCHITECTURE.md        # This file
```

---

## Компоненты системы

### 1. Frontend Layer

#### Server Components (Next.js)
- **Преимущества**: Fast initial load, SEO-friendly
- **Используется для**: 
  - Initial page renders
  - Data fetching
  - Static content

#### Client Components
- **Преимущества**: Interactive, real-time updates
- **Используется для**:
  - Filters and search
  - AI chat widget
  - Interactive comparisons
  - Charts and animations

### 2. Data Layer

#### Universities Data
```json
{
  "id": "unique-id",
  "name": "University Name",
  "stats": { "views": 1000, ... },
  "programs": [...],
  "tuitionRange": { "min": 500000, "max": 2000000 }
}
```

#### Programs Data
```json
{
  "id": "program-id",
  "universityId": "uni-id",
  "name": "Program Name",
  "field": "IT",
  "tuitionPerYear": 2000000,
  "requirements": { ... }
}
```

### 3. AI System

#### Architecture
```
User Query
    ↓
Pattern Matching
    ↓
Context Analysis
    ↓
Response Generation
    ↓
User Interface
```

#### Pattern Categories
1. University recommendations
2. Program information
3. Admission process
4. Costs and grants
5. Comparison requests
6. General questions

### 4. Analytics System

#### Metrics Collected
- Page views
- University visits
- Program interest
- 3D tour clicks
- Comparison actions
- Search queries

#### Visualizations
- Bar charts (top universities)
- Pie charts (distribution)
- Trend lines (popularity over time)
- Heat maps (interest by region)

---

## Data Flow

### Example: Viewing a University

```
1. User clicks university card
        ↓
2. Next.js router navigates to /universities/[id]
        ↓
3. Server component fetches data from JSON
        ↓
4. University data passed to UniversityDetail component
        ↓
5. Client-side hydration for interactive elements
        ↓
6. User can switch tabs, add to favorites, etc.
        ↓
7. Analytics event recorded (view_university)
```

### Example: AI Chat Interaction

```
1. User types message in chat
        ↓
2. Client sends POST to /api/chat
        ↓
3. Server analyzes message (pattern matching)
        ↓
4. Server generates contextual response
        ↓
5. Response sent back to client
        ↓
6. UI updates with new message
        ↓
7. Analytics event recorded (ai_chat_message)
```

---

## Performance Optimizations

### 1. Next.js Optimizations
- ✅ Server-side rendering
- ✅ Static generation where possible
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization

### 2. Data Optimizations
- ✅ JSON files for fast read
- ✅ Memoization (useMemo, useCallback)
- ✅ Lazy loading components
- ✅ Debounced search
- ✅ Cached API responses

### 3. UI Optimizations
- ✅ Tailwind JIT compiler
- ✅ CSS purging
- ✅ Framer Motion optimizations
- ✅ Virtual scrolling (if needed)
- ✅ Optimistic UI updates

---

## Security

### Current (MVP)
- ✅ No user authentication (public data)
- ✅ Client-side validation
- ✅ HTTPS only (in production)
- ✅ CORS configured
- ✅ Rate limiting (API)

### Future
- [ ] User authentication (JWT)
- [ ] Role-based access control
- [ ] API key management
- [ ] Data encryption
- [ ] Security headers

---

## Scalability

### Current Capacity
- **Users**: 10,000+ concurrent
- **Universities**: 10 (easily expandable)
- **Programs**: 200+
- **API Requests**: 100,000/day

### Scaling Strategy

#### Phase 1 (Current)
- JSON files
- Vercel CDN
- Client-side rendering

#### Phase 2 (Q2 2025)
- PostgreSQL database
- Redis caching
- Load balancing

#### Phase 3 (Q3 2025)
- Microservices
- Kubernetes
- Multi-region deployment

---

## Integration Points

### External APIs (Optional)
```
┌─────────────────────┐
│   OpenAI API        │  ← AI-powered responses
├─────────────────────┤
│   University APIs   │  ← Real-time data
├─────────────────────┤
│   Google Maps       │  ← 3D tours & locations
├─────────────────────┤
│   Analytics         │  ← Google Analytics
└─────────────────────┘
```

### Future Integrations
- Payment gateways (applications)
- Email services (notifications)
- SMS services (OTP)
- CRM systems (universities)

---

## Deployment

### Development
```bash
npm run dev
# → http://localhost:3000
```

### Production (Vercel)
```bash
vercel deploy
# → https://kz-universe.vercel.app
```

### Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.kzuniverse.kz
OPENAI_API_KEY=sk-xxx (optional)
```

---

## Monitoring & Analytics

### Application Monitoring
- Vercel Analytics (speed, vitals)
- Error tracking (Sentry in future)
- Performance monitoring

### Business Metrics
- User engagement
- Popular universities
- Conversion rates
- Search queries

---

## Testing Strategy

### Current
- Manual testing
- Browser testing
- Mobile responsive testing

### Future
- Unit tests (Jest)
- Integration tests (Cypress)
- E2E tests (Playwright)
- Performance tests (Lighthouse)

---

## Maintenance

### Regular Updates
- University data (monthly)
- Program information (semester)
- Statistics (weekly)
- AI responses (as needed)

### Monitoring
- Uptime monitoring
- Error logs
- Performance metrics
- User feedback

---

## Technology Decisions

### Why Next.js?
- ✅ Best-in-class React framework
- ✅ SEO optimization
- ✅ Server-side rendering
- ✅ Easy deployment
- ✅ Great developer experience

### Why Tailwind CSS?
- ✅ Rapid development
- ✅ Consistent design
- ✅ Small bundle size
- ✅ Responsive utilities
- ✅ Customizable

### Why JSON for data?
- ✅ Simple for MVP
- ✅ Fast read performance
- ✅ Easy to update
- ✅ No database setup
- ✅ Version controlled

### Why TypeScript?
- ✅ Type safety
- ✅ Better IDE support
- ✅ Fewer bugs
- ✅ Self-documenting
- ✅ Scalable

---

## Future Architecture (v2.0)

```
┌─────────────────────────────────────────────┐
│          Web App (Next.js)                  │
│          Mobile App (React Native)          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          API Gateway (GraphQL)              │
└─────────────────────────────────────────────┘
                    ↓
┌──────────────┬──────────────┬──────────────┐
│ Universities │ Applications │ Analytics    │
│ Service      │ Service      │ Service      │
└──────────────┴──────────────┴──────────────┘
                    ↓
┌──────────────┬──────────────┬──────────────┐
│ PostgreSQL   │ Redis        │ S3           │
└──────────────┴──────────────┴──────────────┘
```

---

## Conclusion

KZ UniVerse построен на современном, масштабируемом стеке технологий, обеспечивающем:

- ⚡ Высокую производительность
- 🔒 Безопасность
- 📱 Адаптивность
- 🚀 Простоту масштабирования
- 💻 Отличный DX (Developer Experience)

Архитектура позволяет легко добавлять новые функции и масштабироваться от MVP до enterprise-решения.

