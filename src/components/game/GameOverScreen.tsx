import { Button } from "@/components/ui/button";

type GameOverScreenProps = {
  gameState: 'start' | 'gameOver' | 'gameWon';
  onRestart: () => void;
  score: number;
};

export function GameOverScreen({ gameState, onRestart, score }: GameOverScreenProps) {
  if (gameState === 'playing') return null;

  const messages = {
    start: { title: "Retro Star Savior", subtitle: "Press START to Play" },
    gameOver: { title: "GAME OVER", subtitle: `Final Score: ${score}` },
    gameWon: { title: "YOU WIN!", subtitle: `Congratulations! Final Score: ${score}` },
  };
  
  const message = messages[gameState];

  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 text-center font-headline p-4">
      <h1 className="text-3xl md:text-5xl text-primary animate-pulse">{message.title}</h1>
      <p className="text-lg md:text-2xl text-accent mt-4 mb-8">{message.subtitle}</p>
      <Button 
        onClick={onRestart} 
        variant="outline" 
        className="text-xl md:text-2xl px-8 py-6 border-2 border-accent text-accent hover:bg-accent hover:text-background focus:bg-accent focus:text-background"
        aria-label={gameState === 'start' ? 'Start Game' : 'Restart Game'}
      >
        {gameState === 'start' ? 'START' : 'RESTART'}
      </Button>
    </div>
  );
}
