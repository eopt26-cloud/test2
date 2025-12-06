export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: (string | number)[][];
  color: string;
}

export type GridCell = [string | number, string]; // [content, colorState]
export type Grid = GridCell[][];

export interface Player {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
}

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER',
}