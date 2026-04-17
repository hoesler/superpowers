/**
 * Superpowers extension for Pi coding agent.
 *
 * Injects the using-superpowers skill content into the system prompt on the
 * first agent turn, replicating the Claude Code session-start hook behavior.
 * This ensures the agent always knows about superpowers skills and follows
 * the skill-checking discipline from the very first interaction.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the plugin root relative to this extension file.
// Extension lives at <root>/.pi/extensions/superpowers.ts, so root is two levels up.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_ROOT = join(__dirname, "..", "..");

/**
 * Strip YAML frontmatter from a skill file, returning only the body content.
 */
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

export default function (pi: ExtensionAPI) {
  let injected = false;

  pi.on("session_start", async () => {
    // Reset injection flag on new/resumed sessions so the bootstrap
    // is re-injected on the first turn of each session.
    injected = false;
  });

  pi.on("before_agent_start", async (event) => {
    // Only inject once per session — the skill content is static and
    // doesn't need to be repeated on every turn.
    if (injected) return;
    injected = true;

    const skillPath = join(PLUGIN_ROOT, "skills", "using-superpowers", "SKILL.md");
    if (!existsSync(skillPath)) return;

    const fullContent = readFileSync(skillPath, "utf8");
    const skillBody = stripFrontmatter(fullContent);

    const toolMapping = `**Tool Mapping for Pi:**
When skills reference Claude Code tools, use Pi equivalents:
- \`Skill\` tool → use \`read\` on the skill's SKILL.md file, or invoke \`/skill:name\`
- \`TodoWrite\` → write a TODO.md file (no built-in equivalent)
- \`Task\` tool (subagent dispatch) → \`subagent\` tool (supports single, parallel, and chain modes)
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → \`read\`, \`write\`, \`edit\`, \`bash\` (same names)
- \`Grep\` / \`Glob\` → use \`bash\` with \`rg\`/\`grep\` or \`find\`

See the full mapping in \`skills/using-superpowers/references/pi-tools.md\`.`;

    const bootstrap = `\n\n<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED — you are currently following it. Do NOT use the read tool to load "using-superpowers" again — that would be redundant.**

${skillBody}

${toolMapping}
</EXTREMELY_IMPORTANT>`;

    return {
      systemPrompt: event.systemPrompt + bootstrap,
    };
  });
}
