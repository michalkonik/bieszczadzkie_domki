/* Logo wordmark, Nav (transparent→solid, PL/EN toggle), Hero */
(function () {
  const { useState, useEffect } = React;
  const Icon = window.Icon;
  const L = window.L;

  // ---- LOGO: a little gabled wooden house + fir mark ----
  function LogoMark() {
    return (
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#131d16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.5V20h14v-9.5" />
          <path d="M10 20v-5h4v5" />
          <path d="M12 7.2 12 9" />
        </svg>
      </span>
    );
  }
  window.LogoMark = LogoMark;

  window.Logo = function Logo() {
    return (
      <a className="logo" href="#top" aria-label="bieszkacje.pl">
        <LogoMark />
        <span className="logo-word">bieszkacje<span className="dot">.pl</span></span>
      </a>
    );
  };

  window.Nav = function Nav({ lang, setLang, links, ctaLabel }) {
    const [solid, setSolid] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
      const onScroll = () => setSolid(window.scrollY > 80);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const LangToggle = () => (
      <div className="lang" role="group" aria-label="Language">
        <button className={lang === "pl" ? "active" : ""} onClick={() => setLang("pl")}>PL</button>
        <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
      </div>
    );

    return (
      <React.Fragment>
        <header className={"nav" + (solid ? " solid" : "")}>
          <div className="wrap nav-inner">
            <window.Logo />
            <nav className="nav-links">
              {links.map((l) => (
                <a className="nav-link" key={l.id} href={"#" + l.id}>{L(l.label, lang)}</a>
              ))}
            </nav>
            <div className="nav-right">
              <LangToggle />
              <a href="#kontakt" className="btn btn-primary" style={{ padding: "11px 22px", fontSize: 15 }}>{ctaLabel}</a>
              <button className="nav-burger" onClick={() => setOpen(true)} aria-label="Menu"><Icon name="menu" size={26} /></button>
            </div>
          </div>
        </header>

        <div className={"mobile-menu" + (open ? " open" : "")}>
          <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close"><Icon name="x" size={28} /></button>
          {links.map((l) => (
            <a key={l.id} href={"#" + l.id} onClick={() => setOpen(false)}>{L(l.label, lang)}</a>
          ))}
          <div style={{ marginTop: 24 }}><LangToggle /></div>
        </div>
      </React.Fragment>
    );
  };

  // ---- HERO ----
  window.Hero = function Hero({ data, lang, align }) {
    const tl = L(data.tagline, lang);
    return (
      <section className="hero" id="top" data-align={align || "left"}>
        <div className="hero-bg">
          <window.Slideshow slides={data.slides} lang={lang} interval={6000} showCounter={false} showCaption={false} showDots={false} kenburns={true} />
        </div>
        <div className="hero-scrim"></div>
        <div className="hero-content">
          <div className="wrap">
            <span className="hero-kicker">{L(data.kicker, lang)}</span>
            <h1 className="hero-tagline">
              {tl.map((line, k) => (
                <span key={k} style={{ display: "block" }}>
                  {k === tl.length - 1 ? <span className="accent">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="hero-sub">{L(data.sub, lang)}</p>
            <div className="hero-actions">
              <a href="#kontakt" className="btn btn-primary">{L(data.ctaPrimary, lang)} <Icon name="arrowRight" size={18} /></a>
              <a href="#domki" className="btn btn-on-dark">{L(data.ctaGhost, lang)}</a>
            </div>
          </div>
        </div>
        <div className="wrap hero-meta">
          <span>{data.coords || "49.3°N · 22.5°E — Bieszczady, PL"}</span>
          <span className="scroll-cue">{lang === "pl" ? "PRZEWIŃ" : "SCROLL"}<span className="line"></span></span>
        </div>
      </section>
    );
  };
})();
