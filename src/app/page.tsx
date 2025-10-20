import GameContainer from '@/components/game/GameContainer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-headline">
      <h1 className="text-2xl md:text-4xl text-primary mb-4 animate-pulse text-center">Retro Star Savior</h1>
      
      <GameContainer />

      <div className="mt-4 text-accent text-center text-xs md:text-sm space-y-2">
        <p>
          Use <kbd className="p-2 bg-accent text-background rounded-md">Arrow Keys</kbd> to Move
        </p>
        <p>
          Use <kbd className="p-2 bg-accent text-background rounded-md">Spacebar</kbd> to Shoot
        </p>
      </div>
    </main>
  );
}
