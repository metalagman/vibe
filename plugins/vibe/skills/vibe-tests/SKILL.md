---
name: vibe-tests
description: Write, refactor, or review meaningful behavioral tests and failure cases; use when adding tests or verifying behavior changes.
---

# Vibe Tests

Test observable behavior and meaningful failure cases, not implementation
structure. For each test, identify the behavioral error it would catch; do not
add tests merely to increase their number.

Before changing behavior, use an existing test or write the smallest necessary
behavioral test. Observe the expected failure before implementing the change,
then confirm it passes. Do not backfill tests from the new implementation.
If meaningful automation is not possible, explain why and verify the behavior
directly instead of inventing a structural test.

Do not search source code for strings or symbols as a proxy for behavior.
Exact-string assertions are appropriate when the string itself is part of
supported behavior. When removing functionality, remove tests belonging only
to the old contract; do not add tests merely proving the old code stays absent.
Test rejection of old inputs only when rejection is a current requirement.
