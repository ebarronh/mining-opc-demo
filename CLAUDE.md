# MineSensors OPC UA Mining Demo - Development Guide

## Project Overview
Executive-ready, standards-based real-time ore intelligence platform showcasing OPC UA Mining Companion Specification with enterprise-grade integration capabilities.

## Phase 3: Frontend Foundations (COMPLETED)
- ✅ Professional navigation with Radix UI tabs
- ✅ Live system status integration with Phase 2 backend
- ✅ WebSocket client foundation for Phase 4
- ✅ Enhanced placeholder pages with executive-ready polish
- ✅ Dark theme with mining-specific visual identity
- ✅ Puppeteer validation script

## Development Commands

### Frontend Development
```bash
# Start frontend development server
pnpm dev:frontend
# or
npm run dev

# Build frontend for production
pnpm build:frontend

# Run frontend tests
pnpm --filter frontend test

# Lint frontend code
pnpm --filter frontend lint

# Type check frontend
pnpm --filter frontend type-check
```

### Backend Development (Phase 2)
```bash
# Start backend OPC UA server
pnpm dev:backend

# Backend should be running on http://localhost:3001
# Health endpoint: http://localhost:3001/api/health
# WebSocket endpoint: ws://localhost:4841/ws
```

### Full Stack Development
```bash
# Start both frontend and backend simultaneously
pnpm dev

# Build entire project
pnpm build

# Run all tests
pnpm test

# Lint entire codebase
pnpm lint

# Format code
pnpm format
```

### Phase 3 Validation
```bash
# Run Phase 3 Puppeteer validation (requires frontend running)
pnpm validate:phase3

# Take screenshot and validate Phase 3 requirements
# Output: validation/phase3-shell.png
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15.4.0 (App Router)
- **Styling**: Tailwind CSS with executive dark theme
- **UI Components**: Radix UI for professional navigation
- **TypeScript**: Full type safety
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

### Key Components
- `AppLayout`: Main layout wrapper with navigation
- `MainNavigation`: Radix UI tabs with live status
- `SystemStatus`: Phase 2 backend integration
- `WebSocketStatus`: Real-time connection monitoring
- `useSystemStatus`: Backend health API hook
- `useWebSocket`: WebSocket client with reconnection

### Styling System
- **Executive Theme**: Professional dark theme with mining colors
- **CSS Variables**: Consistent color system
- **Animations**: Fade-in, slide-up, pulse effects
- **Typography**: Inter font with proper spacing
- **Cards**: Executive-ready card styles with elevation

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:4841/ws
```

## File Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with feature cards
│   │   ├── real-time/         # Phase 4 3D visualization preview
│   │   ├── explorer/          # OPC UA address space browser
│   │   ├── integration/       # ISA-95 integration hub
│   │   └── compliance/        # Standards compliance dashboard
│   ├── components/            # Reusable React components
│   │   ├── layout/           # Layout components
│   │   ├── navigation/       # Navigation components
│   │   ├── status/           # System status components
│   │   └── websocket/        # WebSocket components
│   ├── hooks/                # Custom React hooks
│   │   ├── useSystemStatus.ts # Backend health integration
│   │   └── useWebSocket.ts    # WebSocket client hook
│   └── providers/            # React context providers
│       └── WebSocketProvider.tsx # WebSocket context
├── validation/               # Phase validation scripts
└── package.json             # Frontend dependencies
```

## Development Workflow

### 1. Starting Development
```bash
# Install dependencies (first time)
pnpm install

# Start development servers
pnpm dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### 2. Making Changes
- All components use TypeScript for type safety
- Follow existing patterns for consistency
- Use executive-card class for professional styling
- Test changes with validation script

### 3. Validation
```bash
# Before committing, run validation
pnpm validate:phase3

# Ensure all tests pass
pnpm test

# Check for linting issues
pnpm lint
```

## Phase 4 Preparation

### WebSocket Foundation
- Full WebSocket client implementation ready
- Mining-specific message types defined
- Reconnection logic with exponential backoff
- Message history and subscription management

### 3D Visualization Readiness
- Component structure established
- Real-time data hooks implemented
- Professional UI framework in place
- Executive-ready visual quality achieved

## Troubleshooting

### Common Issues

**Frontend server won't start:**
```bash
# Kill existing processes
pkill -f "next"
# Clear Next.js cache
rm -rf .next
# Restart
pnpm dev:frontend
```

**Backend connection errors:**
- Ensure Phase 2 backend is running on port 3001
- Check network connectivity
- Verify API endpoints in browser

**WebSocket connection issues:**
- Backend WebSocket should be on ws://localhost:4841/ws
- Check browser console for connection errors
- Verify CORS settings if needed

**Puppeteer validation failures:**
- Ensure frontend server is running and accessible
- Check port 3000 is not blocked
- Run with headless: false for debugging

## Next Steps (Phase 4)
1. 3D mine pit visualization with Three.js
2. Real-time equipment tracking
3. Live grade heatmaps
4. Interactive scenario triggering
5. Advanced WebSocket integration

## Standards Compliance
- OPC UA Mining Companion Specification v1.0
- ISA-95 Enterprise Integration (Levels 1-5)
- Executive presentation standards
- Professional UI/UX guidelines