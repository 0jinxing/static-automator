export type Conf = {
  type: "ali" | "tencent";
  secret_id: string;
  secret_key: string;
  bucket: string;
  region: string;
  cdn: string;

  base: string;
  input: string;
  output: string;

  generate?: { scss?: boolean; js?: boolean };
};

export const INITIAL_CONFIG: Conf = {
  type: "tencent",
  secret_id: "",
  secret_key: "",
  bucket: "",
  region: "",
  cdn: "",

  base: "/",
  input: "images",
  output: "src/helper",

  generate: { scss: true, js: true },
};

export function mergeConfig(c1: Conf, c2: Conf): Conf {
  return {
    ...c1,
    ...c2,
    generate: { ...c1.generate, ...c2.generate },
  };
}
