# Task List - Phase 4: 3D Real-Time Visualization & OPC UA Explorer

## Relevant Files

### Frontend - 3D Visualization Components
- `frontend/src/components/three/MineScene.tsx` - Main 3D scene container with equipment and terrain ✅
- `frontend/src/components/three/MineScene.test.tsx` - Unit tests for MineScene component
- `frontend/src/components/three/Equipment.tsx` - Reusable 3D equipment component (excavators, trucks, conveyors) ✅
- `frontend/src/components/three/Equipment.test.tsx` - Unit tests for Equipment component
- `frontend/src/components/three/GradeHeatmap.tsx` - Grade overlay visualization component ✅
- `frontend/src/components/three/GradeHeatmap.test.tsx` - Unit tests for GradeHeatmap
- `frontend/src/components/three/CameraControls.tsx` - Camera interaction and keyboard shortcuts ✅
- `frontend/src/components/three/CameraControls.test.tsx` - Unit tests for camera controls

### Frontend - OPC UA Explorer Components
- `frontend/src/components/opcua/OpcUaExplorer.tsx` - Main OPC UA tree explorer component
- `frontend/src/components/opcua/OpcUaExplorer.test.tsx` - Unit tests for explorer
- `frontend/src/components/opcua/NodeDetails.tsx` - Node information display panel
- `frontend/src/components/opcua/NodeDetails.test.tsx` - Unit tests for node details
- `frontend/src/components/opcua/CodeExamples.tsx` - Collapsible code snippet component
- `frontend/src/components/opcua/CodeExamples.test.tsx` - Unit tests for code examples

### Frontend - Educational Components
- `frontend/src/components/educational/Glossary.tsx` - Floating glossary component
- `frontend/src/components/educational/Glossary.test.tsx` - Unit tests for glossary
- `frontend/src/components/educational/Tooltip.tsx` - Educational tooltip wrapper
- `frontend/src/components/educational/Tooltip.test.tsx` - Unit tests for tooltips
- `frontend/src/data/miningTerms.ts` - Mining terminology definitions ✅

### Frontend - Page Updates
- `frontend/src/app/real-time/page.tsx` - Update Real-time Monitor page with 3D view ✅
- `frontend/src/app/explorer/page.tsx` - Update OPC UA Explorer page

### Frontend - Hooks and Types
- `frontend/src/hooks/useWebSocket.ts` - Extend for new message types
- `frontend/src/types/websocket.ts` - Add new WebSocket message interfaces ✅
- `frontend/src/hooks/useThree.ts` - Three.js utilities and performance monitoring
- `frontend/src/hooks/useThree.test.ts` - Unit tests for Three.js hooks

### Backend - WebSocket Updates
- `backend/src/websocket/messageHandlers.ts` - Add handlers for new message types
- `backend/src/websocket/messageHandlers.test.ts` - Unit tests for message handlers
- `backend/src/simulation/gradeGenerator.ts` - Generate grade heatmap data
- `backend/src/simulation/gradeGenerator.test.ts` - Unit tests for grade generation

### Validation
- `validation/phase4-puppeteer.js` - Puppeteer validation script for Phase 4

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Setup and Dependencies
  - [x] 1.1 Install Three.js packages: `npm install three @react-three/fiber @react-three/drei`
  - [x] 1.2 Install additional UI dependencies: `npm install @radix-ui/react-tooltip @radix-ui/react-dialog`
  - [x] 1.3 Create TypeScript interfaces for new WebSocket message types in `frontend/src/types/websocket.ts`
  - [x] 1.4 Set up folder structure for Three.js components (`frontend/src/components/three/`)
  - [x] 1.5 Set up folder structure for OPC UA components (`frontend/src/components/opcua/`)
  - [x] 1.6 Create mining terminology data file with initial terms

