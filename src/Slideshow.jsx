/* ============================================================
   Universal media Slideshow — the core repeated component.
   Photos + video slides, title overlays, arrow controls,
   dots, counter, autoplay progress, graceful image fallback.
   window.Slideshow
   ============================================================ */
(function () {
  const { useState, useEffect, useRef, useCallback } = React;
  const Icon = window.Icon;

  // a single slide's media with gradient fallback when the photo 404s
  function Media({ slide, active, lang }) {
    const [ok, setOk] = useState(true);
    const videoRef = useRef(null);
    const isVideo = !!slide.video && !!slide.img;

    // play the video only while its slide is the active one
    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      if (active) {
        try { v.currentTime = 0; } catch (e) {}
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    }, [active, isVideo]);

    return (
      <div className="slide-media-wrap">
        <div className="slide-media" style={{
          backgroundImage: !isVideo && ok && slide.img ? `url("${slide.img}")` : (slide.tint || undefined),
        }}>
          {isVideo ? (
            <video ref={videoRef} src={slide.img} muted loop playsInline preload="metadata"
              onError={() => setOk(false)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : ok && slide.img ? (
            <img src={slide.img} alt={window.L(slide.title, lang) || ""} loading="lazy"
              onError={() => setOk(false)}
              style={{ width: "100%", height: "100%", objectFit: "cover", animation: active ? "kenburns 9s ease-out forwards" : "none" }} />
          ) : null}
        </div>
        <div className="slide-scrim"></div>
      </div>
    );
  }

  window.Slideshow = function Slideshow({ slides, lang, rounded, capPosition, autoplay = true, interval = 5200, showCounter = true, showCaption = true, showDots = true, kenburns = true }) {
    const [i, setI] = useState(0);
    const [paused, setPaused] = useState(false);
    const barRef = useRef(null);
    const n = slides.length;

    const go = useCallback((d) => setI((p) => (p + d + n) % n), [n]);
    const jump = (k) => setI(k);

    // autoplay + progress bar
    useEffect(() => {
      if (!autoplay || paused || n <= 1) return;
      const bar = barRef.current;
      if (bar) {
        bar.style.transition = "none"; bar.style.width = "0%";
        // force reflow then animate
        void bar.offsetWidth;
        bar.style.transition = `width ${interval}ms linear`; bar.style.width = "100%";
      }
      const t = setTimeout(() => go(1), interval);
      return () => clearTimeout(t);
    }, [i, paused, autoplay, interval, n, go]);

    // keyboard when hovered/focused
    const rootRef = useRef(null);
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    return (
      <div className={"slideshow" + (rounded ? " rounded" : "")}
        data-cap={capPosition || "bottom"}
        ref={rootRef} tabIndex={0} onKeyDown={onKey}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel">
        {autoplay && n > 1 ? (
          <div className="slide-progress"><div className="bar" ref={barRef}></div></div>
        ) : null}

        {slides.map((s, k) => (
          <div className={"slide" + (k === i ? " active" : "")} key={k} aria-hidden={k !== i}>
            <Media slide={s} active={k === i && kenburns} lang={lang} />
            {s.video ? (
              <div className="video-badge">
                <span className="play"><Icon name="play" size={12} /></span>
                {lang === "pl" ? "FILM" : "VIDEO"}
              </div>
            ) : null}
            <div className="slide-caption" style={showCaption ? null : { display: "none" }}>
              {s.kicker ? <span className="cap-kicker">{window.L(s.kicker, lang)}</span> : null}
              {s.title ? <span className="cap-title">{window.L(s.title, lang)}</span> : null}
              {s.sub ? <span className="cap-sub">{window.L(s.sub, lang)}</span> : null}
            </div>
          </div>
        ))}

        {n > 1 ? (
          <React.Fragment>
            <button className="slide-arrow prev" onClick={() => go(-1)} aria-label="Previous"><Icon name="chevronLeft" size={26} /></button>
            <button className="slide-arrow next" onClick={() => go(1)} aria-label="Next"><Icon name="chevronRight" size={26} /></button>
            {showCounter ? (
              <div className="slide-counter">{String(i + 1).padStart(2, "0")}<span className="total"> / {String(n).padStart(2, "0")}</span></div>
            ) : null}
            {showDots ? (
            <div className="slide-dots">
              {slides.map((_, k) => (
                <button key={k} className={"dot" + (k === i ? " active" : "")} onClick={() => jump(k)} aria-label={"Slide " + (k + 1)}></button>
              ))}
            </div>
            ) : null}
          </React.Fragment>
        ) : null}
      </div>
    );
  };
})();
