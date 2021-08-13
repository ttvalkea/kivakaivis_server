import { obstacleType } from "./types";

export const generateObstaclesForNewGame = (): obstacleType[] => {
  const obstacles: obstacleType[] = [
    { x: -100, y: 100, width: 600, height: 100, destructible: false }, // TODO: Dummy, needs actual implementation
  ];
  return obstacles;
};
