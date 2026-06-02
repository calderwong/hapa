#!/usr/bin/env node
const http = require('node:http');
const local = require('../electron/hapa-local');

const command = process.argv[2] || 'help';
const args = process.argv.slice(3);

function hasFlag(name) {
  return args.includes(name);
}

function flagValue(name, fallback = '') {
  const index = args.indexOf(name);
  return index >= 0 && index + 1 < args.length ? args[index + 1] : fallback;
}

function asJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function summarizeRoots(roots) {
  const fs = require('node:fs');
  return Object.fromEntries(Object.entries(roots).map(([key, value]) => [key, {
    path: value,
    exists: fs.existsSync(value),
  }]));
}

function capabilities() {
  return {
    app: 'hapa-node-space',
    status: 'partial',
    standard: '$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Operations/Hapa Node App Standards.md',
    docs: {
      readme: 'README.md',
      aiAgentContext: 'AGENTS.md',
      parity: 'docs/FEATURE_PARITY.md',
      cli: 'docs/CLI.md',
      api: 'docs/API.md',
      ui: 'docs/NODE_SPACE_DESKTOP.md',
    },
    surfaces: {
      api: {
        status: 'partial',
        type: 'Electron IPC + local CommonJS feature module + optional loopback HTTP server',
        module: 'electron/hapa-local.js',
        note: 'Run `npm run api -- --port 8876` for read-only /health, /capabilities, and /v1/* endpoints.',
      },
      cli: {
        status: 'scaffold',
        command: 'npm run cli -- <command>',
        bin: 'hapa-node-space',
      },
      ui: {
        status: 'partial',
        desktop: 'npm run desktop',
        staticSite: 'site/index.html',
        markdownViewer: 'site/app.js renders wiki/repo Markdown snapshots with escaped HTML; Node Space desktop docs surface remains a documented gap.',
      },
    },
    commands: ['health', 'capabilities', 'context', 'nodes', 'music', 'ships', 'services', 'provider-costs', 'flow-explainer', 'serve-api', 'help'],
  };
}

function health() {
  const context = local.getContext();
  return {
    ok: true,
    generatedAt: context.generatedAt,
    roots: summarizeRoots(local.roots),
    counts: {
      wikiPages: context.wiki.count,
      providerCostRows: context.providerCosts.counts.rows,
      nodes: context.nodes.count,
      musicTracks: context.music.libraryCount,
      playableMusicTracks: context.music.playableCount,
      protocolFlows: context.flows.length,
      ships: context.ships.count,
    },
  };
}

function printHelp() {
  console.log(`Hapa Node Space CLI

Usage:
  hapa-node-space <command> [--json]
  npm run cli -- <command> [--json]

Commands:
  health          Local roots and feature-spine counts
  capabilities    API/CLI/UI parity and standards status
  context         Full local context summary from electron/hapa-local.js
  nodes           Node map summary
  music           Music library summary
  ships           Ship asset summary
  services        Probe known local Hapa service URLs
  provider-costs  Provider/local compute cost survey from the Second Brain
  flow-explainer  Create a flow explainer record
  serve-api       Start read-only loopback HTTP API
  help            Show this help

provider-costs flags:
  --provider <text> --model <text> --task <text> --query <text> --local --hosted --limit <n> --markdown

flow-explainer flags:
  --name <text> --objective <text> --steps <"a -> b [UI]: label"> [--nodes <csv>] [--dry-run]

serve-api flags:
  --host <127.0.0.1> --port <8876>

Safe boundaries:
  The CLI reads only known Hapa roots through electron/hapa-local.js. The flow-explainer command writes to the wiki Operations/Flow Explainers folder, site/generated/protocol-flows, and docs/PROCESS_FLOW_EXPLAINER_REGISTRY.md.
`);
}

