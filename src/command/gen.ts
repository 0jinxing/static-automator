import path from "path";
import fs from "fs";
import prettier from "prettier";
import { globalContext } from "../context";
import { PROJECT } from "../utils/pkg";

const { config, uploadItems, BASE_URL, BIN_PROJECT_PATH } = globalContext;
const { generate } = config;
const saveDir = path.resolve(PROJECT.path, config.output);

function getStyleVarName(fileName: string) {
  return fileName
    .replace(/[^0-9A-Za-z]+([0-9A-Za-z])/g, (_, $1) => "-" + $1.toLowerCase())
    .toLowerCase();
}

async function generatorScss(mapper: Record<string, string>) {
  const vars = Object.keys(mapper)
    .map((k) => `$${getStyleVarName(k)}: url(${BASE_URL}/${mapper[k]});`)
    .join("\n");

  const content = await fs.promises.readFile(
    path.resolve(BIN_PROJECT_PATH, "template", "static-helper.scss"),
    "utf-8"
  );

  const text = content.replace(
    /[\s]*\/\*[\s]*INJECT_VARIABLE[\s]*\*\/[\s]*/m,
    vars
  );

  await fs.promises.writeFile(
    path.resolve(saveDir, "static-helper.scss"),
    Buffer.from(prettier.format(text, { parser: "scss" }), "utf-8")
  );
}

async function generatorLess(mapper: Record<string, string>) {
  const vars = Object.keys(mapper)
    .map((k) => `@${getStyleVarName(k)}: url(${BASE_URL}/${mapper[k]});`)
    .join("\n");

  const content = await fs.promises.readFile(
    path.resolve(BIN_PROJECT_PATH, "template", "static-helper.less"),
    "utf-8"
  );

  const text = content.replace(
    /[\s]*\/\*[\s]*INJECT_VARIABLE[\s]*\*\/[\s]*/m,
    vars
  );

  await fs.promises.writeFile(
    path.resolve(saveDir, "static-helper.less"),
    Buffer.from(prettier.format(text, { parser: "less" }), "utf-8")
  );
}

async function generatorJs(mapper: Record<string, string>) {
  const content = await fs.promises.readFile(
    path.resolve(BIN_PROJECT_PATH, "template", "static-helper.js"),
    "utf-8"
  );
  const text = content
    .replace(
      /INJECT_MAPPER_KEY/,
      Object.keys(mapper)
        .map((i) => JSON.stringify(i))
        .join("|")
    )
    .replace(
      /\{[\s]*\/\*[\s]*INJECT_MAPPER[\s]*\*\/[\s]*\}/m,
      JSON.stringify(mapper)
    )
    .replace(
      /"[\s]*\/\*[\s]*INJECT_BASE_URL[\s]*\*\/[\s]*"/m,
      JSON.stringify(BASE_URL)
    );

  await fs.promises.writeFile(
    path.resolve(saveDir, "static-helper.js"),
    Buffer.from(prettier.format(text, { parser: "babel" }), "utf-8")
  );
}

async function generatorMapper() {
  const mapper: Record<string, string> = {};
  for await (const item of uploadItems) {
    mapper[item.realPath] = `${config.base}/${item.realPath}`;
    if (item.md5) mapper[item.realPath] = item.md5Path;
  }
  return mapper;
}

export async function command() {
  if (!generate || (!generate.js && !generate.scss)) return;

  const mapper = await generatorMapper();

  if (!fs.existsSync(saveDir)) {
    fs.promises.mkdir(saveDir, { recursive: true });
  }

  const tasks: Promise<void>[] = [];

  if (generate.js) {
    tasks.push(generatorJs(mapper));
  }

  if (generate.scss) {
    tasks.push(generatorScss(mapper));
  }

  if (generate.less) {
    tasks.push(generatorLess(mapper));
  }

  await Promise.all(tasks);
}
