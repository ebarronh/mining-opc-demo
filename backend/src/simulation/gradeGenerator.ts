import { GradeData } from '../types/mining-types';

export interface GradePattern {
  centerX: number;
  centerY: number;
  peakGrade: number;
  radius: number;
  falloffRate: number;
}

export class GradeGenerator {
  private gridSize: { rows: number; columns: number };
  private bounds: { minX: number; maxX: number; minY: number; maxY: number };
  private patterns: GradePattern[];
  private lastUpdate: number = 0;
  private updateInterval: number = 2000; // 2 seconds

  constructor(
    gridSize = { rows: 20, columns: 20 },
    bounds = { minX: -250, maxX: 250, minY: -250, maxY: 250 }
  ) {
    this.gridSize = gridSize;
    this.bounds = bounds;
    this.patterns = this.initializePatterns();
  }

  // Initialize realistic grade patterns across the mine site
  private initializePatterns(): GradePattern[] {
    return [
      // High-grade zone in the northwest
      {
        centerX: 5,
        centerY: 5,
        peakGrade: 3.8,
        radius: 4,
        falloffRate: 0.3
      },
      // Medium-grade zone in the center
      {
        centerX: 10,
        centerY: 10,
        peakGrade: 2.1,
        radius: 6,
        falloffRate: 0.25
      },
      // Another high-grade zone in the southeast
      {
        centerX: 15,
        centerY: 15,
        peakGrade: 3.2,
        radius: 3,
        falloffRate: 0.4
      },
      // Low-grade zone in the northeast
      {
        centerX: 5,
        centerY: 15,
        peakGrade: 1.2,
        radius: 5,
        falloffRate: 0.2
      }
    ];
  }

  // Generate grade data with realistic patterns
  generateGradeData(): GradeData {
    const now = Date.now();
    
    // Only update if enough time has passed
    if (now - this.lastUpdate < this.updateInterval) {
      return this.getCurrentGradeData();
    }

    this.lastUpdate = now;

    // Evolve patterns slightly over time to simulate mining progression
    this.evolvePatterns();

    const grid: number[][] = [];
    let totalGrade = 0;
    let minGrade = Infinity;
    let maxGrade = -Infinity;
    let cellCount = 0;

    for (let row = 0; row < this.gridSize.rows; row++) {
      const rowData: number[] = [];
      
      for (let col = 0; col < this.gridSize.columns; col++) {
        let grade = this.calculateGradeAtCell(row, col);
        
        // Add some realistic noise
        grade += this.generateNoise() * 0.15;
        
        // Ensure grade is within realistic bounds
        grade = Math.max(0.05, Math.min(4.5, grade));
        
        rowData.push(grade);
        totalGrade += grade;
        minGrade = Math.min(minGrade, grade);
        maxGrade = Math.max(maxGrade, grade);
        cellCount++;
      }
      
      grid.push(rowData);
    }

    const averageGrade = totalGrade / cellCount;

    return {
      timestamp: now,
      grid,
      gridSize: this.gridSize,
      bounds: this.bounds,
      statistics: {
        averageGrade: Number(averageGrade.toFixed(3)),
        minGrade: Number(minGrade.toFixed(3)),
        maxGrade: Number(maxGrade.toFixed(3))
      }
    };
  }

  // Calculate grade at a specific grid cell based on patterns
  private calculateGradeAtCell(row: number, col: number): number {
    let totalGrade = 0;
    let totalWeight = 0;

    // Calculate contribution from each pattern
    for (const pattern of this.patterns) {
      const distance = Math.sqrt(
        Math.pow(row - pattern.centerX, 2) + Math.pow(col - pattern.centerY, 2)
      );

      if (distance <= pattern.radius) {
        // Calculate grade based on distance from center
        const normalizedDistance = distance / pattern.radius;
        const weight = Math.exp(-normalizedDistance * pattern.falloffRate);
        const gradeContribution = pattern.peakGrade * weight;

        totalGrade += gradeContribution * weight;
        totalWeight += weight;
      }
    }

    // Add base grade level
    const baseGrade = 0.3;
    
    if (totalWeight > 0) {
      return baseGrade + (totalGrade / totalWeight);
    } else {
      return baseGrade + this.generateNoise() * 0.2;
    }
  }

  // Evolve patterns over time to simulate mining progression
  private evolvePatterns(): void {
    this.patterns.forEach(pattern => {
      // Slightly shift centers (equipment movement effect)
      pattern.centerX += (Math.random() - 0.5) * 0.1;
      pattern.centerY += (Math.random() - 0.5) * 0.1;

      // Keep centers within bounds
      pattern.centerX = Math.max(0, Math.min(this.gridSize.columns - 1, pattern.centerX));
      pattern.centerY = Math.max(0, Math.min(this.gridSize.rows - 1, pattern.centerY));

      // Slightly change peak grade (geological variation)
      pattern.peakGrade += (Math.random() - 0.5) * 0.05;
      pattern.peakGrade = Math.max(0.5, Math.min(4.0, pattern.peakGrade));

      // Slightly change radius (mining progression)
      pattern.radius += (Math.random() - 0.5) * 0.1;
      pattern.radius = Math.max(2, Math.min(8, pattern.radius));
    });
  }

  // Generate realistic noise for grade variations
  private generateNoise(): number {
    // Use Box-Muller transform for normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  // Get current grade data without regenerating
  private getCurrentGradeData(): GradeData {
    // Return cached data if available, otherwise generate fresh
    return this.generateGradeData();
  }

  // Create grade patterns for specific scenarios
  createScenario(scenario: 'high_grade' | 'low_grade' | 'mixed' | 'depletion'): void {
    switch (scenario) {
      case 'high_grade':
        this.patterns = [
          {
            centerX: 10,
            centerY: 10,
            peakGrade: 4.2,
            radius: 8,
            falloffRate: 0.2
          }
        ];
        break;

      case 'low_grade':
        this.patterns = [
          {
            centerX: 10,
            centerY: 10,
            peakGrade: 1.1,
            radius: 12,
            falloffRate: 0.1
          }
        ];
        break;

      case 'mixed':
        this.patterns = this.initializePatterns();
        break;

      case 'depletion':
        this.patterns = this.patterns.map(pattern => ({
          ...pattern,
          peakGrade: pattern.peakGrade * 0.6,
          radius: pattern.radius * 0.8
        }));
        break;
    }
  }

  // Get real-world coordinates for a grid cell
  getWorldCoordinates(row: number, col: number): { x: number; y: number } {
    const cellWidth = (this.bounds.maxX - this.bounds.minX) / this.gridSize.columns;
    const cellHeight = (this.bounds.maxY - this.bounds.minY) / this.gridSize.rows;

    return {
      x: this.bounds.minX + (col + 0.5) * cellWidth,
      y: this.bounds.minY + (row + 0.5) * cellHeight
    };
  }

  // Get statistics about current patterns
  getPatternStats(): {
    patternCount: number;
    averagePeakGrade: number;
    averageRadius: number;
  } {
    const averagePeakGrade = this.patterns.reduce((sum, p) => sum + p.peakGrade, 0) / this.patterns.length;
    const averageRadius = this.patterns.reduce((sum, p) => sum + p.radius, 0) / this.patterns.length;

    return {
      patternCount: this.patterns.length,
      averagePeakGrade: Number(averagePeakGrade.toFixed(3)),
      averageRadius: Number(averageRadius.toFixed(3))
    };
  }
}