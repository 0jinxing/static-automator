export type Conf = {
  type: "ali" | "tencent";
  secret_id: string;
  secret_key: string;
  bucket: string;
  region: string;
  cdn: string;

  base: string;
  input: string[];
  output: string;

  generate?: { js?: boolean; less?: boolean; scss?: boolean };
};

export const INITIAL_CONFIG: Conf = {
  type: "tencent",
  secret_id: "",
  secret_key: "",
  bucket: "",
  region: "",
  cdn: "",
  base: "/",
  input: [],
  output: "./",

  generate: { js: true, less: false, scss: false },
};

export function mergeConfig(c1: Conf, c2: Conf): Conf {
  return {
    ...c1,
    ...c2,
    generate: { ...c1.generate, ...c2.generate },
  };
}
