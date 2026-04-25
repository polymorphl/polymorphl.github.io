---
name: adr-guard
description: Use when finishing a feature, reviewing code, or before committing in the project — verifies compliance with Architecture Decision Records (ADRs) by checking code patterns, import rules, type conventions, and structural invariants
---

# ADR Guard

Generic ADR compliance checker. Each ADR in `docs/adr/` owns its own verification rules via a `## Verification` section.

## When to Use

- After a significant implementation session
- When uncertain about a convention

## Process

1. **Discover** all ADRs:
   ```bash
   ls docs/adr/*.md | grep -v README
   ```
2. **For each ADR**: read the file and locate its `## Verification` section.
3. **Run** every bash command found in that section.
4. **Flag** violations as described in the ADR.
5. **Produce** the compliance report below.

## Compliance Report

One line per ADR, sorted by file name:

```
<adr-slug>  ✓ pass
<adr-slug>  ✗ N violations — <short description>
<adr-slug>  ✓ (manual — no automated check)
```

## Updating ADRs

When an architectural decision changes:
1. Update the relevant ADR in `docs/adr/`
2. Update or add its `## Verification` section
3. Propose a new ADR for significantly new decisions


