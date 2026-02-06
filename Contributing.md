# Contributing

Thanks for contributing! This repo aims to stay boring-in-a-good-way: predictable branches, clean commits, and easy reviews.

## Table of contents

- [Development workflow](#development-workflow)
- [Branching convention](#branching-convention)
- [Commit message convention](#commit-message-convention)
- [Pull request guidelines](#pull-request-guidelines)

---

## Development workflow

1. Pick/create an issue (or create one if it doesn’t exist).
2. Create a branch from `main` using the conventions below.
3. Commit frequently with clear messages (see commit rules).
4. Open a PR early (draft is fine) to get feedback.
5. Ensure CI passes and the PR description is complete.
6. Squash or rebase as required by the repo’s merge strategy.

---

## Branching convention

### Branch types

Create branches from `main` (unless noted otherwise) using:

- **Features:** `feature/<issue-id>-<short-slug>`
- **Fixes:** `fix/<issue-id>-<short-slug>`
- **Chores / maintenance:** `chore/<issue-id>-<short-slug>`
- **Docs only:** `docs/<issue-id>-<short-slug>`
- **Experiments / spikes:** `spike/<issue-id>-<short-slug>`
- **Releases (optional):** `release/<version>`
- **Hotfixes (from `main` or `release/*`):** `hotfix/<issue-id>-<short-slug>`

**Rules**
- Use **lowercase** and **kebab-case** for slugs.
- Prefer **short**, descriptive slugs (2–6 words).
- Always include an issue/ticket id when possible.

**Examples**
- `feature/JIRA-214-add-audio-capture`
- `fix/JIRA-301-null-pointer-on-sync`
- `chore/OPS-18-upgrade-node-versions`
- `docs/DOCS-7-update-readme`
- `spike/JIRA-999-evaluate-rag-libraries`
- `release/1.6.0`
- `hotfix/JIRA-322-fix-login-redirect`

### Long-lived branches

- `main` — always deployable, protected branch.
- `release/*` — optional stabilization branches when doing timed releases.
- Avoid additional long-lived branches unless there’s a strong reason.

### Branch lifecycle

- Branches should be short-lived: aim for **hours to a few days**, not weeks.
- Delete branches after merge.
- Rebase frequently (or merge `main` into your branch) to avoid painful conflicts.

---

# Commit Message Convention

This repo uses a commit message convention to keep history readable, make rollbacks safe, and enable automation (like changelogs and release notes). The convention is based on **Conventional Commits**, with a few pragmatic additions so real-world work doesn’t turn into ritual theater.

A great commit message answers three questions for a future reader (including future-you, who is famously unreliable): **what changed**, **why it changed**, and **how risky it is to integrate or revert**.

## Core rules (the shape of every commit)

Use this format:
<body/>
<footer/>

## Example: 
feat(jira): create ticket from voice transcription
Generate a structured ticket description from transcript segments and attach
captured screenshots as thumbnails to reduce load time in Jira.
Refs: JIRA-214

The type is a short label describing the kind of change. Choose exactly one:
	•	feat — introduces new functionality/capability (user-facing or API-facing)
	•	fix — corrects a bug or incorrect behavior
	•	docs — documentation changes only
	•	style — formatting only (no behavior change), e.g. prettier, whitespace
	•	refactor — internal restructuring with no behavior change intended
	•	perf — performance improvement without changing intended behavior
	•	test — adds or updates tests
	•	build — build tooling, packaging, dependency tooling, bundlers
	•	ci — CI configuration/scripts/workflows
	•	chore — maintenance tasks that don’t fit above (repo housekeeping, minor tooling)

How to choose when you’re unsure:
	•	If a user could notice it → feat or fix
	•	If only developers notice it → usually chore, build, ci, or docs
	•	If it changes structure but should behave the same → refactor
	•	If it makes the same thing faster → perf
	•	If it’s just formatting → style (be strict about “just”)


## Pull Request (PR) Guidelines

Pull requests are how we keep quality high without slowing down. The goal is: **small, reviewable changes**, with enough context that a reviewer can understand intent and risk without telepathy.

### 1) Before opening a PR

- **Start from `main`** .
- **Create a correctly named branch** (see Branching Convention).
- Ensure your branch is reasonably up to date with `main` (rebase or merge per repo preference).

### 2) PR title convention

PR titles should follow the same style as commit messages (Conventional Commits):