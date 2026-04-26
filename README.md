# Copy File Path with Range

VSCode/Cursor extension to copy the active editor selection as a file reference with a line range.

This is useful for giving precise context to coding agents like Pi, Claude Code, Cursor, Copilot, etc.

Example clipboard output:

```text
/Users/me/project/src/main.py:42-58
```

This is a fork of [`cheapsteak/copy-file-path-with-range`](https://github.com/cheapsteak/copy-file-path-with-range). The command IDs are intentionally kept the same so existing keybindings continue to work.

## Features

- Copy with line ranges
- Relative path mode: `src/main.py:42-58`
- Absolute path mode: `/home/user/project/src/main.py:42-58`
- Single line: `:42`
- Multiple lines: `:42-58`
- Column ranges: `:42:15-58:30`
- Multiple selections: `:42-45,:50-52`

## Commands

```text
copy-file-path-with-range.copyRelativePath
copy-file-path-with-range.copyAbsolutePath
```

## Default keybindings

- `Option+L` — copy relative path with range
- `Option+Shift+L` — copy absolute path with range

## Recommended Pi/context keybinding

To make `Cmd+I` copy the absolute path + selected line range, add this to your VSCode/Cursor `keybindings.json`:

```json
{
  "key": "cmd+i",
  "command": "copy-file-path-with-range.copyAbsolutePath",
  "when": "editorTextFocus && editorHasSelection"
}
```

## Install from GitHub release

Download the latest `.vsix` from:

```text
https://github.com/drisspg/copy-file-path-with-range/releases
```

Then install it:

```bash
code --install-extension copy-file-path-with-range-*.vsix --force
cursor --install-extension copy-file-path-with-range-*.vsix --force
```

Cursor sometimes fails to find Marketplace extensions by id. Installing the VSIX file directly is the most reliable path.

## Development

```bash
corepack enable
pnpm install
pnpm run build
pnpm vsce package
```

## License

MIT. Original copyright belongs to the upstream author; see `LICENSE`.
