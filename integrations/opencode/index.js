import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const skills = [
  {
    id: "vibe-code",
    name: "Vibe Code",
    description: "Apply KISS, DRY, and YAGNI when writing, refactoring, or reviewing production code.",
    url: new URL("../../skills/code/SKILL.md", import.meta.url),
  },
  {
    id: "vibe-tests",
    name: "Vibe Tests",
    description: "Write, refactor, or review meaningful behavioral tests and failure cases; use when adding tests or verifying behavior changes.",
    url: new URL("../../skills/tests/SKILL.md", import.meta.url),
  },
]

export default {
  id: "vibe",
  async setup(ctx) {
    const loaded = []
    for (const { url, ...skill } of skills) {
      const markdown = await readFile(url, "utf8")
      loaded.push({
        ...skill,
        location: fileURLToPath(url),
        content: markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""),
      })
    }

    await ctx.skill.transform((editor) => {
      for (const skill of loaded) editor.add(skill)
    })
  },
}
