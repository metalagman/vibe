# Vibe

Vibe helps your coding agent explore design decisions, write clear code, and test the behavior you depend on. Each skill works independently.

## Skills

| Skill | What it helps you do |
| --- | --- |
| **brainstorm** | Compare design options, clarify trade-offs, and shape an idea into a specification. |
| **code** | Choose a clear solution, reuse shared rules, and build what you need now. Applies KISS, DRY, and YAGNI without sacrificing required behavior. |
| **tests** | Catch behavioral errors and meaningful failure cases. Use test-first verification where it helps, and avoid tests that merely mirror implementation details. |

## Install

Choose your coding agent:

### Codex

```sh
codex plugin marketplace add metalagman/vibe
codex plugin add vibe@vibe
```

### Claude Code

```sh
claude plugin marketplace add metalagman/vibe
claude plugin install vibe@vibe
```

### Grok Build

```sh
grok plugin marketplace add metalagman/vibe
```

Select Vibe in the Marketplace tab to install it.

### GitHub Copilot CLI

```sh
copilot plugin marketplace add metalagman/vibe
copilot plugin install vibe@vibe
```

### OpenCode v2

```sh
opencode plugin add github:metalagman/vibe
```

Requires OpenCode **v2** (`>=2.0.0 <3`).

### Cursor

```sh
agent plugin marketplace add https://github.com/metalagman/vibe.git
```

Select Vibe in Customize or the interactive plugin marketplace to install it.

## Use it

Invoke a skill with your task:

| Agent | Brainstorm | Code | Tests |
| --- | --- | --- | --- |
| Codex | `$vibe:brainstorm` | `$vibe:code` | `$vibe:tests` |
| Claude Code | `/vibe:brainstorm` | `/vibe:code` | `/vibe:tests` |
| Grok Build | `/vibe-brainstorm` | `/vibe-code` | `/vibe-tests` |
| GitHub Copilot CLI, OpenCode v2, Cursor | Ask for `vibe-brainstorm` | Ask for `vibe-code` | Ask for `vibe-tests` |

For example, in Codex:

```text
$vibe:brainstorm Compare approaches for the new authorization flow.
```

```text
$vibe:code Simplify this request handler while preserving its behavior.
```

```text
$vibe:tests Add tests for the checkout flow, including declined payments.
```

Vibe provides guidance to your agent. It needs no additional credentials or
external services.

<details>
<summary>Using an Agent Plugins client?</summary>

The portable package root is `plugins/vibe`. An Agent Plugins 1.0 client discovers
the `vibe-brainstorm`, `vibe-code`, and `vibe-tests` skills from its `skills/`
directory. Installation is host-specific; Agent Plugins defines the package, not
a universal installer.

</details>

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, package structure,
and validation.

## License

[MIT](LICENSE)
