/* =========================================================================
   DATABASE LUOGHI — FUERTEVENTURA
   -------------------------------------------------------------------------
   Campi:
     id      : identificativo univoco
     name    : nome del posto
     type    : spiaggia | natura | borgo | panorama | cultura | attivita
     zone    : Nord | Ovest | Centro | Est | Sud (Jandia) | Isole
     lat/lng : coordinate
     min     : minuti d'auto STIMATI da Corralejo (senza traffico)
     access  : facile | medio | difficile | 4x4 | barca
     road    : asfalto | misto | sterrato  (usato per stimare i tempi tra tappe)
     park    : nota sul parcheggio
     tags    : etichette per i filtri
     best    : momento migliore della giornata
     desc    : descrizione breve
     wiki    : titolo articolo Wikipedia (IT o ES) per caricare una foto
   I tempi sono stime realistiche su strada: verificare sempre su Google Maps
   il giorno stesso (vento, lavori, sterrati che cambiano).
   ========================================================================= */

const CORRALEJO = { lat: 28.7404, lng: -13.8675, name: 'Corralejo', road: 'asfalto' };

const PLACES = [
  /* ------------------------------ NORD ---------------------------------- */
  {
    id: 'grandes-playas', name: 'Grandes Playas / Dune di Corralejo', type: 'spiaggia', zone: 'Nord',
    lat: 28.7089, lng: -13.8317, min: 8, access: 'facile', road: 'asfalto',
    park: 'Si parcheggia lungo la FV-1a, gratis, tantissimi spiazzi',
    tags: ['sabbia bianca', 'iconica', 'famiglia', 'vento'], best: 'mattina', tide: 'bassa', tideWhy: 'con la bassa si apre una lingua di sabbia enorme',
    desc: 'Chilometri di sabbia bianca e acqua turchese dentro il Parco Naturale delle Dune. La spiaggia simbolo dell\'isola: ci si ferma dove si vuole lungo la strada.',
    wiki: 'Parque natural de Corralejo'
  },
  {
    id: 'playa-del-moro', name: 'Playa del Moro', type: 'spiaggia', zone: 'Nord',
    lat: 28.7003, lng: -13.8283, min: 10, access: 'facile', road: 'asfalto',
    park: 'Parcheggio sterrato a bordo strada + 3 min a piedi tra le dune',
    tags: ['dune', 'tranquilla', 'snorkeling'], best: 'mattina',
    desc: 'Una delle cale più belle del tratto dune, con qualche roccia che ripara dal vento. Sabbia finissima e acqua limpida.'
  },
  {
    id: 'el-dormidero', name: 'Playa El Dormidero', type: 'spiaggia', zone: 'Nord',
    lat: 28.7130, lng: -13.8330, min: 10, access: 'medio', road: 'asfalto',
    park: 'Spiazzo sulla FV-1a, poi 5 min a piedi tra le dune: l\'accesso non è segnalato',
    tags: ['dune', 'tranquilla', 'acqua calma', 'nudismo'], best: 'mattina',
    desc: 'Uno degli arenili nascosti del Parco delle Dune, circa 440 m di sabbia dorata tra Playa Alzada e Playa del Moro. Acqua calma e pochissima gente proprio perché il sentiero non è indicato: si punta alle dune e si scende verso il mare.'
  },
  {
    id: 'playa-alzada', name: 'Playa Alzada / Bajo Negro', type: 'spiaggia', zone: 'Nord',
    lat: 28.7186, lng: -13.8348, min: 7, access: 'facile', road: 'asfalto',
    park: 'Spiazzi sterrati sulla FV-1a',
    tags: ['dune', 'tranquilla', 'kite'], best: 'pomeriggio',
    desc: 'Primo tratto delle dune uscendo da Corralejo, meno affollato dei chiringuiti più a sud. Ottimo per una nuotata veloce.'
  },
  {
    id: 'playa-chica-corralejo', name: 'Playa Chica (Corralejo)', type: 'spiaggia', zone: 'Nord',
    lat: 28.7381, lng: -13.8664, min: 3, access: 'facile', road: 'asfalto',
    park: 'A piedi dal centro',
    tags: ['centro', 'famiglia', 'riparata', 'snorkeling'], best: 'mattina',
    desc: 'La spiaggetta in paese, protetta e con acqua calma: perfetta per un bagno veloce prima di cena o con poco tempo.'
  },
  {
    id: 'muelle-chico', name: 'Muelle Chico & centro storico di Corralejo', type: 'borgo', zone: 'Nord',
    lat: 28.7418, lng: -13.8686, min: 2, access: 'facile', road: 'asfalto',
    park: 'Parcheggi blu/gratuiti nelle vie interne',
    tags: ['aperitivo', 'ristoranti', 'tramonto', 'passeggiata'], best: 'sera',
    desc: 'Il porticciolo vecchio con le barche colorate, i tavolini sull\'acqua e la vista su Lobos e Lanzarote. Il posto per l\'aperitivo al tramonto.'
  },
  {
    id: 'isla-lobos', name: 'Isla de Lobos', type: 'natura', zone: 'Isole',
    lat: 28.7486, lng: -13.8194, min: 15, access: 'barca', road: 'asfalto',
    park: 'Traghetto dal porto di Corralejo (15 min)',
    tags: ['isola', 'snorkeling', 'trekking', 'permesso obbligatorio'], best: 'giornata',
    desc: 'Isolotto vulcanico protetto davanti a Corralejo: la laguna di El Puertito, la Caletita e la salita alla Montaña La Caldera. ATTENZIONE: serve il permesso gratuito online (posti limitati, si esaurisce) + biglietto del traghetto.',
    wiki: 'Isla de Lobos'
  },
  {
    id: 'faro-toston', name: 'Faro del Tostón', type: 'panorama', zone: 'Nord',
    lat: 28.7255, lng: -14.0093, min: 30, access: 'facile', road: 'asfalto',
    park: 'Grande spiazzo davanti al faro',
    tags: ['faro', 'tramonto', 'museo', 'onde'], best: 'tramonto', tide: 'bassa', tideWhy: 'le pozze di marea emergono con la bassa',
    desc: 'Faro a strisce bianche e rosse sulla punta nord-ovest, con museo della pesca tradizionale. Le pozze di marea intorno sono spettacolari al tramonto.',
    wiki: 'Faro del Tostón'
  },
  {
    id: 'lagunas-cotillo', name: 'Lagunas de El Cotillo (Playa de la Concha)', type: 'spiaggia', zone: 'Nord',
    lat: 28.6944, lng: -14.0110, min: 27, access: 'facile', road: 'asfalto',
    park: 'Parcheggi sterrati sopra le lagune',
    tags: ['acqua calma', 'famiglia', 'turchese', 'snorkeling'], best: 'mattina', tide: 'alta', tideWhy: 'con la bassa restano pochi centimetri d\'acqua: meglio marea medio-alta',
    desc: 'Piscine naturali di acqua turchese e calmissima protette da barriere di roccia: la zona più "caraibica" dell\'isola e la scelta migliore quando il vento tira.',
    wiki: 'El Cotillo'
  },
  {
    id: 'piedra-playa', name: 'Playa del Castillo / Piedra Playa (El Cotillo)', type: 'spiaggia', zone: 'Nord',
    lat: 28.6800, lng: -14.0126, min: 28, access: 'facile', road: 'asfalto',
    park: 'Parcheggio sterrato grande sopra la spiaggia',
    tags: ['surf', 'onde', 'tramonto', 'lunga'], best: 'tramonto',
    desc: 'Grande spiaggia selvaggia di sabbia dorata a sud di El Cotillo. Bellissima al tramonto, ma attenzione a correnti e risacca: si nuota solo con mare calmo.'
  },
  {
    id: 'playa-aguila', name: 'Playa del Águila (La Escalera)', type: 'spiaggia', zone: 'Nord',
    lat: 28.6555, lng: -14.0170, min: 40, access: 'difficile', road: 'sterrato',
    park: 'Pista sterrata di 3,5 km a sud di El Cotillo, si parcheggia in cima alla falesia; poi 130 gradini scavati nella roccia',
    tags: ['selvaggia', 'falesie', 'deserta', 'scalinata', 'nudismo'], best: 'pomeriggio',
    tide: 'bassa', tideWhy: 'con l\'alta la sabbia si riduce a una striscia sotto la falesia',
    desc: 'La cala segreta di El Cotillo: sabbia dorata chiusa tra falesie a picco, si scende con una scalinata di 130 gradini. Nessun servizio, nessuna ombra, quasi nessuno. Mare della costa ovest: si entra in acqua solo se è piatto, le correnti qui sono serie.'
  },
  {
    id: 'popcorn-beach', name: 'Popcorn Beach (Playa del Bajo de la Burra)', type: 'spiaggia', zone: 'Nord',
    lat: 28.7445, lng: -13.9420, min: 25, access: 'difficile', road: 'sterrato',
    park: 'Pista sterrata di circa 7 km da Corralejo verso Majanicho, piena di buche: piano con l\'utilitaria',
    tags: ['insolita', 'fotografia', 'niente bagno', 'fuori rotta'], best: 'mattina',
    desc: 'La spiaggia di "popcorn": non è sabbia ma rodoliti, scheletri di alghe calcaree bianche accumulati dal mare. Spettacolare da vedere e fotografare, ma NON si fa il bagno (fondale roccioso e onde) e soprattutto NON si raccolgono i popcorn: sono materiale protetto e le multe sono salate. Andare presto: a metà mattina si riempie.'
  },
  {
    id: 'cotillo-borgo', name: 'El Cotillo (borgo e porticciolo)', type: 'borgo', zone: 'Nord',
    lat: 28.6866, lng: -14.0072, min: 26, access: 'facile', road: 'asfalto',
    park: 'Parcheggi lungo il lungomare',
    tags: ['ristoranti', 'pesce', 'tramonto', 'passeggiata'], best: 'sera',
    desc: 'Villaggio di pescatori diventato paesino hippie-chic: castello di El Tostón, ristorantini di pesce sul porticciolo e i migliori tramonti dell\'isola.'
  },
  {
    id: 'majanicho', name: 'Majanicho', type: 'borgo', zone: 'Nord',
    lat: 28.7455, lng: -13.9310, min: 25, access: 'difficile', road: 'sterrato',
    park: 'Sterrato pieno di buche (fattibile con utilitaria, piano)',
    tags: ['surf', 'autentico', 'pozze', 'fuori rotta'], best: 'pomeriggio', tide: 'bassa', tideWhy: 'le pozze si formano con la bassa marea',
    desc: 'Micro-villaggio di casette bianche di pescatori sulla costa nord selvaggia, tra spot da surf e pozze naturali. Zero turismo, tanto vento.'
  },
  {
    id: 'playa-esquinzo-norte', name: 'Playa de Esquinzo (Nord)', type: 'spiaggia', zone: 'Nord',
    lat: 28.7231, lng: -13.9682, min: 30, access: 'difficile', road: 'sterrato',
    park: 'Sterrato dalla pista Majanicho–El Cotillo',
    tags: ['selvaggia', 'deserta', 'nudismo'], best: 'pomeriggio',
    desc: 'Cala di sabbia chiara persa sulla costa nord, quasi sempre vuota. Si arriva solo dalla pista sterrata: andarci con calma e con luce.'
  },
  {
    id: 'lajares', name: 'Lajares', type: 'borgo', zone: 'Nord',
    lat: 28.6884, lng: -13.9569, min: 15, access: 'facile', road: 'asfalto',
    park: 'Facile in paese',
    tags: ['artigianato', 'caffè', 'surf town', 'colazione'], best: 'mattina',
    desc: 'Paesino surf & craft: laboratori di ricamo, negozietti, caffè specialty e mercatino artigianale del sabato/martedì. Ottima tappa per colazione o pranzo.'
  },
  {
    id: 'calderon-hondo', name: 'Vulcano Calderón Hondo', type: 'natura', zone: 'Nord',
    lat: 28.6971, lng: -13.9219, min: 18, access: 'medio', road: 'asfalto',
    park: 'Parcheggio all\'inizio del sentiero (Lajares), poi 45 min a piedi a/r',
    tags: ['trekking', 'cratere', 'alba', 'scoiattoli'], best: 'mattina',
    desc: 'Camminata facile (circa 2 km) fino al bordo di un cratere perfetto, con vista su tutto il nord dell\'isola. Da fare presto la mattina o al tramonto: a mezzogiorno si cuoce.',
    wiki: 'Calderón Hondo'
  },
  {
    id: 'malpais-arena', name: 'Malpaís de la Arena', type: 'natura', zone: 'Nord',
    lat: 28.6395, lng: -13.9081, min: 18, access: 'medio', road: 'asfalto',
    park: 'Area di sosta lungo la FV-101',
    tags: ['trekking', 'lava', 'vulcano'], best: 'mattina',
    desc: 'Colata lavica nera con sentiero ad anello attorno al vulcano Arena. Paesaggio lunare, poca ombra.'
  },
  {
    id: 'cueva-llano', name: 'Cueva del Llano (Villaverde)', type: 'cultura', zone: 'Nord',
    lat: 28.6564, lng: -13.9125, min: 16, access: 'facile', road: 'asfalto',
    park: 'Parcheggio del centro visite',
    tags: ['grotta', 'visita guidata', 'ombra'], best: 'pomeriggio',
    desc: 'Tubo vulcanico di 648 m visitabile con guida (casco e torcia), con una specie di ragno endemica. Perfetto nelle ore calde. Verificare orari/prenotazione.'
  },
  {
    id: 'la-oliva', name: 'La Oliva — Casa de los Coroneles', type: 'cultura', zone: 'Nord',
    lat: 28.6118, lng: -13.9312, min: 22, access: 'facile', road: 'asfalto',
    park: 'Gratis davanti alla casa',
    tags: ['storia', 'architettura', 'museo'], best: 'mattina',
    desc: 'La dimora settecentesca dei governatori militari dell\'isola, con la chiesa di Nuestra Señora de la Candelaria a due passi. Il centro storico più signorile di Fuerteventura.',
    wiki: 'Casa de los Coroneles'
  },
  {
    id: 'tindaya', name: 'Montaña Tindaya', type: 'natura', zone: 'Nord',
    lat: 28.5883, lng: -13.9853, min: 30, access: 'medio', road: 'misto',
    park: 'Sterrato breve fino alla base',
    tags: ['sacra', 'trekking', 'incisioni', 'fotografia'], best: 'tramonto',
    desc: 'La montagna sacra degli aborigeni Majos, con centinaia di incisioni podomorfe. La salita è regolamentata, ma la vista dalla base al tramonto vale il viaggio.',
    wiki: 'Montaña de Tindaya'
  },
  {
    id: 'barranco-enamorados', name: 'Barranco de los Enamorados', type: 'natura', zone: 'Nord',
    lat: 28.6016, lng: -13.9633, min: 28, access: 'medio', road: 'misto',
    park: 'Spiazzo sterrato, poi 20 min a piedi',
    tags: ['canyon', 'roccia bianca', 'fotografia', 'instagram'], best: 'mattina',
    desc: 'Piccolo canyon di roccia bianchissima erosa, spettacolare per le foto. Niente ombra: solo mattina presto o tardo pomeriggio.'
  },
  {
    id: 'vallebron', name: 'Mirador de Vallebrón', type: 'panorama', zone: 'Nord',
    lat: 28.5606, lng: -13.9337, min: 35, access: 'facile', road: 'asfalto',
    park: 'Piazzola panoramica',
    tags: ['vista', 'tramonto', 'stelle'], best: 'tramonto',
    desc: 'Belvedere sulla valle verde di Vallebrón con vista fino a Tindaya e all\'oceano. Cielo bellissimo dopo il tramonto.'
  },
  {
    id: 'playa-jarugo', name: 'Playa de Jarugo', type: 'spiaggia', zone: 'Ovest',
    lat: 28.5747, lng: -14.0500, min: 45, access: 'difficile', road: 'sterrato',
    park: 'Sterrato lungo da Tindaya/Tefía, poi discesa a piedi',
    tags: ['selvaggia', 'deserta', 'onde', 'avventura'], best: 'pomeriggio',
    desc: 'Spiaggia nera e dorata incastrata tra falesie sulla costa ovest, quasi sempre deserta. Mare mosso e correnti: più da contemplare che da nuotare.'
  },

  /* ------------------------------ OVEST --------------------------------- */
  {
    id: 'los-molinos', name: 'Puertito de los Molinos', type: 'borgo', zone: 'Ovest',
    lat: 28.5073, lng: -14.0330, min: 45, access: 'facile', road: 'asfalto',
    park: 'Spiazzo all\'ingresso del villaggio',
    tags: ['pesce', 'tramonto', 'autentico', 'spiaggia nera'], best: 'tramonto',
    desc: 'Frazione di casette bianche in fondo a un barranco verde, con spiaggetta di ciottoli neri e un paio di ristorantini di pesce sull\'acqua. Uno dei tramonti più belli.'
  },
  {
    id: 'ajuy', name: 'Ajuy e le Grotte (Caleta Negra)', type: 'natura', zone: 'Ovest',
    lat: 28.3970, lng: -14.1510, min: 60, access: 'medio', road: 'asfalto',
    park: 'Parcheggio all\'ingresso del paese, poi 20 min a piedi in salita',
    tags: ['grotte', 'sabbia nera', 'falesie', 'geologia'], best: 'pomeriggio', tide: 'bassa', tideWhy: 'le grotte si raggiungono in sicurezza con la bassa marea',
    desc: 'Spiaggia di sabbia nera e sentiero a picco sull\'oceano fino alle grotte marine scavate nelle rocce più antiche delle Canarie (70 milioni di anni). Da non perdere.',
    wiki: 'Ajuy'
  },
  {
    id: 'aguas-verdes', name: 'Aguas Verdes', type: 'spiaggia', zone: 'Ovest',
    lat: 28.4569, lng: -14.0983, min: 60, access: 'difficile', road: 'sterrato',
    park: 'Pista sterrata lunga dalla FV-30',
    tags: ['pozze', 'selvaggia', 'sabbia nera'], best: 'pomeriggio', tide: 'bassa', tideWhy: 'le piscine naturali si usano solo con bassa marea e mare piatto',
    desc: 'Tratto di costa selvaggia con calette nere e piscine naturali tra le rocce. Bagno solo con mare piatto e bassa marea.'
  },
  {
    id: 'garcey', name: 'Playa de Garcey', type: 'spiaggia', zone: 'Ovest',
    lat: 28.3145, lng: -14.1983, min: 80, access: 'difficile', road: 'sterrato',
    park: 'Sterrato dalla FV-605',
    tags: ['relitto', 'deserta', 'selvaggia'], best: 'pomeriggio',
    desc: 'Spiaggia remota famosa per il relitto arrugginito dell\'American Star (ormai quasi del tutto inghiottito dal mare). Panorama potente, bagno sconsigliato.'
  },

  /* ------------------------------ CENTRO -------------------------------- */
  {
    id: 'betancuria', name: 'Betancuria', type: 'borgo', zone: 'Centro',
    lat: 28.4256, lng: -14.0578, min: 55, access: 'facile', road: 'asfalto',
    park: 'Parcheggi all\'ingresso del paese',
    tags: ['borgo', 'chiesa', 'ristoranti', 'storia'], best: 'mattina',
    desc: 'Antica capitale dell\'isola (1404), un\'oasi verde di case bianche tra le montagne, con la chiesa di Santa María e musei. Il borgo più bello di Fuerteventura.',
    wiki: 'Betancuria'
  },
  {
    id: 'morro-velosa', name: 'Mirador de Morro Velosa', type: 'panorama', zone: 'Centro',
    lat: 28.4550, lng: -14.0448, min: 50, access: 'facile', road: 'asfalto',
    park: 'Parcheggio del mirador',
    tags: ['vista', 'caffè', 'design'], best: 'mattina',
    desc: 'Belvedere progettato da César Manrique a 670 m: vetrate panoramiche su tutta la parte nord dell\'isola. Chiuso di lunedì, verificare gli orari.'
  },
  {
    id: 'guise-ayose', name: 'Mirador Guise y Ayose', type: 'panorama', zone: 'Centro',
    lat: 28.4083, lng: -14.0403, min: 58, access: 'facile', road: 'asfalto',
    park: 'Piazzola sulla FV-30',
    tags: ['statue', 'vista', 'foto veloce'], best: 'pomeriggio',
    desc: 'Le due statue in bronzo dei re aborigeni che si guardano da 5 metri d\'altezza, con vista sulla valle. Sosta di 15 minuti sulla strada per Pájara.'
  },
  {
    id: 'penitas', name: 'Barranco de las Peñitas & Ermita de la Peña', type: 'natura', zone: 'Centro',
    lat: 28.3934, lng: -14.0700, min: 65, access: 'difficile', road: 'sterrato',
    park: 'Sterrato da Vega de Río Palmas, poi 30 min a piedi',
    tags: ['trekking', 'diga', 'palme', 'oasi'], best: 'mattina',
    desc: 'Gola rocciosa con palmeto, una piccola diga e l\'eremo della patrona dell\'isola incastrato nella roccia. Il posto più "verde" e sorprendente di Fuerteventura.'
  },
  {
    id: 'pajara', name: 'Pájara', type: 'borgo', zone: 'Centro',
    lat: 28.3510, lng: -14.1080, min: 70, access: 'facile', road: 'asfalto',
    park: 'Facile in paese',
    tags: ['chiesa', 'giardino', 'pranzo'], best: 'mattina',
    desc: 'Paesino tranquillo con la chiesa di Nuestra Señora de Regla e il suo portale barocco di ispirazione azteca, unico nelle Canarie. Bella tappa pranzo verso Ajuy.'
  },
  {
    id: 'antigua-molino', name: 'Antigua — Molino & Museo del Queso', type: 'cultura', zone: 'Centro',
    lat: 28.4193, lng: -13.9345, min: 40, access: 'facile', road: 'asfalto',
    park: 'Parcheggio del museo',
    tags: ['formaggio', 'mulino', 'giardino cactus'], best: 'mattina',
    desc: 'Mulino restaurato, giardino di cactus e museo dedicato al majorero, il formaggio di capra DOP dell\'isola. Degustazione inclusa.'
  },
  {
    id: 'sicasumbre', name: 'Mirador Astronómico de Sicasumbre', type: 'panorama', zone: 'Centro',
    lat: 28.2833, lng: -14.1667, min: 80, access: 'facile', road: 'asfalto',
    park: 'Piazzola attrezzata sulla FV-605',
    tags: ['stelle', 'notte', 'vista', 'silenzio'], best: 'sera',
    desc: 'Punto di osservazione astronomica attrezzato, lontano da ogni luce: con la Via Lattea d\'agosto è uno spettacolo. Portare felpa e torcia rossa.'
  },

  /* -------------------------------- EST --------------------------------- */
  {
    id: 'puerto-rosario', name: 'Puerto del Rosario', type: 'borgo', zone: 'Est',
    lat: 28.5004, lng: -13.8627, min: 30, access: 'facile', road: 'asfalto',
    park: 'Parcheggi in centro / porto',
    tags: ['città', 'sculture', 'shopping', 'street art'], best: 'mattina',
    desc: 'La capitale: passeggiata sul porto, museo di Unamuno e oltre 100 sculture a cielo aperto sparse per la città. Utile anche per supermercati e farmacie.',
    wiki: 'Puerto del Rosario'
  },
  {
    id: 'playa-blanca-pr', name: 'Playa Blanca (Puerto del Rosario)', type: 'spiaggia', zone: 'Est',
    lat: 28.4744, lng: -13.8556, min: 32, access: 'facile', road: 'asfalto',
    park: 'Lungo la strada litoranea',
    tags: ['locale', 'sabbia dorata', 'famiglia'], best: 'pomeriggio',
    desc: 'La spiaggia dei residenti della capitale: sabbia dorata, servizi, poco turismo. Comoda se si è già in zona.'
  },
  {
    id: 'puerto-lajas', name: 'Puerto Lajas', type: 'borgo', zone: 'Est',
    lat: 28.5330, lng: -13.8480, min: 26, access: 'facile', road: 'asfalto',
    park: 'Nel villaggio',
    tags: ['pesce', 'caletta', 'autentico'], best: 'sera',
    desc: 'Piccolo villaggio di pescatori con caletta protetta e qualche buon ristorante di pesce, a metà strada tra Corralejo e la capitale.'
  },
  {
    id: 'caleta-fuste', name: 'Caleta de Fuste / El Castillo', type: 'spiaggia', zone: 'Est',
    lat: 28.3968, lng: -13.8598, min: 45, access: 'facile', road: 'asfalto',
    park: 'Parcheggi del porto turistico',
    tags: ['baia calma', 'famiglia', 'servizi', 'snorkeling'], best: 'pomeriggio',
    desc: 'Baia artificiale con acqua sempre piatta, marina, castello del \'700 e tanti locali. La scelta sicura nei giorni di vento forte.'
  },
  {
    id: 'salinas-carmen', name: 'Salinas del Carmen — Museo della Sal', type: 'cultura', zone: 'Est',
    lat: 28.3830, lng: -13.8560, min: 48, access: 'facile', road: 'asfalto',
    park: 'Davanti al museo',
    tags: ['saline', 'museo', 'balene'], best: 'pomeriggio',
    desc: 'Saline ancora attive con museo e scheletro di capodoglio. Visita breve e insolita, con caletta e ristorantino accanto.'
  },
  {
    id: 'pozo-negro', name: 'Pozo Negro & Poblado de la Atalayita', type: 'borgo', zone: 'Est',
    lat: 28.3255, lng: -13.8830, min: 60, access: 'medio', road: 'misto',
    park: 'Sterrato breve ma comodo',
    tags: ['pesce', 'archeologia', 'spiaggia nera'], best: 'pomeriggio',
    desc: 'Villaggio di pescatori con spiaggia di ciottoli neri e, poco prima, il villaggio aborigeno della Atalayita nel malpaís. Combinazione perfetta mare + storia.'
  },
  {
    id: 'las-playitas', name: 'Las Playitas', type: 'borgo', zone: 'Est',
    lat: 28.2280, lng: -13.9280, min: 70, access: 'facile', road: 'asfalto',
    park: 'Lungomare',
    tags: ['pesce', 'tranquillo', 'sport'], best: 'sera',
    desc: 'Villaggio bianco e blu di pescatori, ottimo per una cena di pesce lontano dai circuiti turistici.'
  },
  {
    id: 'faro-entallada', name: 'Faro de la Entallada', type: 'panorama', zone: 'Est',
    lat: 28.2211, lng: -13.8586, min: 80, access: 'medio', road: 'asfalto',
    park: 'Strada stretta a tornanti fino al faro',
    tags: ['falesia', 'vista Africa', 'foto', 'vertigini'], best: 'pomeriggio',
    desc: 'Il faro sul punto più vicino all\'Africa (circa 100 km), a picco su falesie di 190 m. Strada stretta ma asfaltata, panorama pazzesco.'
  },
  {
    id: 'gran-tarajal', name: 'Gran Tarajal', type: 'borgo', zone: 'Est',
    lat: 28.2100, lng: -14.0200, min: 75, access: 'facile', road: 'asfalto',
    park: 'Lungomare',
    tags: ['sabbia nera', 'locale', 'murales'], best: 'pomeriggio',
    desc: 'Seconda città dell\'isola, spiaggia di sabbia nera, palme e murales sul lungomare. Molto canario, pochissimo turistico.'
  },

  /* --------------------------- SUD / JANDÍA ----------------------------- */
  {
    id: 'la-pared', name: 'La Pared / Playa del Viejo Rey', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.2130, lng: -14.2230, min: 90, access: 'medio', road: 'asfalto',
    park: 'Sterrato sopra la spiaggia, poi discesa',
    tags: ['surf', 'tramonto', 'falesie', 'onde'], best: 'tramonto',
    desc: 'Spiaggia ampia sotto le falesie ocra della costa ovest, spot di surf e uno dei posti migliori dell\'isola per vedere il sole cadere in mare.'
  },
  {
    id: 'costa-calma', name: 'Costa Calma', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.1620, lng: -14.2270, min: 85, access: 'facile', road: 'asfalto',
    park: 'Parcheggi vicino agli hotel',
    tags: ['sabbia bianca', 'servizi', 'famiglia', 'vento'], best: 'pomeriggio',
    desc: 'Lunghissima spiaggia bianca all\'inizio della penisola di Jandía, con tutti i servizi. Punto di partenza per Sotavento.'
  },
  {
    id: 'sotavento', name: 'Playa de Sotavento & Laguna', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.1178, lng: -14.2261, min: 95, access: 'facile', road: 'asfalto',
    park: 'Parcheggio di Risco del Paso / Los Gorriones',
    tags: ['laguna', 'kitesurf', 'iconica', 'marea'], best: 'pomeriggio', tide: 'bassa', tideWhy: 'la laguna si forma solo con la bassa marea',
    desc: 'La spiaggia più fotografata dell\'isola: con la bassa marea si forma una laguna azzurra chilometrica alta pochi centimetri. Controllare le maree prima di andare — è tutto lì.',
    wiki: 'Playa de Sotavento'
  },
  {
    id: 'esquinzo-butihondo', name: 'Playa de Esquinzo–Butihondo', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.0839, lng: -14.3126, min: 105, access: 'medio', road: 'asfalto',
    park: 'Accessi dagli hotel, scale',
    tags: ['sabbia dorata', 'lunga', 'tranquilla'], best: 'pomeriggio',
    desc: 'Lungo arenile dorato tra Butihondo e Jandía, meno affollato di Morro Jable e con acqua bellissima.'
  },
  {
    id: 'morro-jable', name: 'Morro Jable & Playa del Matorral', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.0480, lng: -14.3520, min: 110, access: 'facile', road: 'asfalto',
    park: 'Parcheggi lungo il Matorral',
    tags: ['faro', 'ristoranti', 'famiglia', 'lunga'], best: 'pomeriggio',
    desc: 'Il capoluogo del sud: 4 km di spiaggia dorata, il faro di Morro Jable, il vecchio borgo in salita e tanti ristoranti. Base per Cofete.',
    wiki: 'Morro Jable'
  },
  {
    id: 'cofete', name: 'Playa de Cofete', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.1069, lng: -14.3874, min: 150, access: '4x4', road: 'sterrato',
    park: 'Pista sterrata di 18 km da Morro Jable: 45-60 min a senso',
    tags: ['iconica', 'selvaggia', 'no bagno', 'avventura'], best: 'giornata',
    desc: 'Dodici chilometri di sabbia deserta ai piedi di montagne che cadono in mare: il posto più spettacolare delle Canarie. La pista è sterrata e stretta (molte compagnie di noleggio la vietano: controllare il contratto, in alternativa c\'è la navetta 4x4 da Morro Jable). Bagno pericolosissimo per le correnti.',
    wiki: 'Playa de Cofete'
  },
  {
    id: 'villa-winter', name: 'Villa Winter (Cofete)', type: 'cultura', zone: 'Sud (Jandia)',
    lat: 28.1053, lng: -14.3830, min: 152, access: '4x4', road: 'sterrato',
    park: 'Sterrato dal villaggio di Cofete',
    tags: ['misteri', 'storia', 'leggende'], best: 'pomeriggio',
    desc: 'La villa isolata dell\'ingegnere tedesco Gustav Winter, al centro di ogni leggenda su nazisti e sottomarini. Visitabile con piccola offerta; ci si arriva insieme a Cofete.'
  },
  {
    id: 'punta-jandia', name: 'Faro de Punta Jandía & Puertito de la Cruz', type: 'panorama', zone: 'Sud (Jandia)',
    lat: 28.0575, lng: -14.4936, min: 155, access: '4x4', road: 'sterrato',
    park: 'Pista sterrata di 20 km da Morro Jable',
    tags: ['faro', 'fine del mondo', 'pesce', 'remoto'], best: 'pomeriggio',
    desc: 'La punta estrema sud-ovest dell\'isola: faro, oceano furioso e il villaggio di Puertito de la Cruz con due ristorantini di pesce. Si combina con Cofete in una giornata lunga.'
  },
  {
    id: 'oasis-park', name: 'Oasis Park (La Lajita)', type: 'attivita', zone: 'Sud (Jandia)',
    lat: 28.1720, lng: -14.1600, min: 85, access: 'facile', road: 'asfalto',
    park: 'Parcheggio grande gratuito',
    tags: ['animali', 'giardino botanico', 'famiglia', 'mezza giornata'], best: 'mattina',
    desc: 'Zoo e orto botanico enorme con spettacoli di rapaci e lemuri, cammelli e il più grande giardino di cactus delle Canarie. Serve mezza giornata, biglietto online più economico.'
  },
  {
    id: 'playa-mal-nombre', name: 'Playa de Mal Nombre', type: 'spiaggia', zone: 'Sud (Jandia)',
    lat: 28.0930, lng: -14.3280, min: 100, access: 'medio', road: 'misto',
    park: 'Sterrato breve dalla FV-2, poi sentiero',
    tags: ['selvaggia', 'nudismo', 'deserta'], best: 'pomeriggio', tide: 'bassa', tideWhy: 'con l\'alta la spiaggia si riduce parecchio',
    desc: 'Cala selvaggia sotto la strada di Jandía, senza servizi e quasi sempre vuota nonostante sia a pochi minuti dagli hotel.'
  },

  /* -------------------------- ATTIVITÀ / EXTRA -------------------------- */
  {
    id: 'kite-flag-beach', name: 'Flag Beach — kite & windsurf (Corralejo)', type: 'attivita', zone: 'Nord',
    lat: 28.7226, lng: -13.8382, min: 6, access: 'facile', road: 'asfalto',
    park: 'Spiazzo delle scuole di kite',
    tags: ['kitesurf', 'windsurf', 'lezioni', 'vento'], best: 'pomeriggio',
    desc: 'Lo spot di riferimento per kite e windsurf a Corralejo, con scuole e noleggio. Lezione base o solo spettacolo dalla spiaggia.'
  },
  {
    id: 'snorkel-lobos', name: 'Escursione in barca / snorkeling a Lobos', type: 'attivita', zone: 'Isole',
    lat: 28.7433, lng: -13.8654, min: 0, access: 'barca', road: 'asfalto',
    park: 'Partenza dal porto di Corralejo',
    tags: ['barca', 'snorkeling', 'mezza giornata', 'gruppo'], best: 'mattina',
    desc: 'Uscite in catamarano o gommone verso Lobos e la costa nord, con snorkeling e pranzo a bordo. Da prenotare il giorno prima al porto.'
  },
  {
    id: 'mercatino-corralejo', name: 'Mercatino di Corralejo (Campanario)', type: 'attivita', zone: 'Nord',
    lat: 28.7288, lng: -13.8632, min: 5, access: 'facile', road: 'asfalto',
    park: 'Parcheggio del centro commerciale',
    tags: ['mercatino', 'artigianato', 'giovedì', 'domenica'], best: 'mattina',
    desc: 'Mercatino artigianale nel patio in stile canario del Campanario: giovedì e domenica mattina. Buon posto anche per fare colazione.'
  },
  {
    id: 'lanzarote-day', name: 'Gita a Lanzarote (traghetto da Corralejo)', type: 'attivita', zone: 'Isole',
    lat: 28.7437, lng: -13.8664, min: 0, access: 'barca', road: 'asfalto',
    park: 'Traghetto Lineas Romero / Fred Olsen, 25 min per Playa Blanca',
    tags: ['gita', 'giornata intera', 'traghetto'], best: 'giornata',
    desc: 'In 25 minuti si è a Playa Blanca: Timanfaya, Papagayo o i vini di La Geria. Serve tutta la giornata e conviene noleggiare un\'auto lì o prenotare un tour.'
  }
];

