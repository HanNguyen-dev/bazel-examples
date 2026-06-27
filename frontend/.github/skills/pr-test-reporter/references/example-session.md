# Example Session: Testing PR #1 in bazel-examples

This document captures the actual workflow executed to test PR #1 and post results back to GitHub.

## Session Overview

**Repository:** HanNguyen-dev/bazel-examples
**PR:** #1 (test branch)
**Goal:** Checkout branch, run tests, capture failures, post results

## Step-by-Step Walkthrough

### Step 1: Fetch and Checkout the PR Branch

```bash
$ git fetch origin test && git checkout test
From github.com:HanNguyen-dev/bazel-examples
 * branch            test       -> FETCH_HEAD
branch 'test' set up to track 'origin/test'.
Switched to a new branch 'test'
```

**Status:** ✅ Successfully checked out the `test` branch

### Step 2: Retrieve PR Details

Used GitHub API to fetch PR information:
- **PR Number:** 1
- **Title:** "test branch"
- **State:** open
- **Head SHA:** df1dce675e7f1f96bf7cab9c7456fc81514d7a2c
- **Base SHA:** dbf3399037ae65f901d46147804749fae1409ef2
- **Files Changed:** 1
- **Additions:** 7

### Step 3: Run Tests

```bash
$ bazel test //... 2>&1
```

**Test Execution Output:**

```
INFO: Analyzed 94 targets (927 packages loaded, 7465 targets configured).
ERROR: /home/pluto/codes/bazel-examples/frontend/react-router/BUILD.bazel:122:14
: JsRunBinary react-router/.react-router failed: (Exit 1): react_router failed:
error executing JsRunBinary command (from _run_binary rule target //react-router
:typegen)

Error: EMFILE: too many open files, watch '...bazel-out/k8-fastbuild/bin/react-router'
    at FSWatcher.<computed> (node:internal/fs/watchers:247:19)
    at Object.watch (node:fs:2469:36)
```

### Step 4: Analyze Failures

**Failed Target:** `//react-router:typegen`
**Error Type:** JsRunBinary failure (Exit 1)
**Root Cause:** EMIFE: too many open files

This is a system resource limit issue where Vite's file watcher tries to watch too many files, exceeding the file descriptor ulimit.

### Step 5: Compile Test Results

- **Tests Passed:** 3
  - `//react:build_smoke_test` ✅
  - `//react/src:lint` ✅
  - `//react/src:src_typecheck_test` ✅

- **Tests Failed:** 1
  - `//react-router:typegen` ❌

- **Tests Skipped:** 12 (due to build failure)

### Step 6: Format and Post Comment

Created markdown comment with:
- Build status indicator
- Target and error details
- Full error message with context
- Test summary
- Root cause analysis
- Recommendation

Posted using: `mcp_github_mcp_se_add_issue_comment`

```json
{
  "owner": "HanNguyen-dev",
  "repo": "bazel-examples",
  "issue_number": 1,
  "body": "## Test Failure Report\n\n### Build Status: ❌ FAILED\n..."
}
```

**Result:** ✅ Comment successfully posted to PR #1

## Key Insights

1. **Resource Limits Matter:** Bazel sandboxes + Vite file watchers can quickly exhaust file descriptors
2. **Build Failure Cascades:** A failure in one target blocks dependent tests
3. **GitHub Integration:** Using the GitHub MCP tools allows seamless API integration for posting results
4. **Error Capture:** Redirecting stderr to stdout (`2>&1`) is crucial for capturing full error context

## Potential Improvements

- Increase ulimit before running tests: `ulimit -n 4096`
- Configure Vite to use optimized file watching in sandboxes
- Add build caching to speed up subsequent runs
- Parallelize independent test targets where possible
