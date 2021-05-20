import path from "path";
import fs from "fs";
import prettier from "prettier";
import { globalContext } from "../context";
import { genMd5Path } from "../utils/md5";
import { PROJECT } from "../utils/pkg";

function getScssVarName(fileName: string) {
  return fileName
    .replace(/[^0-9A-Za-z]+([0-9A-Za-z])/g, (_, $1) => "-" + $1.toLowerCase())
    .toLowerCase();
}

function genScss(record: Record<string, string>) {
  const { BASE_URL, BIN_PROJECT_PATH } = globalContext;

  const vars = Object.keys(record)
    .map((k) => `$${getScssVarName(k)}: url(${BASE_URL}/${record[k]});`)
    .join("\n");

  return fs
    .readFileSync(
      path.resolve(BIN_PROJECT_PATH, "template", "cos-helper.scss"),
      "utf-8"
    )
    .replace(/[\s]*\/\*[\s]*INJECT_VARIABLE[\s]*\*\/[\s]*/m, vars);
}

function genJs(record: Record<string, string>) {
  const { BASE_URL, BIN_PROJECT_PATH } = globalContext;

  return fs
    .readFileSync(
      path.resolve(BIN_PROJECT_PATH, "template", "cos-helper.js"),
      "utf-8"
    )
    .replace(
      /INJECT_RECORD_KEY/,
      Object.keys(record)
        .map((i) => JSON.stringify(i))
        .join("|")
    )
    .replace(
      /\{[\s]*\/\*[\s]*INJECT_RECORD[\s]*\*\/[\s]*\}/m,
      JSON.stringify(record)
    )
    .replace(
      /"[\s]*\/\*[\s]*INJECT_BASE_URL[\s]*\*\/[\s]*"/m,
      JSON.stringify(BASE_URL)
    );
}

export async function command() {
  const { config, imageFiles } = globalContext;
  const { generate } = config;

  if (!generate || (!generate.js && !generate.scss)) return;

  const genRecord: Record<string, string> = {};

  for (const fileName of imageFiles) {
    genRecord[fileName] = await genMd5Path(fileName);
  }

  const saveDir = path.resolve(PROJECT.path, config.output);

  if (!fs.existsSync(saveDir)) {
    fs.promises.mkdir(saveDir, { recursive: true });
  }

  if (generate.js) {
    fs.writeFileSync(
      path.resolve(saveDir, "cos-helper.js"),
      Buffer.from(
        prettier.format(genJs(genRecord), { parser: "babel" }),
        "utf-8"
      )
    );
  }

  if (generate.scss) {
    fs.writeFileSync(
      path.resolve(saveDir, "cos-helper.scss"),
      Buffer.from(
        prettier.format(genScss(genRecord), { parser: "scss" }),
        "utf-8"
      )
    );
  }
}
