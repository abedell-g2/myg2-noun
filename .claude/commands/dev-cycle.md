---
description: Orchestrates the development cycle - developer implements, reviewer critiques, repeat until done
---

# Development Cycle Orchestrator

You are orchestrating a **development cycle** between a Developer agent and a Code Reviewer agent. Your job is to manage the back-and-forth until the implementation is complete and approved.

## The Cycle

```
┌─────────────────┐
│   Requirements  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Developer    │◄──────────────────────┐
│   Implements    │◄──────────────┐       │
└────────┬────────┘               │       │
         │                        │       │
         ▼                        │       │
┌─────────────────┐               │       │
│    Reviewer     │               │       │
│    Critiques    │               │       │
└────────┬────────┘               │       │
         │                        │       │
         ▼                        │       │
    ┌─────────┐                   │       │
    │Approved?│──── No ───────────┘       │
    └────┬────┘                           │
         │ Yes                            │
         ▼                                │
┌─────────────────┐                       │
│  Architecture   │                       │
│    Overseer     │                       │
└────────┬────────┘                       │
         │                                │
         ├── BLOCKING CONFLICT ──► escalate to user (stop)
         │
         ├── CHANGES NEEDED ─────────────┘
         │
         │ APPROVED
         ▼
┌─────────────────┐
│  Move folder →  │
│  completed/     │
│  Open PR        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      Done       │
└─────────────────┘
```

## Agent Instructions

- Developer: `.claude/agents/dev.md`
- Reviewer: `.claude/agents/reviewer.md`

## Your Process

### Phase 0: Pre-Flight Check

1. Confirm the feature folder is located at `docs/requirements/features/ready-to-implement/[feature-name]`.
   - If it is in `docs/requirements/features/todo/`, **stop immediately** and ask the user: "This feature is still in `todo/`. The spec may not be complete. Please confirm the spec is ready (full requirements, acceptance criteria, no blocking open questions) before proceeding."
   - If it is in `docs/requirements/features/completed/`, **stop** — this feature is already done.
   - If the path passed as `$ARGUMENTS` does not start with `docs/requirements/features/ready-to-implement/`, warn the user and ask them to confirm the correct path.
2. Check for any blocking open questions in the feature README (`- [ ]` items in the **Open Questions** section). If blocking questions exist, stop and ask the user to resolve them first.

### Phase 1: Setup
1. Read the requirements from: **$ARGUMENTS/README.md**
2. Understand what needs to be built
3. **Create feature branch** (if not already on one):
   ```bash
   # Extract feature name from path (e.g., "jaja-bot" from "docs/requirements/jaja-bot")
   git checkout -b feature/[feature-name]
   ```
4. Review any existing task files and review files in **$ARGUMENTS/**

### Phase 2: Development Loop

**For each iteration:**

1. **Invoke Developer Agent**
   Use the Task tool:
   ```
   Task(
     subagent_type: "general-purpose",
     prompt: "
       Read and follow .claude/agents/dev.md

       Requirements folder: $ARGUMENTS
       Previous reviewer feedback: [paste feedback if any, or 'None - first iteration']

       Implement the next increment using TDD.
       Report what you built when done.
     "
   )
   ```

2. **Invoke Reviewer Agent**
   Use the Task tool:
   ```
   Task(
     subagent_type: "general-purpose",
     prompt: "
       Read and follow .claude/agents/reviewer.md

       Requirements folder: $ARGUMENTS

       Review the branch changes (git diff main...HEAD -- . ':!.entire').
       Provide structured feedback with verdict: APPROVE or REQUEST CHANGES
     "
   )
   ```

3. **Evaluate**
   - Read the latest `$ARGUMENTS/review-NN.md` for the verdict
   - If APPROVE: Note that it is approved, but check for non-critical suggestions
     - if there are any suggestions, send it back to the developer to evaluate
     - otherwise move to Finalization
   - If REQUEST CHANGES: Loop back to developer (they'll read the review file)

### Phase 3: Finalization

1. Run final test suite (both unit and e2e):
   ```bash
   npm test
   npm run test:e2e
   ```
   Both must pass before proceeding. If e2e tests fail, send back to the developer to fix.
2. Run linting/formatting
3. **Spawn Architecture Overseer** — after reviewer approves, invoke the architecture overseer against the feature folder:
   ```
   Task(
     subagent_type: "general-purpose",
     prompt: "
       Read and follow .claude/agents/architecture-overseer.md

       Requirements folder: $ARGUMENTS

       Review this completed feature for architecture documentation gaps, conflicts, and open questions.
     "
   )
   ```
   - Read the resulting `$ARGUMENTS/arch-review-NN.md` for the verdict.
   - If **BLOCKING CONFLICT**: do not proceed — escalate to the user immediately. Do not open a PR until the conflict is resolved.
   - If **CHANGES NEEDED**: delegate remediation to the developer agent (technical-overview edits, OPEN-QUESTIONS.md updates), then re-run the architecture overseer. Repeat until APPROVED.
   - If **APPROVED**: continue to Phase 4.
4. **Extract open questions**: delegate to the developer agent to ensure that any unresolved `- [ ]` items from the feature README's **Open Questions** section are registered in `docs/requirements/OPEN-QUESTIONS.md`. This is the point in the lifecycle where they risk being permanently lost — do not skip this step. Use the same Task tool invocation pattern as other developer agent delegation in Phase 2, instructing the developer to scan the feature README's Open Questions section and add any unregistered items to `docs/requirements/OPEN-QUESTIONS.md`.
5. Summarize what was built
6. Suggest commit message

### Phase 4: PR

1. **Move feature folder from `ready-to-implement/` to `completed/`** — commit this move onto the PR branch before opening the PR:
   ```bash
   # Extract feature name from $ARGUMENTS path
   git mv docs/requirements/features/ready-to-implement/[feature-name] docs/requirements/features/completed/[feature-name]
   git add docs/requirements/features/
   git commit -m "docs: move [feature-name] to completed/ [NO-JIRA]"
   ```
   The folder must be in `completed/` at the point of merge — not after. The PR itself carries this commit.
2. Open the PR:
   ```bash
   gh pr create --title "[description] [NO-JIRA]" --body "..."
   ```
3. The feature folder in `completed/` is now **immutable**. Any issues discovered after merge must be addressed by creating a new feature spec in `docs/requirements/features/todo/`.

## Iteration Limits

- Maximum 5 iterations before escalating to user
- If stuck in a loop, ask for human guidance

## Communication

After each iteration, report to the user:
- What the developer implemented
- What the reviewer found
- Current status (continuing / approved / needs help)

## Your Task

Begin the development cycle for: **$ARGUMENTS**

`$ARGUMENTS` should be a path to a requirements folder (e.g., `docs/requirements/jaja-bot`).

**Start immediately by:**
1. **Running Phase 0 pre-flight check** — confirm the feature is in `features/ready-to-implement/`
2. Reading `$ARGUMENTS/README.md` for requirements
3. Checking for existing task/review files in `$ARGUMENTS/`
4. Creating feature branch: `git checkout -b feature/[name]`
5. **Spawning the developer subagent using the Task tool** (do not implement directly - delegate to subagent)

**IMPORTANT:** You are the orchestrator. You MUST use the Task tool to spawn developer and reviewer subagents. Do not implement or review code yourself - delegate to the specialized agents.
