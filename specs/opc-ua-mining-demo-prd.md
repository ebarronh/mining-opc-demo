# MineSensors OPC UA Mining Integration Demo – Product Requirements Document (PRD)

## 0. Elevator Pitch
*Empower mining operations with standards-based, real-time ore intelligence.*  
This demo proves how an AI-augmented MineSensors platform can surface shovel-level grade data, feed fleet management systems (FMS) within seconds, and meet the **OPC UA Mining Companion Specification** – all wrapped in a modern, interactive UI that delights executives and engineers alike.

---

## 1. Why This Matters
1. **Operational Efficiency** – Routing trucks based on live grade increases NPV and lowers processing costs.  
2. **Standards Compliance** – OPC UA guarantees interoperability across OEMs, reducing custom integration projects.  
3. **Product Owner Storytelling** – A polished demo showcases domain knowledge, technical leadership, and user-centric thinking.

---

## 2. Goals & Non-Goals
| # | Goal | Measure of Success |
|---|------|-------------------|
| G1 |Demonstrate full OPC UA Mining information model | Shovel & Truck nodes browsable from any OPC UA client |
| G2 |<2 s data latency end-to-end | Puppeteer-captured metrics panel shows ≤2 s AVG latency |
| G3 |Illustrate multi-protocol FMS integration | REST & SOAP mocks exchange >30 msgs/s with demo server |
| G4 |Provide executive-ready UI | Stakeholder NPS ≥ 9 during dry-run |

**Out of Scope**: Production-grade security hardening, cloud deployment, mobile responsive tweaks.

---

## 3. Target Audience
* Primary: Product & engineering leadership at mining technology firms.  
* Secondary: Interview panel evaluating product ownership, domain expertise, and UX vision.

---

## 4. Key Features
1. **OPC UA Server** – Node-OPCUA powered, modeling `MiningEquipmentType`, historical trend surface, alarm simulation.
2. **3D Real-Time Dashboard** – Three.js mine pit, equipment avatars, grade heatmap.
3. **OPC UA Explorer** – Tree view + live value subscription with badge indicators.
4. **Integration Hub** – ISA-95 swim-lane, FMS connectivity cards, throughput charts.
5. **Compliance View** – Checklist against OPC UA & regional regulations.
6. **Scenario Player** – Trigger “high-grade discovery”, “equipment failure” etc.

---

## 5. Non-Functional Requirements (NFR)
* **Local First** – Runs via `docker-compose` on a laptop with 8 GB RAM.  
* **Great UI** – Dark theme, Tailwind CSS, animation <60 fps on Intel UHD Graphics.
* **Observability** – Console logs + metrics endpoint for Puppeteer MCP assertions.
* **Testability** – Each phase supplies an automated Puppeteer MCP script that boots the stack, performs smoke navigation, and screenshots key views.

---

## 6. Delivery Plan (Phased – STOP after each phase)

### Phase 1 – Research & Skeleton
*Objective*: Validate requirements, stub repo, CI, and base README.
- Desk research: OPC UA Mining Spec, grade economics, ISA-95.  
- Create mono-repo scaffold (`frontend`, `backend`, `docker-compose`).  
- Commit placeholder README & architecture diagram.

**Puppeteer MCP**: N/A (no UI yet).

##### 🚦 STOP – Phase 1 review & approval

---

### Phase 2 – OPC UA Server MVP
*Objective*: Stand-up Node-OPCUA server exposing shovel & truck nodes with randomized data.
- Implement `server.ts`, `mining-namespace.ts`, minimal simulator (grade, location).  
- Expose WebSocket bridge (ws://:4841).

**Definition of Done**
1. `opc.tcp://localhost:4840` reachable via UA Expert.  
2. Puppeteer MCP script spins server in Docker and parses console “Server is now listening”.

##### 🚦 STOP – Phase 2 review & approval

---

### Phase 3 – Front-End Foundations
*Objective*: Create Next.js 14 app with navigation shell and placeholder tabs.
- Tailwind & Radix UI setup.  
- Implement layout with Tabs list (Real-time, Explorer, Integration, Compliance).  
- Hook WebSocket client stub.

**Puppeteer MCP**
- Start `npm run dev` – Navigate to `/`, verify header text, take screenshot `phase3-shell.png`.

##### 🚦 STOP – Phase 3 review & approval

---

### Phase 4 – Real-Time Visualization & Explorer
*Objective*: Deliver 3D pit, equipment tracker, and live node browser.
- Use `@react-three/fiber` for 3D.  
- Implement `OpcUaExplorer` component with subscribe/unsubscribe.  
- Grade heatmap mesh updated each tick.

**Puppeteer MCP**
- Navigate to *Real-Time Monitor*, wait for WebGL canvas, assert ≥1 equipment label.  
- Navigate to *OPC UA Explorer*, click first node, assert value column renders.  
- Capture `phase4-realtime.png` & `phase4-explorer.png`.

##### 🚦 STOP – Phase 4 review & approval

---

### Phase 5 – Integration Hub & Compliance
*Objective*: Show ISA-95 flow, FMS cards, compliance checklist.
- Build `ISA95Flow` & `FMSIntegrationPanel`.  
- Add metrics polling API.  
- Finalize compliance items with pass/partial statuses.

**Puppeteer MCP**
- Navigate to *Integration* tab, count 3 FMS cards.  
- Navigate to *Compliance* tab, verify “OPC UA Mining v1.0 – compliant” badge.

##### 🚦 STOP – Phase 5 review & approval

---

### Phase 6 – Demo Orchestration & Polish
*Objective*: Scenario player, performance HUD, scripted walkthrough.
- Implement `DemoScenarios` backend triggers + front-end controls.  
- Add latency, throughput, and uptime widgets.  
- Record promo GIF via Puppeteer MCP.

**Definition of Done**
1. All scenarios selectable & reflected in UI within 5 s.  
2. Puppeteer MCP end-to-end script passes CI, producing artifact `demo-screens.zip`.

##### 🚦 FINAL STOP – Handoff & interview dry-run

---

## 7. Acceptance Criteria (summarised)
1. **Browse-able** – UA Expert shows expected folder hierarchy.  
2. **Performant** – Latency KPI on dashboard ≤2 s.  
3. **Aesthetic** – Interviewers subjectively rate UI ≥9/10.  
4. **Repeatable** – `docker-compose up` and Puppeteer MCP scripts succeed on clean machine.

---

## 8. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| WebGL perf on low-end laptop | Laggy demo | Use simple geometries, limit draw calls |
| OPC UA cert handshake issues | Demo failure | Allow `SecurityPolicy.None` fallback for local |
| Time constraints (interview imminent) | Incomplete features | Focus on Phases 1-4 first; later phases nice-to-have |

---

## 9. Glossary
* **OPC UA** – Open Platform Communications Unified Architecture, an industrial interoperability standard.  
* **ISA-95** – Enterprise-Control integration model with 5 levels.

---

## 10. References
1. OPC UA Companion Specification for Mining v1.0 – OPC Foundation.  
2. *The Value of Real-Time Grade Control* – Mining Technology Journal, 2023.

---

*Prepared by*: AI Product Owner Candidate  
*Date*: <<auto-generated>>
