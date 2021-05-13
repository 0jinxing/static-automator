export type COSConfig = {
  secret_id: string;
  secret_key: string;
  bucket: string;
  region: string;

  base: string;
  input: string;
  output: string;

  generate?: { scss?: boolean; js?: boolean };
};

export const INITIAL_CONFIG: COSConfig = {
  secret_id: "",
  secret_key: "",
  bucket: "",
  region: "",

  base: "/",
  input: "images",
  output: "src/helper",

  generate: { scss: true, js: true },
};

export function mergeConfig(c1: COSConfig, c2: COSConfig): COSConfig {
  return {
    ...c1,
    ...c2,
    generate: { ...c1.generate, ...c2.generate },
  };
}