function providerCostOptionsFromArgs() {
  return {
    provider: flagValue('--provider', ''),
    model: flagValue('--model', ''),
    task: flagValue('--task', ''),
    query: flagValue('--query', flagValue('--q', '')),
    table: flagValue('--table', ''),
    local: hasFlag('--local'),
    hosted: hasFlag('--hosted'),
    limit: flagValue('--limit', '0'),
    includeMarkdown: hasFlag('--markdown'),
  };
}

function queryOptions(searchParams) {
  return {
    provider: searchParams.get('provider') || '',
    model: searchParams.get('model') || '',
    task: searchParams.get('task') || '',
    query: searchParams.get('query') || searchParams.get('q') || '',
    table: searchParams.get('table') || '',
    local: searchParams.get('local') === '1' || searchParams.get('local') === 'true',
    hosted: searchParams.get('hosted') === '1' || searchParams.get('hosted') === 'true',
    limit: searchParams.get('limit') || '0',
    includeMarkdown: searchParams.get('markdown') === '1' || searchParams.get('markdown') === 'true',
  };
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': 'http://127.0.0.1',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'content-type',
  });
  response.end(JSON.stringify(payload, null, 2));
}

async function apiPayload(pathname, searchParams) {
  if (pathname === '/health') return health();
  if (pathname === '/capabilities') return capabilities();
  if (pathname === '/v1/context') return local.getContext();
  if (pathname === '/v1/nodes') return local.getContext().nodes;
  if (pathname === '/v1/music') return local.getMusicLibrary();
  if (pathname === '/v1/ships') return local.getShipAssets();
  if (pathname === '/v1/services') return local.checkLocalServices();
  if (pathname === '/v1/provider-costs') return local.getProviderCostSurvey(queryOptions(searchParams));
  if (pathname === '/v1/provider-costs/rows') {
    const survey = local.getProviderCostSurvey(queryOptions(searchParams));
    return {
      id: survey.id,
      generatedAt: survey.generatedAt,
      sourcePath: survey.sourcePath,
      counts: survey.counts,
      filters: survey.filters,
      rows: survey.rows,
    };
  }
  return null;
}

async function serveApi() {
  const host = flagValue('--host', '127.0.0.1');
  const port = Number(flagValue('--port', '8876'));
  const server = http.createServer(async (request, response) => {
    try {
      if (request.method === 'OPTIONS') return sendJson(response, 204, {});
      if (request.method !== 'GET') return sendJson(response, 405, { ok: false, error: 'Only GET is supported' });
      const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
      const payload = await apiPayload(url.pathname, url.searchParams);
      if (!payload) return sendJson(response, 404, { ok: false, error: 'Not found' });
      return sendJson(response, 200, payload);
    } catch (error) {
      return sendJson(response, 500, { ok: false, error: error.message || String(error) });
    }
  });
  server.listen(port, host, () => {
    console.log(`Hapa Node Space API listening at http://${host}:${port}`);
    console.log('Endpoints: /health, /capabilities, /v1/context, /v1/provider-costs, /v1/provider-costs/rows');
  });
}

async function main() {
  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'health') return asJson(health());
  if (command === 'capabilities') return asJson(capabilities());

  if (command === 'context') return asJson(local.getContext());
  if (command === 'nodes') return asJson(local.getContext().nodes);
  if (command === 'music') return asJson(local.getMusicLibrary());
  if (command === 'ships') return asJson(local.getShipAssets());
  if (command === 'services') return asJson(await local.checkLocalServices());
  if (command === 'provider-costs') return asJson(local.getProviderCostSurvey(providerCostOptionsFromArgs()));
  if (command === 'serve-api') return serveApi();

  if (command === 'flow-explainer') {
    const payload = {
      name: flagValue('--name', 'Untitled Hapa Flow'),
      objective: flagValue('--objective', ''),
      steps: flagValue('--steps', ''),
      nodes: flagValue('--nodes', ''),
      description: flagValue('--description', ''),
      teaches: flagValue('--teaches', ''),
    };
    if (hasFlag('--dry-run')) {
      return asJson({ ok: true, dryRun: true, payload });
    }
    return asJson(await local.createFlowExplainer(payload));
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(2);
}

main().catch(error => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
