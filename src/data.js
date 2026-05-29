/* ============================================================
   bieszkacje.pl — content loader
   Reads content.yaml (declarative, admin-editable) and maps it
   to window.DATA for the React components.
   Exposes: window.L (localize), window.loadContent() -> Promise
   ============================================================ */
(function () {
  // localize a { pl, en } value (or pass through plain strings/arrays)
  window.L = (v, lang) =>
    (v && typeof v === "object" && !Array.isArray(v) && ("pl" in v || "en" in v))
      ? (v[lang] || v.pl) : v;

  // gradient fallbacks behind photos (admin never edits these)
  const TINTS = [
    "linear-gradient(150deg, #2e3d2f, #758c8f)",
    "linear-gradient(150deg, #243528, #c2782a)",
    "linear-gradient(150deg, #3b4d3c, #8fa3a8)",
    "linear-gradient(150deg, #1a261c, #a8651f)",
    "linear-gradient(150deg, #4d6149, #c98a3a)",
  ];
  const withTints = (arr = []) =>
    arr.map((s, i) => ({ ...s, img: s.image || s.img, tint: TINTS[i % TINTS.length] }));

  // ---- dynamic galleries from photos/manifest.json ----
  const VIDEO_RE = /\.(mp4|mov|webm|ogg|m4v)$/i;

  // turn a file name into a human title:  "video_1.mp4" -> "video 1"
  const prettyName = (file) =>
    file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();

  // build a slide list from a manifest folder; slide count = file count,
  // titles taken from the file names, videos detected by extension.
  function galleryFromFolder(folder, manifest) {
    const files = (manifest && manifest[folder]) || [];
    return files.map((file, i) => {
      const name = prettyName(file);
      return {
        img: "photos/" + folder + "/" + file,
        video: VIDEO_RE.test(file),
        title: { pl: name, en: name },
        tint: TINTS[i % TINTS.length],
      };
    });
  }

  function transform(raw, manifest) {
    const site = raw.site || {};
    const c = raw.contact || {};
    const lbl = c.labels || {};

    return {
      site,

      nav: raw.nav || [],

      hero: {
        kicker: raw.hero.kicker,
        tagline: raw.hero.tagline,
        sub: raw.hero.sub,
        ctaPrimary: raw.hero.cta_primary,
        ctaGhost: raw.hero.cta_ghost,
        coords: site.coords_label,
        slides: raw.hero.photos_folder
          ? galleryFromFolder(raw.hero.photos_folder, manifest)
          : withTints(raw.hero.slides),
      },

      hosts: {
        eyebrow: raw.hosts.eyebrow,
        title: raw.hosts.title,
        signature: raw.hosts.signature,
        portrait: (() => {
          const g = raw.hosts.photos_folder ? galleryFromFolder(raw.hosts.photos_folder, manifest) : [];
          return g.length ? g[0].img : raw.hosts.portrait;
        })(),
        body: raw.hosts.body,
        stamp: raw.hosts.stamp,
        pets: (raw.hosts.pets || []).map((p) => ({ name: p.name, role: p.role, glyph: p.glyph, c: p.color })),
      },

      housesHeader: raw.houses_section,

      houses: (raw.houses || []).map((h) => ({
        num: h.num,
        name: h.name,
        lede: h.lede,
        price: { val: h.price, unit: h.price_unit },
        feats: (h.features || []).map((f) => ({ ic: f.icon, t: f.t })),
        slides: h.photos_folder
          ? galleryFromFolder(h.photos_folder, manifest)
          : withTints(h.slides),
      })),

      attractions: {
        eyebrow: raw.attractions.eyebrow,
        title: raw.attractions.title,
        lede: raw.attractions.lede,
        tabs: raw.attractions.tabs,
        nearby: raw.attractions.nearby_folder
          ? galleryFromFolder(raw.attractions.nearby_folder, manifest)
          : (raw.attractions.nearby || []).map((a) => ({ img: a.image, dist: a.distance, title: a.title, p: a.text, wide: a.wide })),
        region: raw.attractions.region_folder
          ? galleryFromFolder(raw.attractions.region_folder, manifest)
          : (raw.attractions.region || []).map((a) => ({ img: a.image, dist: a.distance, title: a.title, p: a.text, wide: a.wide })),
      },

      reviews: {
        eyebrow: raw.reviews.eyebrow,
        title: raw.reviews.title,
        score: raw.reviews.score,
        count: raw.reviews.count,
        items: (raw.reviews.items || []).map((r) => ({ name: r.name, when: r.when, c: r.color, text: r.text })),
      },

      contact: {
        eyebrow: c.eyebrow,
        title: c.title,
        lede: c.lede,
        formTitle: c.form_title,
        mapLabel: c.map_label,
        form: c.form,
        rows: [
          { ic: "mapPin", lab: lbl.address, val: site.address },
          { ic: "phone", lab: lbl.phone, val: site.phone, href: "tel:" + (site.phone_link || "") },
          { ic: "mail", lab: lbl.email, val: site.email, href: "mailto:" + (site.email || "") },
          { ic: "facebook", lab: lbl.facebook, val: site.facebook_label, href: site.facebook },
        ],
      },

      footer: {
        blurb: raw.footer.blurb,
        copy: raw.footer.copy,
        cols: [
          ...(raw.footer.columns || []).map((col) => ({ h: col.title, links: col.links })),
          { h: raw.footer.contact_title, links: [site.phone, site.email, site.address] },
        ],
        facebook: site.facebook,
      },
    };
  }

  // Fetch + parse the YAML, then populate window.DATA
  window.loadContent = async function () {
    try {
      const [yamlRes, manRes] = await Promise.all([
        fetch("content.yaml", { cache: "no-cache" }),
        fetch("photos/manifest.json", { cache: "no-cache" }).catch(() => null),
      ]);
      if (!yamlRes.ok) throw new Error("HTTP " + yamlRes.status);
      const text = await yamlRes.text();
      const raw = window.jsyaml.load(text);

      // photo manifest is optional — site still renders without it
      let manifest = {};
      if (manRes && manRes.ok) {
        try { manifest = await manRes.json(); }
        catch (e) { console.warn("[bieszkacje] Nie udało się odczytać photos/manifest.json:", e); }
      }
      window.PHOTO_MANIFEST = manifest;

      window.DATA = transform(raw, manifest);
      return window.DATA;
    } catch (err) {
      console.error("[bieszkacje] Nie udało się wczytać content.yaml:", err);
      throw err;
    }
  };
})();
