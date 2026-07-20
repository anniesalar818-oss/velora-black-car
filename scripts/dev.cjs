const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const commands = [
  { name: "SERVER", command: "npm run dev --prefix server" },
  { name: "CLIENT", command: "npm run dev --prefix client" },
];

const children = commands.map(({ name, command }) => {
  const child = spawn(command, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    windowsHide: false,
  });

  child.on("error", (error) => {
    console.error(`[${name}] Could not start: ${error.message}`);
  });

  child.on("exit", (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[${name}] stopped with exit code ${code}.`);
      shutdown(1);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 500);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
