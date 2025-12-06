import React from 'react';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
  label?: string;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text, label }) => (
  <div
    className={`
      box-border flex flex-col items-center justify-center 
      mb-4 p-4 rounded-xl border-2 min-h-[80px] w-full
      ${gameOver 
        ? 'border-red-500 bg-red-900/20 text-red-500' 
        : 'border-slate-700 bg-slate-800/50 text-slate-300'}
    `}
  >
    {label && <span className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</span>}
    <span className={`font-pixel text-lg ${gameOver ? 'text-red-400' : 'text-white'}`}>{text}</span>
  </div>
);

export default Display;