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
- `frontend/src/data/fleetManagementSystems.ts` - Configuration data for different FMS vendors
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

## Tasks

- [ ] 1.0 Create ISA-95 Integration Visualization System
  - [x] 1.1 Design and implement ISA95Pyramid component with interactive levels 0-5
  - [x] 1.2 Create DataFlowAnimator for particle-based data movement visualization
  - [x] 1.3 Implement data transformation examples at each ISA-95 level
  - [x] 1.4 Add latency metrics display (e.g., "20ms sensor → edge")
  - [x] 1.5 Build protocol transition visualization (OPC UA → REST → Delta Share)
  - [ ] 1.6 Implement "Follow the Data" mode to trace single ore reading through all levels
  - [ ] 1.7 Add tooltips explaining each ISA-95 level in mining context
  - [ ] 1.8 Create bi-directional data flow animations for control commands
  - [ ] 1.9 Implement security boundary highlighting between levels
  - [ ] 1.10 Add data volume metrics display (e.g., "20 scans/second → 1 aggregate/minute")

- [ ] 2.0 Implement Fleet Management System Integration Showcase
  - [ ] 2.1 Create FleetIntegration component with vendor selection (Komatsu, Caterpillar, Wenco)
  - [ ] 2.2 Build real-time truck re-routing visualization based on ore grade
  - [ ] 2.3 Implement API call display showing data formats for each FMS
  - [ ] 2.4 Create performance metrics dashboard (5.9% diversion rates, $3-50M savings)
  - [ ] 2.5 Build OEM-agnostic data translation layer demonstration
  - [ ] 2.6 Implement integration configuration UI for adding new FMS
  - [ ] 2.7 Create real-time equipment status synchronization display
  - [ ] 2.8 Add material classification confidence score visualization
  - [ ] 2.9 Implement shift change data handoff demonstration
  - [ ] 2.10 Create FMS vendor comparison matrix component

- [ ] 3.0 Build Oracle Cloud Integration Demonstration
  - [ ] 3.1 Create OracleConnector component with Autonomous Database visualization
  - [ ] 3.2 Implement ORDS API endpoint demonstrations (/api/ore-grades, /api/equipment)
  - [ ] 3.3 Build Oracle APEX low-code app examples (shift dashboard, maintenance UI)
  - [ ] 3.4 Create OCI Functions visualization for serverless processing
  - [ ] 3.5 Implement Oracle Analytics Cloud dashboard mockups
  - [ ] 3.6 Build data pipeline architecture diagram component
  - [ ] 3.7 Add SQL query examples for common reports
  - [ ] 3.8 Implement role-based access control demonstration
  - [ ] 3.9 Create data retention and archival policy visualization
  - [ ] 3.10 Build Oracle integration troubleshooting guide component

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