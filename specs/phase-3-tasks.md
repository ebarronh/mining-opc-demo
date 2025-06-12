# Phase 3: Front-End Foundations
## MineSensors OPC UA Mining Demo - Navigation Shell & WebSocket Foundation

### 🎯 **Phase 3 Objectives** 
Create Next.js 14 app with navigation shell and placeholder tabs as defined in the PRD. Establish WebSocket connectivity foundation and polished UI structure to prepare for Phase 4's 3D visualization and real-time features.

**Alignment with PRD Phase 3 Requirements:**
- ✅ Next.js 14 app with navigation shell 
- ✅ Tailwind & Radix UI setup
- ✅ Layout with Tabs (Real-time, Explorer, Integration, Compliance)
- ✅ WebSocket client stub integration
- ✅ Puppeteer MCP validation script

### 📋 **Task Breakdown**

---

## **T3-1: Enhanced Navigation Layout**
**Priority: HIGH** | **Estimated Time: 2-3 hours**

### Description
Upgrade the current basic navigation to a polished tab-based layout using Radix UI components, ensuring professional appearance for stakeholder demos.

### Acceptance Criteria
- [ ] Install and configure Radix UI components
- [ ] Implement primary navigation tabs: Real-time, Explorer, Integration, Compliance
- [ ] Add secondary navigation breadcrumbs
- [ ] Include MineSensors branding and logo
- [ ] Add navigation state management
- [ ] Implement smooth transitions between tabs
- [ ] Ensure keyboard accessibility (Tab, Enter navigation)

### Technical Requirements
- Use Radix UI Tabs component
- Maintain Tailwind CSS dark theme
- Add proper ARIA labels for accessibility
- Implement active/inactive tab states

---

## **T3-2: Live System Status Integration**
**Priority: HIGH** | **Estimated Time: 2-3 hours**

### Description
Replace static status indicators with live API integration to the Phase 2 backend health endpoints, providing real-time system status.

### Acceptance Criteria
- [ ] Connect to `/api/health` endpoint from Phase 2 backend
- [ ] Display live OPC UA server status (running/stopped)
- [ ] Show equipment count (7 active equipment expected)
- [ ] Display WebSocket bridge status
- [ ] Add connection status indicators with proper colors
- [ ] Implement 5-second auto-refresh interval
- [ ] Show last update timestamp
- [ ] Add graceful error handling for API failures

### API Integration
```typescript
interface SystemStatus {
  opcua: { server_running: boolean; equipment_count: number };
  websocket: { active_connections: number };
  timestamp: string;
}
```

---

## **T3-3: WebSocket Client Foundation**
**Priority: HIGH** | **Estimated Time: 3-4 hours**

### Description
Implement WebSocket client stub that establishes connection to Phase 2 backend and provides foundation for Phase 4's real-time features.

### Acceptance Criteria
- [ ] Create WebSocket hook: `useWebSocket(url: string)`
- [ ] Handle connection states: connecting, connected, disconnected, error
- [ ] Implement message subscription system
- [ ] Add connection status indicator in UI
- [ ] Create data buffer for incoming messages
- [ ] Implement reconnection logic with exponential backoff
- [ ] Add proper cleanup on component unmount
- [ ] Create WebSocket context for global access

### Connection Details
- **URL**: `ws://localhost:4841/ws`
- **Message Types**: connection, mining_data, subscription_confirmed
- **Reconnection**: 3 attempts with 1s, 2s, 4s delays

---

## **T3-4: Enhanced Placeholder Pages**
**Priority: MEDIUM** | **Estimated Time: 2-3 hours**

### Description
Transform basic placeholder pages into polished, informative previews that set expectations for Phase 4 features while maintaining professional appearance.

### Acceptance Criteria
- [ ] **Real-time Monitor**: Add 3D visualization preview with Three.js mention
- [ ] **OPC UA Explorer**: Show tree structure mockup with expandable nodes
- [ ] **Integration Hub**: Display ISA-95 flow diagram preview
- [ ] **Compliance**: Present OPC UA Mining Companion Specification checklist
- [ ] Add "Coming in Phase X" indicators with specific features
- [ ] Include educational content about mining operations
- [ ] Add feature preview animations or mockups

### Content Guidelines
- Use mining industry terminology correctly
- Reference OPC UA Mining Companion Specification v1.0
- Explain educational value of each section
- Maintain executive-ready visual quality

---

## **T3-5: UI/UX Polish & Dark Theme**
**Priority: MEDIUM** | **Estimated Time: 2-3 hours**

### Description
Enhance the visual design to achieve "executive-ready UI" standard mentioned in PRD with consistent dark theme and smooth animations.

### Acceptance Criteria
- [ ] Refine dark theme color palette for professional appearance
- [ ] Add smooth transitions and micro-animations (<60fps)
- [ ] Implement hover states for all interactive elements
- [ ] Add loading skeletons for API calls
- [ ] Ensure consistent spacing and typography
- [ ] Add subtle gradients and shadows for depth
- [ ] Optimize for laptop displays (1920x1080, 1366x768)
- [ ] Test performance on Intel UHD Graphics

