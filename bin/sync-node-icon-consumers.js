#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const desktopRoot = path.dirname(repoRoot);
const wikiRoot = process.env.HAPA_WIKI_ROOT || path.join(desktopRoot, 'Hapa_Worldbuilding_Wiki');
const devProtoRoot = process.env.HAPA_DEV_PROTO_ROOT || path.join(desktopRoot, 'hapa-dev-proto');
const avatarDashboardRoot = process.env.HAPA_AVATAR_DASHBOARD_ROOT || path.join(desktopRoot, 'hapa-avatar-dashboard');
const sourceRoot = path.join(repoRoot, 'site', 'generated', 'node-icons');
const sourceManifestPath = path.join(sourceRoot, 'index.json');
const launcherIconRoot = path.join(repoRoot, 'site', 'generated', 'desktop-launcher-icons');
const wikiCardRoot = path.join(wikiRoot, 'Cards', 'Node Icon Cards');

const desktopLauncherMap = [
  { name: 'Launch Hapa Dev Proto.app', slug: 'hapa-dev-proto', reason: 'main Hapa AG app launcher' },
  { name: 'Launch Hapa Node Space.app', slug: 'hapa-node-space', reason: '3D Node Space desktop launcher' },
  { name: 'Hapa Wiki Viewer.app', slug: 'hapa-wiki-viewer', reason: 'wiki viewer desktop app' },
  { name: 'Launch Hapa LiTo.app', slug: 'hapalito', reason: '.hapaLiTo launcher' },
  { name: 'Launch MTPLX.app', slug: 'mtplx', reason: 'MTPLX Cymatica launcher' },
  { name: 'Launch Hapa Game Node Desktop.app', slug: 'hapa-game-generation-node', reason: 'game generation desktop launcher' },
  { name: 'Cymatica Launcher.app', slug: 'project-cymatica-vision', reason: 'Project Cymatica launcher' },
  { name: 'Hapa Drama.app', slug: 'hapa-drama-desktop', reason: 'Hapa Drama desktop node' },
  { name: 'Hapa Music.app', slug: 'hapa-song-registry', reason: 'music launcher backed by song registry' },
  { name: 'HapaAudio.app', slug: 'hapa-song-registry', reason: 'audio launcher backed by song registry' },
  { name: 'Hapa Brochure Node.app', slug: 'hapa-node-space', reason: 'front-door brochure launcher uses Node Space identity' },
  { name: 'Hapa Asset Viewer.app', slug: 'hapa-anvil-node', reason: 'asset viewer supports forged artifacts and card outputs' },
  { name: 'Hapa Marlin.app', slug: 'wormhole-ingestion-node', reason: 'Marlin artifact flow uses ingestion-node identity' },
];

