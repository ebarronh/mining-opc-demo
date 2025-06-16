import { Color } from 'three';

// Grade color mapping (low to high) - Enhanced colors for better visibility
export const getGradeColor = (grade: number): Color => {
  const color = new Color();
  
  if (grade < 0.5) {
    // Deep blue for low grade
    color.setHSL(0.6, 1, 0.5);
  } else if (grade < 1.0) {
    // Cyan for low-medium
    color.setHSL(0.5, 1, 0.5);
  } else if (grade < 1.5) {
    // Green for medium
    color.setHSL(0.33, 1, 0.5);
  } else if (grade < 2.0) {
    // Yellow for medium-high
    color.setHSL(0.17, 1, 0.5);
  } else if (grade < 2.5) {
    // Orange for high
    color.setHSL(0.08, 1, 0.5);
  } else {
    // Red for very high
    color.setHSL(0, 1, 0.5);
  }
  
  return color;
};

// Convert Three.js Color to CSS hex string
export const getGradeColorHex = (grade: number): string => {
  const color = getGradeColor(grade);
  return `#${color.getHexString()}`;
};

// Grade ranges for legend with economic context
export const GRADE_RANGES = [
  { 
    min: 0, 
    max: 0.5, 
    label: '< 0.5%', 
    description: 'Waste Rock (Below cutoff)',
    economics: 'Mined but stockpiled. May become profitable if metal prices rise.'
  },
  { 
    min: 0.5, 
    max: 1.0, 
    label: '0.5-1.0%', 
    description: 'Marginal Grade (Cutoff threshold)',
    economics: 'Economically viable. Often blended with higher grades for processing.'
  },
  { 
    min: 1.0, 
    max: 1.5, 
    label: '1.0-1.5%', 
    description: 'Commercial Grade',
    economics: 'Solid profit margins. Core of mining operations revenue.'
  },
  { 
    min: 1.5, 
    max: 2.0, 
    label: '1.5-2.0%', 
    description: 'Good Grade',
    economics: 'High value target. Priority for immediate extraction.'
  },
  { 
    min: 2.0, 
    max: 2.5, 
    label: '2.0-2.5%', 
    description: 'High Grade',
    economics: 'Premium ore. Exceptional profit margins and immediate processing.'
  },
  { 
    min: 2.5, 
    max: Infinity, 
    label: '> 2.5%', 
    description: 'Very High Grade (Bonanza)',
    economics: 'Extremely valuable. Direct shipping ore with maximum profitability.'
  },
];