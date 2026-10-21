# Vibe

**Simple code. Tests that matter.**

Vibe gives your coding agent two focused skills: one for keeping code clear and
another for testing the behavior you depend on.

Use them when building a feature, simplifying existing code, or reviewing a
change. Each skill works independently.

## Two skills, one clear purpose

| Skill | What it helps you do |
| --- | --- |
| **code** | Choose a clear solution, reuse shared rules, and build what you need now. Applies KISS, DRY, and YAGNI without sacrificing required behavior. |
| **tests** | Catch behavioral errors and meaningful failure cases. Use test-first verification where it helps, and avoid tests that merely mirror implementation details. |

## Install

Choose your coding agent:

| Agent | Installation |
| --- | --- |
| Codex | `codex plugin marketplace add metalagman/vibe` then `codex plugin add vibe@vibe` |
| Claude Code | `claude plugin marketplace add metalagman/vibe` then `claude plugin install vibe@vibe` |
| Grok Build | `grok plugin marketplace add metalagman/vibe`, then select Vibe in the Marketplace tab |
| GitHub Copilot CLI | `copilot plugin marketplace add metalagman/vibe` then `copilot plugin install vibe@vibe` |
| OpenCode v2 | `opencode plugin add github:metalagman/vibe` |
| Cursor | `agent plugin marketplace add https://github.com/metalagman/vibe.git`, then select Vibe in the plugin marketplace |

OpenCode support targets **v2** (`>=2.0.0 <3`). For Cursor, select and install the
plugin through Customize or the interactive plugin marketplace after registering
its source.

## Use it

Invoke a skill with your task:

| Agent | Code | Tests |
| --- | --- | --- |
| Codex | `$vibe:code` | `$vibe:tests` |
| Claude Code | `/vibe:code` | `/vibe:tests` |
| Grok Build | `/vibe-code` | `/vibe-tests` |
| GitHub Copilot CLI, OpenCode v2, Cursor | Ask for `vibe-code` | Ask for `vibe-tests` |

For example, in Codex:

```text
$vibe:code Simplify this request handler while preserving its behavior.
```

```text
$vibe:tests Add tests for the checkout flow, including declined payments.
```

```text
$vibe:code Review this change for unnecessary abstractions and speculative features.
```

Vibe provides guidance to your agent. It needs no additional credentials or
external services.

<details>
<summary>Using an Agent Plugins client?</summary>

Vibe also includes an Agent Plugins 1.0 package. Follow your client's installation
instructions and select the `code` or `tests` skill.

</details>

<details>
<summary>Moving from KISS IT?</summary>

Install Vibe from `metalagman/vibe` and remove the old `kiss` installation through
your agent's plugin manager. Replace `it` with `code` or `tests` in saved prompts;
the old `$kiss:it`, `/kiss:it`, and `kiss-it` names have no compatibility aliases.

</details>

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, package structure,
and validation.

## License

[MIT](LICENSE)
