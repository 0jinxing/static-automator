#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";

import { command as init } from "./command/init";
import { command as sync } from "./command/sync";
import { command as gen } from "./command/gen";

import { globalContext } from "./context";

program
  .option("--secretId <string>")
  .option("--secretKey <string>")
  .option("-i, --init", "初始化 配置 文件")
  .option("-s, --sync", "同步图片到 腾讯云 cos")
  .option("-g, --gen", "生成 cos 相关代码");

program.parse(process.argv);

const input = program.opts();

async function main() {
  const { config } = globalContext;
  const { secretId, secretKey } = input;

  config.secret_id = secretId || config.secret_id;
  config.secret_key = secretKey || config.secret_key;

  if (input.init) {
    await init();
  }
  if (input.sync) {
    await sync();
  }
  if (input.gen) {
    await gen();
  }

  console.log(chalk.green("执行成功"));
}

main();
