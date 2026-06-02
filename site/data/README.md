# Hapa Site Data

`hapa-index.json` is a generated local search/browse snapshot built from the Hapa wiki and local repo READMEs.

Regenerate it from the repo root with:

```bash
python3 site/build-data.py
```

The generated JSON can be large and may contain local filesystem paths, so it is ignored for public GitHub source. Publish source code and this note; distribute heavy or machine-local snapshots through the Hapa vault/Hypercore asset flow.
