// === Utilità & Stato (IT) ===
const state = {
  route: location.hash || '#/overview',
  query: '',
  data: window.CAMPAIGN
};

function $(sel, root=document) { return root.querySelector(sel); }
function $all(sel, root=document) { return Array.from(root.querySelectorAll(sel)); }

// Tema (persistenza)
(function initTheme(){
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  $('#themeToggle').addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', curr);
    localStorage.setItem('theme', curr);
    $('#themeToggle .icon').textContent = curr === 'light' ? '☀️' : '🌙';
  });
})();

// Navigazione (router hash)
window.addEventListener('hashchange', () => { state.route = location.hash || '#/overview'; render(); });

// Ricerca
$('#search').addEventListener('input', (e) => { state.query = e.target.value.toLowerCase(); render(); });

// Attiva tab corrente
function setActiveTab(){
  $all('.tab').forEach(a=>{ a.classList.toggle('active', a.getAttribute('href') === state.route); });
}

// Filtra per query generica
function matchQuery(text){ if(!state.query) return true; return (text||'').toLowerCase().includes(state.query); }

// Componenti UI
function card({title, subtitle, body, tags=[]}){
  const tagHtml = tags.map(t=>`<span class="badge">${t}</span>`).join('');
  return `<article class="card">
    <h3>${title}</h3>
    ${subtitle?`<p class="muted">${subtitle}</p>`:''}
    ${body?`<p>${body}</p>`:''}
    ${tags.length?`<div class="badges">${tagHtml}</div>`:''}
  </article>`;
}

function section(title, count){
  return `<div class="section-title">
    <h2>${title}</h2>
    <span class="muted">${count ?? ''}</span>
  </div>`;
}

// Render per sezioni
const views = {
  overview(){
    const o = state.data.overview;
    const party = (o.party||[]).map(p=>`<span class="badge">${p}</span>`).join('');
    return `
      ${section('Panoramica', '')}
      <div class="grid">
        ${card({ title:o.tagline, subtitle:`Sistema: ${o.system} · Sessioni: ${o.schedule}`, body:o.summary, tags:[] })}
        ${card({ title:'Party', body:'Membri attuali del party', tags:o.party })}
      </div>
    `;
  },
  world(){
    const items = state.data.world.filter(w=> matchQuery(w.name) || matchQuery(w.summary) || w.tags.some(t=>matchQuery(t)));
    return `
      ${section('Mondo', `${items.length} luoghi`)}
      <div class="grid">
        ${items.map(w=> card({ title:w.name, subtitle:w.type, body:w.summary, tags:w.tags })).join('')}
      </div>`;
  },
  factions(){
    const items = state.data.factions.filter(f=> matchQuery(f.name) || matchQuery(f.summary) || matchQuery(f.alignment));
    return `
      ${section('Fazioni', `${items.length} fazioni`)}
      <div class="grid">
        ${items.map(f=> card({ title:f.name, subtitle:`Allineamento: ${f.alignment}`, body:f.summary, tags:f.tags||[] })).join('')}
      </div>`;
  },
  characters(){
    const items = state.data.characters.filter(c=> matchQuery(c.name) || matchQuery(c.class) || matchQuery(c.bio));
    return `
      ${section('Personaggi', `${items.length} personaggi`)}
      <div class="grid">
        ${items.map(c=> card({ title:`${c.name} (${c.role})`, subtitle:`${c.class} · Livello ${c.level}`, body:c.bio, tags:c.tags||[] })).join('')}
      </div>`;
  },
  quests(){
    const items = state.data.quests.filter(q=> matchQuery(q.title) || matchQuery(q.summary) || matchQuery(q.status));
    return `
      ${section('Quest', `${items.length} quest`)}
      <div class="grid">
        ${items.map(q=> card({ title:q.title, subtitle:`Stato: ${q.status}`, body:q.summary, tags:q.tags||[] })).join('')}
      </div>`;
  },
  sessions(){
    const items = state.data.sessions.filter(s=> matchQuery(String(s.number)) || matchQuery(s.recap) || matchQuery(s.date));
    return `
      ${section('Sessioni', `${items.length} sessioni`)}
      <div class="grid">
        ${items.map(s=> card({ title:`Sessione ${s.number}`, subtitle:s.date, body:s.recap })).join('')}
      </div>`;
  },
  rules(){
    const r = state.data.rules;
    const homebrew = (r.homebrew||[]).map(h=>`<li>${h}</li>`).join('');
    const links = (r.links||[]).map(l=>`<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join('');
    return `
      ${section('Regole & Homebrew')}
      <div class="card">
        <h3>House rules</h3>
        <ul>${homebrew}</ul>
        <h3>Link utili</h3>
        <ul>${links}</ul>
      </div>`;
  },
  resources(){
    const items = state.data.resources.filter(r=> matchQuery(r.label) || matchQuery(r.url));
    return `
      ${section('Risorse', `${items.length} risorse`)}
      <div class="grid">
        ${items.map(r=> card({ title:r.label, body:`<a href='${r.url}' target='_blank' rel='noopener'>Apri</a>` })).join('')}
      </div>`;
  },
  map(){
    return `
      ${section('Mappa')}
      <div class="card">
        <p>Inserisci qui un'immagine della mappa (es. <code>assets/map.jpg</code>) o un iframe con una mappa interattiva.</p>
        <p class="muted">Suggerimento: usa un'immagine ad alta risoluzione e aggiungi annotazioni con marker SVG.</p>
      </div>`;
  }
};

function render(){
  setActiveTab();
  const key = (state.route.replace('#/','') || 'overview');
  const view = views[key] || views.overview;
  $('#app').innerHTML = view();
}

// Inizializza
render();
$('#year').textContent = new Date().getFullYear();
