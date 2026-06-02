const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const topbar = $('.topbar');
const onScroll = () => topbar?.setAttribute('data-elevated', String(window.scrollY > 18));
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
const normalize = value => String(value ?? '').toLowerCase();
const clamp = (value, max = 260) => String(value ?? '').length > max ? `${String(value).slice(0, max - 1)}…` : String(value ?? '');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
function observeNew(root = document) {
  $$('section, .node-card, .hapa-card, .living-card, .brief-card, .mode-panel, .wiki-row, .repo-row', root).forEach(el => {
    if (!el.classList.contains('fade-in')) el.classList.add('fade-in');
    observer.observe(el);
  });
}
observeNew();

const SOUND_STORAGE_KEY = 'hapa-front-door-sfx-enabled';
function readSoundPreference() {
  let stored = null;
  try {
    stored = window.localStorage?.getItem(SOUND_STORAGE_KEY) ?? null;
  } catch {}
  if (stored == null) {
    try {
      const prefix = `${SOUND_STORAGE_KEY}=`;
      const cookie = document.cookie.split('; ').find(part => part.startsWith(prefix));
      stored = cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
    } catch {}
  }
  return stored === 'true';
}
let soundEnabled = readSoundPreference();
let audioContext = null;
const soundToggle = $('#soundToggle');
function syncSoundToggle() {
  if (!soundToggle) return;
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.textContent = soundEnabled ? 'SFX ON' : 'SFX OFF';
  soundToggle.title = soundEnabled ? 'Interface tones enabled' : 'Interface tones muted';
}
function persistSoundPreference() {
  try {
    window.localStorage?.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
  } catch {}
  try {
    document.cookie = `${SOUND_STORAGE_KEY}=${encodeURIComponent(String(soundEnabled))};path=/;max-age=31536000;SameSite=Lax`;
  } catch {}
}
syncSoundToggle();
function tone(freq = 440, duration = 0.06, type = 'sine', gain = 0.035, force = false) {
  if ((!soundEnabled && !force) || reduceMotion.matches) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator();
    const amp = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0, audioContext.currentTime);
    amp.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    osc.connect(amp).connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration + 0.02);
  } catch {}
}
soundToggle?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  persistSoundPreference();
  syncSoundToggle();
  if (soundEnabled) tone(740, 0.08, 'triangle', 0.04);
});

const terminalLines = {
  browse: 'MODE  Browse / Light-Web scan\nFOCUS Wiki, nodes, cards, repos, protocol stack\nRULE  Absorb useful · discard useless · add unique\nNEXT  Select an entity to inspect',
  inspect: 'MODE  Inspect / action hub\nFOCUS Selected card, lineage, provenance, Markdown\nRULE  Actions gated with reasons\nNEXT  Open details without losing context',
  navigate: 'MODE  Navigate / constellation\nFOCUS Spatial anchors, reticle, camera\nRULE  Escape returns safely\nNEXT  Traverse wiki ↔ repos ↔ cards',
  forge: 'MODE  Forge / ritual path\nFOCUS Source → manifest → artifact\nRULE  No accidental route loss\nNEXT  Mint a card, loop, or ledger entry',
  lore: 'MODE  Lore / chronicle\nFOCUS Readability, names, emotional truth\nRULE  Low density, high provenance\nNEXT  Return meaning to the wiki'
};
const modeReadout = $('#modeReadout');
const hudModeReadout = $('#hudModeReadout');
const terminalText = $('#terminalText');
function setMode(mode) {
  document.documentElement.dataset.mode = mode;
  modeReadout && (modeReadout.textContent = mode.toUpperCase());
  hudModeReadout && (hudModeReadout.textContent = mode.toUpperCase());
  terminalText && (terminalText.textContent = terminalLines[mode] || terminalLines.browse);
  $$('.mode-dot, .mode-panel').forEach(el => el.classList.toggle('active', el.dataset.modeTarget === mode));
  tone({ browse: 440, inspect: 560, navigate: 660, forge: 780, lore: 500 }[mode] || 440, 0.07, 'triangle');
}
$$('[data-mode-target]').forEach(button => {
  button.addEventListener('click', () => setMode(button.dataset.modeTarget));
  button.addEventListener('mouseenter', () => tone(880, 0.035, 'sine', 0.018));
});

const reticle = $('#heroReticle');
$('#reticleButton')?.addEventListener('click', () => {
  reticle?.classList.remove('ping');
  void reticle?.offsetWidth;
  reticle?.classList.add('ping');
  tone(920, 0.08, 'square', 0.025);
  setTimeout(() => tone(1240, 0.05, 'sine', 0.02), 70);
});

