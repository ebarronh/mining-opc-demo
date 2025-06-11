# Contributing to MineSensors OPC UA Mining Demo

Thank you for your interest in contributing to this mining technology demonstration project! This guide will help you get started with development and contribution workflows.

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.18.0 (use `nvm use` if you have nvm installed)
- **pnpm** ≥ 8.0.0 (`npm install -g pnpm`)
- **Docker** (optional, for containerized development)
- **Git** for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/mining-opc-demo.git
   cd mining-opc-demo
   ```

2. **Install Dependencies**
   ```bash
   pnpm install  # Installs all workspace dependencies
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment examples
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Adjust values as needed for your development environment
   ```

4. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   pnpm dev
   
   # Or start individually
   pnpm dev:backend   # OPC UA server on :4840, API on :3001
   pnpm dev:frontend  # Next.js on :3000
   ```

## 📁 Project Structure

```
mining-opc-demo/
├── backend/          # Node.js OPC UA server + API
│   ├── src/         # TypeScript source code
│   ├── tests/       # Jest unit tests
│   └── Dockerfile   # Backend container
├── frontend/        # Next.js web application
│   ├── src/app/     # App router pages & components
│   ├── tests/       # React Testing Library tests
│   └── Dockerfile   # Frontend container
├── docs/           # Research & documentation
├── specs/          # Requirements & phase tasks
└── spikes/         # Proof-of-concept code
```

## 🛠️ Development Workflow

### Code Quality Standards

1. **Linting & Formatting**
   ```bash
   pnpm lint          # Check all workspaces
   pnpm lint:fix      # Auto-fix issues
   pnpm format        # Format code with Prettier
   ```

2. **Type Checking**
   ```bash
   pnpm type-check    # TypeScript validation
   ```

3. **Testing**
   ```bash
   pnpm test          # Run all tests
   pnpm test:watch    # Watch mode for active development
   pnpm test:coverage # Generate coverage reports
   ```

4. **Pre-commit Hooks**
   - Husky automatically runs linting and formatting before commits
   - Ensure all code passes quality gates before pushing

### Branch Strategy

- **main**: Production-ready code, protected branch
- **develop**: Integration branch for ongoing development  
- **feature/**: New features (`feature/phase-2-opcua-server`)
- **fix/**: Bug fixes (`fix/websocket-connection-issue`)
- **docs/**: Documentation updates (`docs/add-api-reference`)

### Commit Convention

Use conventional commits for clear history:

```bash
feat: add OPC UA mining equipment simulation
fix: resolve WebSocket connection timeout
docs: update API documentation
test: add integration tests for grade control
refactor: optimize equipment data structures
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development & Testing**
   ```bash
   # Make changes, add tests
   pnpm validate  # Runs lint, type-check, and tests
   ```

3. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: implement your feature"
   git push origin feature/your-feature-name
   ```

4. **Open Pull Request**
   - Target the `develop` branch
   - Include clear description of changes
   - Reference any related issues
   - Ensure CI checks pass

## 🎯 Development Phases

This project follows a phased development approach:

### Phase 1: Research & Skeleton ✅
- Documentation and standards research
- Project scaffolding and basic infrastructure

### Phase 2: OPC UA Server MVP (Current)
- Implement node-opcua server with mining equipment models
- WebSocket bridge for real-time communication

### Phase 3: Frontend Foundations
- Next.js navigation shell
- Basic WebSocket client integration

### Phase 4: Real-time Visualization
- 3D mine visualization with Three.js
- OPC UA Explorer component
- Live data subscription

### Phase 5: Integration & Compliance
- ISA-95 integration flows
- FMS connectivity simulation
- Compliance reporting

### Phase 6: Demo Orchestration
- Scenario player and automation
- Performance monitoring
- Demo recording capabilities

## 🧪 Testing Guidelines

### Backend Testing
```bash
cd backend
pnpm test              # Unit tests with Jest
pnpm test:integration  # OPC UA integration tests (future)
```

### Frontend Testing
```bash
cd frontend
pnpm test              # Component tests with React Testing Library
pnpm test:e2e          # Playwright E2E tests (future)
```

### OPC UA Testing
- Use **UA Expert** for manual server testing
- Endpoint: `opc.tcp://localhost:4840/mining-demo`
- Security: None (demo configuration)

## 🐳 Docker Development

### Local Development
```bash
pnpm docker:build     # Build all containers
pnpm docker:up        # Start services
pnpm docker:logs      # View logs
pnpm docker:down      # Stop services
```

### Demo Mode
```bash
pnpm demo:start       # Complete demo environment
# Visit http://localhost:3000
pnpm demo:stop        # Cleanup
```

## 📚 Mining Domain Knowledge

### OPC UA Concepts
- **Address Space**: Hierarchical information model
- **Nodes**: Variables, objects, methods in the server
- **Subscriptions**: Real-time data change notifications
- **Companion Specifications**: Industry-specific extensions

### Mining Equipment Types
- **Hydraulic Excavators**: Grade sensing, GPS positioning
- **Mining Trucks**: Payload monitoring, route optimization  
- **Conveyors**: Throughput measurement, condition monitoring

### ISA-95 Integration Levels
- **Level 0-1**: Physical processes and instrumentation
- **Level 2**: Control systems (SCADA, DCS)
- **Level 3**: Manufacturing operations (MES)
- **Level 4**: Business planning (ERP)

## 🔧 Troubleshooting

### Common Issues

1. **OPC UA Server Won't Start**
   ```bash
   # Check port availability
   lsof -i :4840
   
   # Verify node-opcua installation
   cd backend && npm list node-opcua
   ```

2. **Frontend Build Errors**
   ```bash
   # Clear Next.js cache
   cd frontend && rm -rf .next
   
   # Reinstall dependencies
   pnpm clean && pnpm install
   ```

3. **WebSocket Connection Issues**
   ```bash
   # Check WebSocket server
   curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:4841
   ```

4. **Docker Issues**
   ```bash
   # Reset Docker environment
   pnpm docker:clean
   pnpm docker:build
   ```

### Development Tools

- **VSCode Settings**: Configured in `.vscode/settings.json`
- **Recommended Extensions**: Listed in `.vscode/extensions.json`
- **Environment Variables**: Examples in `.env.example` files

## 💡 Contributing Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb-inspired configuration
- **Prettier**: Consistent formatting
- **Naming**: camelCase for variables, PascalCase for components

### Documentation
- **API Changes**: Update relevant documentation
- **New Features**: Include usage examples
- **Complex Logic**: Add inline comments explaining mining domain concepts

### Performance
- **OPC UA**: Target <2s latency for data updates
- **Frontend**: Maintain >30 FPS for 3D visualizations
- **Memory**: Monitor for leaks in long-running simulations

## 🤝 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions and ideas
- **Documentation**: Check `docs/` folder for detailed specifications
- **Mining Domain**: Refer to OPC UA Companion Specifications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy coding!** 🚀 Let's build the future of connected mining operations together.