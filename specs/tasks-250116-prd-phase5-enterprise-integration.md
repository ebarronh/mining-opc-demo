## Relevant Files

- `frontend/src/app/integration/page.tsx` - Main integration hub page showcasing all Phase 5 features
- `frontend/src/app/integration/layout.tsx` - Layout wrapper for integration pages with navigation
- `frontend/src/components/integration/ISA95Pyramid.tsx` - Interactive ISA-95 pyramid visualization with data flow animation
- `frontend/src/components/integration/ISA95Pyramid.test.tsx` - Unit tests for ISA95Pyramid component
- `frontend/src/components/integration/DataFlowAnimator.tsx` - Particle-based animation system for showing data movement
- `frontend/src/components/integration/DataTransformationExamples.tsx` - Data transformation examples at each ISA-95 level
- `frontend/src/components/integration/DataTransformationExamples.test.tsx` - Unit tests for DataTransformationExamples component
- `frontend/src/components/integration/LatencyMetrics.tsx` - Detailed latency metrics display across ISA-95 levels
- `frontend/src/components/integration/LatencyMetrics.test.tsx` - Unit tests for LatencyMetrics component
- `frontend/src/components/integration/ProtocolTransition.tsx` - Protocol transition visualization (OPC UA → REST → Delta Share)
- `frontend/src/components/integration/ProtocolTransition.test.tsx` - Unit tests for ProtocolTransition component
- `frontend/src/components/integration/FollowTheData.tsx` - Interactive data tracing through all ISA-95 levels
- `frontend/src/components/integration/FollowTheData.test.tsx` - Unit tests for FollowTheData component
- `frontend/src/components/ui/Tooltip.tsx` - Reusable tooltip component with positioning and animation
- `frontend/src/components/ui/Tooltip.test.tsx` - Unit tests for Tooltip component
- `frontend/src/components/integration/ISA95LevelTooltip.tsx` - Specialized tooltip for ISA-95 level explanations
- `frontend/src/components/integration/ISA95LevelTooltip.test.tsx` - Unit tests for ISA95LevelTooltip component
- `frontend/src/data/isa95MiningContext.ts` - Comprehensive mining context data for each ISA-95 level
- `frontend/src/components/integration/SecurityBoundaryHighlight.tsx` - Security boundary highlighting and analysis component
- `frontend/src/components/integration/SecurityBoundaryHighlight.test.tsx` - Unit tests for SecurityBoundaryHighlight component
- `frontend/src/components/integration/BiDirectionalFlow.tsx` - Bi-directional data flow animations for control commands
- `frontend/src/components/integration/BiDirectionalFlow.test.tsx` - Unit tests for BiDirectionalFlow component
- `frontend/src/components/integration/DataVolumeMetrics.tsx` - Data volume transformation and compression metrics display
- `frontend/src/components/integration/DataVolumeMetrics.test.tsx` - Unit tests for DataVolumeMetrics component
- `frontend/src/components/integration/FleetIntegration.tsx` - Fleet management system integration showcase
- `frontend/src/components/integration/FleetIntegration.test.tsx` - Unit tests for FleetIntegration component
- `frontend/src/components/integration/OracleConnector.tsx` - Oracle cloud integration demonstration
- `frontend/src/components/integration/DeltaShareExplorer.tsx` - Delta Share protocol implementation UI
- `frontend/src/components/integration/ERPIntegration.tsx` - ERP integration scenarios and workflows
- `frontend/src/components/integration/EdgeComputing.tsx` - Edge computing architecture demonstration
- `frontend/src/components/integration/AnalyticsDashboard.tsx` - Business intelligence and analytics dashboards
- `frontend/src/components/integration/APIPlayground.tsx` - Interactive API explorer with try-it-now functionality
- `frontend/src/components/integration/APIPlayground.test.tsx` - Unit tests for APIPlayground component
- `frontend/src/components/middleware/TransformationPipeline.tsx` - Visual data transformation pipeline
- `frontend/src/components/middleware/ProtocolTranslator.tsx` - Protocol conversion demonstration
- `frontend/src/components/education/IntegrationPatterns.tsx` - Integration pattern library and examples
- `frontend/src/components/education/TroubleshootingGuide.tsx` - Interactive troubleshooting scenarios
- `frontend/src/hooks/useIntegrationData.ts` - Hook for managing integration demonstration data
- `frontend/src/hooks/useDataFlow.ts` - Hook for animating data flow between systems
- `frontend/src/hooks/useIntegrationSimulator.ts` - Hook for simulating integration scenarios
- `frontend/src/types/integration.ts` - TypeScript types for integration components
- `frontend/src/data/integrationPatterns.ts` - Static data for integration patterns and examples
- `frontend/src/data/fleetManagementSystems.ts` - Configuration data for different FMS vendors (CREATED)
- `frontend/src/components/integration/FleetIntegration.tsx` - Main fleet management integration component with vendor selection (CREATED)
- `frontend/src/components/integration/FleetIntegration.test.tsx` - Unit tests for FleetIntegration component (CREATED)
- `frontend/src/components/integration/TruckReroutingVisualization.tsx` - Real-time truck re-routing visualization with canvas-based mine map (CREATED)
- `frontend/src/components/integration/TruckReroutingVisualization.test.tsx` - Unit tests for TruckReroutingVisualization component (CREATED)
- `frontend/src/components/integration/APICallDisplay.tsx` - Interactive API call display with vendor-specific request/response formats (CREATED)
- `frontend/src/components/integration/APICallDisplay.test.tsx` - Unit tests for APICallDisplay component (CREATED)
- `frontend/src/components/integration/PerformanceMetricsDashboard.tsx` - Comprehensive performance metrics dashboard with ROI analysis (CREATED)
- `frontend/src/components/integration/PerformanceMetricsDashboard.test.tsx` - Unit tests for PerformanceMetricsDashboard component (CREATED)
- `frontend/src/components/integration/DataTranslationLayer.tsx` - OEM-agnostic data translation layer with field mapping visualization (CREATED)
- `frontend/src/components/integration/DataTranslationLayer.test.tsx` - Unit tests for DataTranslationLayer component (CREATED)
- `frontend/src/components/integration/FMSConfigurationUI.tsx` - Integration configuration UI for adding new FMS systems (CREATED)
- `frontend/src/components/integration/FMSConfigurationUI.test.tsx` - Unit tests for FMSConfigurationUI component (CREATED)
- `frontend/src/components/integration/EquipmentStatusSync.tsx` - Real-time equipment status synchronization display (CREATED)
- `frontend/src/components/integration/EquipmentStatusSync.test.tsx` - Unit tests for EquipmentStatusSync component (CREATED)
- `frontend/src/components/integration/MaterialClassificationConfidence.tsx` - Material classification confidence score visualization (CREATED)
- `frontend/src/components/integration/MaterialClassificationConfidence.test.tsx` - Unit tests for MaterialClassificationConfidence component (CREATED)
- `frontend/src/components/integration/ShiftChangeHandoff.tsx` - Shift change data handoff demonstration (CREATED)
- `frontend/src/components/integration/ShiftChangeHandoff.test.tsx` - Unit tests for ShiftChangeHandoff component (CREATED)
- `frontend/src/components/integration/FMSVendorComparison.tsx` - FMS vendor comparison matrix component (CREATED)
- `frontend/src/components/integration/FMSVendorComparison.test.tsx` - Unit tests for FMSVendorComparison component (CREATED)
- `frontend/src/utils/dataTransformers.ts` - Utility functions for data transformation examples
- `backend/src/routes/integration.ts` - Backend API routes for integration endpoints
- `backend/src/routes/integration.test.ts` - Unit tests for integration API routes
- `backend/src/services/integrationSimulator.ts` - Service for simulating integration data flows
- `backend/src/services/oracleSimulator.ts` - Mock Oracle cloud service responses
- `backend/src/services/deltaShareSimulator.ts` - Delta Share protocol simulation
- `backend/src/services/erpSimulator.ts` - ERP system response simulation
- `backend/src/types/integration.ts` - Backend TypeScript types for integration

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

