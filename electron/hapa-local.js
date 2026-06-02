const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const repoRoot = path.resolve(__dirname, '..');
const inferredDesktopRoot = path.basename(path.dirname(repoRoot)) === 'Desktop'
  ? path.dirname(repoRoot)
  : path.join(os.homedir(), 'Desktop');
const desktopRoot = process.env.HAPA_DESKTOP_ROOT || inferredDesktopRoot;
const documentsRoot = process.env.HAPA_DOCUMENTS_ROOT || path.join(path.dirname(desktopRoot), 'Documents');

const roots = {
  repo: repoRoot,
  wiki: process.env.HAPA_WIKI_ROOT || path.join(desktopRoot, 'Hapa_Worldbuilding_Wiki'),
  songRegistry: process.env.HAPA_SONG_REGISTRY_ROOT || path.join(desktopRoot, 'hapa-song-registry'),
  songLibrary: process.env.HAPA_SONG_LIBRARY_ROOT || path.join(desktopRoot, 'suno-library'),
  devProto: process.env.HAPA_DEV_PROTO_ROOT || path.join(desktopRoot, 'hapa-dev-proto'),
  overwatch: process.env.HAPA_OVERWATCH_ROOT || path.join(desktopRoot, '.Overwatch'),
  assetViewerApp: process.env.HAPA_ASSET_VIEWER_APP || path.join(desktopRoot, 'Hapa Asset Viewer.app'),
  assetViewerWorkspace: process.env.HAPA_ASSET_VIEWER_WORKSPACE || path.join(documentsRoot, 'Codex', '2026-05-24', 'i-want-to-create-a-spacehip'),
  assetViewerHandoff: process.env.HAPA_ASSET_VIEWER_HANDOFF_ROOT || path.join(desktopRoot, 'hapa-dev-proto', 'data', 'hapa-asset-viewer'),
};

const providerCostSurveyPath = process.env.HAPA_PROVIDER_COST_SURVEY_PATH
  || path.join(roots.wiki, 'Operations', 'Hapa Provider Cost Survey.md');

const pathHintRoots = {
  HAPA_REPO_ROOT: repoRoot,
  HAPA_DESKTOP_ROOT: desktopRoot,
  HAPA_DOCUMENTS_ROOT: documentsRoot,
  HAPA_WIKI_ROOT: roots.wiki,
  HAPA_OVERWATCH_ROOT: roots.overwatch,
  HAPA_DEV_PROTO_ROOT: roots.devProto,
  HAPA_SONG_REGISTRY_ROOT: roots.songRegistry,
  HAPA_SONG_LIBRARY_ROOT: roots.songLibrary,
  HAPA_ASSET_VIEWER_APP: roots.assetViewerApp,
  HAPA_ASSET_VIEWER_WORKSPACE: roots.assetViewerWorkspace,
  HAPA_ASSET_VIEWER_HANDOFF_ROOT: roots.assetViewerHandoff,
  HAPA_MLX_STATION_ROOT: process.env.HAPA_MLX_STATION_ROOT || path.join(os.homedir(), 'hapa-mlx-station'),
  HAPA_CODEX_ROOT: process.env.HAPA_CODEX_ROOT || path.join(documentsRoot, 'Codex'),
  HAPA_VAULT_ROOT: process.env.HAPA_VAULT_ROOT || path.join(documentsRoot, 'Hapa', 'hapa-vault'),
  CODEX_HOME: process.env.CODEX_HOME || path.join(os.homedir(), '.codex'),
};

const allowedRoots = Object.values(roots).map(value => path.resolve(value));
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'dist-electron', 'build', '.venv', 'venv', '__pycache__']);
const audioExts = new Set(['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg']);
const markdownExts = new Set(['.md', '.mdx', '.txt']);
const modelExts = new Set(['.glb', '.gltf']);

const nodeAliases = new Map([
  ['overwatch', 'overwatch'],
  ['.overwatch', 'overwatch'],
  ['worldbuilding wiki', 'world-building-wiki'],
  ['worldbuilding-wiki', 'world-building-wiki'],
  ['world building wiki', 'world-building-wiki'],
  ['hapa worldbuilding wiki', 'world-building-wiki'],
  ['wiki', 'world-building-wiki'],
  ['master view', 'hapa-master-dashboard'],
  ['master dashboard', 'hapa-master-dashboard'],
  ['library', 'hapa-library'],
  ['card library', 'hapa-library'],
  ['hapa forge', 'hapa-forge'],
  ["hapa's forge", 'hapa-forge'],
  ['forge', 'hapa-forge'],
  ['game engine', 'hapa-game-engine'],
  ['prototype', 'hapa-prototype'],
  ['ai model chat', 'hapa-ai-model-chat'],
  ["thor's hamma", 'hapa-thors-hamma'],
  ['thors hamma', 'hapa-thors-hamma'],
  ['atlas', 'hapa-atlas'],
]);

