import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      className="brand"
      href="/"
      style={footer ? { marginBottom: 14, display: "inline-flex" } : undefined}
    >
      <Image
        {...images.logo}
        alt="Moment View Logo"
        className="brand-icon"
        draggable={false}
        sizes="48px"
      />
      <div className="brand-text">
        <div className="brand-name" style={footer ? { color: "#fff" } : undefined}>
          Moment <span style={footer ? { color: "var(--gold-2)" } : undefined}>View</span>
        </div>
        <div
          className="brand-tag"
          style={footer ? { display: "block", color: "rgba(255,255,255,.66)" } : undefined}
        >
          Rental CCTV for Event
        </div>
      </div>
    </Link>
  );
}
