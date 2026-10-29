"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { navItems } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  // The menu is "open for" the route it was opened on, so navigating away closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  // styles.css hides the page scroll and reveals the drawer through `body.menu-open`.
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpenOn(null);
  const links = navItems.map(({ href, label }) => (
    <Link
      className={`nav-link${pathname === href ? " active" : ""}`}
      href={href}
      key={href}
      onClick={close}
    >
      {label}
    </Link>
  ));

  return (
    <header className="site-header">
      <div className="container navbar">
        <Brand />
        <nav className="nav-links">
          {links}
          <Link className="nav-cta" href="/kontak" onClick={close}>
            Konsultasi Sekarang
          </Link>
        </nav>
        <button
          aria-expanded={open}
          aria-label="Buka menu"
          className="menu-btn"
          onClick={() => setOpenOn(open ? null : pathname)}
          type="button"
        >
          <Icon name="menu" round={false} strokeWidth={2} />
        </button>
      </div>
      <div className="mobile-drawer">
        {links}
        <Link className="nav-cta" href="/kontak" onClick={close}>
          Konsultasi Sekarang
        </Link>
      </div>
    </header>
  );
}
