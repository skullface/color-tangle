import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  arrow?: boolean;
  accent?: string;
};

export function Button({
  variant = "primary",
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
        variant === "primary" && [
          "border-(--fg) bg-(--fg) text-(--bg)",
          "hover:bg-transparent hover:text-(--fg) hover:border-(--fg)/50",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-(--fg)/50",
        ],
        variant === "secondary" &&
          (accent
            ? [
                "hover:bg-(--fg) hover:text-(--bg) hover:border-(--fg)!",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
              ]
            : "border-(--fg)/50 hover:bg-(--fg) hover:text-(--bg) hover:border-(--fg)"),
        className,
      )}
      style={
        accent
          ? ({
              borderColor: accent,
              "--accent": accent,
              ...style,
            } as CSSProperties)
          : style
      }
      {...props}
    >
      {children}
      {arrow ? (
        <>
          {accent ? "\u00A0" : " "}
          <span
            className={
              accent
                ? "group-hover:text-inherit!"
                : "opacity-50 group-hover:opacity-100"
            }
            style={accent ? { color: accent } : undefined}
          >
            &rarr;
          </span>
        </>
      ) : null}
    </button>
  );
}