const commandLauncherMap = [
  { name: 'Launch Hapa Avatar Dashboard.command', slug: 'hapa-avatar-dashboard', reason: 'avatar dashboard command launcher' },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function loadManifest() {
  const manifest = readJson(sourceManifestPath);
  const records = Array.isArray(manifest.nodes) ? manifest.nodes : [];
  const bySlug = new Map(records.map(record => [record.slug, record]));
  const byKey = new Map();
  const setKey = (value, record) => {
    const key = normalizeKey(value);
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
  return { manifest, records, bySlug, byKey };
}

function webAssetsFor(record) {
  return {
    glyph: `/hapa-node-icons/${record.slug}/glyph.svg`,
    badge: `/hapa-node-icons/${record.slug}/badge.svg`,
    card: `/hapa-node-icons/${record.slug}/card.svg`,
  };
}

function copyIconPublicMirror(records) {
  const targets = [
    path.join(devProtoRoot, 'public', 'hapa-node-icons'),
    path.join(devProtoRoot, 'dist-renderer', 'hapa-node-icons'),
  ];
  const copiedTargets = [];
  for (const targetRoot of targets) {
    if (targetRoot.includes(`${path.sep}dist-renderer${path.sep}`) && !fs.existsSync(path.dirname(targetRoot))) {
      continue;
    }
    fs.mkdirSync(targetRoot, { recursive: true });
    for (const record of records) {
      const sourceDir = path.join(sourceRoot, record.slug);
      const targetDir = path.join(targetRoot, record.slug);
      if (!fs.existsSync(sourceDir)) continue;
      fs.rmSync(targetDir, { recursive: true, force: true });
      fs.cpSync(sourceDir, targetDir, { recursive: true });
    }
    const webManifest = {
      id: 'hapa-node-icons-web',
      name: 'Hapa Node Icons Web Mirror',
      source: sourceManifestPath,
      generatedAt: new Date().toISOString(),
      nodes: records.map(record => ({
        label: record.label,
        slug: record.slug,
        type: record.type || record.node_type,
        source_path: record.source_path,
        assets: webAssetsFor(record),
        wiki: record.wiki || record.wiki_paths,
      })),
    };
    writeJson(path.join(targetRoot, 'index.json'), webManifest);
    copiedTargets.push(targetRoot);
  }
  return copiedTargets;
}

function replaceOrAppendBlock(content, marker, block) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const wrapped = `${start}\n${block.trim()}\n${end}`;
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (pattern.test(content)) return content.replace(pattern, wrapped);
  return `${content.trimEnd()}\n\n${wrapped}\n`;
}

function enrichWikiNodePages(records) {
  let updated = 0;
  let skipped = 0;
  for (const record of records) {
    const cardRecord = record.wiki?.card_record || record.wiki_paths?.card_record;
    if (!record.source_path || !cardRecord) {
      skipped += 1;
      continue;
    }
    const nodePath = path.join(wikiRoot, record.source_path);
    if (!fs.existsSync(nodePath)) {
      skipped += 1;
      continue;
    }
    const mediaPath = path.join(wikiCardRoot, 'Media', record.slug, 'card.svg');
    const cardPath = path.join(wikiRoot, cardRecord);
    const relMedia = path.relative(path.dirname(nodePath), mediaPath).split(path.sep).join('/');
    const relCard = path.relative(path.dirname(nodePath), cardPath).split(path.sep).join('/');
    const block = [
      '## Node Icon',
      '',
      `![${record.label} node icon](${relMedia})`,
      '',
      `Icon card: [${record.label} Icon Card](${relCard})`,
      '',
      `Icon slug: \`${record.slug}\``,
    ].join('\n');
    const current = fs.readFileSync(nodePath, 'utf8');
    const next = replaceOrAppendBlock(current, 'HAPA-NODE-ICON', block);
    if (next !== current) {
      fs.writeFileSync(nodePath, next, 'utf8');
      updated += 1;
    }
  }
  return { updated, skipped };
}

function findRecord(manifest, slug) {
  return manifest.bySlug.get(slug) || manifest.byKey.get(normalizeKey(slug));
}

function copyStandaloneDashboardBadges(manifest) {
  const copies = [];
  const avatarRecord = findRecord(manifest, 'hapa-avatar-dashboard');
  const avatarSource = avatarRecord ? path.join(sourceRoot, avatarRecord.slug, 'badge.svg') : null;
  const avatarTarget = path.join(avatarDashboardRoot, 'src', 'assets', 'hapa-avatar-dashboard-badge.svg');
  if (avatarSource && fs.existsSync(avatarSource) && fs.existsSync(avatarDashboardRoot)) {
    fs.mkdirSync(path.dirname(avatarTarget), { recursive: true });
    fs.copyFileSync(avatarSource, avatarTarget);
    copies.push({ app: 'hapa-avatar-dashboard', slug: avatarRecord.slug, target: avatarTarget });
  }
  return copies;
}

function thumbnailPngForRecord(record) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `hapa-icon-${record.slug}-`));
  const sourceSvg = path.join(sourceRoot, record.slug, 'card.svg');
  execFileSync('qlmanage', ['-t', '-s', '1024', '-o', tmpDir, sourceSvg], { stdio: 'ignore' });
  const pngPath = path.join(tmpDir, 'card.svg.png');
  if (!fs.existsSync(pngPath)) {
    throw new Error(`Quick Look did not create a thumbnail for ${sourceSvg}`);
  }
  return { tmpDir, pngPath };
}

function icnsForRecord(record) {
  fs.mkdirSync(launcherIconRoot, { recursive: true });
  const outPath = path.join(launcherIconRoot, `${record.slug}.icns`);
  if (fs.existsSync(outPath)) return outPath;

  const { tmpDir, pngPath } = thumbnailPngForRecord(record);
  const iconset = path.join(tmpDir, `${record.slug}.iconset`);
  fs.mkdirSync(iconset, { recursive: true });
  const sizes = [
    [16, 1],
    [16, 2],
    [32, 1],
    [32, 2],
    [128, 1],
    [128, 2],
    [256, 1],
    [256, 2],
    [512, 1],
    [512, 2],
  ];
  for (const [baseSize, scale] of sizes) {
    const pixels = baseSize * scale;
    const suffix = scale === 2 ? `icon_${baseSize}x${baseSize}@2x.png` : `icon_${baseSize}x${baseSize}.png`;
    execFileSync('sips', ['-z', String(pixels), String(pixels), pngPath, '--out', path.join(iconset, suffix)], { stdio: 'ignore' });
  }
  execFileSync('iconutil', ['-c', 'icns', iconset, '-o', outPath], { stdio: 'ignore' });
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return outPath;
}

function setBundleIcon(appPath, icnsPath) {
  const plistPath = path.join(appPath, 'Contents', 'Info.plist');
  const resourcesPath = path.join(appPath, 'Contents', 'Resources');
  if (!fs.existsSync(plistPath)) throw new Error(`Missing Info.plist: ${appPath}`);
  fs.mkdirSync(resourcesPath, { recursive: true });
  const bundleIconName = 'HapaNodeIcon.icns';
  fs.copyFileSync(icnsPath, path.join(resourcesPath, bundleIconName));
  try {
    execFileSync('/usr/libexec/PlistBuddy', ['-c', `Set :CFBundleIconFile ${bundleIconName}`, plistPath], { stdio: 'ignore' });
  } catch {
    execFileSync('/usr/libexec/PlistBuddy', ['-c', `Add :CFBundleIconFile string ${bundleIconName}`, plistPath], { stdio: 'ignore' });
  }
  const now = new Date();
  fs.utimesSync(appPath, now, now);
}

