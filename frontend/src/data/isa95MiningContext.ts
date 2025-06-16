// Mining-specific context and explanations for ISA-95 levels

export interface ISA95MiningContext {
  level: number;
  title: string;
  purpose: string;
  miningExamples: string[];
  keyFunctions: string[];
  typicalEquipment: string[];
  dataTypes: string[];
  challenges: string[];
  businessImpact: string;
  realWorldExample: string;
}

export const ISA95_MINING_CONTEXTS: ISA95MiningContext[] = [
  {
    level: 0,
    title: "Field Level - Physical Mining Operations",
    purpose: "Direct control and monitoring of physical mining equipment and processes",
    miningExamples: [
      "XRF ore analyzers measuring Fe, SiO2, Al2O3 content in real-time",
      "Conveyor belt weighing systems tracking tonnage",
      "Excavator hydraulic pressure monitoring",
      "Truck engine temperature and fuel consumption sensors",
      "Environmental dust and noise monitoring stations"
    ],
    keyFunctions: [
      "Real-time ore grade measurement",
      "Equipment performance monitoring",
      "Safety system interlocks",
      "Environmental compliance tracking",
      "Automated equipment control"
    ],
    typicalEquipment: [
      "XRF analyzers",
      "PLCs (Programmable Logic Controllers)",
      "SCADA sensors",
      "GPS tracking systems",
      "Environmental monitoring stations"
    ],
    dataTypes: [
      "Sensor readings (temperature, pressure, flow)",
      "GPS coordinates and equipment position",
      "Ore grade measurements",
      "Equipment status and alarms",
      "Environmental conditions"
    ],
    challenges: [
      "Harsh mining environment (dust, vibration, extreme temperatures)",
      "Need for explosion-proof equipment in underground mines",
      "Real-time data collection from moving equipment",
      "Wireless communication in remote locations"
    ],
    businessImpact: "Directly affects production efficiency, safety compliance, and ore quality control",
    realWorldExample: "An XRF analyzer on a conveyor belt scans ore every 30 seconds, instantly identifying high-grade material that should be sent to premium stockpiles rather than waste dumps, potentially saving millions in revenue."
  },
  {
    level: 1,
    title: "Control Level - Automated Mining Systems",
    purpose: "Automated control loops and safety systems that manage mining operations",
    miningExamples: [
      "Automated truck dispatch systems routing vehicles based on ore grades",
      "Conveyor belt speed control based on material flow",
      "Crusher feed rate optimization",
      "Water spray systems for dust suppression",
      "Emergency shutdown systems for equipment safety"
    ],
    keyFunctions: [
      "Automated equipment dispatch and routing",
      "Process control optimization",
      "Safety interlock management",
      "Quality control decisions",
      "Equipment coordination"
    ],
    typicalEquipment: [
      "Distributed Control Systems (DCS)",
      "Safety Instrumented Systems (SIS)",
      "Motor control centers",
      "Variable frequency drives",
      "Emergency stop systems"
    ],
    dataTypes: [
      "Control commands and setpoints",
      "Safety interlocks and alarms",
      "Process variables (speed, flow, pressure)",
      "Equipment coordination signals",
      "Quality control decisions"
    ],
    challenges: [
      "Coordinating multiple autonomous systems",
      "Ensuring safety in automated operations",
      "Managing complex interdependencies",
      "Maintaining performance during equipment failures"
    ],
    businessImpact: "Optimizes production throughput while ensuring safety and quality standards",
    realWorldExample: "When ore grade sensors detect high-value material, the control system automatically routes trucks to specific stockpiles and adjusts crusher settings to maximize recovery, increasing plant efficiency by 15-20%."
  },
  {
    level: 2,
    title: "Supervision Level - Operations Control Center",
    purpose: "Human-machine interface for monitoring and supervising mining operations",
    miningExamples: [
      "Control room displays showing pit operations in real-time",
      "Operator interfaces for adjusting mining parameters",
      "Alarm management systems for safety and process alerts",
      "Historical trend displays for production analysis",
      "Equipment status dashboards for maintenance planning"
    ],
    keyFunctions: [
      "Real-time process monitoring",
      "Operator decision support",
      "Alarm and event management",
      "Historical data analysis",
      "Manual intervention capabilities"
    ],
    typicalEquipment: [
      "SCADA systems",
      "Human Machine Interfaces (HMI)",
      "Operator workstations",
      "Large display screens",
      "Alarm management systems"
    ],
    dataTypes: [
      "Process graphics and trends",
      "Alarm logs and operator actions",
      "Production reports and KPIs",
      "Equipment status summaries",
      "Shift handover information"
    ],
    challenges: [
      "Information overload from multiple systems",
      "Effective alarm management",
      "Operator training and competency",
      "Shift continuity and communication"
    ],
    businessImpact: "Enables informed decision-making and rapid response to operational issues",
    realWorldExample: "Control room operators monitor a dashboard showing 50+ pieces of equipment across a 5km² pit, receiving alerts when ore grades change or equipment needs attention, allowing them to optimize production in real-time and prevent costly downtime."
  },
  {
    level: 3,
    title: "MES Level - Mine Execution Systems",
    purpose: "Production planning, scheduling, and execution management for mining operations",
    miningExamples: [
      "Short-term mine planning (weekly/monthly production schedules)",
      "Equipment maintenance scheduling and work orders",
      "Quality control and ore classification systems",
      "Inventory management for ore stockpiles",
      "Production tracking against targets and budgets"
    ],
    keyFunctions: [
      "Production scheduling and planning",
      "Work order management",
      "Quality management",
      "Inventory tracking",
      "Performance analysis"
    ],
    typicalEquipment: [
      "Manufacturing Execution Systems",
      "Computerized Maintenance Management Systems (CMMS)",
      "Laboratory Information Management Systems (LIMS)",
      "Inventory management systems",
      "Production planning software"
    ],
    dataTypes: [
      "Production schedules and work orders",
      "Quality test results and certifications",
      "Inventory levels and movements",
      "Equipment maintenance records",
      "Performance metrics and KPIs"
    ],
    challenges: [
      "Balancing production targets with equipment availability",
      "Managing complex supply chains and logistics",
      "Integrating quality data with production planning",
      "Coordinating with external contractors and suppliers"
    ],
    businessImpact: "Optimizes resource utilization and ensures production targets are met efficiently",
    realWorldExample: "The MES system schedules maintenance during planned downtime, coordinates ore blending to meet customer specifications, and tracks production against monthly targets, improving overall equipment effectiveness by 10-15%."
  },
  {
    level: 4,
    title: "ERP Level - Business Management Systems",
    purpose: "Enterprise resource planning and business process management for mining operations",
    miningExamples: [
      "Financial planning and cost accounting for mining operations",
      "Procurement of equipment, parts, and consumables",
      "Human resources management and workforce planning",
      "Regulatory compliance and environmental reporting",
      "Customer relationship management and sales contracts"
    ],
    keyFunctions: [
      "Financial management and accounting",
      "Procurement and supply chain management",
      "Human resources and payroll",
      "Regulatory compliance",
      "Customer and contract management"
    ],
    typicalEquipment: [
      "Enterprise Resource Planning (ERP) systems",
      "Financial management systems",
      "Human resources information systems",
      "Document management systems",
      "Compliance tracking systems"
    ],
    dataTypes: [
      "Financial transactions and budgets",
      "Purchase orders and contracts",
      "Employee records and payroll",
      "Regulatory reports and permits",
      "Customer orders and shipments"
    ],
    challenges: [
      "Integrating operational data with business systems",
      "Managing global compliance requirements",
      "Long-term planning in volatile markets",
      "Balancing operational efficiency with regulatory compliance"
    ],
    businessImpact: "Ensures profitability, compliance, and sustainable business operations",
    realWorldExample: "When production data shows higher-than-expected ore grades, the ERP system automatically adjusts revenue forecasts, triggers procurement of additional crushing equipment, and updates customer delivery schedules, improving cash flow by millions."
  },
  {
    level: 5,
    title: "Business Intelligence - Strategic Decision Making",
    purpose: "Executive reporting, strategic planning, and business intelligence for mining enterprises",
    miningExamples: [
      "Executive dashboards for mine performance across multiple sites",
      "Predictive analytics for equipment maintenance and replacement",
      "Market analysis and commodity price forecasting",
      "Strategic mine planning and resource allocation",
      "Environmental, social, and governance (ESG) reporting"
    ],
    keyFunctions: [
      "Executive reporting and KPIs",
      "Predictive analytics and forecasting",
      "Strategic planning support",
      "Market intelligence",
      "ESG and sustainability reporting"
    ],
    typicalEquipment: [
      "Business Intelligence platforms",
      "Data warehouses and lakes",
      "Analytics and visualization tools",
      "Machine learning platforms",
      "Executive information systems"
    ],
    dataTypes: [
      "KPI dashboards and scorecards",
      "Predictive models and forecasts",
      "Market data and commodity prices",
      "Strategic plans and budgets",
      "ESG metrics and sustainability reports"
    ],
    challenges: [
      "Aggregating data from multiple mines and systems",
      "Providing actionable insights from complex data",
      "Long-term strategic planning with market uncertainty",
      "Balancing financial performance with sustainability goals"
    ],
    businessImpact: "Enables strategic decision-making that determines long-term competitiveness and sustainability",
    realWorldExample: "BI analytics predict that equipment maintenance costs will increase 30% next year based on aging fleet data, prompting executives to approve a $50M equipment replacement program that will reduce operating costs by $15M annually."
  }
];

export const getMiningContextForLevel = (level: number): ISA95MiningContext | undefined => {
  return ISA95_MINING_CONTEXTS.find(context => context.level === level);
};