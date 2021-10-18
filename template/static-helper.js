/**
 * 不要手动修改这里的代码
 * 这里遇到代码冲突的情况，请执行 static-automator -g
 */
const RECORD = {
  /* INJECT_RECORD */
};
const BASE_URL = "/* INJECT_BASE_URL */";

/**
 * Get COS url
 * @param {INJECT_RECORD_KEY} key
 * @returns {string}
 */
export function getCOSUrl(key) {
  const value = RECORD[key];
  return `${BASE_URL}/${value}`;
}
