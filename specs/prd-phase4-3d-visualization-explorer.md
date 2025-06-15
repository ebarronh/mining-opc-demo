# Phase 4: 3D Real-Time Visualization & OPC UA Explorer - PRD

## Introduction/Overview

Phase 4 transforms the MineSensors OPC UA Mining Demo from a static dashboard into an interactive 3D learning environment. Building on the WebSocket infrastructure and UI foundation from Phase 3, this phase adds a 3D mine visualization and an OPC UA explorer to help new MineSense employees understand mining operations and data flow in an intuitive, visual way.

**Problem**: New employees struggle to understand the spatial relationships in mining operations and how OPC UA structures mining data.

**Goal**: Create interactive 3D visualization and OPC UA exploration tools that make complex mining concepts immediately understandable.

---

## Goals

| # | Goal | Success Criteria |
|---|------|-----------------|
| G1 | Visualize mining operations in 3D | Users can identify equipment and understand spatial relationships within 2 minutes |
| G2 | Show real-time equipment status | Equipment colors and positions update every 2 seconds via WebSocket |
| G3 | Display ore grade distribution | Users can toggle and understand grade heatmap with educational tooltips |
| G4 | Enable OPC UA exploration | Users can browse mining-specific nodes and see live values |
| G5 | Provide educational context | All mining terms have hover explanations, reducing confusion by 80% |
| G6 | Maintain performance | 3D view runs at minimum 30 FPS on standard hardware |

---

## User Stories

1. **As a new MineSense employee**, I want to see a 3D view of mining operations so I can understand where equipment operates and how ore grades are distributed.

2. **As a product owner**, I want to click on equipment in the 3D view so I can see real-time operational data and understand what each machine does.

3. **As a developer**, I want to explore the OPC UA tree structure so I can understand how mining data is organized and accessed.

4. **As a new employee**, I want to hover over any mining term or acronym so I can quickly learn industry terminology without interrupting my exploration.

5. **As a technical user**, I want to see code examples for accessing OPC UA nodes so I can understand how to integrate with mining systems.

---

## Functional Requirements

### 3D Visualization Tab (Real-time Monitor)

1. **FR4.1.1**: The system must render a 500m x 500m open-pit mine using Three.js with an angled perspective view (approximately 45-degree angle)

2. **FR4.1.2**: The system must display the 7 equipment items from the backend using simple 3D shapes:
   - Excavators: Rectangular box with attached arm/boom cylinder
   - Haul Trucks: Box with wheels (cylinders)
   - Conveyor Systems: Long rectangular segments

3. **FR4.1.3**: The system must color-code equipment based on status:
   - Green: Active/Operating
   - Yellow: Idle
   - Red: Maintenance Required

4. **FR4.1.4**: The system must update equipment positions every 2 seconds using WebSocket data from Phase 3

5. **FR4.1.5**: The system must show equipment information in a tooltip on hover:
   - Equipment ID and Type
   - Current Status
   - Fuel Level (for mobile equipment)
   - Position (X, Y, Z coordinates)
   - Current Task/Operation

6. **FR4.1.6**: The system must provide camera controls:
   - Left click + drag: Rotate view
   - Right click + drag: Pan view  
   - Scroll wheel: Zoom in/out
   - Double click: Focus on clicked equipment

7. **FR4.1.7**: The system must display a toggleable grade heatmap overlay:
   - Grid pattern across the mine pit (20x20 grid minimum)
   - Color-coded grade ranges with legend:
     - Blue: < 0.5% (Waste)
     - Green: 0.5-1.5% (Marginal Ore)
     - Yellow: 1.5-3.0% (Primary Ore)
     - Red: > 3.0% (High Priority)

8. **FR4.1.8**: The system must show exact grade percentage when clicking on any heatmap grid cell

9. **FR4.1.9**: The system must display keyboard shortcuts in a collapsible panel:
   - R: Reset camera to default view
   - G: Toggle grade heatmap
   - E: Toggle equipment labels
   - H: Toggle help mode
   - F: Focus on selected equipment

