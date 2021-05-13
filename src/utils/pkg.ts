import fs from "fs";
import path from "path";

const CWD = process.cwd();
const NODE_MODULES = "node_modules";

export function getName(): string {
  const pkg = require(path.resolve(getPath(), "package.json"));
  return pkg.name;
}

export function getPath(current: string = CWD): string {
  const e = fs.existsSync(path.resolve(current, NODE_MODULES));

  if (e) return current;

  const prev = path.resolve(current, "..");

  if (prev === current) {
    throw "Invalid Project";
  }

  return getPath(prev);
}

export const PROJECT = {
  get path() {
    return getPath();
  },
  get name() {
    return getName();
  },
};
