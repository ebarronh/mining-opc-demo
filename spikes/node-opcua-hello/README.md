# Node-OPCUA Hello World Spike

## Overview
This spike demonstrates a minimal OPC UA server using node-opcua that exposes mining equipment variables. It serves as proof-of-concept for the mining demo's backend implementation.

## Features
- OPC UA server running on port 4840
- Mining equipment folder structure
- Hydraulic excavator with realistic variables:
  - **Ore Grade**: Simulated ore grade values (1.5-4.5 g/t)
  - **GPS Location**: Simulated coordinates with small variations
  - **Operational Status**: Rotating status (Operating, Loading, Moving, Maintenance)

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

### Test Connection
1. **Using UA Expert (Recommended)**:
   - Connect to `opc.tcp://localhost:4840/mining-demo`
   - Use Security Policy: `None` (for demo purposes)
   - Browse to `Objects > MiningEquipment > Excavator_001`
   - Subscribe to variables to see live data updates

2. **Using opcua-commander (CLI)**:
   ```bash
   npx opcua-commander -e opc.tcp://localhost:4840/mining-demo
   ```

## Server Output
When running, you'll see:
```
🚀 OPC UA Mining Demo Server is running!
📡 Endpoint: opc.tcp://localhost:4840/mining-demo
📊 Variables exposed:
   - MiningEquipment/Excavator_001/OreGrade (g/t)
   - MiningEquipment/Excavator_001/Location (GPS)
   - MiningEquipment/Excavator_001/OperationalStatus
```

## Technical Details
- **Framework**: node-opcua v2.116.0
- **Security**: None (demo configuration only)
- **Data Updates**: Variables return new values on each read
- **Namespace**: Uses server's own namespace for mining equipment

## Screenshot Instructions
1. Start the server with `npm start`
2. Open UA Expert
3. Add Server: `opc.tcp://localhost:4840/mining-demo`
4. Connect with Security Policy: None
5. Browse to MiningEquipment folder
6. Take screenshot showing the folder structure and variable values

## Next Steps
This spike validates that node-opcua can:
- ✅ Create hierarchical address space for mining equipment
- ✅ Expose variables with realistic mining data
- ✅ Support standard OPC UA client connections
- ✅ Provide foundation for full mining information model

The full backend implementation will extend this pattern with:
- Complete MiningEquipmentType companion specification compliance
- Multiple equipment instances (excavators, trucks, conveyors)
- WebSocket bridge for frontend integration
- Historical data and alarm management