function setCommandFileIcon(commandPath, record) {
  if (!fs.existsSync(commandPath)) throw new Error(`Missing command launcher: ${commandPath}`);
  const { tmpDir, pngPath } = thumbnailPngForRecord(record);
  const iconPng = path.join(tmpDir, 'icon.png');
  const rsrcPath = path.join(tmpDir, 'icon.rsrc');
  fs.copyFileSync(pngPath, iconPng);
  execFileSync('sips', ['-i', iconPng], { stdio: 'ignore' });
  const rsrc = execFileSync('DeRez', ['-only', 'icns', iconPng], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  fs.writeFileSync(rsrcPath, rsrc, 'utf8');
  execFileSync('Rez', ['-append', rsrcPath, '-o', commandPath], { stdio: 'ignore' });
  execFileSync('SetFile', ['-a', 'C', commandPath], { stdio: 'ignore' });
  fs.copyFileSync(pngPath, `${commandPath}.thumbnail.png`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

function applyDesktopLauncherIcons(manifest) {
  const applied = [];
  const failed = [];
  for (const launcher of desktopLauncherMap) {
    const appPath = path.join(desktopRoot, launcher.name);
    const record = findRecord(manifest, launcher.slug);
    if (!record || !fs.existsSync(appPath)) {
      failed.push({ ...launcher, path: appPath, error: record ? 'missing launcher' : 'missing icon record' });
      continue;
    }
    try {
      setBundleIcon(appPath, icnsForRecord(record));
      applied.push({ ...launcher, path: appPath, icon: record.slug, kind: 'app-bundle' });
    } catch (error) {
      failed.push({ ...launcher, path: appPath, error: error.message });
    }
  }
  for (const launcher of commandLauncherMap) {
    const commandPath = path.join(desktopRoot, launcher.name);
    const record = findRecord(manifest, launcher.slug);
    if (!record || !fs.existsSync(commandPath)) {
      failed.push({ ...launcher, path: commandPath, error: record ? 'missing command launcher' : 'missing icon record' });
      continue;
    }
    try {
      setCommandFileIcon(commandPath, record);
      applied.push({ ...launcher, path: commandPath, icon: record.slug, kind: 'command-file' });
    } catch (error) {
      failed.push({ ...launcher, path: commandPath, error: error.message });
    }
  }
  return { applied, failed };
}

function writeLauncherRecords(result) {
  const generatedAt = new Date().toISOString();
  const manifest = {
    id: 'hapa-desktop-launcher-icons',
    name: 'Hapa Desktop Launcher Icon Map',
    generatedAt,
    source: sourceManifestPath,
    applied: result.applied,
    failed: result.failed,
  };
  writeJson(path.join(repoRoot, 'site', 'generated', 'desktop-launcher-icons', 'desktop-launcher-icon-map.json'), manifest);
  writeJson(path.join(wikiCardRoot, 'desktop-launcher-icon-map.json'), manifest);

  const rows = result.applied
    .map(item => `| ${item.name} | \`${item.icon}\` | ${item.kind} | ${item.reason} |`)
    .join('\n');
  const failures = result.failed.length
    ? `\n\n## Skipped / Failed\n\n${result.failed.map(item => `- ${item.name}: ${item.error}`).join('\n')}\n`
    : '';
  const markdown = `---\ntitle: Hapa Desktop Launcher Icon Map\ntype: launcher-icon-map\nstatus: generated\ncreated: ${generatedAt.slice(0, 10)}\ntags:\n  - node-icons\n  - desktop-launchers\n  - hapa-ui\n---\n\n# Hapa Desktop Launcher Icon Map\n\nDesktop launchers now use the same node icon source as wiki cards and app thumbnails.\n\n| Launcher | Icon Slug | Target | Mapping Rule |\n| --- | --- | --- | --- |\n${rows}\n${failures}`;
  fs.writeFileSync(path.join(wikiCardRoot, 'Desktop Launcher Icon Map.md'), markdown, 'utf8');
}

function main() {
  if (!fs.existsSync(sourceManifestPath)) {
    throw new Error(`Missing node icon manifest: ${sourceManifestPath}`);
  }
  const manifest = loadManifest();
  const copiedTargets = copyIconPublicMirror(manifest.records);
  const standaloneDashboards = copyStandaloneDashboardBadges(manifest);
  const wiki = enrichWikiNodePages(manifest.records);
  const launchers = applyDesktopLauncherIcons(manifest);
  writeLauncherRecords(launchers);
  console.log(JSON.stringify({
    ok: true,
    copiedTargets,
    standaloneDashboards,
    wiki,
    launcherIcons: {
      applied: launchers.applied.length,
      failed: launchers.failed.length,
      failedItems: launchers.failed,
    },
  }, null, 2));
}

main();