const localEndpoints = [
  { id: 'hapa-brochure', name: 'Hapa brochure', url: 'http://127.0.0.1:9890/' },
  { id: 'hapa-dev-proto', name: 'hapa-dev-proto Vite', url: 'http://127.0.0.1:5173/' },
  { id: 'hapa-media-node', name: 'Hapa media node', url: 'http://127.0.0.1:8773/' },
  { id: 'hapa-ltx-node', name: 'Hapa LTX node', url: 'http://127.0.0.1:8788/' },
  { id: 'hapa-song-registry', name: 'Song registry helper', url: 'http://127.0.0.1:8797/' },
];

function exists(targetPath) {
  try {
    fs.accessSync(targetPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function expandPathHint(targetPath) {
  return String(targetPath || '').replace(/\$(HAPA_[A-Z0-9_]+|CODEX_HOME)(?=\/|$)/g, (match, name) => pathHintRoots[name] || process.env[name] || match);
}

function assertAllowedPath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') throw new Error('Missing path');
  const resolved = path.resolve(expandPathHint(targetPath));
  if (!allowedRoots.some(root => resolved === root || resolved.startsWith(`${root}${path.sep}`))) {
    throw new Error(`Path is outside known Hapa roots: ${targetPath}`);
  }
  return resolved;
}

function statSafe(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}

function readJsonSafe(targetPath) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  } catch {
    return null;
  }
}

function parseSimpleFrontmatter(text) {
  if (!String(text || '').startsWith('---\n')) return [{}, text || ''];
  const end = text.indexOf('\n---', 4);
  if (end === -1) return [{}, text || ''];
  const raw = text.slice(4, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, '');
  const meta = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#') || !line.includes(':')) continue;
    const [key, ...rest] = line.split(':');
    let value = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    meta[key.trim()] = value;
  }
  return [meta, body];
}

function splitMarkdownTableRow(line) {
  const trimmed = String(line || '').trim();
  if (!trimmed.startsWith('|')) return [];
  return trimmed
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim());
}

function isMarkdownDivider(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell.trim()));
}

function parseMarkdownTables(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const tables = [];
  let heading = 'Document';
  for (let index = 0; index < lines.length; index += 1) {
    const headingMatch = lines[index].match(/^##\s+(.+?)\s*$/);
    if (headingMatch) heading = headingMatch[1].trim();

    const headers = splitMarkdownTableRow(lines[index]);
    const divider = splitMarkdownTableRow(lines[index + 1]);
    if (!headers.length || !isMarkdownDivider(divider)) continue;

    const rows = [];
    index += 2;
    while (index < lines.length && /^\s*\|/.test(lines[index])) {
      const cells = splitMarkdownTableRow(lines[index]);
      if (cells.length === headers.length) {
        rows.push(Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || ''])));
      }
      index += 1;
    }
    index -= 1;
    tables.push({ id: slug(heading), title: heading, headers, rows });
  }
  return tables;
}

function normalizeSurveyFilters(options = {}) {
  const filters = options.filters || options;
  const normalized = {
    provider: filters.provider || '',
    model: filters.model || '',
    task: filters.task || '',
    table: filters.table || '',
    query: filters.query || filters.q || '',
    local: Boolean(filters.local),
    hosted: Boolean(filters.hosted),
    limit: Number(filters.limit || 0),
  };
  return normalized;
}

function includesFolded(values, needle) {
  const q = String(needle || '').trim().toLowerCase();
  if (!q) return true;
  return values.filter(value => value != null).map(value => String(value).toLowerCase()).join(' ').includes(q);
}

function flattenProviderSurveyRows(tables) {
  return tables.flatMap(table => table.rows.map((raw, index) => {
    const category = table.id.includes('hosted') ? 'hosted'
      : table.id.includes('local-mac') ? 'local'
        : table.id.includes('routing') ? 'routing'
          : table.id.includes('inventory') ? 'inventory'
            : 'reference';
    return {
      id: `${table.id}-${index + 1}`,
      tableId: table.id,
      tableTitle: table.title,
      category,
      provider: raw.Provider || raw['Local provider'] || raw.Surface || '',
      model: raw['Model / route'] || raw['Model / engine'] || raw['Providers / models found'] || '',
      task: raw.Task || raw['Task comparable to hosted'] || raw.Surface || '',
      parameters: raw.Parameters || raw['Parameters observed'] || '',
      publishedPrice: raw['Published price'] || '',
      representativeCost: raw['Representative cost'] || '',
      queue: raw['Queue / return constraints'] || raw['Queue / concurrency'] || '',
      returnTime: raw['Return time evidence'] || '',
      constraints: raw.Constraints || raw['Queue / return constraints'] || '',
      raw,
    };
  }));
}

