/* =========================================================================
   MAREE — stima astronomica per Fuerteventura
   -------------------------------------------------------------------------
   Come funziona: le maree dell'isola sono semidiurne e seguono la Luna.
   L'alta marea arriva a un intervallo pressoché costante dal passaggio della
   Luna al meridiano del luogo ("intervallo di alta marea", HWI). Qui:

     alta marea  = transito lunare (alto o basso) + HWI
     bassa marea = alta marea + 6h 12m 30s (mezzo ciclo M2)

   La posizione della Luna è calcolata con l'algoritmo di Schlyter (precisione
   ~2 primi d'arco: l'errore sull'orario del transito è di pochi minuti).
   L'incertezza vera sta nell'HWI e negli effetti meteo (vento e pressione
   spostano i livelli): gli orari qui sono una STIMA a ±45 minuti, ottima per
   programmare la giornata, da verificare sulla tabella ufficiale prima di
   partire (link su ogni giornata).

   Se confronti con una tabella reale e trovi uno scarto costante, correggi
   HWI_HOURS qui sotto: è l'unica costante da tarare.
   ========================================================================= */
const Tides = (() => {

  const HWI_HOURS = 1.9;          // ritardo dell'alta marea sul transito lunare
  const HALF_CYCLE = 6 + 12.5 / 60; // mezzo ciclo semidiurno M2, in ore
  const TZ_OFFSET = 1;            // Canarie in estate: WEST = UTC+1
  const LNG = -13.8675;           // Corralejo
  const AGE_OF_TIDE = 1.3;        // ritardo delle sizigie sul novilunio/plenilunio (giorni)

  const rad = Math.PI / 180;
  const sin = a => Math.sin(a * rad), cos = a => Math.cos(a * rad);
  const norm = a => ((a % 360) + 360) % 360;

  /** Giorni dal 2000-01-00 0:00 TDT (= JD 2451543,5), per un istante UTC. */
  function dayNumber(utcMs) { return utcMs / 86400000 - 10956; }

  /** Posizione geocentrica della Luna: ascensione retta (gradi) ed elongazione. */
  function moon(d) {
    const N = norm(125.1228 - 0.0529538083 * d);
    const i = 5.1454;
    const w = norm(318.0634 + 0.1643573223 * d);
    const a = 60.2666, e = 0.054900;
    const M = norm(115.3654 + 13.0649929509 * d);

    // equazione di Keplero (poche iterazioni bastano con e piccola)
    let E = M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M));
    for (let k = 0; k < 5; k++) {
      E = E - (E - (180 / Math.PI) * e * sin(E) - M) / (1 - e * cos(E));
    }

    const xv = a * (cos(E) - e);
    const yv = a * (Math.sqrt(1 - e * e) * sin(E));
    const v = norm(Math.atan2(yv, xv) / rad);
    const r = Math.hypot(xv, yv);

    // coordinate eclittiche geocentriche
    let xh = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i));
    let yh = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i));
    let zh = r * (sin(v + w) * sin(i));
    let lon = norm(Math.atan2(yh, xh) / rad);
    let lat = Math.atan2(zh, Math.hypot(xh, yh)) / rad;

    // perturbazioni principali (Sole)
    const ws = 282.9404 + 4.70935e-5 * d;
    const Ms = norm(356.0470 + 0.9856002585 * d);
    const Ls = norm(Ms + ws);
    const Lm = norm(M + w + N);
    const D = norm(Lm - Ls);
    const F = norm(Lm - N);

    lon += -1.274 * sin(M - 2 * D) + 0.658 * sin(2 * D) - 0.186 * sin(Ms)
      - 0.059 * sin(2 * M - 2 * D) - 0.057 * sin(M - 2 * D + Ms)
      + 0.053 * sin(M + 2 * D) + 0.046 * sin(2 * D - Ms) + 0.041 * sin(M - Ms)
      - 0.035 * sin(D) - 0.031 * sin(M + Ms) - 0.015 * sin(2 * F - 2 * D)
      + 0.011 * sin(M - 4 * D);
    lat += -0.173 * sin(F - 2 * D) - 0.055 * sin(M - F - 2 * D)
      - 0.046 * sin(M + F - 2 * D) + 0.033 * sin(F + 2 * D) + 0.017 * sin(2 * M + F);
    lon = norm(lon);

    // eclittiche -> equatoriali
    const ecl = 23.4393 - 3.563e-7 * d;
    const xe = cos(lon) * cos(lat);
    const ye = sin(lon) * cos(lat) * cos(ecl) - sin(lat) * sin(ecl);
    const ra = norm(Math.atan2(ye, xe) / rad);

    return { ra, elongation: D, gmst0: norm(Ls + 180) };
  }

  /** Angolo orario locale della Luna (gradi, -180..180) per un istante UTC. */
  function hourAngle(utcMs) {
    const d = dayNumber(utcMs);
    const m = moon(d);
    const ut = (utcMs / 3600000) % 24;              // ore UT del giorno
    const lst = norm(m.gmst0 + ut * 15 + LNG);
    let ha = lst - m.ra;
    return ((ha + 540) % 360) - 180;
  }

  /** Tutti i transiti lunari (alti e bassi) nella finestra indicata. */
  function transits(fromMs, toMs) {
    const out = [], step = 10 * 60000;
    // due funzioni azzerate rispettivamente al transito alto e a quello basso
    const fns = [
      t => hourAngle(t),
      t => { const h = hourAngle(t); return ((h + 360) % 360) - 180; }
    ];
    fns.forEach(f => {
      let prev = f(fromMs);
      for (let t = fromMs + step; t <= toMs; t += step) {
        const cur = f(t);
        if (prev < 0 && cur >= 0 && cur - prev < 180) {
          let lo = t - step, hi = t;
          for (let k = 0; k < 30; k++) {
            const mid = (lo + hi) / 2;
            (f(mid) < 0 ? lo = mid : hi = mid);
          }
          out.push((lo + hi) / 2);
        }
        prev = cur;
      }
    });
    return out.sort((a, b) => a - b);
  }

  /** Ampiezza della marea: massima alle sizigie, minima ai quarti. */
  function rangeFor(utcMs) {
    const m = moon(dayNumber(utcMs - AGE_OF_TIDE * 86400000));
    const factor = Math.abs(cos(m.elongation));       // 1 = sizigie, 0 = quadrature
    return {
      metres: 1.65 + 0.68 * cos(2 * m.elongation),
      label: factor > 0.72 ? 'marea viva' : factor < 0.38 ? 'marea morta' : 'marea media',
      factor
    };
  }

  /** Fase lunare leggibile. */
  function moonPhase(utcMs) {
    const D = moon(dayNumber(utcMs)).elongation;
    const names = ['🌑 luna nuova', '🌒 luna crescente', '🌓 primo quarto', '🌔 gibbosa crescente',
      '🌕 luna piena', '🌖 gibbosa calante', '🌗 ultimo quarto', '🌘 luna calante'];
    return names[Math.round(D / 45) % 8];
  }

  /**
   * Maree del giorno (data 'YYYY-MM-DD'), in ora locale delle Canarie.
   * Ritorna { events:[{type:'alta'|'bassa', time:'HH:MM', ms}], range, moon }
   */
  function forDate(isoDate) {
    const dayStartLocal = Date.parse(isoDate + 'T00:00:00Z') - TZ_OFFSET * 3600000;
    const dayEndLocal = dayStartLocal + 86400000;
    // finestra allargata: servono i transiti appena fuori dal giorno
    const tr = transits(dayStartLocal - 20 * 3600000, dayEndLocal + 20 * 3600000);

    const events = [];
    tr.forEach(t => {
      const high = t + HWI_HOURS * 3600000;
      events.push({ type: 'alta', ms: high });
      events.push({ type: 'bassa', ms: high + HALF_CYCLE * 3600000 });
    });

    const inDay = events
      .filter(e => e.ms >= dayStartLocal && e.ms < dayEndLocal)
      .sort((a, b) => a.ms - b.ms)
      .map(e => ({ ...e, time: hhmm(e.ms) }));

    return { events: inDay, range: rangeFor(dayStartLocal + 43200000), moon: moonPhase(dayStartLocal + 43200000) };
  }

  function hhmm(ms) {
    const d = new Date(ms + TZ_OFFSET * 3600000);
    return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
  }

  /** La bassa marea più vicina a un'ora del giorno (per i consigli sulle spiagge). */
  function nearestLow(isoDate, hourLocal) {
    const t = forDate(isoDate).events.filter(e => e.type === 'bassa');
    if (!t.length) return null;
    const target = Date.parse(isoDate + 'T00:00:00Z') - TZ_OFFSET * 3600000 + hourLocal * 3600000;
    return t.reduce((best, e) => Math.abs(e.ms - target) < Math.abs(best.ms - target) ? e : best);
  }

  function tableLink() { return 'https://tablademareas.com/es/fuerteventura/corralejo'; }

  return { forDate, nearestLow, tableLink, HWI_HOURS };
})();

if (typeof module !== 'undefined') module.exports = Tides;
if (typeof window !== 'undefined') window.Tides = Tides;
