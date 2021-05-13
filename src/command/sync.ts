import fs from "fs";
import COS from "cos-nodejs-sdk-v5";
import ora from "ora";
import prettier from "prettier";
import { globalContext } from "../context";
import { genMd5Path } from "../utils/md5";
import chalk from "chalk";

function putObject(client: COS, key: string, srcFileName: string) {
  const { config } = globalContext;

  return client.putObject({
    Bucket: config.bucket,
    Region: config.region,
    Key: key,
    Body: fs.createReadStream(srcFileName),
  });
}

export async function command() {
  const { PROJECT_RECORD, record, config, imageFiles } = globalContext;

  const client = new COS({
    SecretId: config.secret_id,
    SecretKey: config.secret_key,
  });

  const spinner = ora("upload...").start();

  const newRecord: Record<string, string> = {};
  
  for (const fileName of imageFiles) {
    const cosFileName = await genMd5Path(fileName);

    if (!globalContext.md5FileAameArr.includes(cosFileName)) {
      spinner.text = fileName;
      await putObject(client, cosFileName, fileName);
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
