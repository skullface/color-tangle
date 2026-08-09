import Link from "next/link";

export function Info({}) {
  return (
    <div className="fixed bottom-4 right-4">
      <Link
        href="#"
        className="group/info inline-flex p-2 opacity-66 hover:opacity-100 focus-visible:opacity-100 ring ring-current/33 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="18"
          height="33"
          viewBox="0 0 18 33"
          className="size-4"
          aria-hidden
        >
          <path
            d="m3 9.21888c0-.62569.13438-2.60416.56198-3.85163.3969-1.15789 2.13312-1.94959 3.37268-2.24637 1.27637-.3056 2.39994.02633 3.25734.33709 2.9508 1.06951 3.6173 2.14051 4.1059 3.0004.7406 1.30341.1698 2.91112-.5405 4.71003-.2696.6828-.8927 1.2897-1.7158 2.0636-.8086.76-2.78499 1.9133-5.0749 3.276-.93205.5546-1.16278.8111-1.42262 1.1497-.24114.4113-.45023.9398-.59308 1.7284-.05213.4894-.06292 1.1602-.04426 1.888"
            pathLength={1}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            className="stroke-draw-hover stroke-draw-hover-1"
          />
          <path
            d="m5.2583 30.6603-.09521.1728"
            pathLength={1}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
            className="stroke-draw-hover stroke-draw-hover-2"
          />
        </svg>
      </Link>
    </div>
  );
}
