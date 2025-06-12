# MineSensors OPC UA Mining Demo - Development Scripts

This directory contains development utility scripts to streamline the development workflow for the MineSensors OPC UA Mining Demo project.

## Available Scripts

### 🔧 `dev-setup.js` - Development Environment Setup
Automates the complete development environment setup process.

**Usage:**
```bash
pnpm setup
# or
node scripts/dev-setup.js
```

**Features:**
- Checks Node.js version (requires 18+)
- Installs pnpm if not present
- Creates necessary directories
- Sets up environment files (.env.local, .env)
- Installs all project dependencies
- Makes scripts executable
- Provides comprehensive setup guidance

**Use Case:** First-time setup or resetting development environment

---

### 🏥 `health-check.js` - Service Health Monitor
Validates that all services are running correctly and accessible.

**Usage:**
```bash
pnpm health
# or
node scripts/health-check.js
```

**Checks:**
- Frontend server (http://localhost:3000)
- Backend server (http://localhost:3001)
- Backend health API (http://localhost:3001/api/health)
- WebSocket endpoint (ws://localhost:4841/ws)

**Status Indicators:**
- ✅ **Healthy**: Service running and responsive
- ⚠️ **Unhealthy**: Service reachable but has issues
- ❌ **Offline**: Service not responding or connection refused

**Use Case:** Debugging connection issues, verifying services before development

---

### 📊 `project-stats.js` - Project Analytics
Provides comprehensive insights into codebase structure, progress, and health.

**Usage:**
```bash
pnpm stats
# or
node scripts/project-stats.js
```

**Analytics:**
- **File Statistics**: Total files and lines by type
- **Component Analysis**: React components, pages, hooks count
- **Phase Progress**: Completion status and progress tracking
- **Code Quality**: TypeScript coverage, component ratio
- **Project Health**: Missing files, recommendations

**Use Case:** Project overview, progress tracking, code quality assessment

## Integration with Package.json

All scripts are integrated into the main package.json scripts for easy access:

```json
{
  "scripts": {
    "setup": "node scripts/dev-setup.js",
    "health": "node scripts/health-check.js", 
    "stats": "node scripts/project-stats.js"
  }
}
```

## Common Workflows

### 🚀 First Time Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd mining-opc-demo

# 2. Run automated setup
pnpm setup

# 3. Start development
pnpm dev

# 4. Verify everything works
pnpm health
```

### 🔄 Daily Development
```bash
# Start development servers
pnpm dev

# Check service health
pnpm health

# Validate Phase 3 implementation
pnpm validate:phase3

# View project statistics
pnpm stats
```

### 🐛 Troubleshooting
```bash
# Check what's not working
pnpm health

# View detailed project status
pnpm stats

# Reset environment if needed
pnpm setup
```

## Development Dependencies

The scripts require the following dependencies:
- **Node.js**: 18+ (checked automatically)
- **pnpm**: 8+ (installed automatically if missing)
- **ws**: WebSocket client for connection testing

## Architecture Integration

These scripts are designed to work with the Phase 3 architecture:

- **Frontend**: Next.js 15 with Tailwind CSS and Radix UI
- **Backend**: Node.js OPC UA server (Phase 2)
- **WebSocket**: Real-time data streaming foundation
- **Validation**: Puppeteer automated testing

## Script Output Examples

### Health Check Success
```
🏥 MineSensors OPC UA Mining Demo - Health Check
============================================================

📊 Service Status:

✅ Frontend        HEALTHY    http://localhost:3000
✅ Backend         HEALTHY    http://localhost:3001
✅ Backendhealth   HEALTHY    http://localhost:3001/api/health
✅ Websocket       HEALTHY    ws://localhost:4841/ws

🎉 All services are healthy and ready for development!
```

### Project Statistics Output
```
📊 MineSensors OPC UA Mining Demo - Project Statistics
======================================================================

📁 File Statistics:
   Total files: 40
   Total lines: 8,214

📋 Files by Type:
   .tsx    12 files ( 1,732 lines)
   .ts     11 files ( 2,051 lines)
   .js      9 files ( 1,712 lines)

⚛️  Component Statistics:
   React Components: 11
   Pages: 5
   Custom Hooks: 2

🚀 Phase Progress:
   ✅ Phase 3: Frontend Foundations
```

## Best Practices

1. **Run health checks** before starting development
2. **Use setup script** for environment consistency
3. **Monitor project stats** to track progress
4. **Integrate into CI/CD** for automated monitoring
5. **Run scripts frequently** during development

## Troubleshooting Scripts

### Script Won't Execute
```bash
# Make sure script is executable
chmod +x scripts/dev-setup.js

# Run with node directly
node scripts/dev-setup.js
```

### Permission Issues
```bash
# Fix script permissions
chmod +x scripts/*.js

# Or run with explicit node
node scripts/health-check.js
```

### Missing Dependencies
```bash
# Install missing dependencies
pnpm install

# Or run setup to fix everything
pnpm setup
```

## Contributing

When adding new scripts:
1. Follow the existing naming convention
2. Include comprehensive error handling
3. Add logging with appropriate emoji prefixes
4. Update package.json scripts section
5. Document in this README
6. Make executable with `chmod +x`

## Future Enhancements

Planned script improvements:
- **Performance monitoring**: Track build times, bundle sizes
- **Dependency analysis**: Check for updates, security issues  
- **Test automation**: Automated testing workflows
- **Deployment helpers**: Production deployment scripts
- **Database tools**: Schema management, migrations