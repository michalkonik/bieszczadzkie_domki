/* Contact (form + details + mini map) + Footer */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const L = window.L;

  window.Contact = function Contact({ data, lang }) {
    const [sent, setSent] = useState(false);
    const f = data.form;
    const submit = (e) => { e.preventDefault(); setSent(true); };
    return (
      <section className="contact pad" id="kontakt">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow on-dark">{L(data.eyebrow, lang)}</span>
            <h2 style={{ marginTop: 16, fontSize: "clamp(32px,4.4vw,54px)" }}>{L(data.title, lang)}</h2>
            <p className="lede on-dark" style={{ marginTop: 20, fontSize: 19 }}>{L(data.lede, lang)}</p>

            <div className="contact-details" style={{ marginTop: 28 }}>
              {data.rows.map((r, k) => (
                <div className="cd-row" key={k}>
                  <span className="ic"><Icon name={r.ic} size={22} /></span>
                  <div>
                    <div className="lab">{L(r.lab, lang)}</div>
                    <div className="val">{r.href ? <a href={r.href}>{r.val}</a> : r.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="map-mini">
              <div className="map-pin"><span className="pulse"></span><Icon name="mapPin" size={30} /></div>
              <div className="map-label">{L(data.mapLabel, lang)}</div>
            </div>
          </div>

          <form className="contact-card" onSubmit={submit}>
            <h3>{L(data.formTitle, lang)}</h3>
            <div className="field"><label>{L(f.name, lang)}</label><input type="text" required placeholder={lang === "pl" ? "Jan Kowalski" : "Jane Doe"} /></div>
            <div className="field-row">
              <div className="field"><label>{L(f.email, lang)}</label><input type="email" required placeholder="@" /></div>
              <div className="field"><label>{L(f.guests, lang)}</label><input type="number" min="1" max="12" defaultValue="4" /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>{L(f.dates, lang)}</label><input type="text" placeholder={lang === "pl" ? "12–16 lipca" : "12–16 July"} /></div>
              <div className="field"><label>{L(f.house, lang)}</label>
                <select>
                  {(window.DATA.houses || []).map((h, i) => <option key={i}>{L(h.name, lang)}</option>)}
                  <option>{L(f.house_any, lang)}</option>
                </select>
              </div>
            </div>
            <div className="field"><label>{L(f.msg, lang)}</label><textarea rows="3" placeholder={lang === "pl" ? "Kilka słów o Waszym pobycie…" : "A few words about your stay…"}></textarea></div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 18 }}>{L(f.send, lang)} <Icon name="arrowRight" size={18} /></button>
            {sent ? <div className="form-ok">{L(f.ok, lang)}</div> : null}
          </form>
        </div>
      </section>
    );
  };

  // ---- FOOTER ----
  window.Footer = function Footer({ data, lang }) {
    return (
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <window.Logo />
              <p className="blurb">{L(data.blurb, lang)}</p>
              <div className="footer-social">
                <a href={data.facebook || "#"} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" size={20} /></a>
                <a href={data.facebook || "#"} target="_blank" rel="noopener" aria-label="Instagram"><Icon name="instagram" size={20} /></a>
                <a href={"mailto:" + (window.DATA.site.email || "")} aria-label="Email"><Icon name="mail" size={20} /></a>
              </div>
            </div>
            {data.cols.map((c, k) => (
              <div key={k}>
                <h4>{L(c.h, lang)}</h4>
                {c.links.map((l, j) => <a className="fl" href="#" key={j}>{L(l, lang)}</a>)}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span>{L(data.copy, lang)}</span>
            <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon name="leaf" size={15} /> {lang === "pl" ? "Projekt z miłości do gór" : "Designed with love for the mountains"}</span>
          </div>
        </div>
      </footer>
    );
  };
})();
