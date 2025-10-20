import { PixelStar } from "@/components/icons/PixelStar";
import * as C from "@/lib/game-constants";

type StarProps = {
  x: number;
  y: number;
};

export function Star({ x, y }: StarProps) {
  return (
    <PixelStar
      style={{
        left: x,
        top: y,
        width: C.STAR_SIZE,
        height: C.STAR_SIZE,
      }}
      className="absolute text-primary animate-ping"
      role="img"
      aria-label="Explosion star"
    />
  );
}
