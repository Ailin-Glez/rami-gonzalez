import { useEffect, useState } from "react";

const LINKS = [
  { href: "#tickets", label: "Tickets" },
  { href: "#contacto", label: "Pide tu ciudad" },
  { href: "#sobre-mi", label: "Sobre mí" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <a
        href="#top"
        className={`navbar__logo ${pastHero ? "" : "navbar__logo--hide-mobile"}`}
      >
        RAMI<span>GONZÁLEZ</span>
        <span className="navbar__logo-tag">  comediante</span>
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
