import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

type CardProps = {
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Renders the card as a link, with `note` as its call-to-action line. */
  href?: string;
  note?: string;
  className?: string;
};

export function Card({ icon, title, children, href, note, className = "card" }: CardProps) {
  const content = (
    <>
      <div className="icon-wrap">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      {note && <div className="mini-note">{note}</div>}
    </>
  );

  return href ? (
    <Link className={className} href={href}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
