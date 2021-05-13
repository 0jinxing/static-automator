import path from "path";

export function pathNormalize(p: string) {
  return path.normalize(p).replace(/\\/g, "/");
}
