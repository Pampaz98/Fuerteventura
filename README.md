# 🏝️ Fuerteventura 2026 — itinerario interattivo

Web app statica per organizzare il viaggio del **14 → 22 agosto 2026** con base a **Corralejo**
e condividere il programma con gli amici via link.

## Cosa c'è dentro

- **📚 Database luoghi** — 55 tra spiagge, borghi, vulcani, miradores e attività, ognuno con:
  tempo d'auto stimato da Corralejo, facilità di accesso (asfalto / sterrato / 4x4 / barca),
  nota sul parcheggio, momento migliore della giornata, tag, foto (Wikimedia Commons) e link a
  Google Maps, TripAdvisor e Google Immagini. Filtri per tipo, zona, accesso e distanza massima.
- **📅 Calendario** — i 7 giorni pianificabili (15–21 agosto; 14 e 22 restano come note di
  arrivo/partenza), ciascuno diviso in **mattina · pomeriggio · tramonto · sera** più **pranzo** e
  **cena**. Quando inserisci una tappa, le fasce successive propongono tutti i luoghi **ordinati
  per vicinanza** a quella tappa (con i minuti d'auto stimati) — la scelta finale resta sempre tua.
  Per i pasti ci sono i ristoranti ordinati per vicinanza più **🥪 Al sacco**, **🏠 A casa** e un
  campo libero per scrivere un posto qualsiasi.
- **🗺️ Mappa** — un colore per giorno, tappe numerate nell'ordine della giornata, percorso
  Corralejo → tappe → Corralejo, e la possibilità di accendere/spegnere i singoli giorni.
- **🧾 Riepilogo** — tutto il viaggio su una pagina, con totale di guida stimata e stampa/PDF.
- **🔗 Condivisione** — il pulsante *Condividi* copia un link che contiene l'intero itinerario
  (nessun server, nessun account): chi lo apre vede esattamente il tuo programma e può modificarlo
  a sua volta e rimandarti il suo link. In più: esporta/importa JSON e salvataggio automatico
  nel browser.

## Come pubblicarla (GitHub Pages)

1. Repo → **Settings** → **Pages**
2. *Build and deployment* → **Deploy from a branch**
3. Branch: `claude/fuerteventura-itinerary-app-h6cwgj` (oppure `main` dopo il merge) — cartella `/ (root)`
4. Salva: dopo circa un minuto il sito è online su
   `https://pampaz98.github.io/Fuerteventura/`

Il link da mandare agli amici è quello, con in fondo la parte `#i=...` generata dal pulsante
*Condividi*.

In locale basta aprire `index.html`, oppure `python3 -m http.server` nella cartella del progetto
(consigliato: alcuni browser bloccano le foto se il file è aperto con `file://`).

## Struttura

```
index.html                 pagina unica con le 4 viste
assets/css/style.css       stile
assets/js/data.js          ⬅️ IL DATABASE: luoghi, ristoranti, giorni, orari del tramonto
assets/js/app.js           stato, calendario, filtri, suggerimenti per vicinanza, condivisione
assets/js/map.js           mappa Leaflet e percorsi per giorno
assets/vendor/leaflet/     Leaflet 1.9.4 incluso nel repo (funziona anche offline)
```

### Aggiungere o correggere un posto

Tutto si modifica in `assets/js/data.js`, senza toccare altro:

```js
{
  id: 'nome-univoco', name: 'Nome del posto', type: 'spiaggia', zone: 'Nord',
  lat: 28.70, lng: -13.83, min: 12,          // min = minuti d'auto da Corralejo
  access: 'facile', road: 'asfalto',          // road serve a stimare i tempi tra le tappe
  park: 'Dove si parcheggia',
  tags: ['snorkeling', 'famiglia'], best: 'mattina',
  desc: 'Descrizione breve.',
  wiki: 'Titolo su Wikipedia'                 // opzionale, per la foto
}
```

## Note importanti sui dati

- **I tempi di percorrenza sono stime** (dati curati per la distanza da Corralejo, calcolo
  geografico per le distanze tra tappe): controllate sempre su Google Maps il giorno stesso.
- **Isla de Lobos** richiede un **permesso gratuito online**, a numero chiuso e spesso esaurito
  con settimane di anticipo: prenotatelo appena possibile.
- **Cofete e Punta de Jandía** si raggiungono su pista sterrata; molti contratti di noleggio la
  vietano. In alternativa c'è la navetta 4x4 da Morro Jable.
- **Sotavento** dà il meglio con la **bassa marea** (si forma la laguna): controllate le tabelle
  delle maree prima di partire.
- I ristoranti sono spunti di partenza per zona: verificate orari e recensioni con il link
  TripAdvisor prima di prenotare.
