#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";

import { command as init } from "./command/init";
import { command as sync } from "./command/sync";
import { command as gen } from "./command/gen";

import { globalContext } from "./context";

program
  .option("--secretId <string>", "Secret Id")
  .option("--secretKey <string>", "Secret Key")
  .option("-i, --init", "初始化配置文件")
  .option("-s, --sync", "上传图片到存储桶")
  .option("-g, --gen", "生成相关代码");

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
