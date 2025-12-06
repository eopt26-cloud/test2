import React from 'react';
import { TETROMINOS } from '../constants';

interface CellProps {
  type: string | number;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const color = TETROMINOS[type] ? TETROMINOS[type].color : '0, 0, 0';
  const isFilled = type !== 0;

  return (
    <div
      className={`w-full h-full border-r border-b border-white/5 
      ${isFilled ? 'shadow-[inset_0px_0px_8px_rgba(0,0,0,0.5)]' : ''}`}
      style={{
        backgroundColor: `rgba(${color}, ${isFilled ? 0.8 : 0.1})`,
        borderTopColor: isFilled ? `rgba(255,255,255,0.3)` : 'transparent',
        borderLeftColor: isFilled ? `rgba(255,255,255,0.3)` : 'transparent',
        borderRightColor: isFilled ? `rgba(0,0,0,0.5)` : 'rgba(255,255,255,0.05)',
        borderBottomColor: isFilled ? `rgba(0,0,0,0.5)` : 'rgba(255,255,255,0.05)',
      }}
    />
  );
};

// React.memo makes sure we only re-render the changed cells
export default React.memo(Cell);