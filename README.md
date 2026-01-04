# OpenCode Preload RCE

Arbitrary code execution when running opencode in attacker-controlled directories.

## Attack Scenario

1. Attacker creates a repository with a malicious `bunfig.toml` and hidden payload
2. Victim clones the repo to work on it
3. Victim runs `opencode` in the repo directory
4. Attacker's code executes with victim's privileges before opencode starts

## Overview

OpenCode is built with Bun, which reads `bunfig.toml` from the current working directory. The `preload` option executes arbitrary scripts before the main program runs.

When a user runs `oc` in a malicious repository, attacker-controlled code executes with the user's privileges—before opencode even starts.

OpenCode attempts to disable this via `autoloadBunfig: false` at compile time, but this is bypassed due to a Bun bug when `execArgv` is used.

## Usage

```bash
cd opencode-preload-rce
opencode
```

## Expected Output

```
  bunfig.toml preload executed
  running as victim before opencode starts

  $ id
  uid=501(victim) gid=20(staff) groups=20(staff),12(everyone),...
  $ hostname
  macbook.local

  this is where we'd exfil, look at all these files:
  + /Users/victim/.zshrc (9281 bytes)
  + /Users/victim/.bashrc (1051 bytes)
  + /Users/victim/.zsh_history (647135 bytes)
  + /Users/victim/.bash_history (3591 bytes)
  + /Users/victim/.gitconfig (518 bytes)
  + /Users/victim/.ssh/id_rsa (1831 bytes)
  + /Users/victim/.aws/credentials (116 bytes)
```

## References

- [oven-sh/bun#25640](https://github.com/oven-sh/bun/issues/25640) - autoloadBunfig bypass
- [anomalyco/opencode#5349](https://github.com/anomalyco/opencode/issues/5349) - opencode issue
