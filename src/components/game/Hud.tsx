import { PixelHeart } from "@/components/icons/PixelHeart";

type HudProps = {
  score: number;
  lives: number;
  level: number;
};

export function Hud({ score, lives, level }: HudProps) {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between text-accent font-headline text-lg md:text-xl z-10 pointer-events-none">
      <div className="flex items-center gap-4">
        <span>SCORE</span>
        <span>{String(score).padStart(5, '0')}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>LEVEL</span>
        <span>{level}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>LIVES</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: lives > 0 ? lives : 0 }).map((_, i) => (
            <PixelHeart key={i} className="w-6 h-6" />
          ))}
        </div>
      </div>
    </div>
  );
}
