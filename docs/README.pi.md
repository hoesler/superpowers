# Superpowers for Pi

Complete guide for using Superpowers with [Pi](https://github.com/badlogic/pi-mono), the minimal terminal coding harness.

## Installation

Install superpowers as a pi package:

```bash
pi install git:github.com/obra/superpowers
```

Pi auto-discovers the skills directory from the package. No symlinks or manual configuration needed.

Verify by asking: "Tell me about your superpowers"

## Usage

### Finding Skills

Skills register as `/skill:name` commands. Type `/skill:` to see all available superpowers skills.

### Loading a Skill

```
/skill:brainstorming
```

Or ask the agent to use a skill:

```
Use the brainstorming skill to help me design a new feature
```

### Personal Skills

Create your own skills in `~/.pi/agent/skills/`:

```bash
mkdir -p ~/.pi/agent/skills/my-skill
```

Create `~/.pi/agent/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

### Project Skills

Create project-specific skills in `.pi/skills/` or `.agents/skills/` within your project.

**Skill Priority:** Project skills > Personal skills > Package skills (superpowers)

## How It Works

Pi packages are installed via `pi install` and stored in `~/.pi/agent/git/`. Pi's package system auto-discovers skills and extensions from the package via the `pi` key in `package.json`.

### Session Start Bootstrap

Superpowers includes a pi extension (`extensions/superpowers.ts`) that replicates the Claude Code session-start hook. On the first agent turn of each session, it:

1. Reads the full `using-superpowers` skill content
2. Appends it to the system prompt with pi-specific tool mapping
3. Ensures the agent knows about superpowers skills from the very first interaction

This means the agent automatically checks for relevant skills before every task — the same behavior as in Claude Code.

At startup, pi also scans all skill locations, extracts names and descriptions from SKILL.md frontmatter, and includes them in the system prompt as available skills. When a task matches a skill's description, the agent loads the full content on-demand using the `read` tool.

### Tool Mapping

Pi's built-in tools closely match Claude Code's:

| Claude Code | Pi |
|-------------|-----|
| `Read` | `read` |
| `Write` | `write` |
| `Edit` | `edit` |
| `Bash` | `bash` |
| `Skill` | `read` on SKILL.md or `/skill:name` |
| `TodoWrite` | Write a TODO.md file |
| `Task` (subagent) | `subagent` tool |

See `skills/using-superpowers/references/pi-tools.md` for the complete mapping.

### Subagent Support

Pi has a `subagent` tool that supports single, parallel, and chained dispatch. This enables full use of skills like `subagent-driven-development` and `dispatching-parallel-agents`.

### What's Not Available

- **Plan mode** — Pi doesn't have a built-in plan mode. Skills that reference `EnterPlanMode` should write plans to files instead.
- **TodoWrite** — No built-in task tracking. Use a TODO.md file or a similar approach.

These can be added via pi extensions if needed.

## Updating

```bash
pi update
```

Or update just superpowers:

```bash
pi update git:github.com/obra/superpowers
```

To pin a specific version:

```bash
pi install git:github.com/obra/superpowers@v5.0.7
```

## Uninstalling

```bash
pi remove git:github.com/obra/superpowers
```

## Troubleshooting

### Skills not showing up

1. Run `pi list` to verify superpowers is installed
2. Restart pi — skills are discovered at startup
3. Use `/reload` to reload skills without restarting

### Skills not activating automatically

The `using-superpowers` skill instructs the agent to check for relevant skills before any task. If skills aren't activating:

1. Check that `using-superpowers` appears in pi's startup header
2. Try explicitly loading it: `/skill:using-superpowers`
3. Make sure skill commands are enabled in settings (`enableSkillCommands: true`)

### Subagent skills not working

The `subagent` tool availability depends on your pi setup. If `subagent-driven-development` or `dispatching-parallel-agents` skills can't dispatch subagents, the agent should fall back to `executing-plans` for single-session execution.

## Getting Help

- Report issues: https://github.com/obra/superpowers/issues
- Main documentation: https://github.com/obra/superpowers
- Pi documentation: https://github.com/badlogic/pi-mono
