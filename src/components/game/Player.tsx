import * as C from '@/lib/game-constants';

type PlayerProps = {
  x: number;
  y: number;
};

export function Player({ x, y }: PlayerProps) {
  return (
    <div
      style={{
        left: x,
        top: y,
        width: 0,
        height: 0,
        borderLeft: `${C.PLAYER_WIDTH / 2}px solid transparent`,
        borderRight: `${C.PLAYER_WIDTH / 2}px solid transparent`,
        borderBottom: `${C.PLAYER_HEIGHT}px solid hsl(var(--primary))`,
      }}
      className="absolute"
      role="img"
      aria-label="Player ship"
    />
  );
}
