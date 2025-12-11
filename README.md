
# Sito Statico Campagna D&D

Un template moderno, responsive e leggero per gestire informazioni di una campagna.

## Struttura
- `index.html` — App single-page con router via hash
- `styles.css` — Tema dark/light con CSS moderno
- `app.js` — Rendering dinamico, ricerca, sezioni
- `data/campaign.json` — Dati della campagna (opzionale, si può caricare invece dei dati inline)
- `assets/` — Immagini (es. mappa)

## Avvio locale
Per evitare problemi di CORS, avvia un server locale nella cartella del progetto:

```bash
cd dnd-campaign-site
python -m http.server 8080
# poi apri http://localhost:8080
```

## Personalizzazione
- Modifica i dati inline in `index.html` (oggetto `window.CAMPAIGN`) **oppure** carica `data/campaign.json` e sostituisci l'assegnazione in `app.js` con un `fetch('./data/campaign.json')`.
- Cambia colori nel blocco `:root` di `styles.css`.
- Aggiungi immagini in `assets/` e referenziale nella sezione "Mappa".

## Deploy
Puoi pubblicare su GitHub Pages, Netlify, Vercel o qualsiasi hosting statico.

## Licenza
MIT