/* =========================================================================
   RISTORANTI / OPZIONI PASTO
   Sono spunti di partenza raccolti per zona: prima di prenotare
   verificate orari e recensioni con il link TripAdvisor su ogni scheda.
   Potete sempre usare "Al sacco", "A casa" o scrivere un posto vostro.
   ========================================================================= */

const FOOD = [
  { id: 'f-marquesina',  name: 'La Marquesina',            zone: 'Corralejo',   lat: 28.7415, lng: -13.8690, price: '€€',  kind: 'Pesce fresco sul porticciolo' },
  { id: 'f-muelle',      name: 'Zona Muelle Chico',        zone: 'Corralejo',   lat: 28.7418, lng: -13.8686, price: '€€',  kind: 'Tanti ristoranti sull\'acqua, si sceglie sul posto' },
  { id: 'f-avenida',     name: 'Zona Avenida Marítima',    zone: 'Corralejo',   lat: 28.7350, lng: -13.8625, price: '€€',  kind: 'Passeggiata con pizzerie, tapas e cocktail' },
  { id: 'f-blue-rock',   name: 'Blue Rock',                zone: 'Corralejo',   lat: 28.7386, lng: -13.8641, price: '€',   kind: 'Musica dal vivo e birre, dopo cena' },
  { id: 'f-vaca-azul',   name: 'La Vaca Azul',             zone: 'El Cotillo',  lat: 28.6879, lng: -14.0102, price: '€€',  kind: 'Storico, pesce con vista sulle onde' },
  { id: 'f-cotillo-port',name: 'Porticciolo di El Cotillo',zone: 'El Cotillo',  lat: 28.6885, lng: -14.0090, price: '€€',  kind: 'Fila di ristoranti di pesce sul molo' },
  { id: 'f-lajares',     name: 'Caffè e bistrot di Lajares',zone: 'Lajares',    lat: 28.6884, lng: -13.9569, price: '€',   kind: 'Colazioni, brunch, cucina veg' },
  { id: 'f-mahoh',       name: 'Mahoh (La Oliva)',         zone: 'La Oliva',    lat: 28.6250, lng: -13.9250, price: '€€€', kind: 'Cucina canaria in una casa rurale' },
  { id: 'f-villaverde',  name: 'Trattorie di Villaverde',  zone: 'Villaverde',  lat: 28.6534, lng: -13.9174, price: '€€',  kind: 'Carne alla brace, cucina majorera' },
  { id: 'f-molinos',     name: 'Ristoranti di Puertito de los Molinos', zone: 'Los Molinos', lat: 28.5073, lng: -14.0330, price: '€€', kind: 'Pesce del giorno sulla scogliera' },
  { id: 'f-betancuria',  name: 'Ristoranti di Betancuria', zone: 'Betancuria',  lat: 28.4256, lng: -14.0578, price: '€€',  kind: 'Capretto, formaggi, patatas arrugadas' },
  { id: 'f-pajara',      name: 'Ristoranti di Pájara',     zone: 'Pájara',      lat: 28.3510, lng: -14.1080, price: '€€',  kind: 'Cucina locale in patio, tappa pranzo' },
  { id: 'f-ajuy',        name: 'Ristoranti di Ajuy',       zone: 'Ajuy',        lat: 28.3970, lng: -14.1510, price: '€€',  kind: 'Pesce davanti alla spiaggia nera' },
  { id: 'f-pozo-negro',  name: 'Ristoranti di Pozo Negro', zone: 'Pozo Negro',  lat: 28.3255, lng: -13.8830, price: '€€',  kind: 'Pescato del giorno, molto locale' },
  { id: 'f-salinas',     name: 'Caletta di Salinas del Carmen', zone: 'Salinas', lat: 28.3830, lng: -13.8560, price: '€€', kind: 'Terrazza sul mare accanto alle saline' },
  { id: 'f-caleta',      name: 'Marina di Caleta de Fuste',zone: 'Caleta de Fuste', lat: 28.3968, lng: -13.8598, price: '€€', kind: 'Tanta scelta intorno al porto turistico' },
  { id: 'f-lajas',       name: 'Ristoranti di Puerto Lajas', zone: 'Puerto Lajas', lat: 28.5330, lng: -13.8480, price: '€€', kind: 'Pesce in un villaggio senza turisti' },
  { id: 'f-playitas',    name: 'Ristoranti di Las Playitas', zone: 'Las Playitas', lat: 28.2280, lng: -13.9280, price: '€€', kind: 'Cena di pesce sul lungomare' },
  { id: 'f-tarajal',     name: 'Lungomare di Gran Tarajal',zone: 'Gran Tarajal',lat: 28.2100, lng: -14.0200, price: '€',   kind: 'Tapas e pesce, atmosfera canaria' },
  { id: 'f-costacalma',  name: 'Ristoranti di Costa Calma',zone: 'Costa Calma', lat: 28.1620, lng: -14.2270, price: '€€',  kind: 'Molta scelta internazionale' },
  { id: 'f-morrojable',  name: 'Vecchio borgo di Morro Jable', zone: 'Morro Jable', lat: 28.0510, lng: -14.3530, price: '€€', kind: 'Pesce e cucina spagnola in salita dal porto' },
  { id: 'f-cofete',      name: 'Restaurante Cofete',       zone: 'Cofete',      lat: 28.1090, lng: -14.3830, price: '€',   kind: 'Unico posto per mangiare a Cofete, semplice' },
  { id: 'f-lapared',     name: 'Ristoranti di La Pared',   zone: 'La Pared',    lat: 28.2130, lng: -14.2230, price: '€€',  kind: 'Terrazze sul tramonto della costa ovest' }
];

