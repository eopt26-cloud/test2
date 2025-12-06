import React from 'react';
import Cell from './Cell';
import { Grid } from '../types';

interface StageProps {
  stage: Grid;
}

const Stage: React.FC<StageProps> = ({ stage }) => {
  const height = stage.length;
  const width = stage[0].length;
  
  // Calculate aspect ratio for responsiveness.
  // Standard Tetris is 10x20.
  
  return (
    <div 
      className="grid gap-[1px] border-4 border-slate-700 bg-slate-900 shadow-2xl rounded-lg overflow-hidden relative"
      style={{
        gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
        // Fix aspect ratio to grid dimensions
        aspectRatio: `${width}/${height}`,
        width: '100%',
        maxWidth: '400px', // Prevent it from getting too huge on desktop
      }}
    >
      {stage.map((row) =>
        row.map((cell, x) => <Cell key={x} type={cell[0]} />)
      )}
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,6px_100%]"></div>
    </div>
  );
};

export default Stage;