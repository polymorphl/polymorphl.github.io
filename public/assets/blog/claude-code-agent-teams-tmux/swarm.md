# /swarm

Orchestrate a multi-agent development swarm using Claude Code's native teammate mode.

Usage: `/swarm <task description>`

Examples:
- `/swarm add user authentication with JWT`
- `/swarm fix the pagination bug on the /users endpoint`
- `/swarm refactor the payment module to use the new Stripe SDK`

---

## Your role

You are the PM. Execute every step below using the Bash tool directly.
Never print shell commands for the user to run — run them yourself.

---

## Step 1 — Bootstrap

```bash
mkdir -p .swarm/plans .swarm/contracts .swarm/reviews .swarm/docs .swarm/status
echo "idle" | tee .swarm/status/backend.status .swarm/status/frontend.status .swarm/status/qa.status .swarm/status/doc.status > /dev/null
```

---

## Step 2 — PM Analysis

Read `CLAUDE.md` for project context (stack, conventions, structure).
Fall back to `README.md` or `package.json` if not available.

Analyze `$ARGUMENTS` and write a plan via Bash to `.swarm/plans/task-<timestamp>.md`:

```markdown
## Task: <title>
**Type:** feature | bug fix | refactoring

### Context
<what exists, what needs to change, why>

### Scope — files each agent must read (and ONLY these)

**@backend-dev reads:**
- <exact file paths>

**@frontend-dev reads:**
- <exact file paths>

**@qa reads:**
- <exact file paths>

**@doc reads:**
- <exact file paths>

### Backend
- [ ] <subtask>

### Frontend
- [ ] <subtask> (depends on: backend contract)

### QA
- [ ] <test case>

### Doc
- [ ] <what to document>

### Risks / Questions
<blockers, ambiguities, assumptions>
```

To build the scope, run a targeted search via Bash — do not read files speculatively:

```bash
# Find relevant files by name or pattern
grep -rl "<keyword>" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".swarm"
```

Present the plan to the user and ask:
> "Does this plan look right? Reply **yes** to launch the agents, or tell me what to adjust."

**Stop here and wait for confirmation. Do not proceed to Step 3 until the user replies yes.**

---

## Step 3 — Spawn agents

After the user confirms, spawn the agents using the `@agent-name` syntax so Claude Code
assigns the correct pane titles automatically.

First, write scoped instructions for each agent into their status files via Bash.
Be explicit about which files to read — agents must not explore beyond this list:

```bash
cat > .swarm/status/backend.status << 'INSTRUCTIONS'
Read ONLY these files: <file list from scope>
Task: <specific instructions>
Write API contract to .swarm/contracts/contract-<timestamp>.md when done.
Last action: update this file → "done: <summary>"
INSTRUCTIONS

cat > .swarm/status/frontend.status << 'INSTRUCTIONS'
Wait until .swarm/status/backend.status contains "done".
Read ONLY these files: <file list from scope> + .swarm/contracts/ (latest)
Task: <specific instructions>
Last action: update this file → "done: <summary>"
INSTRUCTIONS

cat > .swarm/status/doc.status << 'INSTRUCTIONS'
Wait until .swarm/status/backend.status contains "done".
Read ONLY these files: <file list from scope> + .swarm/contracts/ (latest)
Task: <specific instructions>
Last action: update this file → "done: <summary>"
INSTRUCTIONS

cat > .swarm/status/qa.status << 'INSTRUCTIONS'
Wait until backend.status AND frontend.status both contain "done".
Read ONLY these files: <file list from scope> + .swarm/contracts/ (latest)
Task: <specific test cases>
Write report to .swarm/reviews/review-<timestamp>.md — ✅ PASS | ⚠️ ISSUES | ❌ FAIL
Last action: update this file → "done: <summary>"
INSTRUCTIONS
```

Then spawn agents with minimal messages — they read their full instructions from the status files.
Use the appropriate model per agent to control token cost:

```
@backend-dev (sonnet) — Read your instructions in .swarm/status/backend.status and start.
@frontend-dev (sonnet) — Read your instructions in .swarm/status/frontend.status and start.
@doc (haiku) — Read your instructions in .swarm/status/doc.status and start.
@qa (haiku) — Read your instructions in .swarm/status/qa.status and start.
```

Model guidelines:
- backend/frontend: sonnet (complex reasoning, type safety, architecture)
- doc/qa: haiku by default (mechanical tasks) — upgrade qa to sonnet if test surface is large

---

## Step 4 — If QA returns ISSUES or FAIL

Read the QA report in `.swarm/reviews/`, then re-spawn only the affected agent(s):

```
@backend-dev — Fix the following issues reported by QA: <list from report>
Update .swarm/status/backend.status → "done: fixed <summary>" when done.

@qa — Re-run your checks once backend/frontend confirm fixes are done.
Write a new report to .swarm/reviews/review-<timestamp>.md.
```