const MEAL_SPECIAL = [
  { id: 'sacco', name: 'Al sacco', icon: '🥪', note: 'Panini, frutta, ghiaccio secco e via' },
  { id: 'casa',  name: 'A casa',   icon: '🏠', note: 'Si cucina in appartamento' },
  { id: 'libero',name: 'Da decidere / scrivo io', icon: '✏️', note: 'Campo libero' }
];

/* -------------------------------------------------------------------------
   GIORNI DEL VIAGGIO
   14 e 22 agosto non si organizzano (arrivo / partenza).
   Orari del tramonto: stime per Fuerteventura, agosto 2026 (ora locale WEST).
   ------------------------------------------------------------------------- */
const TRIP = {
  arrival: { date: '2026-08-14', label: 'Venerdì 14 — Arrivo', note: 'Volo, ritiro auto, spesa e prima cena a Corralejo.' },
  departure: { date: '2026-08-22', label: 'Sabato 22 — Partenza', note: 'Check-out, riconsegna auto, ultimo bagno se il volo lo permette.' },
  days: [
    { date: '2026-08-15', label: 'Sabato 15 agosto',   sunset: '20:52' },
    { date: '2026-08-16', label: 'Domenica 16 agosto', sunset: '20:51' },
    { date: '2026-08-17', label: 'Lunedì 17 agosto',   sunset: '20:50' },
    { date: '2026-08-18', label: 'Martedì 18 agosto',  sunset: '20:49' },
    { date: '2026-08-19', label: 'Mercoledì 19 agosto',sunset: '20:48' },
    { date: '2026-08-20', label: 'Giovedì 20 agosto',  sunset: '20:47' },
    { date: '2026-08-21', label: 'Venerdì 21 agosto',  sunset: '20:45' }
  ]
};

