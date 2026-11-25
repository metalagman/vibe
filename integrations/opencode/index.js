import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const names = ["vibe-brainstorm", "vibe-code", "vibe-tests"]
const skillsURL = new URL("../../plugins/vibe/skills/", import.meta.url)

function frontmatter(markdown, key) {
  const match = markdown.match(new RegExp(`^---\\r?\\n[\\s\\S]*?^\\s*${key}:\\s*(.+?)\\s*$[\\s\\S]*?^---\\s*$`, "m"))
  return match?.[1]?.replace(/^["']|["']$/g, "")
}

function body(markdown) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
}

export default {
  id: "vibe",
  async setup(ctx) {
    const loaded = await Promise.all(names.map(async (name) => {
      const url = new URL(`${name}/SKILL.md`, skillsURL)
      const markdown = await readFile(url, "utf8")
      return {
        id: name,
        name: frontmatter(markdown, "name") ?? name,
        description: frontmatter(markdown, "description") ?? "",
        location: fileURLToPath(url),
        content: body(markdown),
      }
    }))

    await ctx.skill.transform((editor) => {
      for (const skill of loaded) editor.add(skill)
    })
  },
}
