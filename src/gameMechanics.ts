import { MAP_HEIGHT_IN_TILES, MAP_WIDTH_IN_TILES } from "./constants";
import { mapTileTerrain, mapTileType } from "./types";

export const generateObstaclesForNewGame = (): mapTileType[] => {
  const obstacles: mapTileType[] = [];

  for (let x = 0; x < MAP_WIDTH_IN_TILES; x++) {
    for (let y = 0; y < MAP_HEIGHT_IN_TILES; y++) {
      const terrainRandomNumber: number = getRandomNumber(1, 100);
      let tileTerrainType: mapTileTerrain = mapTileTerrain.dirt;
      if (terrainRandomNumber < 20) {
        tileTerrainType = mapTileTerrain.rock;
      }

      obstacles.push({
        gridX: x,
        gridY: y,
        isDiscovered: false,
        type: tileTerrainType,
      });
    }
  }
  return obstacles;
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
