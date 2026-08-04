import { Game } from "@/components/Game";
import { getGameConfig } from "@/lib/config";

export default async function Home() {
  const config = await getGameConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Game config={config} />
    </main>
  );
}