- [x] 2.0 3D Visualization Implementation
  - [x] 2.1 Create basic MineScene component with Three.js canvas setup
    - [x] 2.1.1 Initialize scene with proper lighting (ambient + directional)
    - [x] 2.1.2 Add ground plane representing 500m x 500m mine pit
    - [x] 2.1.3 Set up 45-degree angled camera view
    - [x] 2.1.4 Add basic OrbitControls from @react-three/drei
  - [x] 2.2 Implement Equipment component for 3D equipment rendering
    - [x] 2.2.1 Create excavator geometry (box + cylinder for arm)
    - [x] 2.2.2 Create haul truck geometry (box + cylinder wheels)
    - [x] 2.2.3 Create conveyor system geometry (long rectangles)
    - [x] 2.2.4 Implement status-based coloring (green/yellow/red)
    - [x] 2.2.5 Add equipment labels using Text component from drei
  - [x] 2.3 Implement GradeHeatmap component
    - [x] 2.3.1 Create 20x20 grid mesh overlay
    - [x] 2.3.2 Implement color mapping for grade ranges
    - [x] 2.3.3 Add toggle functionality with smooth fade transition
    - [x] 2.3.4 Create grade legend component
    - [x] 2.3.5 Implement click handler for showing exact grade values
  - [x] 2.4 Implement CameraControls with keyboard shortcuts
    - [x] 2.4.1 Add keyboard event listeners for R, G, E, H, F keys
    - [x] 2.4.2 Implement camera reset functionality
    - [x] 2.4.3 Add focus-on-equipment animation
    - [x] 2.4.4 Create keyboard shortcuts panel UI
    - [x] 2.4.5 Implement double-click to focus on equipment
  - [x] 2.5 Add equipment interaction features
    - [x] 2.5.1 Implement hover detection using raycasting
    - [x] 2.5.2 Create tooltip component showing equipment details
    - [x] 2.5.3 Add hover highlight effect on equipment
    - [x] 2.5.4 Connect tooltip data to WebSocket equipment data

- [ ] 3.0 OPC UA Explorer Implementation
  - [ ] 3.1 Create OpcUaExplorer tree component
    - [ ] 3.1.1 Implement expandable tree structure using Radix UI
    - [ ] 3.1.2 Add mining-specific node highlighting
    - [ ] 3.1.3 Create node type icons (folder, variable, method)
    - [ ] 3.1.4 Implement lazy loading for child nodes
    - [ ] 3.1.5 Add search/filter functionality
  - [ ] 3.2 Implement NodeDetails panel
    - [ ] 3.2.1 Display NodeId, BrowseName, DataType fields
    - [ ] 3.2.2 Show current value with live updates
    - [ ] 3.2.3 Add Subscribe/Unsubscribe toggle buttons
    - [ ] 3.2.4 Implement value formatting based on data type
    - [ ] 3.2.5 Add copy-to-clipboard for NodeId
  - [ ] 3.3 Create CodeExamples component
    - [ ] 3.3.1 Implement collapsible code sections
    - [ ] 3.3.2 Add syntax highlighting using a lightweight library
    - [ ] 3.3.3 Create JavaScript example templates
    - [ ] 3.3.4 Create Python example templates
    - [ ] 3.3.5 Create REST API example templates
  - [ ] 3.4 Connect to backend OPC UA data
    - [ ] 3.4.1 Create API service for fetching OPC UA tree structure
    - [ ] 3.4.2 Implement subscription management
    - [ ] 3.4.3 Handle real-time value updates via WebSocket
    - [ ] 3.4.4 Add error handling for failed subscriptions

- [ ] 4.0 Educational Features Implementation
  - [ ] 4.1 Create educational Tooltip component
    - [ ] 4.1.1 Implement hover detection for mining terms
    - [ ] 4.1.2 Create tooltip UI with explanation text
    - [ ] 4.1.3 Add localStorage tracking for seen tooltips
    - [ ] 4.1.4 Implement (?) icon for educational elements
    - [ ] 4.1.5 Add animation for tooltip appearance
  - [ ] 4.2 Implement Glossary component
    - [ ] 4.2.1 Create floating glossary button
    - [ ] 4.2.2 Build modal dialog with search functionality
    - [ ] 4.2.3 Populate with mining terminology data
    - [ ] 4.2.4 Add alphabetical navigation
    - [ ] 4.2.5 Implement fuzzy search for terms
  - [ ] 4.3 Add "What's This?" help mode
    - [ ] 4.3.1 Create help mode toggle in UI
    - [ ] 4.3.2 Add click handlers for all interactive elements
    - [ ] 4.3.3 Create contextual help content
    - [ ] 4.3.4 Implement help mode visual indicator
    - [ ] 4.3.5 Add exit help mode functionality

