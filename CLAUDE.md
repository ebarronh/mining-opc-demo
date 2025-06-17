# MineSensors OPC UA Mining Demo - Development Guide

## Project Overview
Executive-ready, standards-based real-time ore intelligence platform showcasing OPC UA Mining Companion Specification with enterprise-grade integration capabilities.

## Phase 3: Frontend Foundations (COMPLETED)
- ✅ Professional navigation with Radix UI tabs
- ✅ Live system status integration with Phase 2 backend
- ✅ WebSocket client foundation for Phase 4
- ✅ Enhanced placeholder pages with executive-ready polish
- ✅ Dark theme with mining-specific visual identity
- ✅ Playwright MCP validation script

## Phase 4: 3D Visualization & OPC UA Explorer (COMPLETED)
- ✅ Three.js 3D mine scene with equipment visualization
- ✅ Grade heatmap overlay with toggle functionality
- ✅ Camera controls with keyboard shortcuts (R, G, E, H, F keys)
- ✅ OPC UA Explorer with tree navigation and virtual scrolling
- ✅ Node details panel with value interpretation and subscription management
- ✅ Code examples for JavaScript, Python, and REST API with syntax highlighting
- ✅ Educational features: glossary, tooltips, and help mode
- ✅ Performance optimizations: LOD, frustum culling, instancing
- ✅ Comprehensive test suite with pre-commit hooks
- ✅ Playwright MCP validation script for Phase 4

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
# Run Phase 3 Playwright MCP validation (requires frontend running)
# Use Playwright MCP tools to validate Phase 3 requirements
# Take screenshots and validate shell functionality
# Output: screenshots and validation results via Playwright MCP
```

### Phase 4 Validation
```bash
# Run Phase 4 Playwright MCP validation (requires both frontend and backend running)
# Use Playwright MCP tools to validate 3D scene, equipment, heatmap, OPC UA explorer
# Navigate to pages, take screenshots, and verify functionality
# Output: screenshots and validation results via Playwright MCP browser tools
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15.4.0 (App Router)
- **Styling**: Tailwind CSS with executive dark theme
- **UI Components**: Radix UI for professional navigation
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **TypeScript**: Full type safety
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React
- **Syntax Highlighting**: react-syntax-highlighter

### Key Components
- `AppLayout`: Main layout wrapper with navigation
- `MainNavigation`: Radix UI tabs with live status
- `SystemStatus`: Phase 2 backend integration
- `WebSocketStatus`: Real-time connection monitoring
- `MineScene`: Three.js 3D mine visualization with equipment
- `OpcUaExplorer`: Tree navigation with virtual scrolling
- `NodeDetails`: OPC UA node details with subscription management
- `Glossary`: Educational mining terms with search
- `HelpModeProvider`: Context for educational help mode
- `useSystemStatus`: Backend health API hook
- `useWebSocket`: WebSocket client with reconnection
- `useThree`: Three.js performance monitoring utilities

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
│   │   │   ├── InstancedEquipment.tsx # Performance optimized equipment
│   │   │   ├── LODEquipment.tsx # Level of detail equipment
│   │   │   ├── GradeHeatmap.tsx # Grade overlay visualization
│   │   │   ├── CameraControls.tsx # Camera interaction
│   │   │   ├── CameraControlsUI.tsx # Keyboard shortcuts UI
│   │   │   └── PerformanceMonitor.tsx # FPS and memory monitoring
│   │   ├── opcua/            # OPC UA Explorer components
│   │   │   ├── OpcUaExplorer.tsx # Tree navigation
│   │   │   ├── VirtualizedTree.tsx # Performance virtual tree
│   │   │   ├── NodeDetails.tsx # Node information panel
│   │   │   ├── CodeExamples.tsx # Code snippet generator
│   │   │   └── SyntaxHighlighter.tsx # Code syntax highlighting
│   │   ├── educational/      # Educational features
│   │   │   ├── Glossary.tsx  # Mining terms glossary
│   │   │   ├── Tooltip.tsx   # Educational tooltips
│   │   │   └── HelpTarget.tsx # Help mode targets
│   │   └── ui/               # UI components
│   │       └── GradeLegend.tsx # Grade color legend
│   ├── hooks/                # Custom React hooks
│   │   ├── useSystemStatus.ts # Backend health integration
│   │   ├── useWebSocket.ts    # WebSocket client hook
│   │   ├── useThree.ts        # Three.js utilities
│   │   ├── useDebounce.ts     # Debouncing utility
│   │   ├── useFrustumCulling.ts # 3D performance optimization
│   │   ├── useOpcUaCache.ts   # OPC UA data caching
│   │   └── useBatchedSubscriptions.ts # OPC UA subscription batching
│   ├── providers/            # React context providers
│   │   ├── WebSocketProvider.tsx # WebSocket context
│   │   ├── HelpModeProvider.tsx # Educational help mode context
│   │   └── ClientProviders.tsx # Combined client providers
│   ├── data/                 # Static data
│   │   └── miningTerms.ts    # Mining terminology definitions
│   └── types/                # TypeScript type definitions
│       └── websocket.ts      # WebSocket message types
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
# Run Phase 4 validation (requires both servers running)
# Use Playwright MCP browser tools for validation

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

