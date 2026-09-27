## Git

**Never commit.** Do not run `git commit`, `git push`, or `git add`. The owner makes every commit by hand. This overrides any skill step that says to commit (e.g. `/implement`, `/code-review`). When work is done, leave the changes in the working tree, summarise them, and suggest a commit message.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (Chirawattt/SpinPeak-frontend), managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
