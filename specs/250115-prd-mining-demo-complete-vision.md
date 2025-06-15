# MineSensors OPC UA Mining Demo – Complete Vision PRD

## Introduction/Overview

The MineSensors OPC UA Mining Demo is an **educational platform** designed to help new MineSense employees and mining industry newcomers understand the complex architecture of modern mining operations through interactive visualization and hands-on exploration. 

Building on the completed Phases 1-3 (backend infrastructure, OPC UA server, and frontend foundations), this PRD outlines the vision for Phases 4-5 and beyond, transforming the demo into a comprehensive learning tool that makes mining technology architecture accessible and engaging.

**Problem Statement**: Mining technology architecture involving OPC UA, ISA-95, and enterprise integration is complex and difficult for newcomers to grasp quickly. New MineSense employees need an interactive way to understand how all the pieces fit together.

**Goal**: Create an interactive, visual learning platform that helps users understand mining operations, OPC UA standards, ISA-95 integration levels, and MineSense's role in the ecosystem.

---

## Goals

| # | Goal | Measure of Success |
|---|------|-------------------|
| G1 | Enable rapid onboarding for new MineSense employees | 80% of new hires report improved understanding after using the demo |
| G2 | Visualize complex mining operations in real-time | Users can identify equipment, understand data flow within 5 minutes |
| G3 | Demonstrate ISA-95 level integration clearly | Users can explain Level 2-4 interactions after exploration |
| G4 | Make OPC UA concepts tangible and understandable | Users successfully navigate OPC UA tree and understand node types |
| G5 | Provide interactive learning through scenarios | Users complete 3+ what-if scenarios understanding outcomes |
| G6 | Offer technical depth for developers | Developers can access code examples and implementation details |

---

## User Stories

### Primary User: New MineSense Employee
1. **As a new MineSense employee**, I want to see a visual representation of a mining operation so that I can understand where our technology fits in the ecosystem.
2. **As a new employee**, I want tooltips and explanations for industry acronyms so that I can learn terminology quickly.
3. **As a product owner**, I want to understand data flow between ISA-95 levels so that I can speak intelligently about integration points.
4. **As a new hire**, I want to interact with what-if scenarios so that I can understand cause-and-effect in mining operations.

### Secondary User: Technical Staff
5. **As a developer**, I want to see code snippets and implementation details so that I can understand how the system is built.
6. **As a technical user**, I want to explore the OPC UA address space so that I can understand the data model structure.
7. **As an engineer**, I want to trigger different scenarios so that I can see how the system responds to various conditions.

### Tertiary User: Industry Professional
8. **As an industry professional**, I want a quick refresher on OPC UA Mining Companion Specification so that I can validate my understanding.

---

## Functional Requirements

### Phase 4: 3D Real-Time Visualization & OPC UA Explorer

#### 3D Visualization (FR4.1-FR4.8)
1. **FR4.1**: The system must display a simplified 3D representation of an open-pit mine using Three.js
2. **FR4.2**: The system must show real-time equipment positions updated every 2 seconds (simulated data acceptable)
3. **FR4.3**: The system must provide pan, zoom, and rotate controls for the 3D view
4. **FR4.4**: The system must display equipment information (ID, type, status, fuel level, current task) on hover
5. **FR4.5**: The system must show a toggleable grade heatmap layer with educational grade ranges:
   - < 0.5% (Low Grade - Waste)
   - 0.5-1.5% (Medium Grade - Marginal Ore)  
   - 1.5-3.0% (High Grade - Primary Ore)
   - > 3.0% (Very High Grade - Priority Processing)
6. **FR4.6**: The system must include a legend explaining grade classifications and their economic impact
7. **FR4.7**: The system may show equipment movement paths/trails (nice-to-have)
8. **FR4.8**: The system may implement collision detection warnings (nice-to-have)

