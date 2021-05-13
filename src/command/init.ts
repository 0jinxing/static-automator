import chalk from "chalk";
import fs from "fs";
import path from "path";
import { globalContext } from "../context";

function copyFile(src: string, dest: string) {
  return fs.promises.copyFile(src, dest);
}

export async function command() {
  const { BIN_PROJECT_PATH, CONFIG_FILE, PROJECT_CONFIG } = globalContext;

  if (!fs.existsSync(PROJECT_CONFIG)) {
    await copyFile(
      path.resolve(BIN_PROJECT_PATH, "template", CONFIG_FILE),
      PROJECT_CONFIG
    );
  } else {
    console.log(chalk.yellow("配置文件已存在"));
  }
}