### Design System
- **Primary Colors**: Blue (#3B82F6), Green (#10B981), Purple (#8B5CF6)
- **Status Colors**: Success (#10B981), Warning (#F59E0B), Error (#EF4444)
- **Typography**: System fonts with proper hierarchy
- **Animations**: Max 300ms transitions, 60fps requirement

---

## **T3-6: Puppeteer MCP Validation Script**
**Priority: HIGH** | **Estimated Time: 1-2 hours**

### Description
Create automated validation script as specified in PRD to verify Phase 3 deliverables and capture required screenshots.

### Acceptance Criteria
- [ ] Create `validation/phase3-puppeteer.js` script
- [ ] Start `npm run dev` automatically
- [ ] Navigate to root `/` and verify header text
- [ ] Test all navigation tabs (Real-time, Explorer, Integration, Compliance)
- [ ] Verify WebSocket connection status indicator
- [ ] Capture `phase3-shell.png` screenshot
- [ ] Test system status API integration
- [ ] Validate navigation transitions work smoothly
- [ ] Generate test report with pass/fail status

### Required Validations
```javascript
// PRD Requirement: "Navigate to `/`, verify header text, take screenshot `phase3-shell.png`"
await page.goto('http://localhost:3000');
await expect(page.locator('h1')).toContainText('MineSensors OPC UA');
await page.screenshot({ path: 'phase3-shell.png' });
```

---

## **T3-7: Development Tooling & Scripts**
**Priority: LOW** | **Estimated Time: 1-2 hours**

### Description
Add development convenience scripts and tooling to support efficient Phase 3 development and testing.

### Acceptance Criteria
- [ ] Add npm scripts for Phase 3 development workflow
- [ ] Create development environment setup documentation
- [ ] Add TypeScript strict mode configuration
- [ ] Implement ESLint rules for React hooks and accessibility
- [ ] Add pre-commit hooks for code quality
- [ ] Create component development templates
- [ ] Add debugging utilities for WebSocket connections

### Package.json Scripts
```json
{
  "dev:phase3": "next dev",
  "test:phase3": "jest --testPathPattern=phase3",
  "validate:phase3": "node validation/phase3-puppeteer.js"
}
```

---

## **📦 Deliverables**

### Core Phase 3 Requirements (PRD Alignment)
1. **Enhanced Navigation Layout** (T3-1) - Radix UI tabs implementation
2. **Live System Status Integration** (T3-2) - API connection to Phase 2 backend
3. **WebSocket Client Foundation** (T3-3) - Connection stub for Phase 4
4. **Puppeteer MCP Validation Script** (T3-6) - Required validation and screenshots

### Polish & Foundation (Phase 3 Extended)
5. **Enhanced Placeholder Pages** (T3-4) - Professional preview content
6. **UI/UX Polish & Dark Theme** (T3-5) - Executive-ready visual quality
7. **Development Tooling & Scripts** (T3-7) - Development workflow support

---

## **🎯 Success Metrics** (PRD Aligned)

### Functional Requirements
- [ ] Navigation shell with 4 tabs: Real-time, Explorer, Integration, Compliance
- [ ] WebSocket client stub successfully connects to `ws://localhost:4841/ws`
- [ ] Live system status from `/api/health` endpoint displays correctly
- [ ] Tailwind & Radix UI properly configured and working

### Visual Quality (Executive-Ready UI)
- [ ] Professional dark theme with consistent styling
- [ ] Smooth animations under 60fps on Intel UHD Graphics
- [ ] Navigation transitions work smoothly across all tabs
- [ ] Header text and branding clearly visible and professional

### Technical Performance
- [ ] Page load times under 2 seconds (PRD latency requirement)
- [ ] WebSocket connection establishes within 1 second
- [ ] All tabs navigate without errors or loading delays
- [ ] Responsive design works on laptop displays (1920x1080, 1366x768)

---

## **🔗 Dependencies**

### External Dependencies
- **Radix UI**: Navigation tabs and accessibility components
- **Tailwind CSS**: Already configured, needs enhancement
- **WebSocket API**: Browser native support
- **Puppeteer**: For MCP validation script

### Internal Dependencies  
- **Phase 2 Backend**: OPC UA server running on `localhost:4840`
- **Health API**: `/api/health` endpoint accessible on `localhost:3001`
- **WebSocket Bridge**: `ws://localhost:4841/ws` connection available

---

## **📋 Testing Requirements**

### Puppeteer MCP Script (PRD Required)
```bash
# As specified in PRD Phase 3
npm run validate:phase3
# Expected output: phase3-shell.png screenshot
# Validates: header text, navigation tabs, WebSocket status
```

### Manual Testing Checklist
- [ ] `npm run dev` starts successfully on `localhost:3000`
- [ ] All 4 navigation tabs accessible (Real-time, Explorer, Integration, Compliance)
- [ ] System status section shows live data from Phase 2 backend
- [ ] WebSocket connection indicator displays correct status
- [ ] Header displays "MineSensors OPC UA Mining Demo" correctly
- [ ] Dark theme consistent across all pages

### Automated Testing
- [ ] Component unit tests for navigation and status components
- [ ] Integration tests for API and WebSocket connections
- [ ] Visual regression tests for design consistency
- [ ] Performance tests for 60fps animation requirement

---

## **🚦 Phase 3 Definition of Done**

Following PRD specifications:

1. **Navigation Shell**: ✅ Tabs list with Real-time, Explorer, Integration, Compliance
2. **Tailwind & Radix UI**: ✅ Professional setup with dark theme
3. **WebSocket Stub**: ✅ Connection to `ws://localhost:4841/ws` with status indicator  
4. **Puppeteer MCP**: ✅ Script validates header text and captures `phase3-shell.png`

**Ready for Phase 3 Review & Approval** when:
- All HIGH priority tasks (T3-1, T3-2, T3-3, T3-6) completed
- Puppeteer MCP script passes with screenshot generation
- Visual quality meets "executive-ready" standard
- WebSocket foundation established for Phase 4 3D visualization

---

## **🎓 Educational Foundation**

Phase 3 establishes the educational foundation for:
- **OPC UA Mining Concepts**: Navigation structure mirrors industrial standards
- **Mining Operations Overview**: Professional presentation of mining domain
- **Real-Time Connectivity**: WebSocket foundation demonstrates industrial data flow
- **Standards Compliance**: UI structure prepares for OPC UA Mining Companion Specification demonstration