#### OPC UA Explorer (FR4.9-FR4.14)
9. **FR4.9**: The system must display the OPC UA address space in a tree structure
10. **FR4.10**: The system must show live values for subscribed nodes
11. **FR4.11**: The system must allow users to subscribe/unsubscribe to node updates
12. **FR4.12**: The system must provide tooltips explaining OPC UA concepts (NodeId, BrowseName, DataType)
13. **FR4.13**: The system must highlight the Mining Companion Specification nodes
14. **FR4.14**: The system must show code snippets for accessing nodes programmatically

### Phase 5: Enterprise Integration & Compliance Dashboard

#### ISA-95 Integration Visualization (FR5.1-FR5.8)
1. **FR5.1**: The system must display ISA-95 levels 2-5 in a clear visual hierarchy
2. **FR5.2**: The system must animate data flow between levels showing:
   - Level 2 (Area Supervisory Control) → Level 3 (Site Operations/MES)
   - Level 3 → Level 4 (Site Business Planning/ERP)
   - Level 4 → Level 5 (Enterprise Business Planning)
3. **FR5.3**: The system must highlight MineSense's position at Level 3
4. **FR5.4**: The system must show example integration with Oracle systems
5. **FR5.5**: The system must provide educational tooltips explaining each ISA-95 level's purpose
6. **FR5.6**: The system must demonstrate typical data types exchanged between levels
7. **FR5.7**: The system must show latency/throughput metrics between levels
8. **FR5.8**: The system must include an "Integration Patterns" sidebar with common scenarios

#### Compliance Dashboard (FR5.9-FR5.14)
9. **FR5.9**: The system must show compliance status for key OPC UA Mining Companion Specification sections:
   - Equipment Information Model ✓
   - Operational Data Exchange ✓
   - Alarm & Event Handling ✓
   - Historical Data Access ✓
10. **FR5.10**: The system must provide brief explanations of why each compliance area matters
11. **FR5.11**: The system must show a simplified compliance process flow
12. **FR5.12**: The system must indicate which standards are mandatory vs. recommended
13. **FR5.13**: The system must link to relevant specification documents
14. **FR5.14**: The system must show example compliance implementations with code

### Advanced Features (Phase 6+)

#### Predictive Analytics Dashboard (FR6.1-FR6.4)
1. **FR6.1**: The system must show predictive maintenance alerts with explanation of prediction logic
2. **FR6.2**: The system must display: "Based on vibration patterns and operating hours, Excavator EX001 has 72% probability of hydraulic failure within 48 hours"
3. **FR6.3**: The system must show the data inputs used for predictions (vibration, temperature, hours)
4. **FR6.4**: The system must allow users to adjust parameters and see prediction changes

#### Production Optimization (FR6.5-FR6.8)
5. **FR6.5**: The system must show current vs. optimal truck routing based on grade data
6. **FR6.6**: The system must display potential production gains from optimization
7. **FR6.7**: The system must provide scheduling recommendations with reasoning
8. **FR6.8**: The system must show cost/benefit analysis of recommendations

#### What-If Scenario Player (FR6.9-FR6.12)
9. **FR6.9**: The system must provide pre-built scenarios:
   - "High-grade ore discovery in sector 7"
   - "Primary crusher maintenance required"
   - "Haul truck breakdown on main route"
   - "Weather event approaching"
10. **FR6.10**: The system must show immediate impacts of each scenario
11. **FR6.11**: The system must display recommended actions for each scenario
12. **FR6.12**: The system must track user decisions and show outcomes

