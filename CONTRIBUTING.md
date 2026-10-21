# Contributing to Vibe

Vibe packages the same two instruction skills for several coding agents. Changes
should keep their guidance focused, preserve equivalent behavior across hosts,
and respect each host's packaging contract.

## Get started

Use Node.js 22 or newer and npm for the local checks below. The plugin entrypoint
has no runtime npm dependencies.

```sh
git clone https://github.com/metalagman/vibe.git
cd vibe
node --test
```

For a documentation change, check the rendered Markdown, relative links, and
command examples. Behavioral changes to the OpenCode entrypoint should include
focused tests of registration and failure behavior.

## Repository layout

| Path | Purpose |
| --- | --- |
| `skills/code/` | Canonical KISS, DRY, and YAGNI guidance and Codex skill UI metadata |
| `skills/tests/` | Canonical behavioral-testing guidance and Codex skill UI metadata |
| `plugin.json` | Portable Agent Plugins 1.0 manifest |
| `plugins/vibe/skills/` | Canonical skill copies for Codex and Claude Code |
| `plugins/vibe/prefixed-skills/` | `vibe-code` and `vibe-tests` variants for hosts with flat skill discovery |
| `plugins/vibe/.codex-plugin/` | Codex manifest |
| `plugins/vibe/.claude-plugin/` | Claude Code manifest |
| `plugins/vibe/.grok-plugin/` | Grok Build manifest |
| `plugins/vibe/.plugin/` | GitHub Copilot CLI manifest |
| `plugins/vibe/.cursor-plugin/` | Cursor manifest |
| `integrations/opencode/index.js` | OpenCode v2 entrypoint registering both root skills |
| `tests/opencode.test.mjs` | OpenCode registration and missing-asset tests |
| `package.json` | OpenCode package metadata and shipped-file allowlist |

Repository marketplace catalogs live in `.agents/plugins/`, `.claude-plugin/`,
`.grok-plugin/`, `.github/plugin/`, and `.cursor-plugin/`.

## Update a skill

Edit the canonical file under `skills/`, then update the corresponding copies in
`plugins/vibe/skills/` and `plugins/vibe/prefixed-skills/`.

- Keep canonical skill and UI copies identical.
- Keep prefixed skill bodies equivalent; their frontmatter names are
  `vibe-code` and `vibe-tests`.
- Keep each skill independently usable and its description specific to its task.
- Update OpenCode registration metadata if a skill description changes.
- Keep Codex default prompts aligned with `$vibe:code` and `$vibe:tests`.

The packages expose exactly two logical skills. Preserve the distinction between
production-code guidance and behavioral-testing guidance.

## Validate changes

Run the repository tests and check the OpenCode package inventory:

```sh
node --test
npm pack --dry-run --ignore-scripts --json
git diff --check
```

The package inventory should include `package.json`, `README.md`, `LICENSE`,
`integrations/opencode/index.js`, and both root `SKILL.md` files. Check that local
state and credentials are excluded. The dry run does not publish anything.

When editing skills, use the installed **skill-creator** skill's
`scripts/quick_validate.py` on each of these six directories:

```text
skills/code
skills/tests
plugins/vibe/skills/code
plugins/vibe/skills/tests
plugins/vibe/prefixed-skills/vibe-code
plugins/vibe/prefixed-skills/vibe-tests
```

Also review the instructions themselves: frontmatter validation cannot establish
whether a skill gives useful guidance. Check copy parity and parse the four
`agents/openai.yaml` files.

For plugin metadata changes, use **plugin-creator** to review the Codex manifest
and marketplace contract, and **hostplugin:author** for host-specific packaging.
The locally inspected plugin-creator provides contract guidance and scaffolding,
but no standalone manifest validator; do not scaffold over an existing package.

With the corresponding host CLIs installed, run:

```sh
claude plugin validate plugins/vibe
claude plugin validate .
grok plugin validate plugins/vibe
```

Validate the root `plugin.json` against its declared
[Agent Plugins 1.0 schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json),
then check path containment, URLs, skill discovery, and metadata consistency.
Keep manifest and marketplace versions synchronized.

Codex, GitHub Copilot CLI, OpenCode v2, and Cursor had no dedicated static plugin
validator in the inspected CLI help. Check current help before choosing a command;
`opencode plugin check` checks for package updates and is not a validator.

Static checks and the OpenCode test editor do not establish that a host installed
or invoked the plugin. Report actual host smoke tests separately and use isolated
configuration for them.

## OpenCode compatibility

The target is **OpenCode v2** (`>=2.0.0 <3`). Read both bundled assets relative to
the entrypoint module before registering either skill. If either file is missing,
setup must reject without partial registration. Keep the entrypoint limited to
registering instruction assets.

## Submit a change

Explain the user-visible result, affected hosts, and checks performed. Call out
any check you could not run. Keep unrelated cleanup separate and preserve license
and author attribution.

## Release notes for maintainers

Git-based installations read the remote repository. Commit and push approved
package changes before asking users to reinstall. A local package preview is not
publication.

Choose and confirm a release version before publishing, especially where hosts
cache versioned plugins. Use the repository's authorized release process and do
not overwrite published versions or existing tags. Updating a README installation
example does not publish a package or create a public marketplace listing.
