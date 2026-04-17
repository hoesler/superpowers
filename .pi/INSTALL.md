# Installing Superpowers for Pi

## Prerequisites

- [Pi coding agent](https://github.com/badlogic/pi-mono) installed

## Installation

Install superpowers as a pi package:

```bash
pi install git:github.com/obra/superpowers
```

That's it. Pi auto-discovers skills, prompts, and agents from the package.

Verify by asking: "Tell me about your superpowers"

## Usage

Skills are discovered automatically. Pi activates them when:
- You invoke a skill with `/skill:name` (e.g., `/skill:brainstorming`)
- The task matches a skill's description and the agent loads it via `read`
- The `using-superpowers` skill directs the agent to load one

### Listing Skills

In Pi, type `/` to see all available commands, including skill commands like `/skill:brainstorming`.

## Updating

```bash
pi update
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

### Tool mapping

When skills reference Claude Code tools, use pi equivalents:
- `Skill` tool → `read` on SKILL.md or `/skill:name`
- `TodoWrite` → write a TODO.md file
- `Task` (subagent) → `subagent` tool
- `Read`, `Write`, `Edit`, `Bash` → same names in pi

See `skills/using-superpowers/references/pi-tools.md` for the full mapping.

## Getting Help

- Report issues: https://github.com/obra/superpowers/issues
- Full documentation: https://github.com/obra/superpowers/blob/main/docs/README.pi.md
