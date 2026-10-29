import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { contact, copyright, navItems } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-grid">
          <div>
            <Brand footer />
            <p>
              Solusi rental CCTV premium untuk event penting dan eksklusif. Cocok untuk wedding,
              birthday, wisuda, seminar, gathering, hingga turnamen.
            </p>
          </div>
          <div>
            <h4>Halaman</h4>
            <ul className="footer-links">
              {navItems
                .filter(({ href }) => href !== "/kontak")
                .map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4>Hubungi Kami</h4>
            <div className="footer-contact">
              <a href={contact.mailto}>
                <Icon name="mail" />
                <span>
                  <strong style={{ display: "block", color: "#fff" }}>Email</strong>
                  {contact.email}
                </span>
              </a>
              <a href={contact.whatsappUrl} rel="noreferrer" target="_blank">
                <WhatsAppIcon variant="gold" />
                <span>
                  <strong style={{ display: "block", color: "#fff" }}>WhatsApp</strong>
                  {contact.whatsappLabel}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">{copyright}</div>
    </footer>
  );
}
