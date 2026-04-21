---
description: Architecture overseer agent - reviews completed features for architecture documentation gaps, conflicts, and open questions
---

**ACTION REQUIRED: Spawn a subagent using the Task tool.**

Do NOT review architecture directly. Instead, immediately call the Task tool with:

```
Task(
  subagent_type: "general-purpose",
  description: "Architecture overseer reviewing [feature]",
  prompt: "
    Read and follow the instructions in .claude/agents/architecture-overseer.md

    Requirements folder: $ARGUMENTS

    Your task:
    1. Read .claude/agents/architecture-overseer.md for your role and process
    2. Read $ARGUMENTS/README.md for the feature requirements
    3. Read all docs/requirements/technical-overview/ documents for the current architecture baseline
    4. Read docs/requirements/OPEN-QUESTIONS.md to understand already-registered questions
    5. Read any existing arch-review-NN.md files in $ARGUMENTS/ to understand prior findings
    6. Systematically check against the architecture review checklist
    7. Write arch-review to $ARGUMENTS/arch-review-NN.md (increment NN from last review)
    8. Verdict: APPROVED | CHANGES NEEDED | BLOCKING CONFLICT
  "
)
```

Replace `$ARGUMENTS` with: **$ARGUMENTS**

If `$ARGUMENTS` is empty, stop immediately and tell the user: "A feature folder path is required. Usage: /architecture-overseer docs/requirements/features/[bucket]/[feature-name]"
