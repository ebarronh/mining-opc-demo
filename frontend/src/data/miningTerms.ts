export interface MiningTerm {
  term: string;
  definition: string;
  category: 'equipment' | 'process' | 'material' | 'measurement' | 'opc-ua' | 'standard';
  relatedTerms?: string[];
}

export const miningTerms: MiningTerm[] = [
  // Equipment Terms
  {
    term: 'Excavator',
    definition: 'Large machine used to dig and move earth, ore, and overburden in mining operations. Modern excavators use hydraulic systems and can weigh up to 1000 tons.',
    category: 'equipment',
    relatedTerms: ['Shovel', 'Dragline', 'Bucket']
  },
  {
    term: 'Haul Truck',
    definition: 'Off-highway dump truck designed to transport large quantities of ore or waste rock. Can carry payloads ranging from 100 to 400 tons.',
    category: 'equipment',
    relatedTerms: ['Dump Truck', 'Mining Truck', 'Payload']
  },
  {
    term: 'Conveyor',
    definition: 'Continuous transport system using a belt to move bulk materials over long distances. More energy-efficient than truck haulage for certain applications.',
    category: 'equipment',
    relatedTerms: ['Belt', 'Transfer Point', 'Throughput']
  },
  
  // Process Terms
  {
    term: 'Grade',
    definition: 'The concentration of valuable mineral or metal in ore, typically expressed as a percentage or grams per ton (g/t). Higher grade means more valuable content.',
    category: 'process',
    relatedTerms: ['Ore Grade', 'Cut-off Grade', 'Average Grade']
  },
  {
    term: 'Ore',
    definition: 'Rock containing valuable minerals in sufficient concentration to be economically extracted and processed.',
    category: 'material',
    relatedTerms: ['Grade', 'Mineral', 'Waste Rock']
  },
  {
    term: 'Overburden',
    definition: 'Layer of soil and rock that must be removed to access ore deposits. Also called waste rock when it contains no valuable minerals.',
    category: 'material',
    relatedTerms: ['Waste Rock', 'Stripping Ratio']
  },
  {
    term: 'Bench',
    definition: 'Horizontal ledge or step in an open-pit mine, typically 10-15 meters high, created by mining in horizontal layers.',
    category: 'process',
    relatedTerms: ['Pit', 'Level', 'Face']
  },
  
  // Measurement Terms
  {
    term: 'Tonnage',
    definition: 'Total weight of material moved or processed, measured in metric tons. Key performance indicator for mining operations.',
    category: 'measurement',
    relatedTerms: ['Throughput', 'Production Rate', 'TPH']
  },
  {
    term: 'TPH',
    definition: 'Tons Per Hour - Standard measurement of material flow rate in mining operations. Critical for equipment sizing and production planning.',
    category: 'measurement',
    relatedTerms: ['Throughput', 'Production Rate', 'Capacity']
  },
  {
    term: 'Payload',
    definition: 'Weight of material carried by a haul truck or other transport equipment in a single trip, excluding the vehicle weight.',
    category: 'measurement',
    relatedTerms: ['Haul Truck', 'Capacity', 'Load']
  },
  
  // OPC UA Terms
  {
    term: 'OPC UA',
    definition: 'Open Platform Communications Unified Architecture - Industrial communication protocol enabling secure, reliable data exchange between devices and systems.',
    category: 'opc-ua',
    relatedTerms: ['Node', 'Server', 'Client', 'Mining Companion']
  },
  {
    term: 'Node',
    definition: 'Basic unit of OPC UA address space representing a data point, object, or method. Each node has a unique identifier (NodeId).',
    category: 'opc-ua',
    relatedTerms: ['NodeId', 'Browse Name', 'Variable']
  },
  {
    term: 'NodeId',
    definition: 'Unique identifier for an OPC UA node within a server. Can be numeric, string, GUID, or opaque format.',
    category: 'opc-ua',
    relatedTerms: ['Node', 'Address Space', 'Namespace']
  },
  {
    term: 'Browse Name',
    definition: 'Human-readable name of an OPC UA node used for navigation. Unlike display names, browse names are unique within their namespace.',
    category: 'opc-ua',
    relatedTerms: ['Node', 'Display Name', 'Path']
  },
  {
    term: 'Subscription',
    definition: 'OPC UA mechanism for clients to receive notifications when monitored data changes, eliminating need for constant polling.',
    category: 'opc-ua',
    relatedTerms: ['Monitoring', 'Notification', 'Publishing Interval']
  },
  
  // Standards Terms
  {
    term: 'Mining Companion',
    definition: 'OPC UA Mining Companion Specification - Industry standard defining common information model for mining equipment and processes.',
    category: 'standard',
    relatedTerms: ['OPC UA', 'Companion Specification', 'Standards']
  },
  {
    term: 'ISA-95',
    definition: 'International standard for enterprise-control system integration, defining 5 levels from field devices (Level 0) to enterprise planning (Level 4).',
    category: 'standard',
    relatedTerms: ['Integration', 'MES', 'ERP', 'Levels']
  },
  {
    term: 'Real-time',
    definition: 'Data or process updates occurring with minimal delay, typically within seconds. Critical for operational decision-making in mining.',
    category: 'process',
    relatedTerms: ['Latency', 'Update Rate', 'Live Data']
  },
  
  // Additional Mining Terms
  {
    term: 'Pit',
    definition: 'Open excavation from which ore and waste rock are extracted. Can be several kilometers wide and hundreds of meters deep.',
    category: 'process',
    relatedTerms: ['Open-pit', 'Mine', 'Bench']
  },
  {
    term: 'Crusher',
    definition: 'Machine that breaks large rocks into smaller pieces as first step in ore processing. Primary crushers handle run-of-mine ore.',
    category: 'equipment',
    relatedTerms: ['Comminution', 'Processing', 'Size Reduction']
  },
  {
    term: 'Telemetry',
    definition: 'Automated remote measurement and data transmission from equipment sensors. Enables real-time monitoring of equipment health and performance.',
    category: 'measurement',
    relatedTerms: ['Sensors', 'Monitoring', 'Data Acquisition']
  }
];

// Helper function to get definition for a term
export function getTermDefinition(term: string): MiningTerm | undefined {
  return miningTerms.find(t => 
    t.term.toLowerCase() === term.toLowerCase()
  );
}

// Helper function to get terms by category
export function getTermsByCategory(category: MiningTerm['category']): MiningTerm[] {
  return miningTerms.filter(t => t.category === category);
}

// Helper function for fuzzy search
export function searchTerms(query: string): MiningTerm[] {
  const lowerQuery = query.toLowerCase();
  return miningTerms.filter(t => 
    t.term.toLowerCase().includes(lowerQuery) ||
    t.definition.toLowerCase().includes(lowerQuery)
  );
}