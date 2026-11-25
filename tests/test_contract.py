import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins" / "vibe"
CANONICAL = PLUGIN / "canonical-skills"
PORTABLE = PLUGIN / "skills"
NAMES = ["brainstorm", "code", "tests"]
VERSION = "0.5.0"
DESCRIPTION = (
    "Explore designs, write simpler code with KISS, DRY, and YAGNI, "
    "and verify behavior with meaningful tests."
)


def skill_name(path):
    text = path.read_text()
    match = re.search(r"^name:\s*([^\n]+)$", text, re.MULTILINE)
    if not match:
        raise AssertionError(f"missing name in {path}")
    return match.group(1).strip().strip("\"'")


def normalized_skill(path):
    return re.sub(
        r"^name:\s*[^\n]+$",
        "name: __SKILL__",
        path.read_text(),
        count=1,
        flags=re.MULTILINE,
    )


class ContractTest(unittest.TestCase):
    def test_expected_skill_names(self):
        self.assertEqual(
            sorted(path.name for path in CANONICAL.iterdir()),
            NAMES,
        )
        self.assertEqual(
            sorted(path.name for path in PORTABLE.iterdir()),
            [f"vibe-{name}" for name in NAMES],
        )
        self.assertFalse((ROOT / "skills").exists())

    def test_canonical_and_portable_parity(self):
        for name in NAMES:
            canonical = CANONICAL / name
            portable = PORTABLE / f"vibe-{name}"
            canonical_files = {
                path.relative_to(canonical)
                for path in canonical.rglob("*")
                if path.is_file()
                and path.relative_to(canonical) != Path("agents/openai.yaml")
            }
            portable_files = {
                path.relative_to(portable)
                for path in portable.rglob("*")
                if path.is_file()
            }
            self.assertEqual(canonical_files, portable_files, name)
            for relative in canonical_files:
                left = canonical / relative
                right = portable / relative
                if relative == Path("SKILL.md"):
                    self.assertEqual(normalized_skill(left), normalized_skill(right), name)
                else:
                    self.assertEqual(left.read_bytes(), right.read_bytes(), relative)
            self.assertEqual(skill_name(canonical / "SKILL.md"), name)
            self.assertEqual(skill_name(portable / "SKILL.md"), f"vibe-{name}")

    def test_local_markdown_links_resolve(self):
        link = re.compile(r"(?<!!)\[[^]]*\]\(([^)]+)\)")
        for markdown in PLUGIN.rglob("*.md"):
            for target in link.findall(markdown.read_text()):
                target = target.split("#", 1)[0]
                if not target or "://" in target or target.startswith(("mailto:", "#")):
                    continue
                self.assertTrue(
                    (markdown.parent / target).resolve().is_file(),
                    f"{markdown}: {target}",
                )

    def test_codex_ui_metadata(self):
        for name in NAMES:
            path = CANONICAL / name / "agents" / "openai.yaml"
            text = path.read_text()
            self.assertRegex(text, r"(?m)^interface:\s*$")
            self.assertRegex(text, r"(?m)^  display_name:\s*\S")
            description = re.search(
                r"(?m)^  short_description:\s*[\"'](.+)[\"']$", text
            )
            self.assertIsNotNone(description, path)
            self.assertGreaterEqual(len(description.group(1)), 25)
            self.assertLessEqual(len(description.group(1)), 64)
            self.assertIn(f"$vibe:{name}", text)

    def test_agent_plugins_manifest(self):
        manifest = json.loads((PLUGIN / "plugin.json").read_text())
        allowed = {
            "$schema", "name", "version", "description", "author",
            "homepage", "repository", "license", "keywords", "extensions",
        }
        self.assertLessEqual(set(manifest), allowed)
        self.assertEqual(
            manifest["$schema"],
            "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
        )
        self.assertEqual(manifest["name"], "vibe")
        self.assertEqual(manifest["version"], VERSION)
        self.assertEqual(manifest["description"], DESCRIPTION)
        self.assertEqual(manifest["license"], "MIT")
        self.assertNotIn("skills", manifest)
        self.assertFalse((ROOT / "plugin.json").exists())

    def test_host_manifests_and_paths(self):
        paths = {
            "codex": PLUGIN / ".codex-plugin" / "plugin.json",
            "claude": PLUGIN / ".claude-plugin" / "plugin.json",
            "grok": PLUGIN / ".grok-plugin" / "plugin.json",
        }
        documents = {name: json.loads(path.read_text()) for name, path in paths.items()}
        self.assertEqual({doc["version"] for doc in documents.values()}, {VERSION})
        self.assertEqual({doc["description"] for doc in documents.values()}, {DESCRIPTION})
        self.assertEqual(documents["codex"]["skills"], "./canonical-skills/")
        self.assertEqual(documents["claude"]["skills"], "./canonical-skills/")
        self.assertEqual(documents["grok"]["skills"], "./skills/")
        self.assertFalse((PLUGIN / ".plugin" / "plugin.json").exists())
        self.assertFalse((PLUGIN / ".cursor-plugin" / "plugin.json").exists())

    def test_marketplaces_are_aligned(self):
        paths = [
            ROOT / ".agents" / "plugins" / "marketplace.json",
            ROOT / ".claude-plugin" / "marketplace.json",
            ROOT / ".cursor-plugin" / "marketplace.json",
            ROOT / ".github" / "plugin" / "marketplace.json",
            ROOT / ".grok-plugin" / "marketplace.json",
        ]
        documents = [json.loads(path.read_text()) for path in paths]
        for document in documents:
            self.assertEqual(document["name"], "vibe")
            self.assertEqual(len(document["plugins"]), 1)
            plugin = document["plugins"][0]
            self.assertEqual(plugin["name"], "vibe")
            source = plugin["source"]
            if isinstance(source, dict):
                self.assertEqual(source, {"source": "local", "path": "./plugins/vibe"})
            else:
                self.assertEqual(source, "./plugins/vibe")
            if "version" in plugin:
                self.assertEqual(plugin["version"], VERSION)
            if "description" in plugin:
                self.assertEqual(plugin["description"], DESCRIPTION)
        for document in documents:
            metadata = document.get("metadata", {})
            if "version" in metadata:
                self.assertEqual(metadata["version"], VERSION)
        self.assertEqual(
            documents[0]["plugins"][0]["policy"],
            {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
        )

    def test_package_inventory(self):
        package = json.loads((ROOT / "package.json").read_text())
        self.assertEqual(package["version"], VERSION)
        self.assertEqual(
            package["files"],
            ["integrations/opencode/index.js", "plugins/vibe/skills/", "LICENSE", "README.md"],
        )
        result = subprocess.run(
            ["npm", "pack", "--dry-run", "--ignore-scripts", "--json"],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        packed = json.loads(result.stdout)[0]["files"]
        actual = {item["path"] for item in packed}
        expected = {
            "LICENSE", "README.md", "package.json", "integrations/opencode/index.js",
            *{
                str(path.relative_to(ROOT))
                for path in PORTABLE.rglob("*")
                if path.is_file()
            },
        }
        self.assertEqual(actual, expected)
        self.assertFalse(any("canonical-skills" in path for path in actual))


if __name__ == "__main__":
    unittest.main()
