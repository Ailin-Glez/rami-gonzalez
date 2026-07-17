import { useEffect, useState } from "react";

const LINKS = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#tickets", label: "Tickets" },
  { href: "#contacto", label: "Llévame a tu ciudad" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <a href="#top" className="navbar__logo">
        RAMI<span>GONZÁLEZ</span>
      </a>

      <nav className={`navbar__links ${open ? "navbar__links--open" : ""}`}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>

      <button
        className={`navbar__burger ${open ? "navbar__burger--open" : ""}`}
        aria-label="Abrir menú"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
