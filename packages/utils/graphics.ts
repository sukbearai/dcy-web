const DefaultRatio = 25.4

interface ImageSize {
  width: number
  height: number
}

/**
 * 获取图片的原始宽高
 * @param src 图片地址
 */
export function getImageSize(src: string): Promise<ImageSize> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.src = src
    img.style.opacity = '0'
    document.body.appendChild(img)

    img.onload = () => {
      const imgWidth = img.clientWidth
      const imgHeight = img.clientHeight

      img.onload = null
      img.onerror = null

      document.body.removeChild(img)

      resolve({ width: imgWidth, height: imgHeight })
    }

    img.onerror = () => {
      img.onload = null
      img.onerror = null
    }
  })
}

/**
 * 读取图片文件的dataURL
 * @param file 图片文件
 */
export function getImageDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })
    reader.readAsDataURL(file)
  })
}

// px2mm
export function px2mm(value: number) {
  return value / 300 * DefaultRatio
}

// mm2px
export function mm2px(value: number) {
  return value * 300 / DefaultRatio
}

let pngDataTable = new Int32Array(256)
const PNG = 'image/png'
const JPEG = 'image/jpeg'
const b64PhysSignature1 = 'AAlwSFlz'
const b64PhysSignature2 = 'AAAJcEhZ'
const b64PhysSignature3 = 'AAAACXBI'

const _P = 'p'.charCodeAt(0)
const _H = 'H'.charCodeAt(0)
const _Y = 'Y'.charCodeAt(0)
const _S = 's'.charCodeAt(0)

function createPNGDataTable() {
  const crcTable = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++)
      c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1

    crcTable[n] = c
  }
  return crcTable
}

function calcCrc(buf: Uint8Array) {
  let c = -1
  if (!pngDataTable)
    pngDataTable = createPNGDataTable()
  for (let n = 0; n < buf.length; n++)
    c = pngDataTable[(c ^ buf[n]) & 0xFF] ^ (c >>> 8)

  return c ^ -1
}

export function changeDpiBlob(blob: Blob, dpi: number) {
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  const headerChunk = blob.slice(0, 33)
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const dataArray = new Uint8Array(fileReader.result as ArrayBuffer)
      const tail = blob.slice(33)
      const changedArray = changeDpiOnArray(dataArray, dpi, blob.type)
      resolve(new Blob([changedArray, tail], { type: blob.type }))
    }
    fileReader.readAsArrayBuffer(headerChunk)
  })
}

export function changeDataURLDPI(base64Image: string, dpi: number) {
  const dataSplitted = base64Image.split(',')
  const format = dataSplitted[0]
  const body = dataSplitted[1]
  let type = ''
  let headerLength = 0
  let overwritepHYs = false
  if (format.includes(PNG)) {
    type = PNG
    const b64Index = detectPhysChunkFromDataUrl(body)
    // 28 bytes in dataUrl are 21bytes, length of phys chunk with everything inside.
    if (b64Index >= 0) {
      headerLength = Math.ceil((b64Index + 28) / 3) * 4
      overwritepHYs = true
    }
    else {
      headerLength = 33 / 3 * 4
    }
  }
  if (format.includes(JPEG)) {
    type = JPEG
    headerLength = 18 / 3 * 4
  }
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  const stringHeader = body.substring(0, headerLength)
  const restOfData = body.substring(headerLength)
  const headerBytes = window.atob(stringHeader)
  const dataArray = new Uint8Array(headerBytes.length)
  for (let i = 0; i < dataArray.length; i++)
    dataArray[i] = headerBytes.charCodeAt(i)

  const finalArray = changeDpiOnArray(dataArray, dpi, type, overwritepHYs)
  const base64Header = window.btoa(String.fromCharCode(...finalArray))
  return [format, ',', base64Header, restOfData].join('')
}

function detectPhysChunkFromDataUrl(data: string) {
  let b64index = data.indexOf(b64PhysSignature1)
  if (b64index === -1)
    b64index = data.indexOf(b64PhysSignature2)

  if (b64index === -1)
    b64index = data.indexOf(b64PhysSignature3)

  // if b64index === -1 chunk is not found
  return b64index
}

function searchStartOfPhys(data: Uint8Array) {
  const length = data.length - 1
  // we check from the end since we cut the string in proximity of the header
  // the header is within 21 bytes from the end.
  for (let i = length; i >= 4; i--) {
    if (data[i - 4] === 9 && data[i - 3] === _P && data[i - 2] === _H && data[i - 1] === _Y && data[i] === _S)
      return i - 3
  }
  return 0
}

function changeDpiOnArray(dataArray: Uint8Array, dpi: number, format: string, overwritepHYs?: boolean) {
  if (format === JPEG) {
    dataArray[13] = 1 // 1 pixel per inch or 2 pixel per cm
    dataArray[14] = dpi >> 8 // dpiX high byte
    dataArray[15] = dpi & 0xFF // dpiX low byte
    dataArray[16] = dpi >> 8 // dpiY high byte
    dataArray[17] = dpi & 0xFF // dpiY low byte
    return dataArray
  }
  if (format === PNG) {
    const physChunk = new Uint8Array(13)
    // chunk header pHYs
    // 9 bytes of data
    // 4 bytes of crc
    // this multiplication is because the standard is dpi per meter.
    dpi *= 39.3701
    physChunk[0] = _P
    physChunk[1] = _H
    physChunk[2] = _Y
    physChunk[3] = _S
    physChunk[4] = dpi >>> 24 // dpiX highest byte
    physChunk[5] = dpi >>> 16 // dpiX veryhigh byte
    physChunk[6] = dpi >>> 8 // dpiX high byte
    physChunk[7] = dpi & 0xFF // dpiX low byte
    physChunk[8] = physChunk[4] // dpiY highest byte
    physChunk[9] = physChunk[5] // dpiY veryhigh byte
    physChunk[10] = physChunk[6] // dpiY high byte
    physChunk[11] = physChunk[7] // dpiY low byte
    physChunk[12] = 1 // dot per meter....

    const crc = calcCrc(physChunk)

    const crcChunk = new Uint8Array(4)
    crcChunk[0] = crc >>> 24
    crcChunk[1] = crc >>> 16
    crcChunk[2] = crc >>> 8
    crcChunk[3] = crc & 0xFF

    if (overwritepHYs) {
      const startingIndex = searchStartOfPhys(dataArray)
      dataArray.set(physChunk, startingIndex)
      dataArray.set(crcChunk, startingIndex + 13)
      return dataArray
    }

    // i need to give back an array of data that is divisible by 3 so that
    // dataurl encoding gives me integers, for luck this chunk is 17 + 4 = 21
    // if it was we could add a text chunk contaning some info, untill desired
    // length is met.
    // chunk structur 4 bytes for length is 9
    const chunkLength = new Uint8Array(4)
    chunkLength[0] = 0
    chunkLength[1] = 0
    chunkLength[2] = 0
    chunkLength[3] = 9

    const finalHeader = new Uint8Array(54)
    finalHeader.set(dataArray, 0)
    finalHeader.set(chunkLength, 33)
    finalHeader.set(physChunk, 37)
    finalHeader.set(crcChunk, 50)
    return finalHeader
  }
  return dataArray
}