#### Educational Features (FR7.1-FR7.6)
1. **FR7.1**: The system must provide a glossary of mining and technology terms accessible via hover
2. **FR7.2**: The system must include a "Learning Mode" toggle that shows additional explanations
3. **FR7.3**: The system must provide guided tours for first-time users
4. **FR7.4**: The system must show "Did You Know?" facts about mining operations
5. **FR7.5**: The system must include links to deeper technical documentation
6. **FR7.6**: The system must provide code examples in multiple languages (JavaScript, Python, C#)

---

## Non-Goals (Out of Scope)

1. **Mobile/Tablet Optimization**: Desktop-only experience for this phase
2. **Data Persistence**: No historical data storage; use simulated historical data
3. **Multi-Site Support**: Single mine site demonstration only
4. **Production Security**: Demo-appropriate security only (no certificates required)
5. **Export Capabilities**: No CSV/JSON export functionality
6. **Real Equipment Integration**: Simulated data only
7. **Cloud Deployment**: Local/Docker deployment only
8. **User Authentication**: No login required

---

## Design Considerations

### Visual Design
- **Theme**: Continue dark theme from Phase 3 with mining-appropriate color scheme
- **3D Aesthetics**: Simplified, clean 3D models focusing on clarity over realism
- **Information Density**: Progressive disclosure - basic info visible, details on demand
- **Educational Elements**: Consistent use of tooltips, info icons, and help panels

### User Experience
- **First-Time User Flow**: Welcome modal → Guided tour option → Interactive tutorial
- **Navigation**: Maintain tab structure from Phase 3, add breadcrumbs for deep navigation
- **Feedback**: Immediate visual feedback for all interactions
- **Loading States**: Skeleton screens and progress indicators for data loading

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader**: ARIA labels for complex visualizations
- **Color Contrast**: WCAG AA compliance for all text
- **Motion**: Respect prefers-reduced-motion for animations

---

## Technical Considerations

### Frontend Architecture
- **3D Rendering**: Use @react-three/fiber for React-Three.js integration
- **State Management**: Leverage existing WebSocket infrastructure from Phase 3
- **Performance**: Implement LOD (Level of Detail) for 3D models
- **Code Splitting**: Lazy load heavy components (3D viewer, charts)

### Backend Considerations
- **Simulation Engine**: Extend existing OPC UA server with scenario triggers
- **WebSocket Messages**: Add new message types for scenarios and predictions
- **API Endpoints**: New REST endpoints for analytics and recommendations
- **Data Generation**: Realistic patterns for equipment movement and grade distribution

### Integration Points
- **Oracle Reference**: Mock Oracle database connections for ISA-95 Level 4
- **OPC UA Standards**: Strict adherence to Mining Companion Specification v1.0
- **Educational Content**: Separate content management for tooltips and explanations

### Developer Experience
- **Code Examples**: Embedded Monaco editor for syntax highlighting
- **API Documentation**: Interactive API explorer for OPC UA methods
- **Architecture Diagrams**: Clickable system architecture visualization

---

## Success Metrics

1. **Onboarding Effectiveness**
   - Time to first "aha" moment < 5 minutes
   - 80% task completion rate in guided tutorial
   - Positive feedback from 90% of new MineSense employees

2. **Educational Value**
   - Users can correctly identify 5+ mining terms after 15 minutes
   - Users can explain ISA-95 levels after exploring integration view
   - Users successfully complete 3+ what-if scenarios

3. **Technical Engagement**
   - 50% of developer users access code examples
   - 30% of users explore OPC UA tree beyond first level
   - Average session duration > 20 minutes

4. **Demo Effectiveness**
   - Stakeholder satisfaction rating ≥ 9/10
   - Zero critical bugs during live demonstrations
   - < 3 seconds load time for initial page

---

## Open Questions

1. **Content Management**: Should educational content be hardcoded or loaded from a CMS for easy updates?
2. **Scenario Complexity**: How complex should the what-if scenarios be? Should they chain together?
3. **Performance Targets**: What's the minimum acceptable FPS for the 3D visualization?
4. **Code Example Scope**: Which programming languages should we prioritize for code examples?
5. **Gamification**: Should we add achievement badges or progress tracking for learning modules?
6. **MineSense Branding**: How prominently should MineSense technology be featured vs. generic mining operations?
7. **Update Frequency**: How often should simulated data change to feel realistic but not distracting?

---

*Prepared by*: Claude Code Assistant  
*Date*: 2025-01-15  
*Version*: 1.0 - Complete Vision including Phases 4-6+