### Validation Requirements

- **All completed tasks must be validated using Playwright MCP browser tools**
- Use `mcp__playwright__browser_navigate` to navigate to relevant pages
- Use `mcp__playwright__browser_take_screenshot` to capture validation evidence
- Use `mcp__playwright__browser_click` and other interaction tools to test functionality
- Take screenshots of key features and save them for documentation
- Validate that all components render correctly and interactions work as expected
- **Replacement for Puppeteer**: All previous Puppeteer validation scripts should now use Playwright MCP tools instead

## Tasks

- [x] 1.0 Create ISA-95 Integration Visualization System
  - [x] 1.1 Design and implement ISA95Pyramid component with interactive levels 0-5
  - [x] 1.2 Create DataFlowAnimator for particle-based data movement visualization
  - [x] 1.3 Implement data transformation examples at each ISA-95 level
  - [x] 1.4 Add latency metrics display (e.g., "20ms sensor → edge")
  - [x] 1.5 Build protocol transition visualization (OPC UA → REST → Delta Share)
  - [x] 1.6 Implement "Follow the Data" mode to trace single ore reading through all levels
  - [x] 1.7 Add tooltips explaining each ISA-95 level in mining context
  - [x] 1.8 Create bi-directional data flow animations for control commands
  - [x] 1.9 Implement security boundary highlighting between levels
  - [x] 1.10 Add data volume metrics display (e.g., "20 scans/second → 1 aggregate/minute")
  
  **Validation (Playwright MCP)**: Navigate to `/integration`, verify ISA-95 pyramid displays all 6 levels, test interactive tooltips, confirm data flow animations, validate security boundary highlighting, and verify data volume metrics visualization. Take screenshots of: complete integration hub page, ISA-95 pyramid with tooltips, security boundaries, and data volume metrics.

