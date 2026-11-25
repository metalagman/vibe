import test from "node:test"
import assert from "node:assert/strict"
import { readFile, copyFile, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

const entrypoint = resolve("integrations/opencode/index.js")

function skillEditor(registered) {
  return {
    skill: {
      async transform(callback) {
        callback({ add(skill) { registered.push(skill) } })
      },
    },
  }
}

test("registers all bundled Vibe skills for OpenCode v2", async () => {
  const { default: plugin } = await import(pathToFileURL(entrypoint))
  const registered = []
  await plugin.setup(skillEditor(registered))

  assert.equal(plugin.id, "vibe")
  assert.deepEqual(registered.map(({ id, name }) => ({ id, name })), [
    { id: "vibe-brainstorm", name: "vibe-brainstorm" },
    { id: "vibe-code", name: "vibe-code" },
    { id: "vibe-tests", name: "vibe-tests" },
  ])
  for (const [index, id] of ["vibe-brainstorm", "vibe-code", "vibe-tests"].entries()) {
    const skillFile = resolve(`plugins/vibe/skills/${id}/SKILL.md`)
    const markdown = await readFile(skillFile, "utf8")
    const body = markdown.slice(markdown.indexOf("\n---\n") + 5)
    assert.equal(registered[index].location, skillFile)
    assert.equal(registered[index].content, body)
  }
})

for (const missing of ["vibe-brainstorm", "vibe-code", "vibe-tests"]) {
  test(`rejects a missing ${missing} asset before registering any skill`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "vibe-opencode-"))
    try {
      const moduleDirectory = join(directory, "integrations/opencode")
      await mkdir(moduleDirectory, { recursive: true })
      const isolatedEntry = join(moduleDirectory, "index.mjs")
      await copyFile(entrypoint, isolatedEntry)
      for (const present of ["vibe-brainstorm", "vibe-code", "vibe-tests"].filter(name => name !== missing)) {
        const skillDirectory = join(directory, "plugins/vibe/skills", present)
        await mkdir(skillDirectory, { recursive: true })
        await copyFile(resolve(`plugins/vibe/skills/${present}/SKILL.md`), join(skillDirectory, "SKILL.md"))
      }
      const { default: plugin } = await import(pathToFileURL(isolatedEntry))
      const registered = []
      await assert.rejects(plugin.setup(skillEditor(registered)), {
        code: "ENOENT",
        path: join(directory, "plugins/vibe/skills", missing, "SKILL.md"),
      })
      assert.deepEqual(registered, [])
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })
}

test("loads module-relative skill bodies without YAML frontmatter", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vibe-opencode-"))
  try {
    const moduleDirectory = join(directory, "integrations/opencode")
    await mkdir(moduleDirectory, { recursive: true })
    const isolatedEntry = join(moduleDirectory, "index.mjs")
    await copyFile(entrypoint, isolatedEntry)
    for (const [name, newline] of [["vibe-brainstorm", "\n"], ["vibe-code", "\r\n"], ["vibe-tests", "\n"]]) {
      const skillDirectory = join(directory, "plugins/vibe/skills", name)
      await mkdir(skillDirectory, { recursive: true })
      await writeFile(join(skillDirectory, "SKILL.md"),
        ["---", `name: ${name}`, "description: Fixture guidance.", "---", `# ${name} fixture`, ""].join(newline))
    }
    const { default: plugin } = await import(pathToFileURL(isolatedEntry))
    const registered = []
    await plugin.setup(skillEditor(registered))
    assert.deepEqual(registered.map(({ content }) => content), ["# vibe-brainstorm fixture\n", "# vibe-code fixture\r\n", "# vibe-tests fixture\n"])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
