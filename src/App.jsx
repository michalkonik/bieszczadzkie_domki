/* ============================================================
   App — language state, theme + Tweaks wiring, composition
   ============================================================ */
const { useState, useEffect } = React;

// palette token overrides applied to :root
const PALETTES = {
  forest: {
    "--bg": "#f5efe3", "--bg-alt": "#efe7d6", "--bg-deep": "#2e3d2f", "--bg-deep-2": "#1a261c",
    "--surface": "#ffffff", "--surface-warm": "#faf6ec",
    "--primary": "#2e3d2f", "--accent": "#c98a3a", "--accent-deep": "#a8651f",
    "--text": "#2a241b", "--text-soft": "#6b5c44",
    "--line": "rgba(42,36,27,0.12)",
  },
  dawn: {
    "--bg": "#eef0ea", "--bg-alt": "#e4e7df", "--bg-deep": "#4d6149", "--bg-deep-2": "#3b4d3c",
    "--surface": "#ffffff", "--surface-warm": "#f6f7f2",
    "--primary": "#4d6149", "--accent": "#c2782a", "--accent-deep": "#9e5f24",
    "--text": "#2c2f2a", "--text-soft": "#5f665b",
    "--line": "rgba(44,47,42,0.12)",
  },
  campfire: {
    "--bg": "#1c1813", "--bg-alt": "#241f18", "--bg-deep": "#14100c", "--bg-deep-2": "#0f0c08",
    "--surface": "#262019", "--surface-warm": "#2e271e",
    "--primary": "#e8c07a", "--accent": "#d99a4e", "--accent-deep": "#c2782a",
    "--text": "#f1ead9", "--text-soft": "#c2b59a",
    "--line": "rgba(241,234,217,0.14)",
  },
};

const DISPLAY_FONTS = {
  "Alegreya": "'Alegreya', Georgia, serif",
  "Bitter": "'Bitter', Georgia, serif",
  "Marcellus": "'Marcellus', Georgia, serif",
  "Spectral": "'Spectral', Georgia, serif",
};
const BODY_FONTS = {
  "Mulish": "'Mulish', system-ui, sans-serif",
  "Karla": "'Karla', system-ui, sans-serif",
  "Source Sans 3": "'Source Sans 3', system-ui, sans-serif",
  "Nunito Sans": "'Nunito Sans', system-ui, sans-serif",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forest",
  "displayFont": "Alegreya",
  "bodyFont": "Mulish",
  "accent": "#c98a3a",
  "heroAlign": "left",
  "captionPos": "bottom",
  "grain": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState(() => localStorage.getItem("bz_lang") || "pl");
  useEffect(() => { localStorage.setItem("bz_lang", lang); document.documentElement.lang = lang; }, [lang]);

  // apply theme tokens
  useEffect(() => {
    const root = document.documentElement;
    const pal = PALETTES[t.palette] || PALETTES.forest;
    Object.entries(pal).forEach(([k, v]) => root.style.setProperty(k, v));
    // accent override (curated swatch) wins over palette accent
    if (t.accent) {
      root.style.setProperty("--accent", t.accent);
      // derive a slightly deeper accent for the eyebrow/links
      root.style.setProperty("--accent-deep", t.accent);
    }
    root.style.setProperty("--font-display", DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS.Alegreya);
    root.style.setProperty("--font-body", BODY_FONTS[t.bodyFont] || BODY_FONTS.Mulish);
    root.style.setProperty("--grain-opacity", t.grain ? "0.05" : "0");
  }, [t.palette, t.accent, t.displayFont, t.bodyFont, t.grain]);

  const D = window.DATA;
  const ctaLabel = lang === "pl" ? "Rezerwacja" : "Book now";

  return (
    <React.Fragment>
      <window.Nav lang={lang} setLang={setLang} links={D.nav} ctaLabel={ctaLabel} />
      <main>
        <window.Hero data={D.hero} lang={lang} align={t.heroAlign} />
        <window.Hosts data={D.hosts} lang={lang} />
        <window.Houses data={D.houses} lang={lang} capPos={t.captionPos} header={D.housesHeader} />
        <window.Attractions data={D.attractions} lang={lang} />
        <window.Reviews data={D.reviews} lang={lang} />
        <window.Contact data={D.contact} lang={lang} />
        <window.Footer data={D.footer} lang={lang} />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label={lang === "pl" ? "Kolorystyka" : "Palette"} />
        <TweakRadio label={lang === "pl" ? "Nastrój" : "Mood"} value={t.palette}
          options={[{ value: "forest", label: "Forest" }, { value: "dawn", label: "Dawn" }, { value: "campfire", label: "Campfire" }]}
          onChange={(v) => { setTweak("palette", v); setTweak("accent", PALETTES[v]["--accent"]); }} />
        <TweakColor label={lang === "pl" ? "Akcent" : "Accent"} value={t.accent}
          options={["#c98a3a", "#a8651f", "#7a8b6f", "#758c8f"]}
          onChange={(v) => setTweak("accent", v)} />

        <TweakSection label={lang === "pl" ? "Typografia" : "Typography"} />
        <TweakSelect label={lang === "pl" ? "Nagłówki" : "Headings"} value={t.displayFont}
          options={Object.keys(DISPLAY_FONTS)} onChange={(v) => setTweak("displayFont", v)} />
        <TweakSelect label={lang === "pl" ? "Tekst" : "Body"} value={t.bodyFont}
          options={Object.keys(BODY_FONTS)} onChange={(v) => setTweak("bodyFont", v)} />

        <TweakSection label={lang === "pl" ? "Układ" : "Layout"} />
        <TweakRadio label={lang === "pl" ? "Hero" : "Hero text"} value={t.heroAlign}
          options={[{ value: "left", label: lang === "pl" ? "Lewo" : "Left" }, { value: "center", label: lang === "pl" ? "Środek" : "Center" }]}
          onChange={(v) => setTweak("heroAlign", v)} />
        <TweakToggle label={lang === "pl" ? "Ziarno filmowe" : "Film grain"} value={t.grain}
          onChange={(v) => setTweak("grain", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

function mount() {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

window.loadContent().then(mount).catch(() => {
  document.getElementById("root").innerHTML =
    '<div style="min-height:100vh;display:grid;place-items:center;font-family:system-ui;color:#6b5c44;text-align:center;padding:40px">' +
    '<div><h2 style="font-size:24px;margin-bottom:8px">Nie udało się wczytać treści</h2>' +
    '<p>Sprawdź plik <code>content.yaml</code> (musi być serwowany przez serwer, nie z dysku).</p></div></div>';
});
