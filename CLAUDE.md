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

## Phase 4: 3D Visualization & OPC UA Explorer (IN PROGRESS)
- ✅ Three.js 3D mine scene with equipment visualization
- ✅ Grade heatmap overlay with toggle functionality
- ✅ Camera controls with keyboard shortcuts
- ✅ OPC UA Explorer with tree navigation
- ✅ Node details panel with value interpretation
- ✅ Code examples for JavaScript, Python, and REST API
- ✅ Educational context for mining values (ore grades, weights, production)
- ✅ Comprehensive test suite with pre-commit hooks

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

# Run all tests (required for pre-commit hooks)
pnpm test

# Lint entire codebase
pnpm lint

# Format code
pnpm format
```

### Testing
```bash
# Run all tests (must pass for commits)
pnpm test

# Run backend tests only
pnpm --filter backend test

# Run frontend tests only
pnpm --filter frontend test

# Run tests in watch mode
pnpm --filter frontend test:watch
pnpm --filter backend test:watch
```

#### Test Setup Notes
1. **Pre-commit hooks**: The project uses Husky to run tests before commits. All tests must pass.
2. **Backend tests**: 
   - Requires `ts-jest` to be installed
   - Jest config is in `backend/jest.config.js`
   - Basic test file exists at `backend/src/server.test.ts`
3. **Frontend tests**: 
   - Mock `useSystemStatus` hook to avoid `AbortSignal.timeout` errors
   - Mock `SystemStatus` component to avoid API calls during tests
   - Use flexible matchers for text that may have formatting (e.g., `getByRole` instead of `getByText`)
   - Test files located alongside components (e.g., `Component.test.tsx`)
4. **Common test issues**:
   - "Preset ts-jest not found": Run `pnpm install --force` to ensure all dependencies are installed
   - "Multiple elements found": Use more specific queries or `getAllBy*` variants
   - "AbortSignal.timeout is not a function": Mock the hooks that use fetch with timeouts
   - Text matching issues: Use regex patterns for partial matches

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
│   │   ├── websocket/        # WebSocket components
│   │   ├── three/            # 3D visualization components
│   │   │   ├── MineScene.tsx # Main 3D scene container
│   │   │   ├── Equipment.tsx # 3D equipment models
│   │   │   ├── GradeHeatmap.tsx # Grade overlay visualization
│   │   │   └── CameraControls.tsx # Camera interaction
│   │   └── opcua/            # OPC UA Explorer components
│   │       ├── OpcUaExplorer.tsx # Tree navigation
│   │       ├── NodeDetails.tsx # Node information panel
│   │       └── CodeExamples.tsx # Code snippet generator
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

### 4. Committing Changes
```bash
# Stage changes
git add -A

# Commit (will trigger pre-commit hooks)
git commit -m "feat: your commit message"

# If tests fail, fix them before committing
# Never use --no-verify to bypass tests

# Push to remote
git push origin main
```

**Commit Message Format:**
- `feat:` New features
- `fix:` Bug fixes
- `test:` Test additions or fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `style:` Formatting changes
- `chore:` Maintenance tasks

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