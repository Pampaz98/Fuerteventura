/* =========================================================================
   APP — stato, calendario, database, suggerimenti per vicinanza
   ========================================================================= */
const App = (() => {

  const STORE_KEY = 'fuerte2026.itinerary.v1';
  const SLOT_IDS = SLOTS.map(s => s.id);
  const byId = Object.fromEntries(PLACES.map(p => [p.id, p]));
  const foodById = Object.fromEntries(FOOD.map(f => [f.id, f]));

  let state = emptyState();
  let picker = null;           // { dayIdx, kind:'slot'|'meal', key }

  /* ----------------------------- STATO -------------------------------- */
  function emptyState() {
    return {
      v: 1,
      days: TRIP.days.map(() => ({
        slots: { mattina: null, pomeriggio: null, tramonto: null, sera: null },
        meals: { pranzo: null, cena: null },
        note: ''
      }))
    };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* modalità privata */ }
  }

  /** L'itinerario proposto, come stato iniziale. */
  function proposalState() {
    const st = emptyState();
    PROPOSAL.forEach((d, i) => {
      if (!st.days[i]) return;
      SLOT_IDS.forEach(s => { st.days[i].slots[s] = d.slots[s] || null; });
      st.days[i].meals = { pranzo: d.meals.pranzo || null, cena: d.meals.cena || null };
      st.days[i].note = d.note || '';
    });
    return st;
  }

  function load() {
    const fromUrl = decodeState(location.hash.replace(/^#i=/, ''));
    if (fromUrl) { state = fromUrl; save(); return; }
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length === TRIP.days.length) { state = parsed; return; }
      }
    } catch (e) { /* ignora */ }
    state = proposalState();   // primo accesso: si parte dalla proposta
  }

  /* ------------------- serializzazione compatta per il link ----------- */
  function encodeState() {
    const compact = state.days.map(d => [
      SLOT_IDS.map(s => d.slots[s] || 0),
      packMeal(d.meals.pranzo),
      packMeal(d.meals.cena),
      d.note || 0
    ]);
    const json = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function packMeal(m) { return !m ? 0 : (m.t === 'rest' ? ['r', m.id] : m.t === 'free' ? ['f', m.text] : [m.t]); }
  function unpackMeal(a) {
    if (!a || !Array.isArray(a)) return null;
    if (a[0] === 'r') return { t: 'rest', id: a[1] };
    if (a[0] === 'f') return { t: 'free', text: a[1] };
    return { t: a[0] };
  }
  function decodeState(str) {
    if (!str) return null;
    try {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const compact = JSON.parse(decodeURIComponent(escape(atob(b64))));
      if (!Array.isArray(compact)) return null;
      const st = emptyState();
      compact.forEach((d, i) => {
        if (!st.days[i] || !Array.isArray(d)) return;
        SLOT_IDS.forEach((s, k) => { st.days[i].slots[s] = (d[0] && d[0][k]) || null; });
        st.days[i].meals.pranzo = unpackMeal(d[1]);
        st.days[i].meals.cena = unpackMeal(d[2]);
        st.days[i].note = d[3] || '';
      });
      return st;
    } catch (e) { return null; }
  }

  /* --------------------------- GEO / TEMPI ---------------------------- */
  function haversine(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const la1 = a.lat * rad, la2 = b.lat * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /** Minuti su strada asfaltata: distanza in linea d'aria + tortuosità, velocità per tratta. */
  function asphaltMinutes(a, b) {
    const km = haversine(a, b) * 1.28;
    if (km < 0.4) return 0;
    const speed = km > 30 ? 74 : km > 10 ? 58 : 42;
    return Math.round(km / speed * 60 + 3);
  }

  /* Sovrapprezzo di ogni posto rispetto all'asfalto puro: è quanto costano la pista
     sterrata, i tornanti o la camminata finale. Si ricava dal dato curato `min`
     (minuti reali da Corralejo), così i tempi in app coincidono con quelli del database. */
  const extraMin = {};
  PLACES.forEach(p => { extraMin[p.id] = Math.max(0, p.min - asphaltMinutes(CORRALEJO, p)); });

  /**
   * Stima dei minuti d'auto tra due punti. La penalità dello sterrato si paga
   * per intero solo se le due tappe non condividono la stessa pista: due posti
   * vicini (Cofete e Villa Winter) si raggiungono con un unico avvicinamento.
   */
  function travelMinutes(from, to) {
    if (!from || !to) return null;
    const km = haversine(from, to);
    const base = asphaltMinutes(from, to);
    const eFrom = extraMin[from.id] || 0, eTo = extraMin[to.id] || 0;
    const w = Math.min(1, km / 15);
    const penalty = w * (eFrom + eTo) + (1 - w) * Math.abs(eTo - eFrom);
    return Math.round(base + penalty);
  }

  function fmtMin(m) {
    if (m == null) return '—';
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60), r = m % 60;
    return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`;
  }

  /** Il punto di riferimento per i suggerimenti di una fascia/pasto. */
  function anchorFor(dayIdx, kind, key) {
    const day = state.days[dayIdx];
    const order = kind === 'slot'
      ? SLOT_IDS
      : (key === 'pranzo' ? ['mattina', 'pomeriggio', 'tramonto', 'sera'] : ['tramonto', 'pomeriggio', 'sera', 'mattina']);
    const startIdx = kind === 'slot' ? SLOT_IDS.indexOf(key) : 0;

    if (kind === 'slot') {
      for (let i = startIdx - 1; i >= 0; i--) { const p = byId[day.slots[order[i]]]; if (p) return { place: p, when: SLOTS[i].label.toLowerCase() }; }
      for (let i = startIdx + 1; i < order.length; i++) { const p = byId[day.slots[order[i]]]; if (p) return { place: p, when: SLOTS[i].label.toLowerCase() }; }
    } else {
      for (const s of order) { const p = byId[day.slots[s]]; if (p) return { place: p, when: s }; }
    }
    return { place: CORRALEJO, when: 'base' };
  }

  /* ------------------------------ UI base ----------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(t._t); t._t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  const TYPE_ICON = { spiaggia: '🏖️', natura: '🌋', borgo: '🏘️', panorama: '👁️', cultura: '🏛️', attivita: '🎯' };
  const ACCESS_LABEL = { facile: 'Accesso facile', medio: 'Accesso medio', difficile: 'Sterrato', '4x4': 'Solo 4x4', barca: 'In barca' };

  /* ------------------------------- MAREE ------------------------------ */
  const tideCache = {};
  function tidesOf(date) {
    if (!window.Tides) return null;
    if (!tideCache[date]) { try { tideCache[date] = Tides.forDate(date); } catch (e) { tideCache[date] = null; } }
    return tideCache[date];
  }

  /** Riga marea del giorno + eventuale avviso sui posti che dipendono dalla marea. */
  function tideBar(date, dayState) {
    const t = tidesOf(date);
    if (!t) return '';
    const seq = t.events.map(e =>
      `<span class="tide-ev ${e.type}">${e.type === 'bassa' ? '🔻' : '🔺'} ${e.time}</span>`).join('');

    const hints = SLOT_IDS.map(s => byId[dayState.slots[s]]).filter(p => p && p.tide).map(p => {
      const wanted = p.tide === 'bassa' ? 'bassa' : 'alta';
      const all = t.events.filter(e => e.type === wanted);
      // interessano solo le maree in orario da spiaggia, non quelle notturne
      const ev = all.filter(e => { const h = +e.time.slice(0, 2); return h >= 7 && h <= 21; });
      if (!ev.length) return '';
      return `<span class="tide-hint">🌊 <b>${esc(p.name.split(' /')[0].split(' (')[0])}</b>: ${esc(p.tideWhy)} → ${wanted} marea alle ${ev.map(e => e.time).join(' e ')}</span>`;
    }).filter(Boolean);

    return `<div class="tides">
      <span class="tide-row">${seq}<span class="tide-range">${t.range.label} · ~${t.range.metres.toFixed(1)} m</span></span>
      ${hints.join('')}
    </div>`;
  }

  function mapsLink(p) { return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`; }
  function taLink(name) { return `https://www.tripadvisor.it/Search?q=${encodeURIComponent(name + ' Fuerteventura')}`; }
  function imgLink(name) { return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' Fuerteventura')}`; }

  /* ---------------------------- CALENDARIO ---------------------------- */
  function renderCalendar() {
    $('#edge-arrival').innerHTML = `<b>${TRIP.arrival.label}</b> — ${TRIP.arrival.note} <em>(giorno non pianificato)</em>`;
    $('#edge-departure').innerHTML = `<b>${TRIP.departure.label}</b> — ${TRIP.departure.note} <em>(giorno non pianificato)</em>`;

    $('#days').innerHTML = TRIP.days.map((d, i) => {
      const day = state.days[i];
      const color = DAY_COLORS[i % DAY_COLORS.length];
      const stops = SLOT_IDS.map(s => byId[day.slots[s]]).filter(Boolean);
      let drive = 0, prev = CORRALEJO;
      stops.forEach(p => { drive += travelMinutes(prev, p) || 0; prev = p; });
      if (stops.length) drive += travelMinutes(prev, CORRALEJO) || 0;

      const slotsHtml = SLOTS.map((s, si) => {
        const p = byId[day.slots[s.id]];
        const prevPlace = si > 0 ? byId[day.slots[SLOT_IDS[si - 1]]] : CORRALEJO;
        const hop = p ? travelMinutes(prevPlace || CORRALEJO, p) : null;
        return `
        <div class="slot ${p ? 'filled' : 'empty'}" data-day="${i}" data-kind="slot" data-key="${s.id}" role="button" tabindex="0">
          <span class="slot-ico">${s.icon}</span>
          <span class="slot-body">
            <span class="slot-label">${s.label} · ${s.id === 'tramonto' ? 'sole alle ' + d.sunset : s.hint}</span>
            <span class="slot-value">${p ? esc(p.name) : 'tocca per scegliere'}</span>
            ${p ? `<span class="slot-note">🚗 ${fmtMin(hop)} da ${si === 0 ? 'Corralejo' : esc((prevPlace || CORRALEJO).name)} · ${ACCESS_LABEL[p.access]}</span>` : ''}
          </span>
          ${p ? `<button class="slot-x" data-clear="${i}|slot|${s.id}" title="Rimuovi">✕</button>` : ''}
        </div>`;
      }).join('');

      const mealHtml = ['pranzo', 'cena'].map(mk => {
        const m = day.meals[mk];
        return `
        <div class="meal slot ${m ? 'filled' : 'empty'}" data-day="${i}" data-kind="meal" data-key="${mk}" role="button" tabindex="0">
          <span class="slot-body">
            <span class="slot-label">${mk === 'pranzo' ? '🍽️ Pranzo' : '🍷 Cena'}</span>
            <span class="slot-value">${m ? esc(mealLabel(m)) : 'da decidere'}</span>
          </span>
          ${m ? `<button class="slot-x" data-clear="${i}|meal|${mk}" title="Rimuovi">✕</button>` : ''}
        </div>`;
      }).join('');

      return `
      <article class="day" style="--day-color:${color}">
        <header class="day-head">
          <h3><span class="day-dot"></span> ${d.label}</h3>
          <p class="day-meta"><span>🌇 Tramonto <b>${d.sunset}</b></span><span>📍 <b>${stops.length}</b> tappe</span></p>
        </header>
        ${tideBar(d.date, day)}
        <div class="slots">${slotsHtml}</div>
        <div class="meals">${mealHtml}</div>
        <div class="day-note"><textarea data-note="${i}" placeholder="Note del giorno (prenotazioni, orari, chi guida…)">${esc(day.note || '')}</textarea></div>
        <p class="day-drive"><span>🚗 Guida stimata: <b>${stops.length ? fmtMin(drive) : '—'}</b> (andata + ritorno a Corralejo)</span></p>
      </article>`;
    }).join('');
  }

  function mealLabel(m) {
    if (!m) return '';
    if (m.t === 'rest') return (foodById[m.id] || { name: '?' }).name;
    if (m.t === 'free') return m.text;
    const sp = MEAL_SPECIAL.find(s => s.id === m.t);
    return sp ? sp.icon + ' ' + sp.name : m.t;
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ----------------------------- DATABASE ----------------------------- */
  function renderDatabase() {
    const q = $('#db-search').value.trim().toLowerCase();
    const type = $('#db-type').value, zone = $('#db-zone').value;
    const access = $('#db-access').value, max = +$('#db-max').value, sort = $('#db-sort').value;

    let list = PLACES.filter(p => {
      if (type && p.type !== type) return false;
      if (zone && p.zone !== zone) return false;
      if (access && p.access !== access) return false;
      if (p.min > max) return false;
      if (q) {
        const hay = [p.name, p.zone, p.type, p.desc, (p.tags || []).join(' ')].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name)
      : sort === 'zone' ? (a.zone.localeCompare(b.zone) || a.min - b.min)
        : a.min - b.min);

    $('#db-count').textContent = `${list.length} luoghi su ${PLACES.length} · i tempi indicati sono in auto da Corralejo`;
    $('#db-cards').innerHTML = list.map(p => `
      <article class="card" data-place="${p.id}">
        <div class="card-photo" data-photo="${p.id}">${TYPE_ICON[p.type] || '📍'}
          <span class="card-type">${p.type}</span>
        </div>
        <div class="card-body">
          <h3>${esc(p.name)}</h3>
          <p class="card-zone">${esc(p.zone)}</p>
          <div class="card-badges">
            <span class="badge time">🚗 ${fmtMin(p.min)} da Corralejo</span>
            <span class="badge ${p.access === '4x4' ? 'badge-4x4' : p.access}">${ACCESS_LABEL[p.access]}</span>
            ${p.best ? `<span class="badge">⏰ meglio di ${p.best}</span>` : ''}
            ${p.tide ? `<span class="badge tide">🌊 con ${p.tide} marea</span>` : ''}
          </div>
          <p class="card-desc">${esc(p.desc)}</p>
          <p class="card-park">🅿️ ${esc(p.park)}</p>
          <div class="tags">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <div class="card-links">
            <a href="${mapsLink(p)}" target="_blank" rel="noopener">🗺️ Maps</a>
            <a href="${taLink(p.name)}" target="_blank" rel="noopener">🦉 TripAdvisor</a>
            <a href="${imgLink(p.name)}" target="_blank" rel="noopener">📷 Altre foto</a>
          </div>
        </div>
      </article>`).join('');

    list.forEach(p => loadPhoto(p));
  }

  /* --------------------- FOTO da Wikipedia / Commons ------------------ */
  const photoCache = {};
  async function loadPhoto(place) {
    const el = document.querySelector(`.card-photo[data-photo="${place.id}"]`);
    if (!el) return;
    const cached = photoCache[place.id] !== undefined ? photoCache[place.id] : await fetchPhoto(place);
    photoCache[place.id] = cached;
    if (!cached) return;
    const target = document.querySelector(`.card-photo[data-photo="${place.id}"]`);
    if (!target) return;
    target.style.backgroundImage = `url("${cached.url}")`;
    target.innerHTML = `<span class="card-type">${place.type}</span>` +
      `<span class="ph-credit">${esc(cached.credit)}</span>`;
  }

  async function fetchPhoto(place) {
    const sess = sessionStorage.getItem('ph.' + place.id);
    if (sess) { try { return JSON.parse(sess); } catch (e) { } }
    let found = null;
    try {
      if (place.wiki) {
        const r = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place.wiki)}`);
        if (r.ok) {
          const j = await r.json();
          if (j.thumbnail && j.thumbnail.source) found = { url: j.thumbnail.source.replace(/\/\d+px-/, '/600px-'), credit: 'Wikipedia' };
        }
      }
      if (!found) {
        const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
          '&generator=geosearch&ggsnamespace=6&ggslimit=6&ggsradius=1200' +
          `&ggscoord=${place.lat}|${place.lng}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=600`;
        const r = await fetch(url);
        if (r.ok) {
          const j = await r.json();
          const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
          const pick = pages.find(pg => pg.imageinfo && /\.(jpe?g|png)$/i.test(pg.title));
          if (pick) {
            const ii = pick.imageinfo[0];
            const art = ii.extmetadata && ii.extmetadata.Artist ? ii.extmetadata.Artist.value.replace(/<[^>]+>/g, '') : 'Wikimedia Commons';
            found = { url: ii.thumburl || ii.url, credit: art.slice(0, 40) };
          }
        }
      }
    } catch (e) { /* offline o rete bloccata: si resta con l'emoji */ }
    if (found) sessionStorage.setItem('ph.' + place.id, JSON.stringify(found));
    return found;
  }

  /* ------------------------- MODALE SELEZIONE ------------------------- */
  function openPicker(dayIdx, kind, key) {
    picker = { dayIdx, kind, key };
    const day = TRIP.days[dayIdx];
    const anchor = anchorFor(dayIdx, kind, key);
    const isBase = anchor.place === CORRALEJO;
    const label = kind === 'slot'
      ? SLOTS.find(s => s.id === key).label
      : (key === 'pranzo' ? 'Pranzo' : 'Cena');

    $('#modal-title').textContent = `${label} — ${day.label}`;
    $('#modal-sub').innerHTML = isBase
      ? 'Nessuna tappa ancora inserita: ordinati per distanza da <b>Corralejo</b>.'
      : `Ordinati per vicinanza a <b>${esc(anchor.place.name)}</b> (la tappa ${esc(anchor.when)}).`;
    $('#modal-search').value = '';
    $('#modal').hidden = false;
    renderPickerList();
    setTimeout(() => $('#modal-search').focus(), 40);
  }

  function closePicker() { $('#modal').hidden = true; picker = null; }

  function renderPickerList() {
    if (!picker) return;
    const { dayIdx, kind, key } = picker;
    const q = $('#modal-search').value.trim().toLowerCase();
    const day = state.days[dayIdx];
    const anchor = anchorFor(dayIdx, kind, key);
    const usedElsewhere = new Set();
    state.days.forEach((d, di) => SLOT_IDS.forEach(s => {
      if (d.slots[s] && !(di === dayIdx && s === key)) usedElsewhere.add(d.slots[s]);
    }));

    let html = '';

    if (kind === 'meal') {
      const current = day.meals[key];
      html += `<div class="list-head">Opzioni rapide</div>`;
      html += MEAL_SPECIAL.filter(s => s.id !== 'libero').map(s => `
        <button class="opt ${current && current.t === s.id ? 'is-current' : ''}" data-pick="special|${s.id}">
          <span class="opt-ico">${s.icon}</span>
          <span class="opt-main"><span class="opt-name">${s.name}</span><span class="opt-meta">${esc(s.note)}</span></span>
        </button>`).join('');
      html += `<div class="list-head">Scrivi un posto tuo</div>
        <div class="free-input">
          <input type="text" id="free-text" placeholder="Es. Ristorante consigliato da Marco" value="${current && current.t === 'free' ? esc(current.text) : ''}">
          <button id="free-add">Salva</button>
        </div>`;

      const foods = FOOD.map(f => ({ ...f, d: travelMinutes(anchor.place, f) }))
        .filter(f => !q || (f.name + ' ' + f.zone + ' ' + f.kind).toLowerCase().includes(q))
        .sort((a, b) => a.d - b.d);
      html += `<div class="list-head">Ristoranti · più vicini a ${esc(anchor.place.name)}</div>`;
      html += foods.map(f => `
        <button class="opt ${current && current.t === 'rest' && current.id === f.id ? 'is-current' : ''}" data-pick="rest|${f.id}">
          <span class="opt-ico">🍴</span>
          <span class="opt-main">
            <span class="opt-name">${esc(f.name)}</span>
            <span class="opt-meta"><span>${esc(f.zone)}</span><span>${f.price}</span><span>${esc(f.kind)}</span></span>
          </span>
          <span class="opt-dist">${fmtMin(f.d)}<small>di auto</small></span>
        </button>`).join('');

    } else {
      const current = day.slots[key];
      const cands = PLACES.map(p => ({ p, d: travelMinutes(anchor.place, p) }))
        .filter(({ p }) => !q || [p.name, p.zone, p.type, (p.tags || []).join(' '), p.desc].join(' ').toLowerCase().includes(q))
        .sort((a, b) => a.d - b.d);

      const suited = cands.filter(({ p }) => p.best === key || (key === 'sera' && p.best === 'sera'));
      if (!q && suited.length) {
        html += `<div class="list-head">⭐ Consigliati per la fascia "${key}" e vicini</div>`;
        html += suited.slice(0, 4).map(({ p, d }) => optRow(p, d, current, anchor)).join('');
      }
      html += `<div class="list-head">Tutti i luoghi · in ordine di vicinanza da ${esc(anchor.place.name)}</div>`;
      html += cands.map(({ p, d }) => optRow(p, d, current, anchor, usedElsewhere.has(p.id))).join('');
    }

    $('#modal-list').innerHTML = html;
  }

  function optRow(p, d, current, anchor, used) {
    return `
    <button class="opt ${current === p.id ? 'is-current' : ''}" data-pick="place|${p.id}">
      <span class="opt-ico">${TYPE_ICON[p.type] || '📍'}</span>
      <span class="opt-main">
        <span class="opt-name">${esc(p.name)}${used ? ' <span class="tag">già in programma</span>' : ''}</span>
        <span class="opt-meta">
          <span>${esc(p.zone)}</span>
          <span class="badge ${p.access === '4x4' ? 'badge-4x4' : p.access}">${ACCESS_LABEL[p.access]}</span>
          ${p.best ? `<span>⏰ ${p.best}</span>` : ''}
        </span>
      </span>
      <span class="opt-dist">${fmtMin(d)}<small>${anchor.place === CORRALEJO ? 'da Corralejo' : 'da qui'}</small></span>
    </button>`;
  }

  function applyPick(token) {
    if (!picker) return;
    const [kind, val] = token.split('|');
    const day = state.days[picker.dayIdx];
    if (kind === 'place') day.slots[picker.key] = val;
    if (kind === 'special') day.meals[picker.key] = { t: val };
    if (kind === 'rest') day.meals[picker.key] = { t: 'rest', id: val };
    if (kind === 'free') day.meals[picker.key] = { t: 'free', text: val };
    save(); closePicker(); refresh();
    toast('Aggiunto ✔');
  }

  /* ----------------------------- RIEPILOGO ---------------------------- */
  function renderSummary() {
    let totalStops = 0, totalDrive = 0, beaches = new Set();
    const daysHtml = TRIP.days.map((d, i) => {
      const day = state.days[i];
      const color = DAY_COLORS[i % DAY_COLORS.length];
      const stops = SLOT_IDS.map(s => byId[day.slots[s]]).filter(Boolean);
      totalStops += stops.length;
      stops.forEach(p => { if (p.type === 'spiaggia') beaches.add(p.id); });
      let drive = 0, prev = CORRALEJO;
      stops.forEach(p => { drive += travelMinutes(prev, p) || 0; prev = p; });
      if (stops.length) drive += travelMinutes(prev, CORRALEJO) || 0;
      totalDrive += drive;

      const lines = [];
      SLOTS.forEach(s => {
        const p = byId[day.slots[s.id]];
        lines.push(`<div class="sum-line"><div class="sum-when">${s.icon} ${s.label}</div>
          <div class="sum-what">${p ? `${esc(p.name)} <small>${esc(p.zone)} · ${ACCESS_LABEL[p.access]} · 🅿️ ${esc(p.park)}</small>` : '<span class="sum-empty">—</span>'}</div></div>`);
        if (s.id === 'mattina') lines.push(mealLine('🍽️ Pranzo', day.meals.pranzo));
        if (s.id === 'tramonto') lines.push(mealLine('🍷 Cena', day.meals.cena));
      });
      if (day.note) lines.push(`<div class="sum-line"><div class="sum-when">📝 Note</div><div class="sum-what">${esc(day.note)}</div></div>`);

      const tide = tidesOf(d.date);
      return `<section class="sum-day" style="--day-color:${color}">
        <h3>${d.label} <span class="badge time">🚗 ${stops.length ? fmtMin(drive) : '—'}</span> <span class="badge">🌇 ${d.sunset}</span>
          ${tide ? `<span class="badge">🌊 ${tide.events.map(e => (e.type === 'bassa' ? '🔻' : '🔺') + e.time).join(' ')}</span>` : ''}</h3>
        ${lines.join('')}
      </section>`;
    }).join('');

    $('#summary').innerHTML = `
      <div class="sum-stats">
        <div class="stat"><b>7</b><span>giorni pianificabili</span></div>
        <div class="stat"><b>${totalStops}</b><span>tappe inserite</span></div>
        <div class="stat"><b>${beaches.size}</b><span>spiagge diverse</span></div>
        <div class="stat"><b>${fmtMin(totalDrive)}</b><span>guida totale stimata</span></div>
      </div>
      <div class="edge-day"><b>${TRIP.arrival.label}</b> — ${TRIP.arrival.note}</div>
      ${daysHtml}
      <div class="edge-day"><b>${TRIP.departure.label}</b> — ${TRIP.departure.note}</div>`;
  }

  function mealLine(label, m) {
    return `<div class="sum-line"><div class="sum-when">${label}</div>
      <div class="sum-what">${m ? esc(mealLabel(m)) : '<span class="sum-empty">—</span>'}</div></div>`;
  }

  /* ------------------------------ AZIONI ------------------------------ */
  function share() {
    const url = `${location.origin}${location.pathname}#i=${encodeState()}`;
    const done = () => toast('Link copiato: incollalo agli amici 🔗');
    if (navigator.clipboard && location.protocol !== 'file:') {
      navigator.clipboard.writeText(url).then(done).catch(() => prompt('Copia il link:', url));
    } else prompt('Copia il link:', url);
    history.replaceState(null, '', '#i=' + encodeState());
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fuerteventura-2026-itinerario.json';
    a.click(); URL.revokeObjectURL(a.href);
  }

  function importJson(file) {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const parsed = JSON.parse(fr.result);
        if (!parsed.days || parsed.days.length !== TRIP.days.length) throw new Error();
        state = parsed; save(); refresh(); toast('Itinerario importato ✔');
      } catch (e) { toast('File non valido ✖'); }
    };
    fr.readAsText(file);
  }

  function countdown() {
    const start = new Date('2026-08-14T00:00:00');
    const diff = Math.ceil((start - new Date()) / 86400000);
    $('#countdown').textContent = diff > 0 ? `mancano ${diff} giorni` : diff === 0 ? 'si parte oggi!' : 'buon viaggio!';
  }

  /* ----------------------------- REFRESH ------------------------------ */
  /** La mappa non deve mai poter rompere il resto dell'app (rete lenta, tile bloccate…). */
  function safeMap(fn) { try { if (window.FMap) fn(); } catch (e) { console.warn('Mappa non disponibile:', e); } }

  function refresh() {
    renderCalendar();
    renderSummary();
    safeMap(() => FMap.refresh(state, { byId, travelMinutes, CORRALEJO, SLOT_IDS, mealLabel }));
  }

  function switchView(name) {
    $$('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.view === name));
    $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + name));
    if (name === 'mappa') safeMap(() => FMap.invalidate());
    if (name === 'database') renderDatabase();
  }

  /* ------------------------------- INIT ------------------------------- */
  function init() {
    load();
    countdown();

    // zone del filtro
    const zones = [...new Set(PLACES.map(p => p.zone))];
    $('#db-zone').insertAdjacentHTML('beforeend', zones.map(z => `<option>${z}</option>`).join(''));

    safeMap(() => FMap.init());
    refresh();
    renderDatabase();

    // tab
    $$('.tab').forEach(t => t.addEventListener('click', () => switchView(t.dataset.view)));

    // calendario: apertura picker / rimozione / note
    $('#days').addEventListener('click', e => {
      const clear = e.target.closest('[data-clear]');
      if (clear) {
        e.stopPropagation();
        const [d, kind, key] = clear.dataset.clear.split('|');
        if (kind === 'slot') state.days[d].slots[key] = null; else state.days[d].meals[key] = null;
        save(); refresh(); return;
      }
      const slot = e.target.closest('[data-kind]');
      if (slot) openPicker(+slot.dataset.day, slot.dataset.kind, slot.dataset.key);
    });
    $('#days').addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.kind) {
        e.preventDefault(); openPicker(+e.target.dataset.day, e.target.dataset.kind, e.target.dataset.key);
      }
    });
    $('#days').addEventListener('input', e => {
      if (e.target.dataset.note !== undefined) { state.days[+e.target.dataset.note].note = e.target.value; save(); }
    });

    // modale
    $('#modal').addEventListener('click', e => {
      if (e.target.closest('[data-close]')) return closePicker();
      const pick = e.target.closest('[data-pick]');
      if (pick) return applyPick(pick.dataset.pick);
      if (e.target.id === 'free-add') {
        const v = $('#free-text').value.trim();
        if (v) applyPick('free|' + v);
      }
    });
    $('#modal').addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.id === 'free-text') {
        const v = e.target.value.trim(); if (v) applyPick('free|' + v);
      }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closePicker(); });
    $('#modal-search').addEventListener('input', renderPickerList);
    $('#modal-clear').addEventListener('click', () => {
      const { dayIdx, kind, key } = picker;
      if (kind === 'slot') state.days[dayIdx].slots[key] = null; else state.days[dayIdx].meals[key] = null;
      save(); closePicker(); refresh();
    });

    // database
    ['db-search', 'db-type', 'db-zone', 'db-access', 'db-max', 'db-sort']
      .forEach(id => $('#' + id).addEventListener('input', renderDatabase));

    // azioni
    $('#btn-share').addEventListener('click', share);
    $('#btn-proposal').addEventListener('click', () => {
      if (confirm('Ricaricare l\'itinerario proposto? Le modifiche attuali andranno perse.')) {
        state = proposalState(); save();
        history.replaceState(null, '', location.pathname);
        refresh(); toast('Itinerario proposto caricato ✨');
      }
    });
    $('#btn-export').addEventListener('click', exportJson);
    $('#btn-import').addEventListener('click', () => $('#file-import').click());
    $('#file-import').addEventListener('change', e => e.target.files[0] && importJson(e.target.files[0]));
    $('#btn-print').addEventListener('click', () => { switchView('riepilogo'); setTimeout(() => window.print(), 200); });
    $('#btn-reset').addEventListener('click', () => {
      if (confirm('Svuotare tutto l\'itinerario?')) { state = emptyState(); save(); history.replaceState(null, '', location.pathname); refresh(); toast('Itinerario svuotato'); }
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.menu')) $$('.menu[open]').forEach(m => m.removeAttribute('open'));
    });
  }

  return { init, refresh, travelMinutes, fmtMin, esc, mapsLink, taLink };
})();
