import { MAP_HEIGHT_IN_TILES, MAP_WIDTH_IN_TILES } from "./constants";
import { mapTileTerrain, mapTileType, renderedObjectType } from "./types";

export const generateObstaclesForNewGame = (): mapTileType[] => {
  const obstacleArrays: mapTileType[][] = [
    [
      {
        gridX: 5,
        gridY: 0,
        isDiscovered: false,
        type: mapTileTerrain.dirt,
        widthInTiles: 1,
        heightInTiles: 1,
      },
      {
        gridX: 4,
        gridY: 0,
        isDiscovered: false,
        type: mapTileTerrain.dirt,
        widthInTiles: 1,
        heightInTiles: 1,
      },
    ],
  ];
  for (let y = 0; y < MAP_HEIGHT_IN_TILES; y++) {
    const obstacleArrayForThisY: mapTileType[] = [];
    for (let x = 0; x < MAP_WIDTH_IN_TILES; x++) {
      const terrainRandomNumber: number = getRandomNumber(1, 100);
      let tileTerrainType: mapTileTerrain = mapTileTerrain.dirt;
      if (terrainRandomNumber < 20) {
        tileTerrainType = mapTileTerrain.rock;
      }

      obstacleArrayForThisY.push({
        gridX: x,
        gridY: y + 1,
        isDiscovered: false,
        type: tileTerrainType,
        widthInTiles: 1,
        heightInTiles: 1,
      });
    }
    obstacleArrays.push(obstacleArrayForThisY);
  }

  return formBiggerObstacles(obstacleArrays);
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// TODO: This could probably be optimized but at least it seems to work.
// Forms as big obstacles as possible from 1x1 tile obstacles. This is to lessen browser's workload of rendering
const formBiggerObstacles = (
  originalObstacles: mapTileType[][]
): mapTileType[] => {
  // Go through all the arrays to form as wide obstacles as possible
  const obstacleArrays: mapTileType[][] = [];
  for (let y = 0; y < originalObstacles.length; y++) {
    const obstacleArrayForThisY: mapTileType[] = [];
    let firstTileOfWideObstacle = originalObstacles[y][0];
    let obstacleWidth = 1;
    // TODO: Fix: The first tile of each row will be missing
    for (let x = 1; x < originalObstacles[y].length; x++) {
      if (x === originalObstacles[y].length - 1) {
        obstacleArrayForThisY.push({
          ...firstTileOfWideObstacle,
          widthInTiles: obstacleWidth,
        });
      }

      if (firstTileOfWideObstacle.type === originalObstacles[y][x].type) {
        obstacleWidth++;
      } else {
        obstacleArrayForThisY.push({
          ...firstTileOfWideObstacle,
          widthInTiles: obstacleWidth,
        });

        firstTileOfWideObstacle = originalObstacles[y][x];
        obstacleWidth = 1;
      }
    }
    obstacleArrays.push(obstacleArrayForThisY);
  }

  // After forming wide obstacles, look for obstacles that are on top of each other and have the same width
  let combinedObstacleArray: mapTileType[] = [];
  obstacleArrays.forEach(
    (array) => combinedObstacleArray.push(...array.filter((x) => x)) // Remove nulls from the arrays
  );

  let continueLooping = true;
  while (continueLooping) {
    continueLooping = false;
    for (let x = 0; x < MAP_WIDTH_IN_TILES; x++) {
      // Typically none of the arrays will have this many obstacles
      for (let y = 0; y < MAP_HEIGHT_IN_TILES; y++) {
        let obstacleInPositionXYIndex = combinedObstacleArray.findIndex(
          (co) => co && co.gridX === x && co.gridY === y
        );
        let obstacleInPositionXY =
          combinedObstacleArray[obstacleInPositionXYIndex];
        if (obstacleInPositionXY) {
          let sameObjectButOneLevelBelowIndex = combinedObstacleArray.findIndex(
            (co) =>
              co &&
              co.gridX === x &&
              co.gridY === y + obstacleInPositionXY.heightInTiles &&
              co.type === obstacleInPositionXY.type &&
              co.widthInTiles === obstacleInPositionXY.widthInTiles
          );
          let sameObjectButOneLevelBelow =
            combinedObstacleArray[sameObjectButOneLevelBelowIndex];
          if (obstacleInPositionXY && sameObjectButOneLevelBelow) {
            combinedObstacleArray[sameObjectButOneLevelBelowIndex] = {
              ...obstacleInPositionXY,
              heightInTiles:
                obstacleInPositionXY.heightInTiles +
                sameObjectButOneLevelBelow.heightInTiles,
            };
            combinedObstacleArray[obstacleInPositionXYIndex] = null;
            continueLooping = true; // Looping will continue so long as there are obstacles to combine
          }
        }
        // After each iteration, remove duplicates.
        combinedObstacleArray = combinedObstacleArray.filter((x) => x !== null);
        const combinedObstacleArrayWithDuplicatesRemoved =
          combinedObstacleArray.filter(
            (thing, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.gridX === thing.gridX &&
                  t.gridY === thing.gridY &&
                  t.type === thing.type &&
                  t.widthInTiles === thing.widthInTiles &&
                  t.heightInTiles === thing.heightInTiles &&
                  t.isDiscovered === thing.isDiscovered
              )
          );
        combinedObstacleArray = combinedObstacleArrayWithDuplicatesRemoved;
      }
    }
  }
  return combinedObstacleArray;
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
