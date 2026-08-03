import { Game } from "@/components/Game";
import { getGameConfig } from "@/lib/config";

export default async function Home() {
  const config = await getGameConfig();

  return (
    <main>
      <Game config={config} />
    </main>
  );
}
