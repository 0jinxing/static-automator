/**
 * 初始化一些全局数据（包括 prettier 配置文件获取）
 */
import path from "path";
import fs from "fs";
import glob from "glob";
import prettier from "prettier";
import { getPath, PROJECT } from "./utils/pkg";
import { pathNormalize } from "./utils/normalize";
import { Conf, INITIAL_CONFIG, mergeConfig } from "./config";
import { genMd5Path } from "./utils/md5";

type UploadItem = { realPath: string; md5Path: string; md5: boolean };

interface GlobalContext {
  record: Record<string, string>;
  config: Conf;
  
  uploadItems: Promise<UploadItem>[];
  hitFileKeys: string[];

  BIN_PROJECT_PATH: string;
  CONFIG_FILE: string;
  PROJECT_CONFIG: string;
  RECORD_FILE: string;
  PROJECT_RECORD: string;
  PRETTOERRC: string;
  PROJECT_PRETTOERRC: string;
  BASE_URL: string;
}

// 配置文件
const CONFIG_FILE = "static-config.json";
const PROJECT_CONFIG = path.resolve(PROJECT.path, CONFIG_FILE);

// 已经上传文件记录
const RECORD_FILE = "static-record.json";
const PROJECT_RECORD = path.resolve(PROJECT.path, RECORD_FILE);

const PRETTOERRC = ".prettierrc";
const PROJECT_PRETTOERRC = path.resolve(PROJECT.path, PRETTOERRC);

let config: Conf = {
  type: "tencent",
  secret_id: "",
  secret_key: "",
  bucket: "",
  region: "",
  cdn: "",
  base: "",
  input: [],
  output: "",
  generate: { scss: true, js: true },
};

if (fs.existsSync(PROJECT_CONFIG)) {
  config = mergeConfig(INITIAL_CONFIG, require(PROJECT_CONFIG));
}

let record = {};
if (fs.existsSync(PROJECT_RECORD)) {
  record = require(PROJECT_RECORD);
}

if (fs.existsSync(PROJECT_PRETTOERRC)) {
  prettier.resolveConfig(PROJECT_PRETTOERRC);
}

export const globalContext: GlobalContext = {
  record,
  config,

  get hitFileKeys() {
    return Object.values(globalContext.record);
  },

  get uploadItems() {
    const { input = [] } = config;
    const files: Promise<UploadItem>[] = [];

    for (let item of input) {
      const md5 = /^md5#/i.test(item);
      const pattern = item.replace(/^md5#/i, "");

      files.push(
        ...glob
          .sync(pattern, { absolute: false, nodir: true, root: PROJECT.path })
          .map(async (path) => ({
            realPath: pathNormalize(path),
            md5Path: await genMd5Path(path),
            md5,
          }))
      );
    }
    return files;
  },

  get BIN_PROJECT_PATH() {
    return getPath(__dirname);
  },

  get CONFIG_FILE() {
    return CONFIG_FILE;
  },

  get PROJECT_CONFIG() {
    return PROJECT_CONFIG;
  },

  get RECORD_FILE() {
    return RECORD_FILE;
  },

  get PROJECT_RECORD() {
    return PROJECT_RECORD;
  },

  get PRETTOERRC() {
    return PRETTOERRC;
  },

  get PROJECT_PRETTOERRC() {
    return PROJECT_PRETTOERRC;
  },

  get BASE_URL() {
    if (config.cdn) return config.cdn.replace(/\/$/, "");

    if (config.type === "ali") {
      return `https://${config.bucket}.${config.region}.aliyuncs.com`;
    }
    return `https://${config.bucket}.cos.${config.region}.myqcloud.com`;
  },
};
