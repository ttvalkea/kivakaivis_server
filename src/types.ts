// ----------------------------------------------------------------- //
// NOTE: All of these should be the exact same in server and client! //
// ----------------------------------------------------------------- //
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

// Map tiles are converted into renderedObjectTypes in the frontend so that each tile's position is multiplied by tile size (25)
export type mapTileType = {
  gridX: number;
  gridY: number;
  type: mapTileTerrain;
  isDiscovered: boolean; // A tile becomes discovered (normally) when a player digs it. Before being discovered, all tiles look like dirt.
};

export enum mapTileTerrain {
  dirt = 1,
  rock,
  empty,
  indestructible,
}
