import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  arrow?: boolean;
  accent?: string;
};

export function Button({
  arrow = false,
  accent,
  className,
  style,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer select-none",
        "py-2 px-3 rounded-sm text-sm font-franklin font-semibold border",
        arrow && "group",
        "bg-(--fg) text-(--bg)",
        "hover:bg-transparent hover:text-(--fg)",
        accent
          ? "hover:border-(--accent) max-md:bg-(--bg) max-md:text-(--fg) max-md:border-(--accent) max-md:hover:bg-(--fg) max-md:hover:text-(--bg) max-md:hover:border-(--fg)"
          : "hover:border-(--fg)/50",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-(--fg)/50",
        className,
      )}
      style={
        accent
          ? ({
              "--accent": accent,
              ...style,
            } as CSSProperties)
          : style
      }
      {...props}
    >
      {children}
      {arrow ? (
        <span
          className={cn(
            "opacity-50",
            accent &&
              "group-hover:text-(--accent) group-hover:opacity-100 max-md:opacity-100 max-md:text-(--accent) max-md:group-hover:text-(--bg)!",
          )}
        >
          {" "}
          &rarr;
        </span>
      ) : null}
    </button>
  );
}
