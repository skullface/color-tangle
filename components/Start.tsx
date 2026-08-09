import Link from "next/link";

type Props = {
  onStart: () => void;
};

export function Start({ onStart }: Props) {
  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <h1 className="font-franklin text-3xl font-semibold">Color Tangle</h1>
      <p className="font-source-serif text-center text-balance">
        Match the color name to its swatch. Inspired by the Iron Tangle from{" "}
        <Link href="https://mattdinniman.com/books/the-dungeon-anarchists-cookbook/">
          <cite>The Dungeon Anarchist’s Cookbook</cite> by Matt Dinniman
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={onStart}
        className="cursor-pointer py-2 px-3 rounded-sm text-sm font-franklin font-semibold border border-(--fg) hover:bg-(--fg) hover:text-(--bg)"
      >
        Start
      </button>
    </main>
  );
}
