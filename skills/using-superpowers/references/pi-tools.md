# Pi Tool Mapping

Skills use Claude Code tool names. When you encounter these in a skill, use your platform equivalent:

| Skill references | Pi equivalent |
|-----------------|---------------|
| `Read` (file reading) | `read` |
| `Write` (file creation) | `write` |
| `Edit` (file editing) | `edit` |
| `Bash` (run commands) | `bash` |
| `Grep` (search file content) | `bash` with `rg` or `grep` |
| `Glob` (search files by name) | `bash` with `find` |
| `Skill` tool (invoke a skill) | `read` on the skill's SKILL.md, or `/skill:name` command |
| `TodoWrite` (task tracking) | No built-in equivalent — write a TODO.md file |
| `Task` tool (dispatch subagent) | `subagent` tool (see [Subagent dispatch](#subagent-dispatch)) |
| Multiple `Task` calls (parallel) | `subagent` with `tasks` array for parallel execution |
| `WebSearch` | `web_search` (if available via extensions) |
| `WebFetch` | `fetch_content` (if available via extensions) |
| `EnterPlanMode` / `ExitPlanMode` | No equivalent — pi has no plan mode by default |

## Subagent dispatch

Pi's `subagent` tool supports three modes:

| Mode | Usage |
|------|-------|
| **single** | `subagent` with `agent` + `task` — dispatch one agent |
| **parallel** | `subagent` with `tasks` array — dispatch multiple independent agents |
| **chain** | `subagent` with `chain` array — sequential execution with `{previous}` placeholder |

When a skill says to dispatch a named agent type (e.g., `superpowers:code-reviewer`):

1. Read the agent's prompt file (e.g., `agents/code-reviewer.md`)
2. Fill any template placeholders
3. Use `subagent` with the filled content as the `task`

## Additional Pi tools

These tools may be available depending on configuration and installed extensions:

| Tool | Purpose |
|------|---------|
| `web_search` | Search the web (requires extension or built-in depending on setup) |
| `fetch_content` | Fetch URL content as markdown |
| `code_search` | Search for code examples and documentation |

## Pi skill loading

Pi discovers skills automatically at startup from:
- `~/.pi/agent/skills/` (global)
- `~/.agents/skills/` (global)
- `.pi/skills/` (project)
- `.agents/skills/` (project, walks up to repo root)
- Installed pi packages

Skills register as `/skill:name` commands. Use `/skill:brainstorming` to explicitly load a skill.

Pi loads only skill names and descriptions into the system prompt. The full skill content is loaded on-demand when the agent uses `read` on the SKILL.md file.