10. **FR4.1.10**: The system must include a "What's This?" help mode where clicking any element shows educational information

### OPC UA Explorer Tab

11. **FR4.2.1**: The system must display the OPC UA address space as an expandable tree structure

12. **FR4.2.2**: The system must highlight mining-specific nodes with a special icon or color

13. **FR4.2.3**: The system must show the following OPC UA structure (focus on mining-relevant nodes):
    ```
    Root
    ├── Objects
    │   ├── MiningSite
    │   │   ├── Equipment
    │   │   │   ├── Excavators
    │   │   │   ├── HaulTrucks
    │   │   │   └── ConveyorSystems
    │   │   └── Metrics
    │   │       ├── Production
    │   │       └── GradeControl
    ```

14. **FR4.2.4**: The system must display node details when selected:
    - NodeId
    - BrowseName
    - DataType
    - Current Value
    - Description

15. **FR4.2.5**: The system must update subscribed node values every 2 seconds (matching backend cycle)

16. **FR4.2.6**: The system must provide Subscribe/Unsubscribe buttons for each data node

17. **FR4.2.7**: The system must show inline, collapsible code examples for each node:
    - JavaScript example using node-opcua
    - Python example using python-opcua
    - REST API endpoint example

18. **FR4.2.8**: The system must indicate node types with icons:
    - Folder icon for object nodes
    - Variable icon for data nodes
    - Method icon for callable methods

### Educational Features (Cross-tab)

19. **FR4.3.1**: The system must show tooltips on hover for all mining terminology with plain English explanations

20. **FR4.3.2**: The system must include a floating glossary button that opens a searchable term dictionary

21. **FR4.3.3**: The system must highlight educational elements with a subtle (?) icon

22. **FR4.3.4**: The system must remember which tooltips a user has already seen (using localStorage)

### WebSocket Integration

23. **FR4.4.1**: The system must use the existing WebSocket connection from Phase 3 for all real-time data

24. **FR4.4.2**: The system must handle new message types:
    - `equipment_positions`: Update 3D positions
    - `grade_data`: Update heatmap values
    - `opcua_updates`: Update subscribed node values

25. **FR4.4.3**: The system must show connection status in both tabs

### Performance Requirements

26. **FR4.5.1**: The 3D visualization must maintain minimum 30 FPS on hardware with:
    - Intel integrated graphics (UHD 620 or better)
    - 8GB RAM
    - Chrome/Firefox/Edge latest versions

27. **FR4.5.2**: The OPC UA tree must handle 1000+ nodes without UI lag

28. **FR4.5.3**: Initial page load must complete within 3 seconds

---

## Non-Goals (Out of Scope)

1. **Realistic 3D models**: Use simple geometric shapes, not detailed equipment models
2. **Historical data**: Show current state only, no time-travel or playback features
3. **Equipment paths/trails**: Not included in Phase 4
4. **Collision detection**: Not included in Phase 4
5. **Predictive analytics**: Saved for Phase 6
6. **Mobile support**: Desktop-only for Phase 4
7. **Direct OPC UA connection**: Use REST API/WebSocket bridge, not direct OPC UA
8. **User accounts**: No authentication needed
9. **Data persistence**: No saving of user preferences beyond localStorage

---

## Design Considerations

### Visual Design
- Continue dark theme from Phase 3 with consistent color palette
- Use Three.js with WebGL renderer for 3D visualization
- Simple, clean geometric shapes for equipment (not realistic models)
- Subtle gradients for grade heatmap to ensure readability
- Consistent icon set for OPC UA node types

### User Interface
- Split-screen option to view 3D and OPC UA Explorer simultaneously
- Collapsible panels for controls and information
- Smooth transitions between camera positions
- Loading skeletons while data loads
- Clear visual feedback for all interactions

### Code Examples Format
```javascript
// Example format for inline code snippets
// Reading excavator position
const client = new OpcuaClient();
const nodeId = "ns=2;s=MiningSite.Equipment.Excavators.EX001.Position";
const value = await client.read(nodeId);
console.log(`Position: X=${value.x}, Y=${value.y}, Z=${value.z}`);
```