## Phase 4 Features

### 3D Mine Visualization
- **Three.js Scene**: Real-time 3D mine pit with equipment
- **Equipment Models**: Excavators, trucks, conveyors with status colors
- **Grade Heatmap**: 20x20 grid overlay with toggle and legend
- **Camera Controls**: Keyboard shortcuts (R=reset, G=toggle grade, E=equipment focus, H=help, F=fullscreen)
- **Performance**: LOD, frustum culling, instancing for 30+ FPS

### OPC UA Explorer
- **Tree Navigation**: Hierarchical OPC UA address space browser
- **Virtual Scrolling**: Handles 1000+ nodes efficiently
- **Node Details**: Live values, subscription management, data type info
- **Production Context**: Help tooltips explaining how subscriptions work in real mining systems
- **Code Examples**: JavaScript, Python, REST API with syntax highlighting
- **Search**: Debounced filtering with fuzzy matching

### Educational Features
- **Glossary**: 50+ mining terms with search and alphabetical navigation
- **Tooltips**: Contextual explanations for mining concepts
- **Help Mode**: Interactive tutorial with click targets
- **Progress Tracking**: localStorage for seen educational content

### WebSocket Message Types
```typescript
// Real-time equipment position updates
type EquipmentPositionMessage = {
  type: 'equipment_positions';
  data: Array<{
    id: string;
    x: number; y: number; z: number;
    status: 'operational' | 'maintenance' | 'error';
    type: 'excavator' | 'truck' | 'conveyor';
  }>;
};

// Grade heatmap data updates
type GradeDataMessage = {
  type: 'grade_data';
  data: {
    timestamp: number;
    grid: number[][]; // 20x20 grade values
  };
};

// OPC UA node value changes
type OpcUaUpdateMessage = {
  type: 'opcua_updates';
  data: Array<{
    nodeId: string;
    value: any;
    timestamp: number;
    dataType: string;
  }>;
};
```

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

**Playwright MCP validation issues:**
- Ensure frontend and backend servers are running and accessible
- Check ports 3000 and 3001 are not blocked
- Use Playwright MCP browser tools to navigate and verify functionality
- Take screenshots to document validation results

## Next Steps (Phase 5)
1. Advanced mining scenarios and simulation
2. ISA-95 integration hub with enterprise systems
3. Compliance dashboard with standards tracking
4. Advanced analytics and reporting
5. Multi-site mining operation support

## Standards Compliance
- OPC UA Mining Companion Specification v1.0
- ISA-95 Enterprise Integration (Levels 1-5)
- Executive presentation standards
- Professional UI/UX guidelines