export interface MiningTerm {
  term: string;
  definition: string;
  category: 'equipment' | 'process' | 'measurement' | 'safety' | 'geology' | 'technology';
  relatedTerms?: string[];
  example?: string;
  unit?: string;
}

export const miningTerms: Record<string, MiningTerm> = {
  // Equipment Terms
  'excavator': {
    term: 'Excavator',
    definition: 'Heavy equipment used for digging and loading material in mining operations. Typically equipped with a bucket capacity of 20-80 tonnes.',
    category: 'equipment',
    relatedTerms: ['bucket', 'boom', 'hydraulic'],
    example: 'The Komatsu PC8000 excavator can move up to 42 cubic meters per pass.'
  },
  'haul truck': {
    term: 'Haul Truck',
    definition: 'Large dump truck designed to transport materials in off-road mining environments. Ultra-class trucks can carry 220-400 tonnes.',
    category: 'equipment',
    relatedTerms: ['payload', 'dump body', 'CAT 797'],
    example: 'CAT 797F haul trucks have a payload capacity of 363 tonnes.'
  },
  'conveyor': {
    term: 'Conveyor',
    definition: 'Continuous transport system using belts to move ore and waste material efficiently over long distances.',
    category: 'equipment',
    relatedTerms: ['belt', 'throughput', 'material handling'],
    example: 'Our main conveyor system moves 5,000 tonnes per hour to the processing plant.'
  },
  
  // Measurement Terms
  'grade': {
    term: 'Grade',
    definition: 'The concentration of valuable minerals or metals in ore, representing actual metal content per unit weight. NOT a probability - this is the real percentage of valuable material in the rock.',
    category: 'measurement',
    relatedTerms: ['ore grade', 'cut-off grade', 'average grade', 'high grade ore', 'mining economics'],
    example: '2.5% copper grade means 25 kg of copper per tonne of rock. At scale, this generates millions in daily revenue.',
    unit: '% or g/t (grams per tonne)'
  },
  'cutoff': {
    term: 'Cutoff Grade',
    definition: 'The minimum ore grade required for economically viable extraction. Below this threshold, material is classified as waste but often stockpiled for future processing.',
    category: 'measurement',
    relatedTerms: ['break-even', 'economic limit', 'marginal ore', 'waste', 'stockpile'],
    example: 'Copper mines typically use 0.2-0.4% cutoff. Gold mines often use 0.3-0.5 g/t cutoff grades.',
    unit: '% or g/t'
  },
  'high grade ore': {
    term: 'High Grade Ore',
    definition: 'Ore with metal concentrations significantly above average, representing premium value. Priorities for immediate processing and generates highest profit margins.',
    category: 'geology',
    relatedTerms: ['grade', 'premium ore', 'direct shipping ore', 'mill feed'],
    example: 'High grade copper ore (>2% Cu) or gold ore (>5 g/t Au) commands immediate extraction and processing.',
    unit: 'Varies by metal'
  },
  'mining economics': {
    term: 'Mining Economics',
    definition: 'The financial principles governing mining operations. Even seemingly low grades (1-3%) generate massive profits due to the enormous scale of mining operations.',
    category: 'process',
    relatedTerms: ['grade', 'throughput', 'economies of scale', 'revenue optimization'],
    example: 'A mine processing 100,000 tonnes daily at 1% copper grade produces 1,000 tonnes of copper worth ~$8 million per day.',
    unit: 'Revenue per tonne'
  },
  'blending': {
    term: 'Ore Blending',
    definition: 'Strategic mixing of different grade ores to optimize mill feed quality and maximize recovery. Balances high and low grade materials for consistent processing.',
    category: 'process',
    relatedTerms: ['grade control', 'mill feed', 'optimization', 'stockpile management'],
    example: 'Blending 60% high-grade (3% Cu) with 40% medium-grade (1% Cu) creates optimal 2.2% mill feed.',
    unit: 'Grade percentage'
  },
  'waste rock': {
    term: 'Waste Rock',
    definition: 'Material below cutoff grade that is mined but not immediately processed. Often stockpiled as it may become economically viable if metal prices rise or technology improves.',
    category: 'process',
    relatedTerms: ['cutoff grade', 'stockpile', 'future ore', 'dump'],
    example: 'Copper ore below 0.3% is classified as waste but stockpiled - it could become profitable if copper prices double.',
    unit: 'Tonnes'
  },
  'payload': {
    term: 'Payload',
    definition: 'The weight of material that can be carried by mining equipment, particularly haul trucks.',
    category: 'measurement',
    relatedTerms: ['capacity', 'tonnage', 'load'],
    example: 'The truck is carrying 85% of its rated payload capacity.',
    unit: 'tonnes'
  },
  'tonnage': {
    term: 'Tonnage',
    definition: 'The amount of material processed or moved, typically measured in tonnes per hour (t/h) or tonnes per day.',
    category: 'measurement',
    relatedTerms: ['throughput', 'production rate', 'capacity'],
    example: 'The mill processes 50,000 tonnes per day.',
    unit: 't/h or tpd'
  },
  
  // Geology Terms
  'ore': {
    term: 'Ore',
    definition: 'Rock containing valuable minerals in concentrations that make extraction economically viable.',
    category: 'geology',
    relatedTerms: ['grade', 'mineralization', 'deposit'],
    example: 'High-grade gold ore contains more than 8 g/t Au.'
  },
  'overburden': {
    term: 'Overburden',
    definition: 'Waste rock and soil that lies above an ore deposit and must be removed to access the ore.',
    category: 'geology',
    relatedTerms: ['stripping ratio', 'waste', 'topsoil'],
    example: 'We need to remove 3 tonnes of overburden for every tonne of ore.'
  },
  'bench': {
    term: 'Bench',
    definition: 'A horizontal ledge in an open pit mine that forms a single level of operation.',
    category: 'geology',
    relatedTerms: ['pit', 'level', 'face'],
    example: 'Each bench is typically 10-15 meters high in large open pit mines.'
  },
  
  // Process Terms
  'blasting': {
    term: 'Blasting',
    definition: 'The controlled use of explosives to break rock for excavation.',
    category: 'process',
    relatedTerms: ['drilling', 'fragmentation', 'explosive'],
    example: 'Blasting occurs twice daily at 7 AM and 3 PM.'
  },
  'crushing': {
    term: 'Crushing',
    definition: 'The process of reducing large rocks into smaller pieces for further processing.',
    category: 'process',
    relatedTerms: ['primary crusher', 'grinding', 'comminution'],
    example: 'Primary crushing reduces ore from 1.5m to 30cm pieces.'
  },
  'leaching': {
    term: 'Leaching',
    definition: 'Chemical process to extract valuable metals from ore using solutions.',
    category: 'process',
    relatedTerms: ['heap leach', 'cyanide', 'recovery'],
    example: 'Heap leaching can recover 70% of gold from low-grade ore.'
  },
  
  // Technology Terms
  'opc ua': {
    term: 'OPC UA',
    definition: 'Open Platform Communications Unified Architecture - Industrial communication protocol for secure, reliable data exchange in mining automation.',
    category: 'technology',
    relatedTerms: ['SCADA', 'automation', 'Industry 4.0'],
    example: 'OPC UA enables real-time monitoring of all mining equipment.'
  },
  'scada': {
    term: 'SCADA',
    definition: 'Supervisory Control and Data Acquisition - System for remote monitoring and control of mining operations.',
    category: 'technology',
    relatedTerms: ['HMI', 'PLC', 'automation'],
    example: 'SCADA systems monitor conveyor speeds and equipment status.'
  },
  'telemetry': {
    term: 'Telemetry',
    definition: 'Automatic measurement and wireless transmission of data from remote equipment.',
    category: 'technology',
    relatedTerms: ['sensors', 'monitoring', 'data acquisition'],
    example: 'Telemetry data shows the excavator\'s fuel consumption and location.'
  },
  
  // Safety Terms
  'tpms': {
    term: 'TPMS',
    definition: 'Tire Pressure Monitoring System - Critical safety system for haul trucks to prevent tire failures.',
    category: 'safety',
    relatedTerms: ['safety', 'monitoring', 'maintenance'],
    example: 'TPMS alerts operators when tire pressure drops below safe levels.'
  },
  'geofence': {
    term: 'Geofence',
    definition: 'Virtual perimeter for real-world geographic areas used to ensure equipment stays within safe operating zones.',
    category: 'safety',
    relatedTerms: ['GPS', 'safety zone', 'proximity'],
    example: 'Geofences prevent equipment from entering blast zones.'
  },
  
  // Additional common terms
  'au': {
    term: 'Au',
    definition: 'Chemical symbol for gold (from Latin: aurum). Used in grade measurements like g/t Au.',
    category: 'measurement',
    unit: 'g/t Au',
    example: '5.2 g/t Au means 5.2 grams of gold per tonne of ore.'
  },
  'tph': {
    term: 'TPH',
    definition: 'Tonnes Per Hour - Standard measurement for material movement or processing rate.',
    category: 'measurement',
    unit: 't/h',
    example: 'The crusher processes 500 TPH of ore.'
  },
  'pit': {
    term: 'Open Pit',
    definition: 'Surface mining operation where ore is extracted from a large excavation.',
    category: 'geology',
    relatedTerms: ['bench', 'ramp', 'pit wall'],
    example: 'The Super Pit in Australia is over 3.5 km long and 600m deep.'
  },
  'node': {
    term: 'Node',
    definition: 'Basic unit in OPC UA representing a data point, object, or method in the address space.',
    category: 'technology',
    relatedTerms: ['NodeId', 'OPC UA', 'address space'],
    example: 'Each equipment sensor is represented as a node in OPC UA.'
  },
  'nodeid': {
    term: 'NodeId',
    definition: 'Unique identifier for an OPC UA node, like "ns=1;s=Excavator_EX001.OreGrade".',
    category: 'technology',
    relatedTerms: ['node', 'namespace', 'identifier'],
    example: 'Subscribe to NodeId "ns=1;s=MiningSite.Production.HourlyTonnage" for production data.'
  },
  'real-time': {
    term: 'Real-time',
    definition: 'Data updates occurring with minimal delay, typically within 1-2 seconds for mining operations.',
    category: 'technology',
    relatedTerms: ['telemetry', 'monitoring', 'latency'],
    example: 'Real-time grade data helps operators adjust excavation patterns immediately.'
  },
  'isa-95': {
    term: 'ISA-95',
    definition: 'International standard for integrating enterprise and control systems, defining levels from field devices (L0) to business planning (L4).',
    category: 'technology',
    relatedTerms: ['MES', 'ERP', 'integration'],
    example: 'OPC UA data flows from Level 1 devices up to Level 4 ERP systems.'
  }
};

// Helper functions remain for compatibility
export function getTermDefinition(term: string): MiningTerm | undefined {
  return miningTerms[term.toLowerCase()];
}

export function getTermsByCategory(category: MiningTerm['category']): MiningTerm[] {
  return Object.values(miningTerms).filter(t => t.category === category);
}

export function searchTerms(query: string): MiningTerm[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(miningTerms).filter(t => 
    t.term.toLowerCase().includes(lowerQuery) ||
    t.definition.toLowerCase().includes(lowerQuery) ||
    (t.example && t.example.toLowerCase().includes(lowerQuery))
  );
}

// Get all terms as array
export function getAllTerms(): MiningTerm[] {
  return Object.values(miningTerms);
}

// Get all unique categories
export function getCategories(): string[] {
  const categories = new Set(Object.values(miningTerms).map(t => t.category));
  return Array.from(categories).sort();
}