import React, { useState, useRef } from 'react';
import { createStage, checkCollision } from './utils';
import { useInterval } from './hooks/useInterval';
import { usePlayer } from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useGameStatus } from './hooks/useGameStatus';
import { GameStatus } from './types';

// Components
import Stage from './components/Stage';
import Display from './components/Display';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MENU);

  const { player, updatePlayerPos, resetPlayer, playerRotate, setPlayer } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    setGameStatus(GameStatus.PLAYING);
    // Focus the game area to capture keyboard events immediately
    setTimeout(() => gameAreaRef.current?.focus(), 0);
  };

  const pauseGame = () => {
    if (gameStatus === GameStatus.PLAYING) {
        setGameStatus(GameStatus.PAUSED);
        setDropTime(null);
    } else if (gameStatus === GameStatus.PAUSED) {
        setGameStatus(GameStatus.PLAYING);
        setDropTime(1000 / (level + 1) + 200);
    }
  }

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        setGameStatus(GameStatus.GAMEOVER);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }) => {
    if (!gameOver) {
      if (keyCode === 40) { // Down Arrow
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
  };

  const fastDrop = () => {
      // Keep dropping until collision
      let tempY = 0;
      while (!checkCollision(player, stage, { x: 0, y: tempY + 1 })) {
          tempY += 1;
      }
      updatePlayerPos({ x: 0, y: tempY, collided: true }); // Collide immediately
  };

  const move = ({ keyCode, preventDefault, key }: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gameOver && gameStatus === GameStatus.PLAYING) {
      if (keyCode === 37) { // Left
        movePlayer(-1);
      } else if (keyCode === 39) { // Right
        movePlayer(1);
      } else if (keyCode === 40) { // Down
        dropPlayer();
      } else if (keyCode === 38) { // Up (Rotate)
        playerRotate(stage, 1);
      } else if (key === ' ' || keyCode === 32) { // Space (Hard Drop)
        preventDefault(); // Prevent scrolling
        fastDrop();
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <div 
      className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 outline-none overflow-hidden" 
      role="button" 
      tabIndex={0} 
      onKeyDown={move} 
      onKeyUp={keyUp}
      ref={gameAreaRef}
    >
      
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="font-pixel text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg mb-2">
          TETRIS
        </h1>
        <p className="text-slate-400 text-sm tracking-wide uppercase">React + Tailwind</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-start">
        
        {/* Left Column (Desktop stats) / Hidden on mobile */}
        <div className="hidden md:flex flex-col w-48 gap-4 pt-4">
             <Display text={`Level: ${level}`} />
             <Display text={`Lines: ${rows}`} />
        </div>

        {/* Main Stage Area */}
        <div className="relative w-full max-w-[320px] mx-auto">
             <Stage stage={stage} />
             
             {/* Overlay for Menu/GameOver */}
             {gameStatus !== GameStatus.PLAYING && (
                 <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg border-4 border-transparent">
                     {gameStatus === GameStatus.GAMEOVER && (
                         <h2 className="font-pixel text-3xl text-red-500 mb-6 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">GAME OVER</h2>
                     )}
                     {gameStatus === GameStatus.PAUSED && (
                         <h2 className="font-pixel text-3xl text-yellow-400 mb-6">PAUSED</h2>
                     )}
                     
                     <button 
                        onClick={gameStatus === GameStatus.PAUSED ? pauseGame : startGame}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] hover:scale-105 transition-all font-pixel text-sm"
                     >
                         {gameStatus === GameStatus.PAUSED 
                             ? "RESUME" 
                             : gameStatus === GameStatus.GAMEOVER 
                                ? "TRY AGAIN" 
                                : "START GAME"}
                     </button>
                 </div>
             )}
             
             {/* Pause Button (Visible always) */}
             {gameStatus === GameStatus.PLAYING && (
                 <button 
                   onClick={pauseGame}
                   className="absolute top-2 right-2 p-2 text-white/50 hover:text-white bg-black/20 rounded hover:bg-black/40 transition-colors"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                   </svg>
                 </button>
             )}
        </div>

        {/* Right Column / Mobile Stats */}
        <div className="flex flex-col w-full md:w-48 gap-4">
            <div className="flex gap-2 md:flex-col w-full">
                <div className="md:hidden flex-1"><Display text={`Lvl:${level}`} /></div>
                <div className="flex-1 w-full"><Display text={String(score)} label="Score" /></div>
            </div>
            
            {/* Start Button for Mobile if not playing */}
            {gameStatus === GameStatus.MENU && (
               <div className="md:hidden text-center text-slate-500 text-xs mt-2">
                  Tap Start to Play
               </div>
            )}
            
            <div className="hidden md:block p-4 bg-slate-800/30 rounded-lg text-xs text-slate-400 leading-6 border border-slate-700/50">
                <p><kbd className="bg-slate-700 px-1 rounded">Arrows</kbd> to Move</p>
                <p><kbd className="bg-slate-700 px-1 rounded">Up</kbd> to Rotate</p>
                <p><kbd className="bg-slate-700 px-1 rounded">Space</kbd> to Drop</p>
            </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <Controls 
        onMoveLeft={() => movePlayer(-1)}
        onMoveRight={() => movePlayer(1)}
        onRotate={() => playerRotate(stage, 1)}
        onDrop={dropPlayer}
        onFastDrop={fastDrop}
      />
      
    </div>
  );
};

export default App;