import React from 'react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onFastDrop: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onDrop,
  onFastDrop
}) => {
  const btnClass = "bg-slate-700/80 active:bg-slate-600 shadow-lg text-white rounded-full w-14 h-14 flex items-center justify-center text-xl select-none backdrop-blur-sm border border-slate-600/50 active:scale-95 transition-transform touch-manipulation";

  return (
    <div className="flex flex-col gap-4 mt-4 w-full max-w-[400px] md:hidden px-4">
      <div className="flex justify-between items-center w-full">
         {/* D-Pad Left/Right */}
         <div className="flex gap-4">
            <button 
              className={btnClass} 
              onPointerDown={(e) => { e.preventDefault(); onMoveLeft(); }}
              aria-label="Move Left"
            >
              ←
            </button>
            <button 
              className={btnClass} 
              onPointerDown={(e) => { e.preventDefault(); onDrop(); }}
              aria-label="Soft Drop"
            >
              ↓
            </button>
            <button 
              className={btnClass} 
              onPointerDown={(e) => { e.preventDefault(); onMoveRight(); }}
              aria-label="Move Right"
            >
              →
            </button>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-4 relative top-[-10px]">
           <button 
              className={`${btnClass} bg-indigo-600/80 border-indigo-500/50 w-16 h-16`} 
              onPointerDown={(e) => { e.preventDefault(); onRotate(); }}
              aria-label="Rotate"
            >
              ↻
            </button>
         </div>
      </div>
      
      {/* Hard Drop Big Button */}
      <button 
        className="w-full h-12 bg-slate-800/80 rounded-xl border border-slate-600 flex items-center justify-center text-xs uppercase tracking-widest text-slate-400 active:bg-slate-700"
        onPointerDown={(e) => { e.preventDefault(); onFastDrop(); }}
      >
        Hard Drop
      </button>
    </div>
  );
};

export default Controls;