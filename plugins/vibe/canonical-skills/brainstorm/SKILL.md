---
name: brainstorm
description: Explore an open-ended idea with the user, compare design options, and shape the chosen approach into a design or specification before implementation.
---

# Brainstorm

Start from the decision the user wants to make. For an existing project, inspect the relevant code, docs, and conventions before asking about constraints the project already establishes. If the idea spans independent pieces, identify their dependencies and agree on which piece to explore first.

Ask one consequential question at a time. Prioritize uncertainties about who needs the change, what outcome would count as success, and which constraints could rule out an approach. Offer concrete choices when they make the decision easier.

Compare viable approaches on the trade-offs that matter to this user. Lead with a recommendation and explain what would make another option preferable. When a layout or interaction is easier to judge visually, offer the optional [visual companion](visual-companion.md). If accepted, run its scripts from this skill directory. Use a temporary session unless the user wants to retain mockups in the project.

Present the proposed design at the level needed for a decision. For a software design, trace a representative use case across the relevant components, including important failure behavior and how success could be verified. Invite feedback on consequential choices while they are still easy to change.

For an ideas-only request, finish with the options or recommendation. When the user wants a specification, capture the agreed design in the requested format and location. Check it for contradictions, requirements with multiple plausible interpretations, and additions beyond the agreed scope. Distinguish unresolved decisions from agreed requirements. Confirm the design before moving into any requested implementation.
