import { MAP_HEIGHT_IN_TILES, MAP_WIDTH_IN_TILES } from "./constants";
import { mapTileTerrain, mapTileType, renderedObjectType } from "./types";

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
        widthInTiles: 1,
        heightInTiles: 1,
      });
    }
  }
  return obstacles;
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const isItemInPlayersView = (
  player: renderedObjectType,
  item: renderedObjectType,
  viewHeight: number,
  viewWidth: number
) => {
  const isVisible =
    // Outside, right of the player
    item.x - player.x - player.width / 2 <= viewWidth / 2 &&
    // Outside, left of the player
    item.x - player.x - player.width / 2 + item.width >= (viewWidth / 2) * -1 &&
    // Outside, below the player
    item.y - player.y - player.height / 2 <= viewHeight / 2 &&
    // Outside, above the player
    item.y - player.y - player.height / 2 + item.height >=
      (viewHeight / 2) * -1;

  return isVisible;
};
