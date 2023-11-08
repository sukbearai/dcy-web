import { saveAs } from 'file-saver'

/**
 * 通过url下载文件
 * @param {string} url 文件路径
 * @param {string} fileName 文件名
 * @returns {undefined}
 */
export const downloadFormUrl = function (url: string, fileName: string) {
  saveAs(url, fileName)
}

/**
 * 下载阿里oss资源
 * @param {string} url oss路径
 * @param {string} fileName 文件名
 * @returns {undefined}
 */
export function downloadFormCos(url: string, fileName: string) {
  fetch(url)
    .then(response => response.blob())
    .then((blob) => {
      saveAs(blob, fileName)
    })
}
