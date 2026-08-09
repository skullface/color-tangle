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

export function OutcomeIcon({
  showFace,
  frown,
}: {
  showFace: boolean;
  frown: boolean;
}) {
  return (
    <span className="relative inline-grid size-3 place-items-center">
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "transition-opacity duration-150",
          "motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          showFace
            ? "pointer-events-none opacity-0 motion-safe:scale-[0.95]"
            : "opacity-100 motion-safe:scale-100",
        )}
      >
        <WaitDotsIcon />
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 inline-flex",
          "transition-opacity duration-150",
          "motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]",
          showFace
            ? "opacity-100 motion-safe:scale-100"
            : "pointer-events-none opacity-0 motion-safe:scale-[0.95]",
        )}
      >
        <NavIcon src={frown ? "/frown.svg" : "/smiley.svg"} />
      </span>
    </span>
  );
}

const waitDotClass = cn(
  "wait-dot",
  "motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/wait:animate-[wait-dot-bounce_0.9s_ease-in-out_infinite]",
  "motion-safe:group-focus-visible/wait:animate-[wait-dot-bounce_0.9s_ease-in-out_infinite]",
);

function WaitDotsIcon() {
  return (
    <svg aria-hidden viewBox="0 0 34 8" fill="none" className="block size-3">
      <path
        className={waitDotClass}
        d="M3.00037 4.06876L3.05212 3.67715"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={waitDotClass}
        style={{ animationDelay: "0.3s" }}
        d="M16.8275 4.0004L16.9523 4.0463"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={waitDotClass}
        style={{ animationDelay: "0.6s" }}
        d="M30.222 3.0004L30.2797 3.39493"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
