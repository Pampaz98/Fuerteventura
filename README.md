# 🏝️ Fuerteventura 2026 — itinerario interattivo

Web app statica per organizzare il viaggio del **14 → 22 agosto 2026** con base a **Corralejo**
e condividere il programma con gli amici via link.

## Cosa c'è dentro

- **📚 Database luoghi** — 58 tra spiagge, borghi, vulcani, miradores e attività, ognuno con:
  tempo d'auto stimato da Corralejo, facilità di accesso (asfalto / sterrato / 4x4 / barca),
  nota sul parcheggio, momento migliore della giornata, tag, foto (Wikimedia Commons) e link a
  Google Maps, TripAdvisor e Google Immagini. Filtri per tipo, zona, accesso e distanza massima.
- **📅 Calendario** — i 7 giorni pianificabili (15–21 agosto; 14 e 22 restano come note di
  arrivo/partenza), ciascuno diviso in **mattina · pomeriggio · tramonto · sera** più **pranzo** e
  **cena**. Quando inserisci una tappa, le fasce successive propongono tutti i luoghi **ordinati
  per vicinanza** a quella tappa (con i minuti d'auto stimati) — la scelta finale resta sempre tua.
  Per i pasti ci sono i ristoranti ordinati per vicinanza più **🥪 Al sacco**, **🏠 A casa** e un
  campo libero per scrivere un posto qualsiasi.
- **⇄ Sposta una giornata** — il pulsante in cima a ogni giorno la scambia con un'altra:
  tappe, pasti e note si spostano insieme, tempi di guida e maree si ricalcolano da soli.
- **🗺️ Mappa** — un colore per giorno, tappe numerate nell'ordine della giornata, percorso
  Corralejo → tappe → Corralejo, e la possibilità di accendere/spegnere i singoli giorni.
- **🧾 Riepilogo** — tutto il viaggio su una pagina, con totale di guida stimata e stampa/PDF.
- **🌊 Maree** — ogni giornata mostra alta e bassa marea con l'ampiezza (viva/morta) e avvisa
  quando una tappa dipende dalla marea ("la laguna di Sotavento si forma solo con la bassa →
  oggi alle 12:45"). Le maree sono **calcolate** dal transito lunare, non scaricate: stima a
  ±45 minuti, con link alla tabella ufficiale in fondo alla pagina.
- **✨ Itinerario proposto** — l'app si apre già con una proposta di 7 giorni costruita sulle
  maree reali di quelle date, con giornate lunghe e corte alternate. Si modifica tutto, e dal
  menù ⋯ si può ricaricare la proposta o svuotare tutto.
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

### Come si condivide, in pratica

Sono due cose diverse:

1. **L'indirizzo del sito** (`https://pampaz98.github.io/Fuerteventura/`) si pubblica una volta
   sola con i passaggi qui sopra. Chi lo apre vede l'itinerario proposto.
2. **Il tuo itinerario** viaggia dentro il link: premi **🔗 Condividi** e l'app copia un indirizzo
   con in fondo `#i=...`, che contiene tappe, pasti e note. Sul telefono si apre direttamente il
   menù di condivisione (WhatsApp, Telegram…), sul computer il link finisce negli appunti.

Chi riceve il link vede esattamente il tuo programma e può modificarlo: le sue modifiche restano
sul suo telefono finché non preme a sua volta *Condividi* e ti rimanda il suo link. Non c'è un
server: nessuno può rovinare il piano degli altri, ma non c'è nemmeno una sincronizzazione
automatica.

### Salvataggio

Non c'è un pulsante "salva": ogni modifica finisce subito nella memoria del browser e
l'indicatore **✓ Salvato** in alto lampeggia a conferma. Riaprendo il sito sullo stesso
dispositivo si ritrova tutto.

Due cose da sapere:

- Il salvataggio è **per dispositivo e per browser**. Il telefono e il computer hanno due copie
  separate: per allinearle si usa *Condividi* e si apre il link sull'altro.
- Aprendo il link di un amico, il suo itinerario **prende il posto del tuo** su quel dispositivo.
  Per sicurezza l'app tiene da parte la tua versione e mostra un avviso con il pulsante
  **↩️ Torna al mio**.

Se l'indicatore diventa **⚠️ Non salvato** il browser sta bloccando la memoria locale
(tipicamente in navigazione privata): in quel caso usa *Esporta JSON* o *Condividi* prima di
chiudere la pagina. *Esporta JSON* resta comunque il modo migliore per tenersi un backup vero.

In locale basta aprire `index.html`, oppure `python3 -m http.server` nella cartella del progetto
(consigliato: alcuni browser bloccano le foto se il file è aperto con `file://`).

## Struttura

```
index.html                 pagina unica con le 4 viste
assets/css/style.css       stile
assets/js/data.js          ⬅️ IL DATABASE: luoghi, ristoranti, giorni, orari del tramonto
assets/js/app.js           stato, calendario, filtri, suggerimenti per vicinanza, condivisione
assets/js/tides.js         calcolo delle maree dal transito lunare
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
  tide: 'bassa',                              // opzionale: la marea che conta lì
  desc: 'Descrizione breve.',
  wiki: 'Titolo su Wikipedia'                 // opzionale, per la foto
}
```

## L'itinerario proposto in breve

| Giorno | Programma | Guida stimata |
|---|---|---|
| Sab 15 | Calderón Hondo presto, dune, tramonto sotto Tindaya | 1h35 |
| Dom 16 | **Sotavento** con la laguna al massimo (bassa marea 12:45, marea viva), Costa Calma, tramonto a La Pared | 3h54 |
| Lun 17 | Lagunas de El Cotillo, Faro del Tostón con le pozze (bassa 13:30), tramonto a Piedra Playa | 1h31 |
| Mar 18 | **Cofete** e Villa Winter, tramonto a Morro Jable | 5h44 |
| Mer 19 | **Isla de Lobos** (recupero), Playa Chica, kite a Flag Beach | 50 min |
| Gio 20 | Betancuria, grotte di **Ajuy** (bassa 15:49), tramonto a Puertito de los Molinos | 2h52 |
| Ven 21 | Dune di Corralejo, Playa del Moro, aperitivo d'addio al Muelle Chico | 35 min |

Le giornate lunghe (16, 18, 20) sono alternate a giornate corte, e Sotavento cade nei giorni di
marea viva, quando la laguna è più estesa.

## Note importanti sui dati

- **I tempi di percorrenza sono stime** (dati curati per la distanza da Corralejo, calcolo
  geografico per le distanze tra tappe): controllate sempre su Google Maps il giorno stesso.
- **Isla de Lobos** richiede un **permesso gratuito online**, a numero chiuso e spesso esaurito
  con settimane di anticipo: prenotatelo appena possibile.
- **Cofete e Punta de Jandía** si raggiungono su pista sterrata. La Jeep Avenger (tranne la
  versione 4xe) è a **trazione anteriore**: la pista è percorribile piano e con tempo asciutto,
  ma quasi tutti i contratti di noleggio vietano gli sterrati e in caso di danni l'assicurazione
  non copre. Controllate il contratto; in alternativa c'è la navetta 4x4 da Morro Jable.
- **Le maree in app sono una stima astronomica** (transito lunare + intervallo di alta marea di
  1,9 h, costante `HWI_HOURS` in `assets/js/tides.js`). Sono precise a ±45 minuti e più che
  sufficienti per programmare, ma prima di contare sulla bassa marea confrontatele con la
  [tabella ufficiale](https://tablademareas.com/es/fuerteventura/corralejo). Se trovate uno
  scarto costante, correggete quell'unica costante.
- I ristoranti sono spunti di partenza per zona: verificate orari e recensioni con il link
  TripAdvisor prima di prenotare.