- [x] 2.0 Implement Fleet Management System Integration Showcase
  - [x] 2.1 Create FleetIntegration component with vendor selection (Komatsu, Caterpillar, Wenco)
  - [x] 2.2 Build real-time truck re-routing visualization based on ore grade
  - [x] 2.3 Implement API call display showing data formats for each FMS
  - [x] 2.4 Create performance metrics dashboard (5.9% diversion rates, $3-50M savings)
  - [x] 2.5 Build OEM-agnostic data translation layer demonstration
  - [x] 2.6 Implement integration configuration UI for adding new FMS
  - [x] 2.7 Create real-time equipment status synchronization display
  - [x] 2.8 Add material classification confidence score visualization
  - [x] 2.9 Implement shift change data handoff demonstration
  - [x] 2.10 Create FMS vendor comparison matrix component
  
  **Validation (Playwright MCP)**: Navigate to fleet management section, test vendor selection (Komatsu, Caterpillar, Wenco), verify truck re-routing visualization, validate API call displays, test performance metrics dashboard, and confirm configuration UI functionality. Screenshots required for each major component.

- [x] 3.0 Build Oracle Cloud Integration Demonstration
  - [x] 3.1 Create OracleConnector component with Autonomous Database visualization
  - [x] 3.2 Implement ORDS API endpoint demonstrations (/api/ore-grades, /api/equipment)
  - [x] 3.3 Build Oracle APEX low-code app examples (shift dashboard, maintenance UI)
  - [x] 3.4 Create OCI Functions visualization for serverless processing
  - [x] 3.5 Implement Oracle Analytics Cloud dashboard mockups
  - [x] 3.6 Build data pipeline architecture diagram component
  - [x] 3.7 Add SQL query examples for common reports
  - [x] 3.8 Implement role-based access control demonstration
  - [x] 3.9 Create data retention and archival policy visualization
  - [x] 3.10 Build Oracle integration troubleshooting guide component
  
  **Validation (Playwright MCP)**: Navigate to Oracle Cloud section, test Autonomous Database visualization, verify ORDS API demonstrations, validate APEX low-code examples, test OCI Functions visualization, and confirm Analytics Cloud dashboard mockups. Screenshots of database connections, API responses, and dashboard examples.

