import fs from "fs";
import crypto from "crypto";
import path from "path";
import { pathNormalize } from "./normalize";
import { globalContext } from "../context";

export async function calcMd5(path: string | Buffer, len?: number) {
  let buffer: Buffer;

  if (typeof path === "string") {
    buffer = await fs.promises.readFile(path);
  } else buffer = path;

  const sum = crypto.createHash("sha256");
  sum.update(buffer);
  const hex = sum.digest("hex").slice(0, len);

  return hex;
}

export async function genMd5Path(fileName: string) {
  const { config } = globalContext;

  const extname = path.extname(fileName);
  const md5 = await calcMd5(fileName, 8);
  return pathNormalize(`${config.base}/${md5}${extname}`);
}
