# MineSensors OPC UA Mining Integration Demo

> Empowering mining operations with standards-based, real-time ore intelligence

## 🎯 Project Vision

This demo showcases how an AI-augmented MineSensors platform can surface shovel-level grade data, feed fleet management systems (FMS) within seconds, and meet the **OPC UA Mining Companion Specification** – all wrapped in a modern, interactive UI that delights executives and engineers alike.

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js 14)"
        UI[3D Real-Time Dashboard]
        EXP[OPC UA Explorer]
        INT[Integration Hub]
        COMP[Compliance View]
    end
    
    subgraph "Backend (Node.js + TypeScript)"
        OPC[OPC UA Server<br/>node-opcua]
        WS[WebSocket Bridge<br/>ws://4841]
        API[REST API<br/>:3001]
    end
    
    subgraph "Mining Equipment"
        EXC[Hydraulic Excavator<br/>Grade Data]
        TRUCK[Mining Trucks<br/>Fleet Data]
        CONV[Conveyors<br/>Throughput]
    end
    
    subgraph "External Systems"
        FMS[Fleet Management<br/>REST/SOAP]
        SCADA[Mine SCADA<br/>OPC UA Client]
        ERP[Enterprise Systems<br/>ISA-95 L4]
    end
    
    UI --> WS
    EXP --> WS
    INT --> API
    COMP --> API
    
    WS --> OPC
    API --> OPC
    
    OPC -.->|opc.tcp://4840| EXC
    OPC -.->|opc.tcp://4840| TRUCK
    OPC -.->|opc.tcp://4840| CONV
    
    API <--> FMS
    OPC <--> SCADA
    API <--> ERP
    
    style UI fill:#2563eb,color:#fff
    style OPC fill:#dc2626,color:#fff
    style EXC fill:#16a34a,color:#fff
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0
- **Docker** (optional, for containerized deployment)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mining-opc-demo
   pnpm install
   ```

2. **Start development servers**
   ```bash
   # Start both frontend and backend
   pnpm dev
   
   # Or start individually
   pnpm --filter backend dev    # OPC UA server on :4840, API on :3001
   pnpm --filter frontend dev   # Next.js on :3000
   ```

3. **Access the demo**
   - **Web UI**: http://localhost:3000
   - **OPC UA Server**: opc.tcp://localhost:4840/mining-demo
   - **WebSocket**: ws://localhost:4841

### Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Access services
# - Web UI: http://localhost:3000
# - OPC UA Server: opc.tcp://localhost:4840
# - WebSocket Bridge: ws://localhost:4841
```

## 📊 Key Features

### 1. **OPC UA Server** (Port 4840)
- Node-OPCUA powered server modeling `MiningEquipmentType`
- Historical trend surface and alarm simulation
- Compliance with OPC UA Mining Companion Specification v1.0

### 2. **3D Real-Time Dashboard**
- **Three.js Visualization**: Interactive 3D mine pit with equipment models
- **Equipment Tracking**: Real-time positioning of excavators, trucks, conveyors
- **Grade Heatmap**: Toggle-able 20x20 grid overlay with color-coded ore grades
- **Camera Controls**: Keyboard shortcuts (R=reset, G=grade toggle, E=equipment focus, H=help, F=fullscreen)
- **Performance Optimized**: LOD rendering, frustum culling, 30+ FPS on Intel UHD Graphics

### 3. **OPC UA Explorer**
- **Tree Navigation**: Hierarchical address space browser with virtual scrolling
- **Live Subscriptions**: Real-time value updates with subscription management
- **Node Details**: Complete OPC UA node information with data type interpretation
- **Code Examples**: Auto-generated JavaScript, Python, and REST API examples
- **Search & Filter**: Debounced search with fuzzy matching for large node trees

### 4. **Integration Hub**
- ISA-95 swim-lane visualization
- FMS connectivity cards showing throughput
- Multi-protocol integration (REST, SOAP, OPC UA)

### 5. **Compliance View**
- Checklist against OPC UA Mining standards
- Regional regulatory compliance tracking
- Audit trail and certification status

### 6. **Educational Features**
- **Mining Glossary**: 50+ industry terms with search and explanations
- **Interactive Tooltips**: Contextual help for mining concepts and values
- **Help Mode**: Guided tutorial with click targets for new users
- **Progress Tracking**: Remembers which educational content has been viewed

### 7. **Demo Scenarios**
- Trigger "high-grade discovery" events
- Simulate equipment failure scenarios
- Performance metrics and KPI tracking
- Real-time 3D equipment movement and status changes

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **OPC UA**: node-opcua (industrial automation)
- **WebSocket**: ws (real-time communication)
- **API**: Express.js with REST endpoints
- **Testing**: Jest with ts-jest

### Frontend
- **Framework**: Next.js 15.4.0 with App Router
- **Styling**: Tailwind CSS + Radix UI
- **3D Graphics**: Three.js with @react-three/fiber, @react-three/drei
- **State Management**: React Query + Context API
- **WebSocket**: Native WebSocket API with reconnection
- **Syntax Highlighting**: react-syntax-highlighter for code examples
- **Performance**: Virtual scrolling, LOD rendering, frustum culling

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Package Manager**: pnpm workspaces
- **Code Quality**: ESLint + Prettier + Husky

## 📈 Performance Goals

- **< 2s Latency**: End-to-end data flow from equipment to UI
- **30+ msgs/s**: FMS integration throughput
- **< 60fps**: WebGL rendering on Intel UHD Graphics
- **8GB RAM**: Complete stack running on laptop

## 🔒 Security & Standards

### OPC UA Security
- X.509 certificate-based authentication
- 256-bit encryption for data transmission
- Secure channels with message signing
- Configurable security policies (None/Basic256Sha256)

### Standards Compliance
- **OPC UA Mining Companion Spec v1.0**: Equipment information models
- **ISA-95 / IEC 62264**: Enterprise-control integration
- **Industry 4.0**: Secure sensor-to-cloud connectivity

## 🎮 3D Controls & Interaction

### Keyboard Shortcuts
- **R** - Reset camera to default position
- **G** - Toggle grade heatmap overlay
- **E** - Focus camera on selected equipment
- **H** - Toggle help mode for educational features
- **F** - Toggle fullscreen mode
- **Double-click** - Focus on equipment or terrain feature

### Mouse Controls
- **Left drag** - Rotate camera around mine pit
- **Right drag** - Pan camera view
- **Scroll wheel** - Zoom in/out
- **Hover** - Show equipment tooltips with live data

## 📡 WebSocket Message Formats

### Equipment Position Updates
```json
{
  "type": "equipment_positions",
  "data": [
    {
      "id": "excavator-001",
      "x": 245.6, "y": 12.3, "z": -87.4,
      "status": "operational",
      "type": "excavator",
      "currentLoad": 85,
      "efficiency": 92.5
    }
  ]
}
```

### Grade Heatmap Data
```json
{
  "type": "grade_data",
  "data": {
    "timestamp": 1703123456789,
    "grid": [
      [2.1, 2.3, 2.8, ...],
      [1.9, 2.1, 2.4, ...],
      ...
    ]
  }
}
```

### OPC UA Node Updates
```json
{
  "type": "opcua_updates",
  "data": [
    {
      "nodeId": "ns=2;s=Equipment.Excavator001.OreGrade",
      "value": 3.45,
      "timestamp": 1703123456789,
      "dataType": "Double",
      "unit": "g/t Au"
    }
  ]
}
```

## 🧪 Testing & Validation

### OPC UA Client Testing
```bash
# Test with UA Expert (Windows)
# Endpoint: opc.tcp://localhost:4840/mining-demo
# Security: None (demo) or Basic256Sha256 (production)

# Test with opcua-commander (CLI)
npx opcua-commander -e opc.tcp://localhost:4840/mining-demo
```

### Automated Testing
```bash
# Run all tests
pnpm test

# Backend unit tests
pnpm --filter backend test

# Frontend component tests
pnpm --filter frontend test

# Phase 4 validation (requires both servers running)
node validation/phase4-puppeteer.js
```

## 📁 Project Structure

```
mining-opc-demo/
├── backend/                 # OPC UA server & API
│   ├── src/
│   │   ├── server.ts       # Main OPC UA server
│   │   ├── addressSpace/   # Mining OPC UA models
│   │   ├── api/            # REST API endpoints
│   │   ├── simulation/     # Grade & equipment simulation
│   │   └── websocket/      # WebSocket message handlers
│   ├── tests/              # Backend unit tests
│   ├── Dockerfile          # Backend container
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   │   ├── three/      # 3D visualization
│   │   │   ├── opcua/      # OPC UA explorer
│   │   │   └── educational/ # Learning features
│   │   ├── hooks/          # Custom React hooks
│   │   ├── providers/      # Context providers
│   │   └── types/          # TypeScript definitions
│   ├── tests/              # Frontend tests
│   ├── Dockerfile          # Frontend container
│   └── package.json        # Frontend dependencies
├── validation/             # Puppeteer validation scripts
│   ├── phase3-puppeteer.js # Phase 3 validation
│   └── phase4-puppeteer.js # Phase 4 validation
├── docs/                   # Documentation
│   ├── standards/          # OPC UA & ISA-95 research
│   ├── tooling/            # Technology decisions
│   └── research/           # Economic analysis
├── specs/                  # Requirements & tasks
├── spikes/                 # Proof-of-concept code
├── docker-compose.yml      # Multi-service deployment
└── package.json            # Workspace configuration
```

## 🎯 Demo Scenarios

### Scenario 1: High-Grade Discovery
- Excavator discovers high-grade ore (>3.5g/t Au)
- Real-time alert triggers in dashboard
- FMS rerouting recommendations appear
- Grade heatmap updates immediately

### Scenario 2: Equipment Health Alert
- Conveyor vibration exceeds threshold
- Maintenance notification sent via OPC UA
- Downtime impact calculated and displayed
- Alternative routing suggestions provided

### Scenario 3: Production Optimization
- Fleet coordination for optimal truck dispatch
- Real-time throughput monitoring
- Grade control feedback loop
- Economic KPI tracking ($/tonne processed)

## 🔍 Monitoring & Observability

- **OPC UA Metrics**: Connection status, message throughput, error rates
- **Performance HUD**: Latency, memory usage, WebGL frame rate
- **Business KPIs**: Production volume, grade recovery, equipment utilization
- **Compliance Status**: Standards adherence, audit readiness

## 🤝 Contributing

1. Follow the Phase-based development approach (see `specs/`)
2. Maintain OPC UA compliance and security best practices
3. Use conventional commits and automated testing
4. Document mining domain knowledge and technical decisions

## 📞 Support

- **Issues**: GitHub Issues for bug reports and feature requests
- **Documentation**: See `docs/` for technical specifications
- **Demo Questions**: Contact the mining technology team

---

**Built with ❤️ for the mining industry** | Showcasing the future of connected mining operations