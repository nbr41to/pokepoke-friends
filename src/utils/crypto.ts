/**
 * 同期 XOR "暗号" (超簡易)
 * -----------------------------------------------
 * 1. JSON.stringify で文字列化
 * 2. 各文字コードを key の文字コードと XOR
 * 3. Base64エンコード → printable な1行文字列
 * 4. 復号は逆手順
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function xorEncrypt(json: any, key: string): string {
  const src = JSON.stringify(json);
  const kLen = key.length;
  let result = '';

  for (let i = 0; i < src.length; i++) {
    const code = src.charCodeAt(i) ^ key.charCodeAt(i % kLen);
    result += String.fromCharCode(code);
  }

  // TextEncoderを使って文字列をUint8Array（バイト配列）に変換
  const encoder = new TextEncoder();
  const bytes = encoder.encode(result);

  // バイト配列をBase64エンコード
  return bytesToBase64(bytes);
}

export function xorDecrypt<T>(blob: string, key: string): T {
  // Base64デコード
  const bytes = base64ToBytes(blob);

  // Uint8ArrayからUTF-8文字列に変換
  const decoder = new TextDecoder();
  const bin = decoder.decode(bytes);

  const kLen = key.length;
  let plain = '';

  for (let i = 0; i < bin.length; i++) {
    const code = bin.charCodeAt(i) ^ key.charCodeAt(i % kLen);
    plain += String.fromCharCode(code);
  }
  return JSON.parse(plain);
}

// Uint8Array（バイト配列）をBase64文字列に変換する関数
function bytesToBase64(bytes: Uint8Array): string {
  const binString = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  return btoa(binString);
}

// Base64文字列をUint8Array（バイト配列）に変換する関数
function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return new Uint8Array(binString.split('').map((char) => char.charCodeAt(0)));
}
