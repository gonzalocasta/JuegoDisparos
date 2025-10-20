import * as C from '@/lib/game-constants';

type ShotProps = {
  x: number;
  y: number;
};

export function Shot({ x, y }: ShotProps) {
  return (
    <div
      style={{
        left: x,
        top: y,
        width: C.SHOT_WIDTH,
        height: C.SHOT_HEIGHT,
      }}
      className="absolute bg-primary rounded-sm"
      role="img"
      aria-label="Player shot"
    />
  );
}