/* -------------------------------------------------------------------------
   PROPOSTA DI ITINERARIO (5 persone, ritmo tranquillo, base Corralejo)
   Costruita sulle maree reali di quei giorni:
     · 14-17 ago maree vive (novilunio del 12): bassa marea a metà giornata
       -> Sotavento e le pozze del Faro del Tostón danno il massimo
     · 19-22 ago maree morte: escursione ridotta, poco importante per il resto
   Le giornate lunghe (Sotavento, Cofete, entroterra) sono alternate a
   giornate corte, e Cofete è al martedì come richiesto.
   È solo un punto di partenza: si cambia tutto dall'app.
   ------------------------------------------------------------------------- */
const PROPOSAL = [
  { // Sabato 15 — rodaggio a Corralejo, quasi senza auto
    slots: { mattina: 'grandes-playas', pomeriggio: 'playa-del-moro', tramonto: 'muelle-chico', sera: null },
    meals: { pranzo: { t: 'sacco' }, cena: { t: 'rest', id: 'f-muelle' } },
    note: 'Giornata di rodaggio: spesa grossa a Corralejo (ombrellone, ghiaccio, acqua). Bassa marea a mezzogiorno. Sulle dune ci si ferma dove si vuole lungo la FV-1a: più si va a sud, meno gente.'
  },
  { // Domenica 16 — Sotavento con la laguna al massimo
    slots: { mattina: 'sotavento', pomeriggio: 'costa-calma', tramonto: 'la-pared', sera: null },
    meals: { pranzo: { t: 'sacco' }, cena: { t: 'rest', id: 'f-lapared' } },
    note: 'IL giorno per Sotavento: bassa marea alle 12:45 con marea viva, la laguna è al massimo tra le 11 e le 15. Partenza verso le 8:30 (1h35 di strada). Tanta acqua e crema: lì non c\'è ombra. Attenzione al rientro: cenando a La Pared si torna a Corralejo verso mezzanotte e mezza — se preferite rientrare prima, cenate a Costa Calma e saltate La Pared.'
  },
  { // Lunedì 17 — El Cotillo e il nord-ovest
    slots: { mattina: 'lagunas-cotillo', pomeriggio: 'faro-toston', tramonto: 'piedra-playa', sera: null },
    meals: { pranzo: { t: 'rest', id: 'f-cotillo-port' }, cena: { t: 'rest', id: 'f-vaca-azul' } },
    note: 'Giornata corta dopo Sotavento. Bassa marea alle 13:30: le pozze intorno al Faro del Tostón sono al meglio nel primo pomeriggio. A Piedra Playa si entra in acqua solo se è calma: correnti forti.'
  },
  { // Martedì 18 — Cofete (giornata lunga)
    slots: { mattina: 'cofete', pomeriggio: 'villa-winter', tramonto: 'morro-jable', sera: null },
    meals: { pranzo: { t: 'rest', id: 'f-cofete' }, cena: { t: 'rest', id: 'f-morrojable' } },
    note: 'Sveglia presto (partenza 7:30): 1h50 fino a Morro Jable più 45-60 min di pista per Cofete. La Jeep Avenger è a trazione anteriore e il contratto di noleggio quasi certamente vieta gli sterrati: controllate il contratto, in alternativa c\'è la navetta 4x4 da Morro Jable. A Cofete NON si fa il bagno: correnti mortali. Pieno di benzina prima di scendere.'
  },
  { // Mercoledì 19 — Isla de Lobos, recupero
    slots: { mattina: 'isla-lobos', pomeriggio: 'playa-chica-corralejo', tramonto: 'kite-flag-beach', sera: null },
    meals: { pranzo: { t: 'sacco' }, cena: { t: 'rest', id: 'f-avenida' } },
    note: 'PERMESSO GRATUITO OBBLIGATORIO per Lobos, da prenotare online settimane prima (posti limitati) + biglietto del traghetto. Sull\'isola non c\'è quasi nulla: portare acqua e pranzo. Giornata di recupero dopo Cofete.'
  },
  { // Giovedì 20 — Betancuria, Ajuy e il tramonto dei Molinos
    slots: { mattina: 'betancuria', pomeriggio: 'ajuy', tramonto: 'los-molinos', sera: null },
    meals: { pranzo: { t: 'rest', id: 'f-betancuria' }, cena: { t: 'rest', id: 'f-molinos' } },
    note: 'Giornata nell\'entroterra. Bassa marea alle 15:49: le grotte di Ajuy si visitano bene nel pomeriggio (scarpe chiuse, 20 min di salita). Sulla strada vale la sosta al Mirador de Morro Velosa (chiuso il lunedì) e al Mirador Guise y Ayose.'
  },
  { // Venerdì 21 — ultimo giro nel nord
    slots: { mattina: 'calderon-hondo', pomeriggio: 'playa-alzada', tramonto: 'tindaya', sera: null },
    meals: { pranzo: { t: 'rest', id: 'f-lajares' }, cena: { t: 'rest', id: 'f-marquesina' } },
    note: 'Calderón Hondo presto, prima del caldo (45 min a piedi a/r dal parcheggio di Lajares). Pomeriggio di dune e ultimo bagno, tramonto sotto Tindaya. Fare benzina e valigie stasera: domani si parte.'
  }
];

const SLOTS = [
  { id: 'mattina',    label: 'Mattina',    icon: '🌅', hint: '09:00 – 13:00' },
  { id: 'pomeriggio', label: 'Pomeriggio', icon: '☀️', hint: '14:00 – 18:30' },
  { id: 'tramonto',   label: 'Tramonto',   icon: '🌇', hint: '19:00 – 21:15' },
  { id: 'sera',       label: 'Sera',       icon: '🌙', hint: 'dopo cena' }
];

const DAY_COLORS = ['#ff5d5d', '#ff9f1c', '#e8c400', '#25c46f', '#20c4d9', '#5b7cfa', '#c46bd9'];
