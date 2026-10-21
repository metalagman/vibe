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

test("registers both bundled Vibe skills for OpenCode v2", async () => {
  const { default: plugin } = await import(pathToFileURL(entrypoint))
  const registered = []
  await plugin.setup(skillEditor(registered))

  assert.equal(plugin.id, "vibe")
  assert.deepEqual(registered.map(({ id, name }) => ({ id, name })), [
    { id: "vibe-code", name: "Vibe Code" },
    { id: "vibe-tests", name: "Vibe Tests" },
  ])
  for (const [index, id] of ["code", "tests"].entries()) {
    const skillFile = resolve(`skills/${id}/SKILL.md`)
    const markdown = await readFile(skillFile, "utf8")
    const body = markdown.slice(markdown.indexOf("\n---\n") + 5)
    assert.equal(registered[index].location, skillFile)
    assert.equal(registered[index].content, body)
  }
})

for (const missing of ["code", "tests"]) {
  test(`rejects a missing ${missing} asset before registering either skill`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "vibe-opencode-"))
    try {
      const moduleDirectory = join(directory, "integrations/opencode")
      await mkdir(moduleDirectory, { recursive: true })
      const isolatedEntry = join(moduleDirectory, "index.mjs")
      await copyFile(entrypoint, isolatedEntry)
      const present = missing === "code" ? "tests" : "code"
      const skillDirectory = join(directory, "skills", present)
      await mkdir(skillDirectory, { recursive: true })
      await copyFile(resolve(`skills/${present}/SKILL.md`), join(skillDirectory, "SKILL.md"))
      const { default: plugin } = await import(pathToFileURL(isolatedEntry))
      const registered = []
      await assert.rejects(plugin.setup(skillEditor(registered)), {
        code: "ENOENT",
        path: join(directory, "skills", missing, "SKILL.md"),
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
    for (const [name, newline] of [["code", "\n"], ["tests", "\r\n"]]) {
      const skillDirectory = join(directory, "skills", name)
      await mkdir(skillDirectory, { recursive: true })
      await writeFile(join(skillDirectory, "SKILL.md"),
        ["---", `name: ${name}`, "description: Fixture guidance.", "---", `# ${name} fixture`, ""].join(newline))
    }
    const { default: plugin } = await import(pathToFileURL(isolatedEntry))
    const registered = []
    await plugin.setup(skillEditor(registered))
    assert.deepEqual(registered.map(({ content }) => content), ["# code fixture\n", "# tests fixture\r\n"])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
