/* Attractions (Nearby / Wider region tabs) + Facebook-style Reviews */
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const L = window.L;

  window.Attractions = function Attractions({ data, lang }) {
    const [tab, setTab] = useState(data.tabs[0].id);
    const list = data[tab] || [];
    return (
      <section className="attractions pad" id="atrakcje">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow on-dark">{L(data.eyebrow, lang)}</span>
            <h2>{L(data.title, lang)}</h2>
            <p className="lede on-dark">{L(data.lede, lang)}</p>
            <div className="attr-tabs">
              {data.tabs.map((t) => (
                <button key={t.id} className={"attr-tab" + (tab === t.id ? " active" : "")} onClick={() => setTab(t.id)}>{L(t.label, lang)}</button>
              ))}
            </div>
          </div>
          {/* one slideshow per tab — slides scale to the folder's file count */}
          <div className="attr-stage">
            {list.length ? (
              <window.Slideshow key={tab} slides={list} lang={lang} rounded={true} capPosition="bottom" />
            ) : null}
          </div>
        </div>
      </section>
    );
  };

  // ---- REVIEWS (Facebook style) ----
  function Stars({ n = 5 }) {
    return <span className="rev-stars" aria-label={n + " / 5"}>{Array.from({ length: n }).map((_, k) => <Icon key={k} name="star" size={14} style={{ display: "inline-block", verticalAlign: "-2px" }} />)}</span>;
  }

  window.Reviews = function Reviews({ data, lang }) {
    return (
      <section className="reviews pad" id="opinie">
        <div className="wrap">
          <div className="reviews-top">
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">{L(data.eyebrow, lang)}</span>
              <h2 style={{ marginTop: 16 }}>{L(data.title, lang)}</h2>
            </div>
            <div className="fb-summary">
              <span className="score">{data.score}</span>
              <div>
                <div className="stars"><Icon name="star" size={18} style={{ display: "inline-block" }} /><Icon name="star" size={18} style={{ display: "inline-block" }} /><Icon name="star" size={18} style={{ display: "inline-block" }} /><Icon name="star" size={18} style={{ display: "inline-block" }} /><Icon name="star" size={18} style={{ display: "inline-block" }} /></div>
                <div className="fb-logo"><Icon name="facebook" size={16} /> Facebook</div>
                <div className="meta">{L(data.count, lang)}</div>
              </div>
            </div>
          </div>

          <div className="reviews-grid">
            {data.items.map((r, k) => (
              <article className="review-card" key={k}>
                <div className="rev-head">
                  <span className="rev-ava" style={{ background: r.c }}>{r.name[0]}</span>
                  <div>
                    <div className="rev-name">{r.name}</div>
                    <div className="rev-when"><Icon name="clock" size={12} /> {L(r.when, lang)}</div>
                  </div>
                </div>
                <Stars n={5} />
                <p className="rev-text">{L(r.text, lang)}</p>
                <div className="rev-foot">
                  <span><Icon name="thumbsUp" size={15} /> {lang === "pl" ? "Pomocna" : "Helpful"}</span>
                  <span><Icon name="message" size={15} /> {lang === "pl" ? "Komentarz" : "Comment"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  };
})();
