"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Player } from './Player';
import { Opponent } from './Opponent';
import { Shot } from './Shot';
import { EnemyShot } from './EnemyShot';
import { Star } from './Star';
import { Hud } from './Hud';
import { GameOverScreen } from './GameOverScreen';
import { useKeyPress } from '@/hooks/useKeyPress';
import * as C from '@/lib/game-constants';

type GameObject = { id: number; x: number; y: number; };
type OpponentObject = GameObject & { type: 'triangle' | 'pentagon'; vx: number; vy: number; lastShot: number; hp: number };
type StarObject = GameObject & { createdAt: number };

const STAR_LIFETIME = 1000;

export default function GameContainer() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver' | 'gameWon'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(C.INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  
  const playerRef = useRef({ x: C.GAME_WIDTH / 2 - C.PLAYER_WIDTH / 2, y: C.GAME_HEIGHT - C.PLAYER_HEIGHT - 20 });
  const opponentsRef = useRef<OpponentObject[]>([]);
  const shotsRef = useRef<GameObject[]>([]);
  const enemyShotsRef = useRef<GameObject[]>([]);
  const starsRef = useRef<StarObject[]>([]);
  
  const [renderTrigger, setRenderTrigger] = useState(0);

  const pressedKeys = useKeyPress();
  const gameLoopRef = useRef<number>();
  const lastShotTimeRef = useRef(0);
  const nextId = useRef(0);

  const initLevel = useCallback((lvl: number) => {
    opponentsRef.current = [];
    shotsRef.current = [];
    enemyShotsRef.current = [];
    starsRef.current = [];
    playerRef.current = { x: C.GAME_WIDTH / 2 - C.PLAYER_WIDTH / 2, y: C.GAME_HEIGHT - C.PLAYER_HEIGHT - 20 };

    if (lvl === 2) { // Boss level
        opponentsRef.current.push({
            id: nextId.current++,
            x: C.GAME_WIDTH / 2 - C.BOSS_WIDTH / 2,
            y: 70,
            type: 'pentagon',
            vx: C.BOSS_SPEED,
            vy: 0,
            lastShot: Date.now(),
            hp: 5,
        });
    } else {
        for (let i = 0; i < lvl; i++) {
            opponentsRef.current.push({
                id: nextId.current++,
                x: Math.random() * (C.GAME_WIDTH - C.OPPONENT_WIDTH),
                y: 50 + i * 40,
                type: 'triangle',
                vx: C.OPPONENT_SPEED * (1 + (lvl - 1) * 0.2),
                vy: 0,
                lastShot: Date.now(),
                hp: 1,
            });
        }
    }
  }, []);

  const handleStart = () => {
    setScore(0);
    setLives(C.INITIAL_LIVES);
    setLevel(1);
    initLevel(1);
    setGameState('playing');
  };

  const checkCollision = (a: {x:number, y:number}, b: {x:number, y:number}, aW: number, aH: number, bW: number, bH: number) => {
    return (
      a.x < b.x + bW &&
      a.x + aW > b.x &&
      a.y < b.y + bH &&
      a.y + aH > b.y
    );
  };
  
  const gameLoop = useCallback(() => {
    const now = Date.now();
    // Player Movement
    const player = playerRef.current;
    if (pressedKeys.has('ArrowLeft')) player.x -= C.PLAYER_SPEED;
    if (pressedKeys.has('ArrowRight')) player.x += C.PLAYER_SPEED;
    player.x = Math.max(0, Math.min(C.GAME_WIDTH - C.PLAYER_WIDTH, player.x));

    // Player Shooting
    if (pressedKeys.has(' ') && now - lastShotTimeRef.current > C.SHOT_COOLDOWN) {
      lastShotTimeRef.current = now;
      shotsRef.current.push({ id: nextId.current++, x: player.x + C.PLAYER_WIDTH / 2 - C.SHOT_WIDTH / 2, y: player.y });
    }

    // Update Shots
    shotsRef.current = shotsRef.current.map(shot => ({ ...shot, y: shot.y - C.SHOT_SPEED })).filter(shot => shot.y > -C.SHOT_HEIGHT);

    // Update Opponents and Enemy Shooting
    opponentsRef.current.forEach(opp => {
      opp.x += opp.vx;
      if (opp.x <= 0 || opp.x >= C.GAME_WIDTH - (opp.type === 'triangle' ? C.OPPONENT_WIDTH : C.BOSS_WIDTH)) {
        opp.vx = -opp.vx;
      }
      
      if (now - opp.lastShot > C.ENEMY_SHOT_COOLDOWN) {
        opp.lastShot = now;
        const oppWidth = opp.type === 'triangle' ? C.OPPONENT_WIDTH : C.BOSS_WIDTH;
        enemyShotsRef.current.push({
          id: nextId.current++,
          x: opp.x + oppWidth / 2 - C.ENEMY_SHOT_WIDTH / 2,
          y: opp.y + (opp.type === 'triangle' ? C.OPPONENT_HEIGHT : C.BOSS_HEIGHT),
        });
      }
    });

    // Update Enemy Shots
    enemyShotsRef.current = enemyShotsRef.current.map(shot => ({ ...shot, y: shot.y + C.ENEMY_SHOT_SPEED })).filter(shot => shot.y < C.GAME_HEIGHT);
    
    // Collision Detection: Shots vs Opponents
    const remainingShots: GameObject[] = [];
    shotsRef.current.forEach(shot => {
      const oppIndex = opponentsRef.current.findIndex(opp => 
        checkCollision(shot, opp, C.SHOT_WIDTH, C.SHOT_HEIGHT, opp.type === 'triangle' ? C.OPPONENT_WIDTH : C.BOSS_WIDTH, opp.type === 'triangle' ? C.OPPONENT_HEIGHT : C.BOSS_HEIGHT)
      );

      if (oppIndex !== -1) {
        const opp = opponentsRef.current[oppIndex];
        opp.hp -= 1;
        if (opp.hp <= 0) {
            setScore(s => s + (opp.type === 'triangle' ? C.SCORE_PER_OPPONENT : C.SCORE_PER_BOSS));
            starsRef.current.push({ id: opp.id, x: opp.x, y: opp.y, createdAt: now });
            opponentsRef.current.splice(oppIndex, 1);
        }
        
        if (opponentsRef.current.length === 0) {
            const nextLevel = level + 1;
            if (nextLevel > C.TOTAL_LEVELS) {
                setGameState('gameWon');
            } else {
                setLevel(nextLevel);
                initLevel(nextLevel);
            }
        }
      } else {
        remainingShots.push(shot);
      }
    });
    shotsRef.current = remainingShots;

    // Player vs Opponent Collision
    for(const opp of opponentsRef.current) {
        if(checkCollision(player, opp, C.PLAYER_WIDTH, C.PLAYER_HEIGHT, opp.type === 'triangle' ? C.OPPONENT_WIDTH : C.BOSS_WIDTH, opp.type === 'triangle' ? C.OPPONENT_HEIGHT : C.BOSS_HEIGHT)) {
            setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) {
                    setGameState('gameOver');
                    return 0;
                }
                initLevel(level);
                return newLives;
            });
            break;
        }
    }

    // Player vs Enemy Shot Collision
    const remainingEnemyShots: GameObject[] = [];
    enemyShotsRef.current.forEach(shot => {
      if (checkCollision(player, shot, C.PLAYER_WIDTH, C.PLAYER_HEIGHT, C.ENEMY_SHOT_WIDTH, C.ENEMY_SHOT_HEIGHT)) {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
            return 0;
          }
          // No level reset, just lose a life
          playerRef.current = { x: C.GAME_WIDTH / 2 - C.PLAYER_WIDTH / 2, y: C.GAME_HEIGHT - C.PLAYER_HEIGHT - 20 };
          return newLives;
        });
      } else {
        remainingEnemyShots.push(shot);
      }
    });
    enemyShotsRef.current = remainingEnemyShots;
    
    // Cleanup stars
    starsRef.current = starsRef.current.filter(star => now - star.createdAt < STAR_LIFETIME);

    setRenderTrigger(r => r + 1);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [pressedKeys, initLevel, level]);
  
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return (
    <div className="relative w-full h-full bg-black border-2 border-primary/50 rounded-lg overflow-hidden shadow-2xl shadow-primary/50 crt-effect" style={{ width: C.GAME_WIDTH, height: C.GAME_HEIGHT, maxWidth: '100vw' }}>
      <Hud score={score} lives={lives} level={level} />
      <GameOverScreen gameState={gameState} onRestart={handleStart} score={score} />
      
      {(gameState === 'playing' || gameState === 'gameOver' || gameState === 'gameWon') && (
        <>
          <Player x={playerRef.current.x} y={playerRef.current.y} />
          {shotsRef.current.map(s => <Shot key={s.id} x={s.x} y={s.y} />)}
          {enemyShotsRef.current.map(s => <EnemyShot key={s.id} x={s.x} y={s.y} />)}
          {opponentsRef.current.map(o => <Opponent key={o.id} x={o.x} y={o.y} type={o.type} />)}
          {starsRef.current.map(s => <Star key={s.id} x={s.x} y={s.y} />)}
        </>
      )}
    </div>
  );
}
