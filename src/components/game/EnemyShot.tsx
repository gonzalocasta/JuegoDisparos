"use client";

import * as C from '@/lib/game-constants';

type EnemyShotProps = {
  x: number;
  y: number;
};

export function EnemyShot({ x, y }: EnemyShotProps) {
  return (
    <div
      style={{
        left: x,
        top: y,
        width: C.ENEMY_SHOT_WIDTH,
        height: C.ENEMY_SHOT_HEIGHT,
      }}
      className="absolute bg-accent rounded-sm"
      role="img"
      aria-label="Enemy shot"
    />
  );
}
