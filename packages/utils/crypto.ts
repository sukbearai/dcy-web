import CryptoJS from 'crypto-js'

const CRYPTO_KEY = 'dcy-js'

/**
 * 加密
 * @param msg 待加密字符串
 */
export function encrypt(msg: string) {
  return CryptoJS.AES.encrypt(msg, CRYPTO_KEY).toString()
}

/**
 * 解密
 * @param ciphertext 待解密字符串
 */
export function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
