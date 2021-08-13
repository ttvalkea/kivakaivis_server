// NOTE: All of these should be the exact same in server and client
export type PlayerType = {
  playerId: string;
  x: number;
  y: number;
};

export type renderedObjectType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type obstacleType = renderedObjectType & { destructible: boolean };