- [ ] 4.0 Develop Delta Share Protocol Implementation
  - [ ] 4.1 Create DeltaShareExplorer component with provider/recipient setup
  - [ ] 4.2 Implement dataset browser (ore grades, equipment metrics, production)
  - [ ] 4.3 Build cross-platform access examples (Python, Spark, Tableau, Power BI)
  - [ ] 4.4 Create data governance dashboard with audit logs and usage tracking
  - [ ] 4.5 Implement performance benefits visualization (zero data movement)
  - [ ] 4.6 Add incremental data update demonstration
  - [ ] 4.7 Build row/column level security configuration UI
  - [ ] 4.8 Create share expiration management interface
  - [ ] 4.9 Implement cost savings calculator for reduced egress
  - [ ] 4.10 Build recipient onboarding workflow component
  
  **Validation (Playwright MCP)**: Navigate to Delta Share section, test provider/recipient setup, verify dataset browser functionality, validate cross-platform access examples, test data governance dashboard, and confirm security configuration UI. Screenshots of data sharing workflows and governance features.

- [ ] 5.0 Create ERP Integration Scenarios and Edge Computing Demo
  - [ ] 5.1 Build ERPIntegration component with maintenance scheduling workflow
  - [ ] 5.2 Implement ore inventory management visualization
  - [ ] 5.3 Create cost allocation workflow demonstrations
  - [ ] 5.4 Build multi-ERP connector showcase (SAP, Oracle, Dynamics)
  - [ ] 5.5 Implement financial metrics dashboard (cost/ton, ROI, payback)
  - [ ] 5.6 Create EdgeComputing component with processing architecture
  - [ ] 5.7 Build resilience scenario simulations (network disconnect, buffering)
  - [ ] 5.8 Implement environmental challenge visualizations (dust, vibration, temperature)
  - [ ] 5.9 Create failover pattern demonstrations with <5 second recovery
  - [ ] 5.10 Build edge analytics dashboard with ML inference examples
  
  **Validation (Playwright MCP)**: Navigate to ERP and Edge Computing sections, test maintenance scheduling workflows, verify ore inventory management, validate cost allocation workflows, test multi-ERP connectors, verify edge computing architecture, and confirm resilience scenarios. Screenshots of ERP integrations and edge computing demonstrations.

- [ ] 6.0 Build Analytics Dashboard and API Playground
  - [ ] 6.1 Create AnalyticsDashboard with predictive analytics (XGBoost model)
  - [ ] 6.2 Implement contamination reduction analysis with heatmaps
  - [ ] 6.3 Build equipment optimization insights dashboard
  - [ ] 6.4 Create real-time KPI displays (tons/hour, recovery %, utilization)
  - [ ] 6.5 Implement "what-if" analysis scenarios with impact modeling
  - [ ] 6.6 Build APIPlayground component with interactive endpoint testing
  - [ ] 6.7 Create API integration pattern demonstrations (REST, WebSocket, webhooks)
  - [ ] 6.8 Implement error handling examples with retry strategies
  - [ ] 6.9 Build SDK code examples for multiple languages
  - [ ] 6.10 Create API performance benchmarks and rate limiting display
  
  **Validation (Playwright MCP)**: Navigate to Analytics and API sections, test predictive analytics dashboard, verify contamination reduction analysis, validate equipment optimization insights, test real-time KPI displays, verify API playground functionality, and confirm performance benchmarks. Screenshots of analytics dashboards and API testing interfaces.

- [ ] 7.0 Implement Educational Features and Integration Patterns
  - [ ] 7.1 Create IntegrationPatterns library with visual examples
  - [ ] 7.2 Build TransformationPipeline component for middleware visualization
  - [ ] 7.3 Implement TroubleshootingGuide with interactive scenarios
  - [ ] 7.4 Create architecture decision records component
  - [ ] 7.5 Build integration testing strategy demonstrations
  - [ ] 7.6 Implement monitoring best practices visualization
  - [ ] 7.7 Create security considerations guide with examples
  - [ ] 7.8 Build compliance mapping visualizations
  - [ ] 7.9 Implement cost optimization tips component
  - [ ] 7.10 Create learning progress tracker with localStorage persistence
  
  **Validation (Playwright MCP)**: Navigate to Educational sections, test integration patterns library, verify transformation pipeline visualization, validate troubleshooting guide interactivity, test architecture decision records, verify monitoring best practices, and confirm learning progress tracking. Screenshots of educational components and user progress.