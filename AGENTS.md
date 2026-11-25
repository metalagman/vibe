# Repository instructions

- Keep the public skill names `brainstorm`, `code`, and `tests` stable.
- Treat `plugins/vibe/canonical-skills/<name>` as the canonical host tree.
- Keep `plugins/vibe/skills/vibe-<name>` byte-for-byte equivalent to the
  canonical tree except for the `name` field in `SKILL.md` and the absence of
  Codex-only `agents/openai.yaml` files.
- Keep all plugin and marketplace versions aligned.
- Do not execute bundled skill scripts during validation.
- Run `python3 -m unittest discover -s tests -v`, `node --test`, and
  `npm pack --dry-run --ignore-scripts` before publishing.
