import { cn } from "@/lib/utils";

function NavIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="block size-3 bg-current mask-contain mask-center mask-no-repeat"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  );
}

export function ResultsNavIcons({
  showingResults,
  frown,
}: {
  showingResults: boolean;
  frown: boolean;
}) {
  return (
    <span className="relative inline-grid size-3 place-items-center">
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          "motion-reduce:transition-opacity motion-reduce:duration-150",
          showingResults
            ? "pointer-events-none scale-0 motion-reduce:scale-100 motion-reduce:opacity-0"
            : "scale-100 motion-reduce:opacity-100",
        )}
      >
        <span className="inline-flex origin-center motion-safe:group-hover/wait:animate-[spin_4s_linear_infinite] motion-safe:hover:animate-[spin_4s_linear_infinite]">
          <NavIcon src="/wait.svg" />
        </span>
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          "motion-reduce:transition-opacity motion-reduce:duration-150",
          showingResults
            ? "scale-100 motion-reduce:opacity-100"
            : "pointer-events-none scale-0 motion-reduce:scale-100 motion-reduce:opacity-0",
        )}
      >
        <NavIcon src={frown ? "/frown.svg" : "/smiley.svg"} />
      </span>
    </span>
  );
}