function filterProviderSurveyRows(rows, filters) {
  let output = rows;
  if (filters.local || filters.hosted) {
    const categories = new Set([
      filters.local ? 'local' : '',
      filters.hosted ? 'hosted' : '',
    ].filter(Boolean));
    output = output.filter(row => categories.has(row.category));
  }
  if (filters.table) {
    const tableId = slug(filters.table);
    output = output.filter(row => row.tableId === tableId || includesFolded([row.tableTitle], filters.table));
  }
  if (filters.provider) output = output.filter(row => includesFolded([row.provider, row.model], filters.provider));
  if (filters.model) output = output.filter(row => includesFolded([row.model], filters.model));
  if (filters.task) output = output.filter(row => includesFolded([row.task, row.raw.Task, row.raw['Task comparable to hosted']], filters.task));
  if (filters.query) {
    output = output.filter(row => includesFolded([
      row.provider,
      row.model,
      row.task,
      row.parameters,
      row.publishedPrice,
      row.representativeCost,
      row.queue,
      row.returnTime,
      row.constraints,
      ...Object.values(row.raw || {}),
    ], filters.query));
  }
  if (filters.limit > 0) output = output.slice(0, filters.limit);
  return output;
}

let nodeIconManifestCache = null;

function normalizeIconKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function siteRelativeAsset(assetPath) {
  return String(assetPath || '')
    .replace(/^site\//, '')
    .replace(/^\/+/, '');
}

function getNodeIconManifest() {
  if (nodeIconManifestCache) return nodeIconManifestCache;
  const manifestPath = path.join(repoRoot, 'site', 'generated', 'node-icons', 'index.json');
  const manifest = readJsonSafe(manifestPath);
  const records = Array.isArray(manifest?.nodes) ? manifest.nodes : [];
  const byKey = new Map();
  const setKey = (value, record) => {
    const key = normalizeIconKey(value);
    if (key && !byKey.has(key)) byKey.set(key, record);
  };
  for (const record of records) {
    [record.slug, record.id, record.label].filter(Boolean).forEach(value => setKey(value, record));
  }
  for (const record of records) {
    [
      record.source_path,
      path.basename(record.source_path || '', path.extname(record.source_path || '')),
    ].filter(Boolean).forEach(value => setKey(value, record));
  }
  nodeIconManifestCache = { manifestPath, records, byKey };
  return nodeIconManifestCache;
}

function iconSetForNode(row) {
  const { byKey } = getNodeIconManifest();
  const candidates = [
    row.name,
    normalizeNodeId(row.name),
    row.path,
    path.basename(row.path || ''),
    path.basename(row.path || '', path.extname(row.path || '')),
  ];
  const record = candidates.map(normalizeIconKey).map(key => byKey.get(key)).find(Boolean);
  if (!record) return null;
  const assets = record.assets || {};
  const iconSet = {
    slug: record.slug,
    label: record.label,
    type: record.type || record.node_type,
    sourcePath: record.source_path,
    wikiCard: record.wiki?.card_record || record.wiki_paths?.card_record || null,
    glyph: siteRelativeAsset(assets.glyph || record.app_paths?.glyph || `site/generated/node-icons/${record.slug}/glyph.svg`),
    badge: siteRelativeAsset(assets.badge || record.app_paths?.badge || `site/generated/node-icons/${record.slug}/badge.svg`),
    card: siteRelativeAsset(assets.card || record.app_paths?.card || `site/generated/node-icons/${record.slug}/card.svg`),
  };
  return {
    ...iconSet,
    absolute: {
      glyph: path.join(repoRoot, iconSet.glyph),
      badge: path.join(repoRoot, iconSet.badge),
      card: path.join(repoRoot, iconSet.card),
    },
  };
}

function walkFiles(root, exts, limit = 5000) {
  const output = [];
  if (!exists(root)) return output;
  const stack = [root];
  while (stack.length && output.length < limit) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) stack.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (exts.has(path.extname(entry.name).toLowerCase())) output.push(fullPath);
      if (output.length >= limit) break;
    }
  }
  return output;
}

function titleFromFilename(filePath) {
  return path.basename(filePath, path.extname(filePath))
    .replace(/\s+-\s+[a-f0-9]{8}$/i, '')
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim() || path.basename(filePath);
}

