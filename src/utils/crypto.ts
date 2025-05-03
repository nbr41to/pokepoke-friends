/**
 * 同期 XOR “暗号” (超簡易)
 * -----------------------------------------------
 * 1. JSON.stringify で文字列化
 * 2. 各文字コードを key の文字コードと XOR
 * 3. btoa() で Base64 化 → printable な1行文字列
 * 4. 復号は逆手順
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function xorEncrypt(json: any, key: string): string {
  const src = JSON.stringify(json);
  const kLen = key.length;
  let bin = '';

  for (let i = 0; i < src.length; i++) {
    const code = src.charCodeAt(i) ^ key.charCodeAt(i % kLen);
    bin += String.fromCharCode(code);
  }
  return btoa(bin); // ← Base64 1 本
}

export function xorDecrypt<T>(blob: string, key: string): T {
  const bin = atob(blob);
  const kLen = key.length;
  let plain = '';

  for (let i = 0; i < bin.length; i++) {
    const code = bin.charCodeAt(i) ^ key.charCodeAt(i % kLen);
    plain += String.fromCharCode(code);
  }
  return JSON.parse(plain);
}
