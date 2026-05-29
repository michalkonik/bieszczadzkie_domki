/* Hosts (family intro) + Houses showcase */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const L = window.L;

  // ---- HOSTS ----
  window.Hosts = function Hosts({ data, lang }) {
    const [imgOk, setImgOk] = useState(true);
    const stamp = L(data.stamp, lang);
    return (
      <section className="hosts pad" id="gospodarze">
        <div className="wrap hosts-grid">
          <div className="hosts-portrait">
            <div className="frame">
              {imgOk ? (
                <img src={data.portrait} alt="Genowefa & Adam" onError={() => setImgOk(false)} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "rgba(255,255,255,.85)", fontFamily: "var(--font-script)", fontSize: 32 }}>Genowefa &amp; Adam</div>
              )}
            </div>
            <div className="stamp">
              {stamp.split("\n").map((s, k) => <span key={k}>{s} </span>)}
              <small>{data.stamp.since}</small>
            </div>
          </div>
          <div className="hosts-copy">
            <span className="eyebrow">{L(data.eyebrow, lang)}</span>
            <h2 style={{ marginTop: 16 }}>{L(data.title, lang)}</h2>
            {L(data.body, lang).map((p, k) => (
              <p key={k} className={k === 0 ? "lede" : ""} style={k > 0 ? { marginTop: 16, color: "var(--text-soft)" } : null}>{p}</p>
            ))}
            <p className="signature">{data.signature}</p>

            <div className="pets">
              {data.pets.map((pet) => (
                <span className="pet" key={pet.name}>
                  <span className="ava" style={{ background: pet.c }}>{pet.glyph}</span>
                  <span><span className="nm">{pet.name}</span><span className="role">{L(pet.role, lang)}</span></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // ---- HOUSES ----
  function House({ h, lang, flip, capPos }) {
    return (
      <div className={"house" + (flip ? " flip" : "")}>
        <div className="house-media">
          <window.Slideshow slides={h.slides} lang={lang} rounded={true} capPosition={capPos} />
        </div>
        <div className="house-info">
          <span className="house-num">{h.num}</span>
          <h3>{L(h.name, lang)}</h3>
          <p className="lede">{L(h.lede, lang)}</p>
          <div className="house-feats">
            {h.feats.map((f, k) => (
              <div className="feat" key={k}>
                <span className="ic"><Icon name={f.ic} size={20} /></span>
                {L(f.t, lang)}
              </div>
            ))}
          </div>
          <div className="house-cta">
            <span className="price"><b>{h.price.val}</b> <span>{L(h.price.unit, lang)}</span></span>
            <a href="#kontakt" className="btn btn-primary">{lang === "pl" ? "Zapytaj o termin" : "Ask about dates"} <Icon name="arrowRight" size={18} /></a>
          </div>
        </div>
      </div>
    );
  }

  window.Houses = function Houses({ data, lang, capPos, header }) {
    return (
      <section className="pad" id="domki">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{L(header.eyebrow, lang)}</span>
            <h2>{L(header.title, lang)}</h2>
            <p className="lede">{L(header.lede, lang)}</p>
          </div>
          {data.map((h, k) => (
            <React.Fragment key={k}>
              <House h={h} lang={lang} flip={k % 2 === 1} capPos={capPos} />
              {k < data.length - 1 ? <div className="houses-sep"></div> : null}
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  };
})();
