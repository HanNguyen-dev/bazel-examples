---
name: pr-test-reporter
description: 'Test a GitHub pull request branch and automatically post test failures as comments. Use when: you need to validate a PR by running tests, capturing failures, and reporting results back to GitHub.'
argument-hint: 'Provide the GitHub PR URL or owner/repo/pr-number'
user-invocable: true
---

# Pull Request Test Reporter

Automates the workflow of checking out a PR branch, running tests, capturing failures, and posting results as a GitHub comment.

## When to Use

- Validate a pull request by running its test suite
- Capture and report test failures to the PR
- Integrate PR testing into your review workflow
- Get detailed failure diagnostics in one command

## Prerequisites

- GitHub CLI (`gh`) or Git installed and configured
- Access to the repository (authentication already set up)
- Test framework configured in the workspace (Bazel, npm/pnpm test, etc.)

## Procedure

### 1. Fetch and Checkout the PR Branch

```bash
git fetch origin <branch-name>
git checkout <branch-name>
```

Or use the `gh` CLI to fetch a specific PR:
```bash
gh pr checkout <pr-number>
```

### 2. Run Tests

Execute your project's test command based on its configuration:

**For Bazel projects:**
```bash
bazel test //... 2>&1
```

**For Node.js projects (npm/pnpm/yarn):**
```bash
pnpm test 2>&1
```

**For other frameworks:**
- Jest: `npm test`
- Vitest: `pnpm vitest`
- pytest: `python -m pytest`

### 3. Capture Test Output

- Redirect stderr to stdout to capture all output: `2>&1`
- Look for test summary (passed/failed counts)
- Identify specific failures or errors
- Note any timeout or resource issues

### 4. Format Failure Report

Create a markdown comment with:
- Build/Test Status (✅ PASSED or ❌ FAILED)
- Error type and location
- Error details (stack trace or message)
- Test summary (counts: passed, failed, skipped)
- Affected tests
- Root cause analysis or recommendations

### 5. Post Comment to PR

Use GitHub CLI or API:

**With GitHub API (via language-agnostic curl):**
```bash
curl -X POST https://api.github.com/repos/OWNER/REPO/issues/PR_NUMBER/comments \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"body": "YOUR_FORMATTED_COMMENT"}'
```

**Or use a tool like `mcp_github_mcp_se_add_issue_comment`:**
```
owner: OWNER
repo: REPO
issue_number: PR_NUMBER
body: FORMATTED_COMMENT
```

## Example Workflow

For a complete walkthrough, see the test session on PR #1:
1. Fetch branch: `git fetch origin test && git checkout test`
2. Run Bazel tests: `bazel test //... 2>&1`
3. Capture output showing failures
4. Post formatted comment to the PR with results

## Tips & Troubleshooting

| Issue | Solution |
|-------|----------|
| **Too many open files error** | Increase ulimit: `ulimit -n 4096` |
| **Authentication failed** | Verify GitHub token or `gh auth login` |
| **Tests timeout** | Add timeout flag: `--timeout=60` or adjust build settings |
| **Lockfile issues** | Try `--no-frozen-lockfile` or `--prefer-offline` |
| **Sandbox errors in Bazel** | Use `--sandbox_debug` for verbose output |

## Common Test Commands by Framework

| Framework | Command |
|-----------|---------|
| Bazel | `bazel test //...` |
| Jest | `jest` or `npm test` |
| Vitest | `vitest` or `pnpm vitest` |
| Pytest | `pytest` |
| Go | `go test ./...` |
| Rust | `cargo test` |
