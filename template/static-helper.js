/**
 * 不要手动修改这里的代码
 * 这里遇到代码冲突的情况，请执行 static-automator -g
 */
const MAPPER = {
  /* INJECT_MAPPER */
};
const BASE_URL = "/* INJECT_BASE_URL */";

/**
 * Get static url
 * @param {INJECT_MAPPER_KEY} key
 * @returns {string}
 */
export function getStaticUrl(key) {
  const value = MAPPER[key];
  return `${BASE_URL}/${value}`;
}
