import fs from "fs";
import COS from "cos-nodejs-sdk-v5";
import OSS from "ali-oss";
import ora from "ora";
import prettier from "prettier";
import { globalContext } from "../context";
import chalk from "chalk";

const { PROJECT_RECORD, record, config, uploadItems } = globalContext;

function putObjectToCOS(client: COS, key: string, srcFileName: string) {
  return client.putObject({
    Bucket: config.bucket,
    Region: config.region,
    Key: key,
    Body: fs.createReadStream(srcFileName),
  });
}

async function putObjectToOSS(client: OSS, key: string, srcFileName: string) {
  return client.putStream(key, fs.createReadStream(srcFileName));
}

export async function command() {
  let client: OSS | COS;
  const { type, region, secret_id, secret_key, bucket } = config;

  if (type === "ali") {
    client = new OSS({
      region,
      bucket,
      accessKeyId: secret_id,
      accessKeySecret: secret_key,
    });
  } else {
    client = new COS({ SecretId: secret_id, SecretKey: secret_key });
  }

  const spinner = ora("upload...").start();

  const needSaveRecord: Record<string, string> = {};

  for await (const file of uploadItems) {
    const uploadPath = file.md5
      ? file.md5Path
      : config.base + "/" + file.realPath;

    const hitKey = file.md5 ? file.md5Path : file.md5Path + "#" + file.realPath;

    if (!globalContext.hitFileKeys.includes(hitKey)) {
      spinner.text = file.realPath;
      if (config.type === "ali") {
        await putObjectToOSS(client as OSS, uploadPath, file.realPath);
      } else {
        await putObjectToCOS(client as COS, uploadPath, file.realPath);
      }
    }
    record[file.realPath] = hitKey;
    needSaveRecord[file.realPath] = hitKey;
  }

  spinner.succeed("上传完成");
  const str = prettier.format(JSON.stringify(needSaveRecord), {
    parser: "json",
  });
  fs.writeFileSync(PROJECT_RECORD, Buffer.from(str, "utf-8"));

  console.log(
    chalk.gray("保存 record 文件成功，** record 文件不应该上传到 git **")
  );
}
