# Hapa Node Icon Sets

Generated Hapa/Astros SVG icon sets for 106 Hapa nodes.

Assets live in `site/generated/node-icons/<node-slug>/` with three variants:

- `glyph.svg` - compact 256px square glyph
- `badge.svg` - 512px node badge
- `card.svg` - 1024px card-scale icon

Machine index: `site/generated/node-icons/index.json`

Wiki mirror: `$HAPA_DESKTOP_ROOT/Hapa_Worldbuilding_Wiki/Cards/Node Icon Cards/`

Contact sheet: `site/generated/node-icons/hapa-node-icons-contact-sheet.svg`

The visual language follows the Hapa/Astros operator system: deep neutral base, luminous cyan/gold accents, type-colored orbit rings, telemetry grid, and function-specific node symbols.

## Consumer Sync

Run `npm run sync:node-icons` from `$HAPA_DESKTOP_ROOT/hapa` after generating or changing node icons.

The sync pass updates:

- `hapa-dev-proto/public/hapa-node-icons/` for Master Dashboard thumbnails.
- `hapa-dev-proto/dist-renderer/hapa-node-icons/` when a built renderer exists.
- Wiki node pages with a `Node Icon` thumbnail block.
- Desktop `.app` launchers with generated `HapaNodeIcon.icns` resources.
- `Cards/Node Icon Cards/Desktop Launcher Icon Map.md` and matching JSON manifests.
