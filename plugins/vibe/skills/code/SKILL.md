---
name: code
description: Apply KISS, DRY, and YAGNI when writing, refactoring, or reviewing production code.
---

# Vibe Code

## KISS

Choose the simplest clear solution that fully meets the requirements. Prefer
direct code over unnecessary layers and abstractions. Optimize for ease of
understanding, not the fewest lines. Simplify the implementation, not the
required behavior or safeguards.

## DRY

Keep shared rules in one place. Reuse existing code when it represents the same
rule. Do not merge unrelated logic merely because it looks similar; a little
duplication is better than an abstraction full of exceptions.

## YAGNI

Implement current requirements. Do not add speculative features, configuration,
or extensibility. Add them when a real need appears, not to prepare for an
imagined future.