function titleFromMarkdown(filePath) {
  try {
    const firstLines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).slice(0, 40);
    const heading = firstLines.find(line => /^#\s+/.test(line));
    if (heading) return heading.replace(/^#\s+/, '').trim();
  } catch {}
  return titleFromFilename(filePath);
}

function summarizeWiki() {
  const files = walkFiles(roots.wiki, markdownExts, 50000);
  const sections = new Map();
  const entries = files.map(filePath => {
    const relative = path.relative(roots.wiki, filePath);
    const section = relative.split(path.sep)[0] || 'Root';
    sections.set(section, (sections.get(section) || 0) + 1);
    const stats = statSafe(filePath);
    return {
      title: titleFromMarkdown(filePath),
      path: filePath,
      relative,
      section,
      modifiedAt: stats ? stats.mtime.toISOString() : null,
      size: stats ? stats.size : 0,
    };
  }).sort((a, b) => String(b.modifiedAt || '').localeCompare(String(a.modifiedAt || '')));

  return {
    root: roots.wiki,
    exists: exists(roots.wiki),
    count: entries.length,
    sections: Array.from(sections.entries()).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    recent: entries.slice(0, 80),
    entries,
  };
}

function registrySongToTrack(song, index) {
  const localPath = song.localPath || song.audioPath || song.path || '';
  if (!localPath || !exists(localPath)) return null;
  return {
    id: song.id || `song-${index}`,
    title: titleFromFilename(song.title || localPath),
    src: pathToFileURL(localPath).href,
    filePath: localPath,
    duration: Number(song.duration || 0),
    model: [song.model, song.majorModelVersion].filter(Boolean).join(' '),
    tags: song.tags || song.stylePrompt || '',
    prompt: song.prompt || song.lyrics || '',
    imageUrl: song.imageUrl || '',
    source: 'hapa-song-registry',
  };
}

function getMusicLibrary() {
  const registryPath = path.join(roots.songRegistry, 'data', 'registry.json');
  const registry = readJsonSafe(registryPath);
  if (registry?.songs?.length) {
    const tracks = registry.songs
      .map(registrySongToTrack)
      .filter(Boolean)
      .sort((a, b) => a.title.localeCompare(b.title));
    return {
      source: 'hapa-song-registry',
      registryPath,
      libraryRoot: roots.songLibrary,
      libraryCount: registry.songs.length,
      playableCount: tracks.length,
      counts: registry.counts || {},
      tracks,
    };
  }

  const audioFiles = walkFiles(roots.songLibrary, audioExts, 10000);
  const tracks = audioFiles.map((filePath, index) => {
    const stats = statSafe(filePath);
    return {
      id: `audio-${index}`,
      title: titleFromFilename(filePath),
      src: pathToFileURL(filePath).href,
      filePath,
      duration: 0,
      model: '',
      tags: '',
      prompt: '',
      source: 'suno-library',
      modifiedAt: stats ? stats.mtime.toISOString() : null,
    };
  }).sort((a, b) => a.title.localeCompare(b.title));
  return {
    source: 'suno-library',
    registryPath,
    libraryRoot: roots.songLibrary,
    libraryCount: tracks.length,
    playableCount: tracks.length,
    counts: {},
    tracks,
  };
}

function summarizeNodes() {
  const nodeMap = path.join(repoRoot, 'docs', 'NODE_MAP.md');
  const content = exists(nodeMap) ? fs.readFileSync(nodeMap, 'utf8') : '';
  const iconManifest = getNodeIconManifest();
  const rows = content.split(/\r?\n/)
    .filter(line => /^\|\s*[^|]+\s*\|/.test(line) && !/^\|\s*-/.test(line))
    .slice(1)
    .map(line => line.split('|').slice(1, -1).map(cell => cell.trim()))
    .filter(cells => cells.length >= 4)
    .map(cells => {
      const rawPath = cells[1].replace(/`/g, '');
      const resolvedPath = expandPathHint(rawPath);
      return {
        name: cells[0],
        path: rawPath,
        resolvedPath,
        group: cells[2],
        role: cells[3],
        exists: exists(resolvedPath),
      };
    })
    .map(row => {
      const iconSet = iconSetForNode(row);
      return iconSet ? { ...row, iconSet, thumbnail: iconSet.badge } : row;
    });
  return {
    source: nodeMap,
    count: rows.length,
    online: 0,
    iconManifest: { path: iconManifest.manifestPath, count: iconManifest.records.length },
    iconized: rows.filter(row => row.thumbnail).length,
    rows,
  };
}

function getProtocolFlows() {
  const dir = path.join(repoRoot, 'site', 'generated', 'protocol-flows');
  if (!exists(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => readJsonSafe(path.join(dir, file)))
    .filter(flow => flow?.id && flow?.name && Array.isArray(flow.steps))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

function fileUrlOrNull(targetPath) {
  return targetPath && exists(targetPath) ? pathToFileURL(targetPath).href : null;
}

function assetUrlOrNull(targetPath) {
  if (!targetPath || !exists(targetPath)) return null;
  const resolved = path.resolve(targetPath);
  const encodedPath = resolved.split(path.sep).map(part => encodeURIComponent(part)).join('/');
  return `hapa-asset://local${encodedPath.startsWith('/') ? encodedPath : `/${encodedPath}`}`;
}

function listFilesSafe(dir) {
  try {
    return fs.readdirSync(dir).map(file => path.join(dir, file));
  } catch {
    return [];
  }
}

function preferredGlbFromOutputDir(outputDir, stem = '') {
  const files = listFilesSafe(outputDir)
    .filter(file => modelExts.has(path.extname(file).toLowerCase()))
    .filter(file => !/\.invalid\.glb$/i.test(file));
  if (!files.length) return null;
  const byName = suffix => files.find(file => path.basename(file) === `${stem}${suffix}`);
  return byName('.rigged.glb')
    || byName('.rigged.tangents.glb')
    || files.find(file => /\.rigged\.glb$/i.test(file))
    || files.find(file => /\.rigged\.tangents\.glb$/i.test(file))
    || files[0];
}

function previewFromOutputDir(outputDir, stem = '') {
  const files = listFilesSafe(outputDir);
  return files.find(file => path.basename(file) === `${stem}.preview.png`)
    || files.find(file => /\.(png|jpe?g|webp)$/i.test(file))
    || null;
}

function shipAssetFromManifest(manifest, registryRun = {}) {
  const run = manifest?.run || {};
  const metadata = run.metadata || {};
  const asset = metadata.asset || {};
  if (String(asset.type || '').toLowerCase() !== 'ship') return null;
  const outputDir = run.outputDir || registryRun.outputDir;
  if (!outputDir || !exists(outputDir)) return null;
  const stem = run.stem || registryRun.runId || path.basename(outputDir);
  const glbPath = preferredGlbFromOutputDir(outputDir, stem);
  if (!glbPath) return null;
  const rawGlbPath = listFilesSafe(outputDir).find(file => path.basename(file) === `${stem}.rigged.glb`) || glbPath;
  const glbStats = statSafe(glbPath);
  const rawGlbStats = statSafe(rawGlbPath);
  const previewPath = previewFromOutputDir(outputDir, stem);
  const metadataPath = run.metadataPath || path.join(outputDir, `${stem}.ship.json`);
  const pipeline = metadata.pipeline_flow || {};
  const dimensions = metadata.dimensions_m || {};
  const controls = Array.isArray(metadata.controls) ? metadata.controls : [];
  const sockets = Array.isArray(metadata.sockets) ? metadata.sockets : [];
  const animations = Array.isArray(metadata.animations) ? metadata.animations : [];
  return {
    id: run.runId || registryRun.runId || stem,
    runId: run.runId || registryRun.runId || stem,
    name: run.name || registryRun.name || asset.concept_name || titleFromFilename(stem),
    subtype: asset.subtype || metadata.concept?.asset_subtype || 'ship',
    conceptId: asset.concept_id || metadata.concept?.id || '',
    conceptName: asset.concept_name || metadata.concept?.name || '',
    conceptPath: asset.concept_path || metadata.concept?.path || '',
    flowName: pipeline.flow || '',
    sourcePath: run.sourcePath || registryRun.sourcePath || '',
    outputDir,
    metadataPath,
    manifestPath: registryRun.manifestPath || '',
    cardPath: registryRun.cardPath || '',
    glbPath,
    glbBytes: glbStats ? glbStats.size : 0,
    glbUrl: assetUrlOrNull(glbPath),
    glbFileUrl: fileUrlOrNull(glbPath),
    rawGlbPath,
    rawGlbBytes: rawGlbStats ? rawGlbStats.size : 0,
    rawGlbUrl: assetUrlOrNull(rawGlbPath),
    rawGlbFileUrl: fileUrlOrNull(rawGlbPath),
    previewPath,
    previewUrl: assetUrlOrNull(previewPath),
    previewFileUrl: fileUrlOrNull(previewPath),
    dimensions,
    socketCount: sockets.length,
    controlCount: controls.length,
    animationCount: animations.length || 4,
    updatedAt: registryRun.updatedAt || manifest.registeredAt || null,
    tags: asset.tags || [],
  };
}

function getShipAssetsFromRegistry() {
  const registryPath = path.join(roots.assetViewerHandoff, 'hapa_asset_registry.json');
  const registry = readJsonSafe(registryPath);
  if (!registry?.runs) return { registryPath, ships: [] };
  const ships = Object.values(registry.runs)
    .map(run => {
      const manifestPath = run.manifestPath || path.join(roots.assetViewerHandoff, 'asset-runs', run.runId || '', 'asset-run.manifest.json');
      const manifest = readJsonSafe(manifestPath);
      return manifest ? shipAssetFromManifest(manifest, { ...run, manifestPath }) : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      const bySubtype = String(a.subtype).localeCompare(String(b.subtype));
      return bySubtype || String(a.name).localeCompare(String(b.name));
    });
  return { registryPath, ships };
}

function getShipAssetsFromViewerManifest() {
  const manifestPath = path.join(roots.assetViewerWorkspace, 'viewer', 'public', 'asset-manifest.json');
  const manifest = readJsonSafe(manifestPath);
  if (!Array.isArray(manifest?.assets)) return { manifestPath, ships: [] };
  const ships = manifest.assets
    .filter(asset => String(asset.assetType || '').toLowerCase() === 'ship')
    .map(asset => {
      const glbPath = asset.glbPath && exists(asset.glbPath) ? asset.glbPath : asset.rawGlbPath;
      if (!glbPath || !exists(glbPath)) return null;
      const glbStats = statSafe(glbPath);
      const rawGlbPath = asset.rawGlbPath || glbPath;
      const rawGlbStats = statSafe(rawGlbPath);
      return {
        id: asset.id,
        runId: asset.id,
        name: asset.name || titleFromFilename(asset.id),
        subtype: asset.assetSubtype || 'ship',
        conceptId: asset.conceptId || '',
        conceptName: asset.conceptName || '',
        conceptPath: asset.conceptPath || '',
        flowName: asset.flowName || '',
        sourcePath: asset.sourcePath || '',
        outputDir: asset.folder || path.dirname(glbPath),
        metadataPath: asset.metadataPath || '',
        manifestPath: '',
        cardPath: '',
        glbPath,
        glbBytes: glbStats ? glbStats.size : 0,
        glbUrl: assetUrlOrNull(glbPath),
        glbFileUrl: fileUrlOrNull(glbPath),
        rawGlbPath,
        rawGlbBytes: rawGlbStats ? rawGlbStats.size : 0,
        rawGlbUrl: assetUrlOrNull(rawGlbPath),
        rawGlbFileUrl: fileUrlOrNull(rawGlbPath),
        previewPath: asset.previewPath || null,
        previewUrl: assetUrlOrNull(asset.previewPath),
        previewFileUrl: fileUrlOrNull(asset.previewPath),
        dimensions: asset.dimensions || {},
        socketCount: Number(asset.socketCount || 0),
        controlCount: 0,
        animationCount: Number(asset.animationCount || 0),
        updatedAt: manifest.generatedAt || null,
        tags: asset.tags || [],
      };
    })
    .filter(Boolean)
    .sort((a, b) => String(a.subtype).localeCompare(String(b.subtype)) || String(a.name).localeCompare(String(b.name)));
  return { manifestPath, ships };
}

function getShipAssets() {
  const registry = getShipAssetsFromRegistry();
  const fallback = registry.ships.length ? { manifestPath: null, ships: [] } : getShipAssetsFromViewerManifest();
  const ships = registry.ships.length ? registry.ships : fallback.ships;
  return {
    source: registry.ships.length ? 'hapa-dev-proto asset handoff registry' : 'asset viewer manifest',
    registryPath: registry.registryPath,
    viewerManifestPath: fallback.manifestPath || path.join(roots.assetViewerWorkspace, 'viewer', 'public', 'asset-manifest.json'),
    handoffRoot: roots.assetViewerHandoff,
    workspaceRoot: roots.assetViewerWorkspace,
    count: ships.length,
    ships,
  };
}

function getProviderCostSurvey(options = {}) {
  const surveyPath = path.resolve(options.path || providerCostSurveyPath);
  assertAllowedPath(surveyPath);
  const stats = statSafe(surveyPath);
  const text = exists(surveyPath) ? fs.readFileSync(surveyPath, 'utf8') : '';
  const [frontmatter, body] = parseSimpleFrontmatter(text);
  const tables = parseMarkdownTables(body);
  const rows = flattenProviderSurveyRows(tables);
  const filters = normalizeSurveyFilters(options);
  const filteredRows = filterProviderSurveyRows(rows, filters);
  const sourceReportMatch = body.match(/Source report:\s*`([^`]+)`/);
  const hostedRows = rows.filter(row => row.category === 'hosted').length;
  const localRows = rows.filter(row => row.category === 'local').length;

  const payload = {
    id: 'hapa-provider-cost-survey',
    title: frontmatter.title || 'Hapa Provider Cost Survey',
    status: frontmatter.status || (stats ? 'available' : 'missing'),
    retrievalId: frontmatter.retrieval_id || 'hapa-provider-cost-survey',
    sourcePath: surveyPath,
    sourceReportPath: sourceReportMatch?.[1] || '',
    updatedAt: stats ? stats.mtime.toISOString() : null,
    generatedAt: new Date().toISOString(),
    frontmatter,
    counts: {
      tables: tables.length,
      rows: rows.length,
      hostedRows,
      localRows,
      filteredRows: filteredRows.length,
    },
    filters,
    tables,
    rows: filteredRows,
  };
  if (options.includeMarkdown) payload.markdown = text;
  return payload;
}

async function checkLocalServices() {
  const checks = await Promise.all(localEndpoints.map(async endpoint => {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 900);
    try {
      const response = await fetch(endpoint.url, { method: 'GET', signal: controller.signal });
      return { ...endpoint, online: true, status: response.status, ms: Date.now() - startedAt };
    } catch (error) {
      return { ...endpoint, online: false, status: 0, ms: Date.now() - startedAt, error: error.name === 'AbortError' ? 'timeout' : error.message };
    } finally {
      clearTimeout(timeout);
    }
  }));
  return { checkedAt: new Date().toISOString(), endpoints: checks };
}

function normalizeNodeId(value) {
  const raw = String(value || '').trim();
  const key = raw.toLowerCase().replace(/[`'"]/g, '').replace(/\s+/g, ' ');
  if (nodeAliases.has(key)) return nodeAliases.get(key);
  return key
    .replace(/^hapa\s+/, 'hapa-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseSteps(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\s*->\s*/);
      if (parts.length < 2) return null;
      const source = parts.shift();
      const right = parts.join(' -> ');
      const layerMatch = right.match(/^(.*?)\s*\[(UI|API|CLI|DATA)\]\s*:?\s*(.*)$/i);
      const colonIndex = layerMatch ? -1 : right.indexOf(':');
      const target = layerMatch ? layerMatch[1] : colonIndex >= 0 ? right.slice(0, colonIndex) : right;
      const label = layerMatch ? layerMatch[3] : colonIndex >= 0 ? right.slice(colonIndex + 1) : 'Flow handoff.';
      return {
        source: normalizeNodeId(source),
        target: normalizeNodeId(target),
        layer: String(layerMatch?.[2] || 'DATA').toUpperCase(),
        label: label.trim() || 'Flow handoff.',
      };
    })
    .filter(Boolean);
}

function splitList(value) {
  return String(value || '').split(/[\n,;]/).map(item => item.trim()).filter(Boolean);
}

function slug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || `flow-${Date.now()}`;
}

function markdownList(items) {
  return items.length ? items.map(item => `- ${item}`).join('\n') : '- TBD';
}

function createFlowMarkdown(input, flow) {
  const created = new Date().toISOString();
  const nodes = flow.nodes.length ? flow.nodes : Array.from(new Set(flow.steps.flatMap(step => [step.source, step.target])));
  const stepLines = flow.steps.map((step, index) => `${index + 1}. \`${step.source} -> ${step.target} [${step.layer}]\`: ${step.label}`).join('\n');
  return `---\ntitle: ${flow.name}\ntype: hapa-flow-explainer\nstatus: draft\ncreated: ${created}\nsource: Hapa Node Space Desktop\nflow_id: ${flow.id}\nrelated:\n  - \"[[Operations/Hapa Production Run Protocol]]\"\n  - \"[[Nodes/Node Graph v2]]\"\n---\n\n# ${flow.name}\n\n## Objective\n\n${input.objective || 'TBD'}\n\n## Teaching Goal\n\n${input.teaches || 'Show how a multi-node Hapa process moves responsibility across UI, API, CLI, and Data layers.'}\n\n## Nodes\n\n${markdownList(nodes)}\n\n## Route Script\n\n${stepLines || '1. TBD'}\n\n## Blue Architect Explainer\n\n${input.explainer || input.description || 'This flow needs a narrated explanation pass before it is ready for TTS or card production.'}\n\n## Flow Card\n\n- Verb: ${flow.card.verb}\n- Type: ${flow.card.type}\n- Rank: ${flow.card.rank}\n- Grade: ${flow.card.grade}\n- Effect: ${flow.card.effect}\n- Risk: ${flow.card.risk}\n\n## Card Hooks\n\n${input.cardHooks || 'TBD'}\n\n## Production Brief\n\n${input.productionNotes || 'Use this flow as a Node Space animation script, action-image prompt, TTS explainer source, and future Hapa process card.'}\n\n## Record Rule\n\n${input.recordRule || 'Write durable state to the owning source-of-truth node, keep provenance in the wiki, and add retrieval/update hooks to Atlas or Lance when applicable.'}\n`;
}

async function createFlowExplainer(input = {}) {
  const name = String(input.name || input.title || 'Untitled Hapa Flow').trim();
  const id = slug(input.id || name);
  const steps = parseSteps(input.stepsText || input.steps || '');
  const nodes = splitList(input.nodesText || input.nodes || '');
  const flow = {
    id,
    name,
    summary: String(input.objective || input.summary || 'A Hapa multi-node flow.').trim(),
    color: 0x5eead4,
    nodes,
    steps,
    card: {
      verb: String(input.verb || 'ROUTE').toUpperCase().slice(0, 16),
      type: input.cardType || 'Protocol Skill',
      rank: input.rank || 'Draft',
      grade: input.grade || 'B',
      description: input.description || input.objective || `${name} moves work across Hapa nodes and makes the route teachable.`,
      effect: input.effect || 'Trace the route, reveal each handoff, and create a protocol record for reuse.',
      risk: input.risk || 'Missing ownership or stale node state can make the route hard to reproduce.',
      stats: {
        impact: Number(input.impact || 7),
        reliability: Number(input.reliability || 7),
        complexity: Number(input.complexity || 6),
        cost: Number(input.cost || 4),
        speed: Number(input.speed || 6),
        teaching: Number(input.teaching || 9),
      },
    },
  };

  const wikiDir = path.join(roots.wiki, 'Operations', 'Flow Explainers');
  const generatedDir = path.join(repoRoot, 'site', 'generated', 'protocol-flows');
  await fsp.mkdir(wikiDir, { recursive: true });
  await fsp.mkdir(generatedDir, { recursive: true });

  const wikiPath = path.join(wikiDir, `${id}.md`);
  const jsonPath = path.join(generatedDir, `${id}.json`);
  await fsp.writeFile(wikiPath, createFlowMarkdown(input, flow), 'utf8');
  await fsp.writeFile(jsonPath, JSON.stringify({ ...flow, wikiPath, jsonPath, createdAt: new Date().toISOString() }, null, 2), 'utf8');

  const registryPath = path.join(repoRoot, 'docs', 'PROCESS_FLOW_EXPLAINER_REGISTRY.md');
  const registryEntry = `- ${new Date().toISOString().slice(0, 10)}: [${name}](${path.relative(repoRoot, wikiPath)}) -> \`${path.relative(repoRoot, jsonPath)}\``;
  let registry = '# Hapa Flow Explainer Registry\n\nFlow explainers created from Hapa Node Space Desktop.\n\n';
  if (exists(registryPath)) registry = await fsp.readFile(registryPath, 'utf8');
  if (!registry.includes(`site/generated/protocol-flows/${id}.json`)) {
    registry = `${registry.trim()}\n${registryEntry}\n`;
    await fsp.writeFile(registryPath, registry, 'utf8');
  }

  return { ok: true, flow, wikiPath, jsonPath, registryPath };
}

function getContext() {
  const music = getMusicLibrary();
  const ships = getShipAssets();
  const providerCosts = getProviderCostSurvey({ limit: 0 });
  return {
    generatedAt: new Date().toISOString(),
    roots,
    wiki: summarizeWiki(),
    providerCosts: {
      id: providerCosts.id,
      title: providerCosts.title,
      status: providerCosts.status,
      sourcePath: providerCosts.sourcePath,
      updatedAt: providerCosts.updatedAt,
      counts: providerCosts.counts,
      sample: providerCosts.rows.slice(0, 20),
    },
    music: {
      source: music.source,
      registryPath: music.registryPath,
      libraryRoot: music.libraryRoot,
      libraryCount: music.libraryCount,
      playableCount: music.playableCount,
      counts: music.counts,
      sample: music.tracks.slice(0, 80),
    },
    nodes: summarizeNodes(),
    flows: getProtocolFlows(),
    ships: {
      source: ships.source,
      registryPath: ships.registryPath,
      viewerManifestPath: ships.viewerManifestPath,
      handoffRoot: ships.handoffRoot,
      workspaceRoot: ships.workspaceRoot,
      count: ships.count,
      sample: ships.ships.slice(0, 20),
    },
  };
}

module.exports = {
  roots,
  assertAllowedPath,
  checkLocalServices,
  createFlowExplainer,
  getContext,
  getMusicLibrary,
  getProviderCostSurvey,
  getShipAssets,
};

if (require.main === module && process.argv.includes('--smoke')) {
  (async () => {
    const context = getContext();
    const services = await checkLocalServices();
    console.log(JSON.stringify({
      wiki: { count: context.wiki.count, root: context.wiki.root },
      providerCosts: context.providerCosts,
      music: { count: context.music.libraryCount, playable: context.music.playableCount },
      nodes: { count: context.nodes.count },
      flows: { count: context.flows.length, first: context.flows[0]?.id || null },
      ships: { count: context.ships.count, source: context.ships.source },
      services: services.endpoints,
    }, null, 2));
  })().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
