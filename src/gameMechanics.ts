import { obstacleType } from "./types";

export const generateObstaclesForNewGame = (): obstacleType[] => {
  const obstacles: obstacleType[] = [
    { x: -60, y: 100, width: 300, height: 100, destructible: false },
    { x: -100, y: 40, width: 460, height: 20, destructible: false },
  ];
  return obstacles;
};