const filters = $$('.filter');
const nodeCards = $$('.node-card');
function attachNodeCardKanbanIngress() {
  const kanban = window.HAPA_KANBAN_INGRESS;
  if (!kanban) return;
  nodeCards.forEach(card => {
    const name = card.querySelector('b')?.textContent || card.textContent || '';
    const projectId = kanban.projectIdForNode({
      id: card.dataset.nodeId || name,
      name,
      path: card.getAttribute('href') || '',
    });
    if (!projectId || card.querySelector('.node-board-ingress')) return;
    const url = kanban.boardUrl(projectId);
    card.dataset.kanbanProject = projectId;
    card.dataset.kanbanUrl = url;
    const ingress = document.createElement('span');
    ingress.className = 'node-board-ingress';
    ingress.setAttribute('role', 'link');
    ingress.setAttribute('tabindex', '0');
    ingress.setAttribute('aria-label', `Open Kanban board for ${name}`);
    ingress.textContent = 'Kanban';
    const openBoard = event => {
      event.preventDefault();
      event.stopPropagation();
      window.open(url, '_blank', 'noopener');
      tone(740, 0.055, 'triangle', 0.024);
    };
    ingress.addEventListener('click', openBoard);
    ingress.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') openBoard(event);
    });
    card.appendChild(ingress);
  });
}
attachNodeCardKanbanIngress();
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  nodeCards.forEach(card => card.classList.toggle('hidden', !(filter === 'all' || (card.dataset.kind || '').split(' ').includes(filter))));
  setMode(filter === 'all' ? 'browse' : 'inspect');
}));

let commands = [
  { type: 'Start', title: 'Light-Web compression', desc: 'Hapa.ai-inspired problem, protocol stack, and entry roles.', href: '#lightweb' },
  { type: 'Start', title: 'Human introduction', desc: 'Canon-facing Hapa intro for people.', href: '#wiki:Canon%2FIntroduction%20for%20Humans.md' },
  { type: 'Start', title: 'AI-agent introduction', desc: 'Operating and context intro for agents.', href: '#wiki:Canon%2FIntroduction%20for%20AIs.md' },
  { type: 'Wiki', title: 'World Bible', desc: 'Broad canon anchor for the Hapa universe.', href: '#wiki:Canon%2FWorld%20Bible.md' },
  { type: 'Wiki', title: 'Astro & Gravity Design System', desc: 'Hapa UI layer cake and Mode Gravity canon.', href: '#wiki:Systems%2FAstro%20%26%20Gravity%20Design%20System.md' },
  { type: 'Repo', title: 'hapa-dev-proto', desc: 'Main Hapa AG app.', href: 'local-desktop/hapa-dev-proto/README.md' },
  { type: 'Dev', title: 'Repository State Matrix', desc: 'Current repo state and priority overlay.', href: 'local-desktop/Hapa_Worldbuilding_Wiki/Development/Repository%20State%20Matrix.md' }
];
const dialog = $('#commandPalette');
const results = $('#paletteResults');
const input = $('#paletteSearch');
function renderCommands(query = '') {
  if (!results) return;
  const q = normalize(query.trim());
  const rows = commands.filter(c => !q || normalize(`${c.type} ${c.title} ${c.desc} ${c.path || ''}`).includes(q)).slice(0, 96);
  results.innerHTML = rows.map(c => `<a class="palette-item" href="${escapeHtml(c.href)}"><small>${escapeHtml(c.type)}</small><span><b>${escapeHtml(c.title)}</b><p>${escapeHtml(c.desc)}</p></span></a>`).join('') || '<p class="palette-empty">No route found. Try wiki, card, repo, node, or roadmap.</p>';
}
renderCommands();
$('#paletteButton')?.addEventListener('click', () => {
  dialog.showModal(); input.value = ''; renderCommands(); setTimeout(() => input.focus(), 30); tone(660, 0.05, 'triangle');
});
$('#closePalette')?.addEventListener('click', () => dialog.close());
input?.addEventListener('input', e => renderCommands(e.target.value));

let siteIndex = { wiki: [], cards: [], repos: [], counts: {}, generated_at: null, truth: 'not loaded' };
let wikiByPath = new Map();
let wikiBySlug = new Map();
let wikiBacklinks = new Map();
let activeWikiPage = null;
let activeCard = null;
let activeRepo = null;
let activeRepoFile = null;
let lastCardFocus = null;

function populateSelect(select, values, label = 'All') {
  if (!select) return;
  const current = select.value || 'all';
  select.innerHTML = `<option value="all">${escapeHtml(label)}</option>` + values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  select.value = values.includes(current) ? current : 'all';
}

