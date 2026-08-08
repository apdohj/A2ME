import { games, type GameConfig } from "@/lib/gameData";

export function GameLogo({
  game,
  className = "h-5 w-auto",
}: {
  game: GameConfig;
  className?: string;
}) {
  if (game.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={game.logo}
        alt={`${game.name} logo`}
        className={`${className} object-contain`}
        draggable={false}
      />
    );
  }
  return <span className="text-lg">{game.icon}</span>;
}

export function GameLogoById({
  id,
  name,
  className,
}: {
  id?: string;
  name?: string;
  className?: string;
}) {
  const game = games.find((g) => g.id === id) ?? games.find((g) => g.name === name);
  if (!game) return null;
  return <GameLogo game={game} className={className} />;
}