---

## Technical Considerations

### Frontend Architecture
- **3D Library**: Use @react-three/fiber (React wrapper for Three.js)
- **3D Components Structure**:
  ```
  components/
    three/
      MineScene.tsx      // Main 3D scene container
      Equipment.tsx      // Reusable equipment component
      GradeHeatmap.tsx   // Grade overlay component
      CameraControls.tsx // Camera interaction logic
  ```

### WebSocket Message Formats
```typescript
// Equipment position update
interface EquipmentPositionMessage {
  type: 'equipment_positions';
  data: {
    equipment: Array<{
      id: string;
      position: { x: number; y: number; z: number };
      status: 'active' | 'idle' | 'maintenance';
      fuelLevel?: number;
    }>;
  };
}

// Grade data update
interface GradeDataMessage {
  type: 'grade_data';
  data: {
    grid: Array<Array<number>>; // 20x20 grid of grade percentages
  };
}
```

### Performance Optimizations
- Use InstancedMesh for multiple similar equipment types
- Implement Level of Detail (LOD) for equipment models
- Throttle WebSocket updates to prevent overwhelming the 3D renderer
- Use React.memo and useMemo for expensive computations
- Lazy load Three.js only when Real-time Monitor tab is active

### OPC UA Integration
- Use existing REST API endpoints from Phase 2
- Cache OPC UA tree structure in frontend
- Batch subscribe/unsubscribe requests
- Implement virtual scrolling for large node lists

---

## Success Metrics

1. **User Understanding**
   - 90% of users can identify all equipment types within 2 minutes
   - 80% of users correctly explain grade distribution after 5 minutes
   - 75% of users successfully navigate OPC UA tree to find specific values

2. **Performance Metrics**
   - 3D view maintains 30+ FPS on target hardware
   - WebSocket messages processed within 100ms
   - OPC UA tree renders 1000 nodes in < 500ms

3. **Educational Effectiveness**
   - Users hover over 10+ tooltips in first session
   - 50% of users explore code examples
   - Average time to first successful OPC UA subscription < 3 minutes

4. **Technical Quality**
   - Zero WebGL errors in Chrome/Firefox/Edge
   - WebSocket reconnection works automatically
   - All equipment visible and correctly positioned

---

## Open Questions

1. **Equipment Movement**: Should equipment move continuously between updates or "jump" to new positions?

2. **Grade Data**: Should grade values change dynamically or remain static during the session?

3. **Error States**: How should we handle WebSocket disconnection in the 3D view? Freeze last known state or show offline indicator?

4. **Code Examples**: Should code examples be editable/runnable in the browser?

5. **Tooltip Persistence**: Should educational tooltips show every time or only once per session?

6. **Camera Presets**: Should we include preset camera positions (e.g., "Overview", "Pit Bottom", "Loading Area")?

7. **Sound Effects**: Should equipment have subtle operational sounds when active?

---

## Implementation Notes for Junior Developers

### Getting Started
1. Install Three.js dependencies: `npm install three @react-three/fiber @react-three/drei`
2. Review Three.js React examples: https://docs.pmnd.rs/react-three-fiber/getting-started/examples
3. Study the existing WebSocket hook from Phase 3 in `src/hooks/useWebSocket.ts`

### Key Concepts to Learn
- **Three.js Basics**: Scene, Camera, Renderer, Mesh, Geometry, Material
- **React Three Fiber**: Declarative 3D using React components
- **WebGL Performance**: Draw calls, instancing, LOD
- **OPC UA Concepts**: Nodes, NodeIds, BrowseName, Subscriptions

### Development Tips
- Start with a simple static 3D scene before adding real-time updates
- Test with Chrome DevTools FPS meter open
- Use React DevTools to identify unnecessary re-renders
- Test on lower-end hardware early and often

---

*Phase 4 PRD Version*: 1.0  
*Created*: 2025-01-15  
*Status*: Ready for Implementation