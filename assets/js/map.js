/* =========================================================================
   MAPPA — percorsi giornalieri, un colore per giorno
   ========================================================================= */
const FMap = (() => {
  let map, layerAll, dayLayers = [], visible = new Set(TRIP.days.map((_, i) => i));
  let showAll = true;

  function init() {
    map = L.map('map', { scrollWheelZoom: true }).setView([28.45, -14.02], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    layerAll = L.layerGroup().addTo(map);
    PLACES.forEach(p => {
      L.circleMarker([p.lat, p.lng], {
        radius: 4, color: '#0b3c5d', weight: 1, fillColor: '#7fa8bf', fillOpacity: .8
      }).bindPopup(popupHtml(p)).addTo(layerAll);
    });

    L.marker([CORRALEJO.lat, CORRALEJO.lng], { icon: pin('#0b3c5d', '🏠') })
      .bindPopup('<b>Corralejo</b><br>Base del viaggio').addTo(map);
  }

  function pin(color, label) {
    return L.divIcon({
      className: '',
      html: `<div class="map-pin" style="background:${color}"><span>${label}</span></div>`,
      iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -24]
    });
  }

  function popupHtml(p, extra) {
    return `<b>${App.esc(p.name)}</b><br>${App.esc(p.zone)} · ${App.fmtMin(p.min)} da Corralejo${extra || ''}
      <br><a href="${App.mapsLink(p)}" target="_blank" rel="noopener">Apri in Maps</a> ·
      <a href="${App.taLink(p.name)}" target="_blank" rel="noopener">TripAdvisor</a>`;
  }

  function refresh(state, ctx) {
    if (!map) return;
    dayLayers.forEach(l => map.removeLayer(l));
    dayLayers = [];

    TRIP.days.forEach((d, i) => {
      const color = DAY_COLORS[i % DAY_COLORS.length];
      const group = L.layerGroup();
      const stops = ctx.SLOT_IDS
        .map(s => ({ place: ctx.byId[state.days[i].slots[s]], slot: SLOTS.find(x => x.id === s) }))
        .filter(x => x.place);

      if (stops.length) {
        const pts = [[CORRALEJO.lat, CORRALEJO.lng], ...stops.map(x => [x.place.lat, x.place.lng]), [CORRALEJO.lat, CORRALEJO.lng]];
        L.polyline(pts, { color, weight: 4, opacity: .85, dashArray: '1,0' }).addTo(group);
        stops.forEach(({ place: p, slot }, n) => {
          const meals = state.days[i].meals;
          const extra = `<br><span style="color:${color}">● ${d.label}</span>` +
            (slot ? ` · ${slot.icon} ${slot.label}` : '') +
            (meals.pranzo ? `<br>🍽️ ${App.esc(ctx.mealLabel(meals.pranzo))}` : '') +
            (meals.cena ? `<br>🍷 ${App.esc(ctx.mealLabel(meals.cena))}` : '');
          L.marker([p.lat, p.lng], { icon: pin(color, n + 1) }).bindPopup(popupHtml(p, extra)).addTo(group);
        });
      }
      dayLayers.push(group);
      if (visible.has(i)) group.addTo(map);
    });

    renderLegend(state, ctx);
  }

  function renderLegend(state, ctx) {
    const el = document.getElementById('map-legend');
    el.innerHTML = '<h4>Giorni</h4>' + TRIP.days.map((d, i) => {
      const n = ctx.SLOT_IDS.filter(s => state.days[i].slots[s]).length;
      return `<label class="legend-row ${n ? '' : 'muted'}">
        <input type="checkbox" data-day="${i}" ${visible.has(i) ? 'checked' : ''}>
        <span class="legend-swatch" style="background:${DAY_COLORS[i % DAY_COLORS.length]}"></span>
        <span>${d.label.replace(' agosto', '')} <small>(${n})</small></span>
      </label>`;
    }).join('') +
      `<label class="legend-row" style="margin-top:6px;border-top:1px solid #eee;padding-top:6px">
        <input type="checkbox" data-all ${showAll ? 'checked' : ''}>
        <span class="legend-swatch" style="background:#7fa8bf;border-radius:50%"></span>
        <span>Tutti i luoghi del DB</span>
      </label>`;

    el.querySelectorAll('input[data-day]').forEach(cb => cb.addEventListener('change', () => {
      const i = +cb.dataset.day;
      if (cb.checked) { visible.add(i); dayLayers[i].addTo(map); }
      else { visible.delete(i); map.removeLayer(dayLayers[i]); }
    }));
    const allCb = el.querySelector('input[data-all]');
    allCb.addEventListener('change', () => {
      showAll = allCb.checked;
      showAll ? layerAll.addTo(map) : map.removeLayer(layerAll);
    });
  }

  function invalidate() { if (map) setTimeout(() => map.invalidateSize(), 60); }

  return { init, refresh, invalidate };
})();

// `const` in uno script classico non finisce su window: lo esponiamo esplicitamente
// perché app.js verifica la presenza della mappa prima di usarla.
window.FMap = FMap;
