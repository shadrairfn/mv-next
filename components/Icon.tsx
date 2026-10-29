import type { ReactNode } from "react";

const icons = {
  shield: (
    <>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path d="M9.5 12.5l1.7 1.7 3.8-4" />
    </>
  ),
  camera: (
    <>
      <path d="M3 9h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3z" />
      <path d="M17 12l4-2.5v9L17 16z" />
      <circle cx="9" cy="14" r="3" />
    </>
  ),
  monitor: (
    <>
      <rect height="12" rx="2" width="18" x="3" y="4" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </>
  ),
  grid: (
    <>
      <rect height="6" rx="1" width="6" x="4" y="4" />
      <rect height="6" rx="1" width="6" x="14" y="4" />
      <rect height="6" rx="1" width="6" x="4" y="14" />
      <rect height="6" rx="1" width="6" x="14" y="14" />
    </>
  ),
  mobile: (
    <>
      <rect height="19" rx="2.2" width="10" x="7" y="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  box: (
    <>
      <path d="M4 8h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
      <path d="M9 8V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2" />
    </>
  ),
  event: (
    <>
      <path d="M16 4l4 4-8 8-4-4 8-8z" />
      <path d="M14.5 5.5l4 4" />
      <path d="M4 20c1.5-3 4-4 8-4" />
      <circle cx="7" cy="8" r="3" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M8.5 16a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
      <path d="M2 9a16 16 0 0 1 20 0" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-2.4 2.4-2.3 3-3z" />
      <path d="M14 15l5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  mail: (
    <>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  hd: (
    <>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M7 12h4" />
      <path d="M7 9v6" />
      <path d="M14 9v6" />
      <path d="M14 12h2.5a1.5 1.5 0 1 0 0-3H14v6h2.8a1.4 1.4 0 1 0 0-2.8H14" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  strokeWidth?: number;
  /** The hamburger icon in the original markup uses the default (butt) line caps. */
  round?: boolean;
};

export function Icon({ name, strokeWidth = 1.8, round = true }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap={round ? "round" : undefined}
      strokeLinejoin={round ? "round" : undefined}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
    >
      {icons[name]}
    </svg>
  );
}
