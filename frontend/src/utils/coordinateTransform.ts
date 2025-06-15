// Coordinate transformation utilities for mining simulation

export interface MiningCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface SceneCoordinates {
  x: number;
  y: number;
  z: number;
}

// Mining coordinate bounds (from backend simulation)
const MINING_BOUNDS = {
  minX: 800,
  maxX: 1400,
  minY: 1600, 
  maxY: 2200,
  minZ: -50,
  maxZ: 0
};

// Scene coordinate bounds (for 3D visualization)
// CORRECT MAPPING: X=left/right, Y=up/down, Z=forward/backward
const SCENE_BOUNDS = {
  minX: -200,  // Scene X (left-right) 
  maxX: 200,
  minY: -25,   // Scene Y (up-down, elevation) - ground is at Y=0
  maxY: 0,     // Equipment should sit ON or slightly above ground (Y=0)
  minZ: -200,  // Scene Z (forward-backward)
  maxZ: 200
};

/**
 * Transform mining coordinates to scene coordinates
 * CORRECT MAPPING:
 * Mining X (easting) → Scene X (left-right)
 * Mining Y (northing) → Scene Z (forward-backward) 
 * Mining Z (elevation) → Scene Y (up-down)
 */
export function miningToScene(mining: MiningCoordinates): SceneCoordinates {
  // Normalize mining coordinates to 0-1 range
  const normalizedX = (mining.x - MINING_BOUNDS.minX) / (MINING_BOUNDS.maxX - MINING_BOUNDS.minX);
  const normalizedY = (mining.y - MINING_BOUNDS.minY) / (MINING_BOUNDS.maxY - MINING_BOUNDS.minY);
  const normalizedZ = (mining.z - MINING_BOUNDS.minZ) / (MINING_BOUNDS.maxZ - MINING_BOUNDS.minZ);
  
  // Map to scene coordinate range with CORRECT axis mapping
  return {
    x: SCENE_BOUNDS.minX + normalizedX * (SCENE_BOUNDS.maxX - SCENE_BOUNDS.minX), // Mining X → Scene X (left-right)
    y: SCENE_BOUNDS.minY + normalizedZ * (SCENE_BOUNDS.maxY - SCENE_BOUNDS.minY), // Mining Z → Scene Y (elevation: ground=0)
    z: SCENE_BOUNDS.minZ + normalizedY * (SCENE_BOUNDS.maxZ - SCENE_BOUNDS.minZ)  // Mining Y → Scene Z (forward-back)
  };
}

/**
 * Transform scene coordinates back to mining coordinates
 */
export function sceneToMining(scene: SceneCoordinates): MiningCoordinates {
  // Normalize scene coordinates to 0-1 range
  const normalizedX = (scene.x - SCENE_BOUNDS.minX) / (SCENE_BOUNDS.maxX - SCENE_BOUNDS.minX);
  const normalizedY = (scene.y - SCENE_BOUNDS.minY) / (SCENE_BOUNDS.maxY - SCENE_BOUNDS.minY);
  const normalizedZ = (scene.z - SCENE_BOUNDS.minZ) / (SCENE_BOUNDS.maxZ - SCENE_BOUNDS.minZ);
  
  // Map to mining coordinate range with CORRECT reverse axis mapping
  return {
    x: MINING_BOUNDS.minX + normalizedX * (MINING_BOUNDS.maxX - MINING_BOUNDS.minX), // Scene X → Mining X
    y: MINING_BOUNDS.minY + normalizedZ * (MINING_BOUNDS.maxY - MINING_BOUNDS.minY), // Scene Z → Mining Y  
    z: MINING_BOUNDS.minZ + normalizedY * (MINING_BOUNDS.maxZ - MINING_BOUNDS.minZ)  // Scene Y → Mining Z
  };
}

/**
 * Check if coordinates are in valid mining range
 */
export function isValidMiningCoordinates(coords: MiningCoordinates): boolean {
  return (
    coords.x >= MINING_BOUNDS.minX && coords.x <= MINING_BOUNDS.maxX &&
    coords.y >= MINING_BOUNDS.minY && coords.y <= MINING_BOUNDS.maxY &&
    coords.z >= MINING_BOUNDS.minZ && coords.z <= MINING_BOUNDS.maxZ
  );
}

/**
 * Get coordinate bounds for display
 */
export function getCoordinateBounds() {
  return {
    mining: MINING_BOUNDS,
    scene: SCENE_BOUNDS
  };
}