- [ ] 5.0 WebSocket Integration and Backend Updates
  - [ ] 5.1 Extend WebSocket message handling
    - [ ] 5.1.1 Add `equipment_positions` message handler
    - [ ] 5.1.2 Add `grade_data` message handler
    - [ ] 5.1.3 Add `opcua_updates` message handler
    - [ ] 5.1.4 Update WebSocket hook to process new message types
    - [ ] 5.1.5 Add message queuing for performance
  - [ ] 5.2 Update backend simulation
    - [ ] 5.2.1 Implement equipment position updates in simulation
    - [ ] 5.2.2 Create grade data generator with realistic patterns
    - [ ] 5.2.3 Add OPC UA value change notifications
    - [ ] 5.2.4 Implement 2-second update cycle for all data
    - [ ] 5.2.5 Add WebSocket broadcast for new message types
  - [ ] 5.3 Create REST API endpoints
    - [ ] 5.3.1 Add `/api/opcua/browse` endpoint for tree structure
    - [ ] 5.3.2 Add `/api/opcua/subscribe` endpoint
    - [ ] 5.3.3 Add `/api/opcua/unsubscribe` endpoint
    - [ ] 5.3.4 Implement subscription management in backend
    - [ ] 5.3.5 Add error handling and validation

- [ ] 6.0 Performance Optimization and Testing
  - [ ] 6.1 Optimize 3D rendering performance
    - [ ] 6.1.1 Implement InstancedMesh for similar equipment
    - [ ] 6.1.2 Add Level of Detail (LOD) for equipment models
    - [ ] 6.1.3 Throttle WebSocket updates to maintain 30 FPS
    - [ ] 6.1.4 Implement frustum culling for off-screen objects
    - [ ] 6.1.5 Add performance monitoring overlay
  - [ ] 6.2 Optimize OPC UA Explorer
    - [ ] 6.2.1 Implement virtual scrolling for large trees
    - [ ] 6.2.2 Add debouncing for search functionality
    - [ ] 6.2.3 Cache OPC UA tree structure
    - [ ] 6.2.4 Batch subscription requests
    - [ ] 6.2.5 Lazy load code examples
  - [ ] 6.3 Write comprehensive unit tests
    - [ ] 6.3.1 Test 3D component rendering and interactions
    - [ ] 6.3.2 Test OPC UA tree navigation
    - [ ] 6.3.3 Test WebSocket message handling
    - [ ] 6.3.4 Test educational features
    - [ ] 6.3.5 Test keyboard shortcuts and controls
  - [ ] 6.4 Performance testing
    - [ ] 6.4.1 Test on Intel UHD 620 graphics
    - [ ] 6.4.2 Verify 30 FPS minimum in all scenarios
    - [ ] 6.4.3 Test with 1000+ OPC UA nodes
    - [ ] 6.4.4 Verify 3-second initial load time
    - [ ] 6.4.5 Test WebSocket reconnection handling

- [ ] 7.0 Validation and Documentation
  - [ ] 7.1 Create Puppeteer validation script
    - [ ] 7.1.1 Test 3D scene loads and renders
    - [ ] 7.1.2 Verify equipment is visible and interactive
    - [ ] 7.1.3 Test grade heatmap toggle
    - [ ] 7.1.4 Validate OPC UA tree exploration
    - [ ] 7.1.5 Capture screenshots for Phase 4 completion
  - [ ] 7.2 Update documentation
    - [ ] 7.2.1 Add Three.js setup instructions to README
    - [ ] 7.2.2 Document new WebSocket message formats
    - [ ] 7.2.3 Create user guide for 3D controls
    - [ ] 7.2.4 Document OPC UA Explorer usage
    - [ ] 7.2.5 Update architecture diagram with new components
  - [ ] 7.3 Integration testing
    - [ ] 7.3.1 Test full data flow from backend to 3D view
    - [ ] 7.3.2 Verify all keyboard shortcuts work
    - [ ] 7.3.3 Test educational features with new users
    - [ ] 7.3.4 Validate cross-browser compatibility
    - [ ] 7.3.5 Run full Puppeteer validation suite