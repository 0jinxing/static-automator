import fs from "fs";
import COS from "cos-nodejs-sdk-v5";
import OSS from "ali-oss";
import ora from "ora";
import prettier from "prettier";
import { globalContext } from "../context";
import { genMd5Path } from "../utils/md5";
import chalk from "chalk";

function putObjectToCOS(client: COS, key: string, srcFileName: string) {
  const { config } = globalContext;

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
  const { PROJECT_RECORD, record, config, imageFiles } = globalContext;

  let client: OSS | COS;

  if (config.type === "ali") {
    client = new OSS({
      region: config.region,
      accessKeyId: config.secret_id,
      accessKeySecret: config.secret_key,
      bucket: config.bucket,
    });
  } else {
    client = new COS({
      SecretId: config.secret_id,
      SecretKey: config.secret_key,
    });
  }

  const spinner = ora("upload...").start();

  const newRecord: Record<string, string> = {};

  for (const fileName of imageFiles) {
    const cosFileName = await genMd5Path(fileName);

    if (!globalContext.md5FileAameArr.includes(cosFileName)) {
      spinner.text = fileName;
      if (config.type === "ali") {
        await putObjectToOSS(client as OSS, cosFileName, fileName);
      } else {
        await putObjectToCOS(client as COS, cosFileName, fileName);
      }
    }
    record[fileName] = cosFileName;

    newRecord[fileName] = cosFileName;
  }

  spinner.succeed("上传完成");
  const str = prettier.format(JSON.stringify(newRecord), { parser: "json" });
  fs.writeFileSync(PROJECT_RECORD, Buffer.from(str, "utf-8"));

  console.log(
    chalk.gray("保存 record 文件成功，** record 文件不应该上传到 git **")
  );
}