function markdownToHtml(md = '') {
  const src = String(md).replace(/\r\n?/g, '\n');
  const out = [];
  const lines = src.split('\n');
  let inCode = false;
  let code = [];
  let list = [];
  const flushList = () => { if (list.length) { out.push(`<ul>${list.map(item => `<li>${inlineMd(item)}</li>`).join('')}</ul>`); list = []; } };
  const flushCode = () => { if (inCode) { out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code = []; inCode = false; } };
  for (const line of lines) {
    if (line.startsWith('```')) { if (inCode) flushCode(); else { flushList(); inCode = true; code = []; } continue; }
    if (inCode) { code.push(line); continue; }
    const trimmed = line.trim();
    if (!trimmed) { flushList(); continue; }
    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) { flushList(); const level = Math.min(heading[1].length + 1, 5); out.push(`<h${level}>${inlineMd(heading[2])}</h${level}>`); continue; }
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) { list.push(bullet[1]); continue; }
    flushList();
    out.push(`<p>${inlineMd(trimmed)}</p>`);
  }
  flushList(); flushCode();
  return out.join('') || '<p>No Markdown body in this static snapshot.</p>';
}
function inlineMd(value) {
  return escapeHtml(value)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '<a href="#wiki:$1" data-wiki-ref="$1">$2</a>')
    .replace(/\[\[([^\]]+)\]\]/g, '<a href="#wiki:$1" data-wiki-ref="$1">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" data-markdown-link>$1</a>');
}
function safeDecodeUri(value = '') {
  try { return decodeURIComponent(String(value || '')); }
  catch { return String(value || ''); }
}
function normalizeWikiRef(value = '') {
  return safeDecodeUri(value)
    .split('#', 1)[0]
    .replace(/^\.\//, '')
    .replace(/^wiki-vault\//, '')
    .replace(/^local-desktop\/Hapa_Worldbuilding_Wiki\//, '')
    .replace(/\.md$/i, '')
    .trim();
}
function slugifyWikiRef(value = '') {
  return normalizeWikiRef(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function pageViewerHash(page) {
  return `#wiki:${encodeURIComponent(page.path || page.title || '')}`;
}
function resolveWikiPage(ref, currentPage = activeWikiPage) {
  const normalized = normalizeWikiRef(ref);
  const withMd = normalized.match(/\.md$/i) ? normalized : `${normalized}.md`;
  if (wikiByPath.has(withMd)) return wikiByPath.get(withMd);
  if (wikiByPath.has(normalized)) return wikiByPath.get(normalized);
  if (currentPage?.path && !normalized.includes('/')) {
    const base = currentPage.path.split('/').slice(0, -1).join('/');
    const relative = `${base}/${withMd}`;
    if (wikiByPath.has(relative)) return wikiByPath.get(relative);
  }
  const slug = slugifyWikiRef(normalized);
  return wikiBySlug.get(slug) || null;
}
async function hydrateWikiPage(page) {
  if (!page || page.markdown) return page;
  const source = page.page_file || page.href;
  if (!source) return page;
  const response = await fetch(source, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (source.endsWith('.json')) {
    const full = await response.json();
    Object.assign(page, full);
  } else {
    page.markdown = await response.text();
  }
  return page;
}
function sourceHref(path) {
  return path?.href || '#';
}
function mediaMarkup(media = [], title = '') {
  if (!media.length) return `<div class="card-media-placeholder"><span>NO MEDIA FOUND</span><small>Static snapshot has text/provenance only.</small></div>`;
  return media.slice(0, 3).map(m => {
    if (m.kind === 'video') return `<figure class="detail-media video-media"><video controls muted loop playsinline preload="metadata" ${m.poster ? `poster="${escapeHtml(m.poster)}"` : ''} src="${escapeHtml(m.url)}"></video><figcaption>${escapeHtml(m.label || 'video loop')}</figcaption></figure>`;
    if (m.kind === 'image') return `<figure class="detail-media"><img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.label || title)}" loading="lazy"><figcaption>${escapeHtml(m.label || 'card image')}</figcaption></figure>`;
    return `<a class="detail-asset" href="${escapeHtml(m.url)}">${escapeHtml(m.label || m.kind)}</a>`;
  }).join('');
}
function hasKind(card, kind) { return (card.media || []).some(m => m.kind === kind); }
function cardRichness(card) {
  const flags = card.content_flags || [];
  return (card.content_score || 0)
    + (hasKind(card, 'video') ? 190 : 0)
    + (hasKind(card, 'image') ? 45 : 0)
    + (card.lore ? 45 : 0)
    + ((card.skills || []).length ? 42 : 0)
    + ((card.goals || []).length ? 34 : 0)
    + (card.description ? 28 : 0)
    + flags.length * 8;
}
function contentBadges(card, limit = 5) {
  const flags = card.content_flags || [];
  const labels = [];
  if (hasKind(card, 'video')) labels.push('video');
  if (card.lore) labels.push('lore');
  if ((card.skills || []).length) labels.push('skills');
  if ((card.goals || []).length) labels.push('goals');
  if (card.description) labels.push('why');
  for (const flag of flags) if (!labels.includes(flag)) labels.push(flag);
  return labels.slice(0, limit).map(label => `<span>${escapeHtml(label)}</span>`).join('');
}
function richSummary(card) {
  return card.lore || card.description || card.meaning || card.card_text || card.excerpt || 'No source-backed summary in this snapshot.';
}
function goalList(goals = []) {
  return goals.length ? `<ol class="goal-list">${goals.slice(0, 4).map(goal => `<li>${escapeHtml(goal)}</li>`).join('')}</ol>` : '<p class="muted">No explicit goals found in the Markdown snapshot.</p>';
}
function closeCardInspector() {
  const inspector = $('#cardInspector');
  if (!inspector) return;
  inspector.classList.remove('is-open');
  inspector.setAttribute('aria-hidden', 'true');
  inspector.removeAttribute('aria-modal');
  inspector.removeAttribute('role');
  document.body.classList.remove('modal-open');
  setMode('browse');
  if (lastCardFocus && document.contains(lastCardFocus)) lastCardFocus.focus({ preventScroll: true });
}
function ensureCardModalRoot() {
  const inspector = $('#cardInspector');
  if (inspector && inspector.parentElement !== document.body) document.body.appendChild(inspector);
  return inspector;
}

function renderWiki() {
  const container = $('#wikiResults');
  if (!container) return;
  const q = normalize($('#wikiSearch')?.value || '');
  const cat = $('#wikiCategory')?.value || 'all';
  const filtered = siteIndex.wiki.filter(p => (cat === 'all' || p.category === cat) && (!q || normalize(`${p.title} ${p.category} ${p.kind} ${p.theme} ${p.excerpt} ${p.path}`).includes(q)));
  const rows = filtered.slice(0, 140);
  $('#wikiCount') && ($('#wikiCount').textContent = `${filtered.length}/${siteIndex.wiki.length} pages`);
  container.innerHTML = rows.map((p, i) => `<button class="wiki-row" type="button" data-wiki-index="${i}">
    <span class="wiki-kind">${escapeHtml(p.category)}</span>
    <span><b>${escapeHtml(p.title)}</b><em>${escapeHtml(p.excerpt)}</em><code>${escapeHtml(p.path)}</code></span>
    <small>${escapeHtml(p.status)} · ${Math.round((p.bytes || 0) / 1024)}KB</small>
  </button>`).join('') || '<p class="palette-empty">No wiki pages match this scan.</p>';
  $$('[data-wiki-index]', container).forEach(el => el.addEventListener('click', () => openWikiPage(rows[Number(el.dataset.wikiIndex)])));
  observeNew(container);
}
function wikiLinkPill(page, label = null) {
  return `<button class="wiki-link-pill" type="button" data-wiki-path="${escapeHtml(page.path)}"><b>${escapeHtml(label || page.title)}</b><small>${escapeHtml(page.category || 'Wiki')}</small></button>`;
}
async function renderWikiViewer(page, options = {}) {
  const viewer = $('#wikiViewer');
  if (!viewer || !page) return;
  activeWikiPage = page;
  viewer.innerHTML = '<div class="viewer-empty"><p class="eyebrow"><span></span> WIKI VIEWER</p><h3>Loading Markdown…</h3><p>Fetching static page snapshot.</p></div>';
  try {
    page = await hydrateWikiPage(page);
  } catch (error) {
    viewer.innerHTML = `<div class="viewer-empty"><p class="eyebrow"><span></span> WIKI VIEWER</p><h3>Could not load page body</h3><p>${escapeHtml(error.message || error)}</p></div>`;
    return;
  }
  activeWikiPage = page;
  const outgoing = (page.wikilinks || []).map(link => ({ link, page: resolveWikiPage(link.target, page) })).filter(item => item.page).slice(0, 18);
  const backlinks = (wikiBacklinks.get(page.path) || []).slice(0, 18);
  viewer.innerHTML = `<div class="viewer-header wiki-reader-header"><div><p class="eyebrow"><span></span> ${escapeHtml(page.category || 'WIKI')} / IN-SITE READER</p><h3>${escapeHtml(page.title)}</h3><p>${escapeHtml(page.excerpt)}</p></div><div class="wiki-reader-actions"><button class="button primary" type="button" id="copyWikiLink">Copy viewer link</button><a class="button glass" href="${escapeHtml(page.href)}" target="_blank" rel="noreferrer">Raw Markdown</a></div></div>
    <dl class="detail-meta"><dt>Status</dt><dd>${escapeHtml(page.status)}</dd><dt>Path</dt><dd><code>${escapeHtml(page.path)}</code></dd><dt>Updated</dt><dd>${escapeHtml(page.updated || 'unknown')}</dd><dt>Bytes</dt><dd>${escapeHtml(page.bytes || 0)}</dd></dl>
    <div class="wiki-reader-layout">
      <article class="markdown-body wiki-reader-body">${markdownToHtml(page.markdown || '')}</article>
      <aside class="wiki-reader-sidebar" aria-label="Wiki page navigation"><section><h4>Outgoing Wikilinks</h4>${outgoing.length ? outgoing.map(item => wikiLinkPill(item.page, item.link.label)).join('') : '<p class="muted">No resolved outgoing wikilinks in this snapshot.</p>'}</section><section><h4>Backlinks</h4>${backlinks.length ? backlinks.map(p => wikiLinkPill(p)).join('') : '<p class="muted">No backlinks indexed for this page.</p>'}</section><section><h4>Source</h4><code>${escapeHtml(page.page_file || page.href || page.path)}</code></section></aside>
    </div>`;
  $('#copyWikiLink')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}${pageViewerHash(page)}`); } catch {} tone(700, 0.06, 'triangle'); });
  $$('[data-wiki-path]', viewer).forEach(button => button.addEventListener('click', () => openWikiPage(resolveWikiPage(button.dataset.wikiPath))));
  setMode('lore');
  if (!options.skipHash) history.replaceState(null, '', pageViewerHash(page));
  viewer.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
}
function openWikiPage(pageOrRef, options = {}) {
  const page = typeof pageOrRef === 'string' ? resolveWikiPage(pageOrRef) : pageOrRef;
  if (!page) return false;
  renderWikiViewer(page, options);
  return true;
}

function cardMarkup(card, index) {
  const badges = contentBadges(card, 4);
  const media = card.media || [];
  const poster = media.find(m => m.kind === 'image');
  const video = media.find(m => m.kind === 'video');
  const mediaVisual = video
    ? `<video muted loop playsinline preload="metadata" ${video.poster ? `poster="${escapeHtml(video.poster)}"` : ''} src="${escapeHtml(video.url)}"></video><span class="video-pill">VIDEO LOOP</span>`
    : poster
      ? `<img src="${escapeHtml(poster.url)}" alt="${escapeHtml(card.title)}" loading="lazy">`
      : `<div class="mini-sigil">${escapeHtml((card.title || 'H').slice(0, 1))}</div>`;
  const skillNames = (card.skills || []).slice(0, 2).map(s => `<li>${escapeHtml(s.name || s)}</li>`).join('');
  return `<article class="hapa-card ${escapeHtml(card.rarity || 'rare')}" data-card-index="${index}" tabindex="0" role="button" aria-label="Inspect ${escapeHtml(card.title)}">
    <div class="mini-media">${mediaVisual}</div>
    <div class="card-face"><small>${escapeHtml((card.rarity || 'rare').toUpperCase())} / ${escapeHtml(card.card_type || card.theme || 'wiki')}</small><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(clamp(richSummary(card), 178))}</p><div class="content-badges">${badges}</div><ul>${skillNames || (card.affixes || []).slice(0, 2).map(a => `<li>${escapeHtml(a)}</li>`).join('')}<li>${escapeHtml(card.status || 'local-wiki')}</li></ul></div>
    <a href="${escapeHtml(card.href)}" data-open-card>open source</a>
  </article>`;
}
function renderCardInspector(card, userSelected = true) {
  const inspector = ensureCardModalRoot();
  if (!inspector || !card) return;
  activeCard = card;
  if (userSelected) {
    inspector.dataset.userSelected = 'true';
    inspector.classList.add('is-open');
    inspector.setAttribute('aria-hidden', 'false');
    inspector.setAttribute('aria-modal', 'true');
    inspector.setAttribute('role', 'dialog');
    document.body.classList.add('modal-open');
  }
  const stats = card.stats || {};
  const skills = (card.skills || []).slice(0, 6).map((skill, i) => `<div class="skill-row"><b>${escapeHtml(skill.name || skill)}</b><span>${escapeHtml(skill.mode || (i % 2 ? 'Passive' : 'Active'))}</span><p>${escapeHtml(skill.description || 'Source-backed card capability inferred from Markdown body.')}</p></div>`).join('') || (card.affixes || []).slice(0, 5).map((a, i) => `<div class="skill-row"><b>${escapeHtml(a)}</b><span>${i % 2 ? 'Passive' : 'Active'}</span><p>Source-backed card affix inferred from Markdown body and media metadata.</p></div>`).join('');
  const flags = contentBadges(card, 8);
  inspector.innerHTML = `<div class="detail-shell ${escapeHtml(card.rarity || 'rare')}">
    <div class="detail-top"><p class="eyebrow"><span></span> ${escapeHtml((card.rarity || 'rare').toUpperCase())} CARD / ${escapeHtml(card.media_kind || 'text')}</p><button class="detail-close" type="button" aria-label="Return to browse">×</button></div>
    <div class="detail-grid">
      <div class="detail-media-stack">${mediaMarkup(card.media, card.title)}<div class="evolution-state"><b>CONTENT VECTOR</b><span>${escapeHtml((card.content_flags || []).join(' · ') || card.status || 'local-wiki')}</span><i style="--p:${Math.min(96, 36 + (card.content_score || 0))}%"></i></div></div>
      <div class="detail-copy"><h3>${escapeHtml(card.title)}</h3><div class="content-badges large">${flags}</div><p class="lore-quote">${escapeHtml(richSummary(card))}</p>
        <div class="card-detail-panels"><section><h4>Lore</h4><p>${escapeHtml(card.lore || card.meaning || card.excerpt || 'No explicit Lore section in this snapshot.')}</p></section><section><h4>Description / Why it matters</h4><p>${escapeHtml(card.description || card.card_text || 'No explicit description section in this snapshot.')}</p></section></div>
        <div class="stat-grid"><div><b>${escapeHtml(stats.power || 0)}</b><span>POWER</span></div><div><b>${escapeHtml(stats.wisdom || 0)}</b><span>WISDOM</span></div><div><b>${escapeHtml(stats.speed || 0)}</b><span>SPEED</span></div><div><b>${escapeHtml(stats.magic || 0)}</b><span>MAGIC</span></div></div>
        <section><h4>Skills / Capabilities</h4>${skills || '<p class="muted">No skills inferred.</p>'}</section>
        <section><h4>Goals / Retrieval Contract</h4>${goalList(card.goals || [])}</section>
        ${card.media_prompt ? `<section><h4>Media Prompt / Asset Context</h4><p>${escapeHtml(card.media_prompt)}</p></section>` : ''}
        <section><h4>Lineage & Provenance</h4><dl><dt>Status</dt><dd>${escapeHtml(card.status || 'local-wiki')}</dd><dt>Theme</dt><dd>${escapeHtml(card.theme || 'wiki')}</dd><dt>Card ID</dt><dd><code>${escapeHtml(card.card_id || 'UNKNOWN')}</code></dd><dt>Retrieval</dt><dd><code>${escapeHtml(card.retrieval_id || 'not specified')}</code></dd><dt>Source</dt><dd><code>${escapeHtml(card.path)}</code></dd></dl></section>
        <section><h4>Markdown Source</h4><div class="markdown-body compact-md">${markdownToHtml(card.markdown || '')}</div></section>
      </div>
    </div>
    <div class="detail-actions"><a class="button primary" href="${escapeHtml(card.href)}">Open Markdown</a><button class="button glass" type="button" id="copyCardPath">Copy path</button><button class="button ghost" type="button" id="focusCardSource">Read source here</button></div>
  </div>`;
  $('.detail-close', inspector)?.addEventListener('click', () => closeCardInspector());
  inspector.onclick = event => { if (event.target === inspector) closeCardInspector(); };
  $('#copyCardPath')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(card.path); } catch {} tone(700, 0.06, 'triangle'); });
  $('#focusCardSource')?.addEventListener('click', () => { closeCardInspector(); renderWikiViewer(card); });
  if (userSelected) {
    setMode('inspect');
    requestAnimationFrame(() => $('.detail-close', inspector)?.focus({ preventScroll: true }));
  }
}
function inspectCard(card) { lastCardFocus = document.activeElement; renderCardInspector(card, true); }

function pickFeaturedCards(limit = 10) {
  const scored = siteIndex.cards.map((card, originalIndex) => {
    const media = card.media || [];
    const hasVideo = media.some(m => m.kind === 'video');
    const hasImage = media.some(m => m.kind === 'image');
    const rarityScore = { mythic: 50, legendary: 40, epic: 32, rare: 20, common: 10 }[card.rarity] || 12;
    const richness = cardRichness(card);
    return { card, originalIndex, hasVideo, hasImage, richness, score: richness + rarityScore + Math.min(media.length * 8, 24) };
  }).filter(item => (item.card.media || []).length).sort((a, b) => b.score - a.score);
  const videos = scored.filter(item => item.hasVideo).slice(0, Math.ceil(limit * 0.6));
  const richNonVideo = scored.filter(item => !videos.includes(item) && (item.card.lore || (item.card.skills || []).length || (item.card.goals || []).length)).slice(0, limit - videos.length);
  const chosen = [...videos, ...richNonVideo];
  for (const item of scored) {
    if (chosen.length >= limit) break;
    if (!chosen.includes(item)) chosen.push(item);
  }
  return chosen.slice(0, limit);
}
function livingCardMarkup(item, index) {
  const card = item.card;
  const media = card.media || [];
  const video = media.find(m => m.kind === 'video');
  const image = media.find(m => m.kind === 'image');
  const visual = video
    ? `<video muted loop playsinline preload="metadata" ${video.poster ? `poster="${escapeHtml(video.poster)}"` : ''} src="${escapeHtml(video.url)}"></video><span class="live-type">VIDEO LOOP</span>`
    : image
      ? `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(card.title)}" loading="lazy"><span class="live-type image">IMAGE CARD</span>`
      : `<div class="live-sigil">${escapeHtml((card.title || 'H').slice(0, 1))}</div><span class="live-type text">TEXT CARD</span>`;
  return `<button class="living-card ${escapeHtml(card.rarity || 'rare')}" type="button" data-live-card="${index}">
    <span class="living-media">${visual}</span>
    <span class="living-copy"><small>${escapeHtml((card.rarity || 'rare').toUpperCase())} · ${escapeHtml(card.theme || card.card_type || 'wiki')}</small><b>${escapeHtml(card.title)}</b><em>${escapeHtml(clamp(richSummary(card), 136))}</em><span class="content-badges">${contentBadges(card, 4)}</span></span>
  </button>`;
}
function renderLivingCards() {
  const grid = $('#livingCardGrid');
  if (!grid) return;
  const featured = pickFeaturedCards(10);
  const videoCount = siteIndex.cards.filter(c => (c.media || []).some(m => m.kind === 'video')).length;
  const richCount = siteIndex.cards.filter(c => c.lore || (c.skills || []).length || (c.goals || []).length || c.description).length;
  const imageCount = siteIndex.cards.filter(c => (c.media || []).some(m => m.kind === 'image')).length;
  $('#cardMediaStats') && ($('#cardMediaStats').innerHTML = `<span>${escapeHtml(featured.length)} featured</span><span>${escapeHtml(videoCount)} video loops prioritized</span><span>${escapeHtml(richCount)} lore/skills/goals</span><span>${escapeHtml(imageCount)} image cards</span>`);
  grid.innerHTML = featured.map(livingCardMarkup).join('') || '<p class="palette-empty">No media-backed cards found in this snapshot.</p>';
  $$('[data-live-card]', grid).forEach(button => {
    const item = featured[Number(button.dataset.liveCard)];
    const video = $('video', button);
    button.addEventListener('mouseenter', () => { if (video && !reduceMotion.matches) video.play().catch(() => {}); });
    button.addEventListener('mouseleave', () => { if (video) video.pause(); });
    button.addEventListener('click', () => {
      inspectCard(item.card);
      $('#cards')?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
  observeNew(grid);
}

function renderCards() {
  const gallery = $('#cardGallery');
  if (!gallery) return;
  const q = normalize($('#cardSearch')?.value || '');
  const theme = $('#cardTheme')?.value || 'all';
  const rarity = $('#cardRarity')?.value || 'all';
  const filteredCards = siteIndex.cards.filter(c => (theme === 'all' || c.theme === theme) && (rarity === 'all' || c.rarity === rarity) && (!q || normalize(`${c.title} ${c.theme} ${c.rarity} ${c.status} ${c.card_text} ${c.meaning} ${c.lore || ''} ${c.description || ''} ${(c.skills || []).map(s => `${s.name} ${s.mode} ${s.description}`).join(' ')} ${(c.goals || []).join(' ')} ${(c.affixes || []).join(' ')} ${c.path} ${c.markdown || ''}`).includes(q)));
  const sortedCards = filteredCards.slice().sort((a, b) => cardRichness(b) - cardRichness(a));
  const videoCards = sortedCards.filter(c => (c.media || []).some(m => m.kind === 'video')).slice(0, 18);
  const richCards = sortedCards.filter(c => !videoCards.includes(c) && (c.lore || (c.skills || []).length || (c.goals || []).length || c.description)).slice(0, 18);
  const cards = [...videoCards, ...richCards, ...sortedCards.filter(c => !videoCards.includes(c) && !richCards.includes(c))].slice(0, 36);
  gallery.innerHTML = cards.map(cardMarkup).join('') || '<p class="palette-empty">No cards match this filter.</p>';
  $$('[data-card-index]', gallery).forEach(el => {
    const card = cards[Number(el.dataset.cardIndex)];
    const video = $('video', el);
    el.addEventListener('mouseenter', () => { if (video && !reduceMotion.matches) video.play().catch(() => {}); });
    el.addEventListener('mouseleave', () => { if (video) video.pause(); });
    el.addEventListener('click', event => { if (!event.target.closest('[data-open-card]')) inspectCard(card); });
    el.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inspectCard(card); } });
  });
  if (cards[0] && !$('#cardInspector')?.dataset.userSelected) renderCardInspector(cards[0], false);
  observeNew(gallery);
}

function renderRepos() {
  const container = $('#repoList');
  if (!container) return;
  const q = normalize($('#repoSearch')?.value || '');
  const rows = siteIndex.repos.filter(repo => !q || normalize(`${repo.name} ${repo.relative} ${repo.excerpt} ${(repo.markdown_files || []).map(f => `${f.title} ${f.path}`).join(' ')}`).includes(q)).slice(0, 80);
  $('#repoCount') && ($('#repoCount').textContent = `${rows.length}/${siteIndex.repos.length}`);
  container.innerHTML = rows.map((repo, i) => `<button class="repo-row" type="button" data-repo-index="${i}"><span>${escapeHtml(repo.name)}</span><em>${escapeHtml(clamp(repo.excerpt, 150))}</em><code>${escapeHtml(repo.relative)} · ${escapeHtml(repo.file_count)} md</code></button>`).join('') || '<p class="palette-empty">No repos match this scan.</p>';
  $$('[data-repo-index]', container).forEach(el => el.addEventListener('click', () => renderRepoInspector(rows[Number(el.dataset.repoIndex)])));
  observeNew(container);
}
function renderRepoInspector(repo, file = null) {
  const inspector = $('#repoInspector');
  if (!inspector || !repo) return;
  activeRepo = repo;
  activeRepoFile = file || repo.markdown_files?.[0] || null;
  const files = (repo.markdown_files || []).slice(0, 80);
  inspector.innerHTML = `<div class="viewer-header"><div><p class="eyebrow"><span></span> LOCAL REPO / STATIC MARKDOWN</p><h3>${escapeHtml(repo.name)}</h3><p>${escapeHtml(repo.excerpt)}</p></div><a class="button glass" href="${escapeHtml(activeRepoFile?.href || repo.href || activeRepoFile?.abs_path || repo.path)}">Open selected source</a></div>
    <dl class="detail-meta"><dt>Repo path</dt><dd><code>${escapeHtml(repo.path)}</code></dd><dt>Indexed Markdown</dt><dd>${escapeHtml(repo.file_count)}</dd><dt>Snapshot truth</dt><dd>local README/Markdown only</dd></dl>
    <div class="repo-file-layout"><nav class="repo-file-list" aria-label="Repository markdown files">${files.map((f, i) => `<button type="button" data-repo-file="${i}" class="${f.path === activeRepoFile?.path ? 'active' : ''}"><b>${escapeHtml(f.title)}</b><code>${escapeHtml(f.path)}</code></button>`).join('')}</nav>
    <article class="markdown-body repo-markdown"><h4>${escapeHtml(activeRepoFile?.title || 'No Markdown file')}</h4>${markdownToHtml(activeRepoFile?.markdown || '')}</article></div>`;
  $$('[data-repo-file]', inspector).forEach(el => el.addEventListener('click', () => renderRepoInspector(repo, files[Number(el.dataset.repoFile)])));
  setMode('inspect');
}

function buildWikiIndexes() {
  wikiByPath = new Map();
  wikiBySlug = new Map();
  wikiBacklinks = new Map();
  siteIndex.wiki.forEach(page => {
    wikiByPath.set(page.path, page);
    wikiBySlug.set(page.slug || slugifyWikiRef(page.path), page);
    if (page.basename_slug && !wikiBySlug.has(page.basename_slug)) wikiBySlug.set(page.basename_slug, page);
    if (!wikiBySlug.has(slugifyWikiRef(page.title))) wikiBySlug.set(slugifyWikiRef(page.title), page);
  });
  siteIndex.wiki.forEach(page => {
    (page.wikilinks || []).forEach(link => {
      const target = resolveWikiPage(link.target, page);
      if (!target) return;
      const backlinks = wikiBacklinks.get(target.path) || [];
      if (!backlinks.some(p => p.path === page.path)) backlinks.push(page);
      wikiBacklinks.set(target.path, backlinks);
    });
  });
}

async function loadSiteIndex() {
  try {
    const response = await fetch('data/hapa-index.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    siteIndex = await response.json();
    buildWikiIndexes();
    const cats = [...new Set(siteIndex.wiki.map(p => p.category).filter(Boolean))].sort();
    const themes = [...new Set(siteIndex.cards.map(c => c.theme).filter(Boolean))].sort();
    populateSelect($('#wikiCategory'), cats, 'All categories');
    populateSelect($('#cardTheme'), themes, 'All themes');
    $('#wikiSnapshotReadout') && ($('#wikiSnapshotReadout').innerHTML = `<b>STATIC SNAPSHOT</b><span>${escapeHtml(siteIndex.counts.wiki_pages_indexed)} indexed / ${escapeHtml(siteIndex.counts.wiki_pages_seen)} seen · ${escapeHtml(new Date(siteIndex.generated_at).toLocaleString())}</span>`);
    $('#cardSnapshotReadout') && ($('#cardSnapshotReadout').innerHTML = `<b>CARD INDEX</b><span>${escapeHtml(siteIndex.counts.cards_indexed)} cards · ${escapeHtml(siteIndex.counts.cards_with_video || 0)} with video · source: local wiki</span>`);
    commands = commands.concat(
      siteIndex.wiki.slice(0, 220).map(p => ({ type: `Wiki/${p.category}`, title: p.title, desc: p.excerpt, href: pageViewerHash(p), path: p.path })),
      siteIndex.cards.slice(0, 90).map(c => ({ type: `Card/${c.rarity}`, title: c.title, desc: c.card_text || c.excerpt, href: c.href, path: c.path })),
      siteIndex.repos.slice(0, 80).map(r => ({ type: 'Repo', title: r.name, desc: r.excerpt, href: r.markdown_files?.[0]?.href || r.href || r.markdown_files?.[0]?.abs_path || r.path, path: r.relative }))
    );
    renderWiki(); renderLivingCards(); renderCards(); renderRepos(); renderCommands(input?.value || '');
    handleWikiRoute();
  } catch (error) {
    console.error('Failed to load Hapa site index', error);
    $('#wikiResults') && ($('#wikiResults').innerHTML = '<p class="palette-empty">Could not load data/hapa-index.json. Run site/build-data.py and serve the site over HTTP.</p>');
    $('#cardGallery') && ($('#cardGallery').innerHTML = '<p class="palette-empty">Card index unavailable.</p>');
    $('#repoList') && ($('#repoList').innerHTML = '<p class="palette-empty">Repo index unavailable.</p>');
  }
}
['wikiSearch', 'wikiCategory'].forEach(id => $(`#${id}`)?.addEventListener('input', renderWiki));
['cardSearch', 'cardTheme', 'cardRarity'].forEach(id => $(`#${id}`)?.addEventListener('input', renderCards));
$('#repoSearch')?.addEventListener('input', renderRepos);
loadSiteIndex();

function handleWikiRoute() {
  if (!location.hash.startsWith('#wiki:')) return false;
  const ref = safeDecodeUri(location.hash.slice(6));
  return openWikiPage(ref, { skipHash: true });
}
window.addEventListener('hashchange', handleWikiRoute);

document.addEventListener('click', event => {
  const anchor = event.target.closest?.('a[href]');
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  if (anchor.target === '_blank') return;
  if (href.startsWith('#wiki:')) {
    event.preventDefault();
    if (dialog?.open) dialog.close();
    history.pushState(null, '', href);
    handleWikiRoute();
    return;
  }
  const markdownHref = href.endsWith('.md') || href.includes('.md#') || href.includes('.md?');
  const wikiHref = href.startsWith('wiki-vault/') || href.startsWith('local-desktop/Hapa_Worldbuilding_Wiki/');
  if (markdownHref && wikiHref) {
    const ref = href.replace(/^wiki-vault\//, '').replace(/^local-desktop\/Hapa_Worldbuilding_Wiki\//, '');
    const page = resolveWikiPage(ref, activeWikiPage);
    if (page) {
      event.preventDefault();
      if (dialog?.open) dialog.close();
      openWikiPage(page);
    }
  }
});

window.addEventListener('keydown', e => {
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dialog.open ? dialog.close() : $('#paletteButton').click(); }
  if (!typing && e.key === 'Escape') { if ($('#cardInspector')?.classList.contains('is-open')) closeCardInspector(); else if (dialog.open) dialog.close(); else setMode('browse'); }
  if (!typing && ['1', '2', '3', '4', '5'].includes(e.key)) setMode(['browse', 'inspect', 'navigate', 'forge', 'lore'][Number(e.key) - 1]);
});

let loopIndex = 0;
const loopSteps = $$('.loop-step');
setInterval(() => {
  if (!loopSteps.length || reduceMotion.matches) return;
  loopSteps[loopIndex]?.classList.remove('active');
  loopIndex = (loopIndex + 1) % loopSteps.length;
  loopSteps[loopIndex]?.classList.add('active');
}, 1700);

const toneTargets = 'a, button, select, input[type="search"], .wiki-row, .repo-row, .hapa-card, .living-card, .palette-item';
document.addEventListener('pointerover', event => {
  const target = event.target.closest?.(toneTargets);
  if (!target || target.dataset.hoverToneActive === '1') return;
  target.dataset.hoverToneActive = '1';
  tone(680, 0.025, 'sine', 0.012);
});
document.addEventListener('pointerout', event => {
  const target = event.target.closest?.(toneTargets);
  if (!target) return;
  if (!event.relatedTarget || !target.contains(event.relatedTarget)) delete target.dataset.hoverToneActive;
});
$$('select, input[type="search"]').forEach(el => {
  el.addEventListener('focus', () => tone(520, 0.035, 'triangle', 0.014));
  el.addEventListener('change', () => tone(760, 0.04, 'triangle', 0.018));
});
setMode('browse');
