import { Canvas } from 'fabric'
import { nanoid } from 'nanoid'
import * as fabric from 'fabric'
import { changeDataURLDPI, getImageSize } from './graphics'
import { downloadFormUrl } from './download'

export type FabricImage = fabric.FabricImage
export type ImageFormat = fabric.ImageFormat

export class FabricTool {
  canvas: Canvas
  width: number
  height: number
  gutter: number
  format: ImageFormat
  fabricImage: FabricImage | null

  /**
   * 初始化 fabric tool
   * @param {HTMLCanvasElement} canvasEl HTMLCanvasElement canvas dom
   * @param {number} width number 宽度
   * @param {height} height number 高度
   * @param {number} gutter number 图片在画布中的间距
   * @param {ImageFormat} format ImageFormat 图片格式 png | jpeg
   * @returns {undefined}
   */
  constructor(canvasEl: HTMLCanvasElement, width: number, height: number, gutter: number, format: ImageFormat) {
    this.width = width
    this.height = height
    this.gutter = gutter
    this.fabricImage = null
    this.format = format

    this.canvas = new Canvas(canvasEl, {
      width,
      height,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    })

    this.canvas.preserveObjectStacking = true
    this.canvas.renderAll()
  }

  /**
   * 绘制图片
   * @param {string} url string
   * @returns {undefined}
   */
  async drawImage(url: string) {
    try {
      const size = await getImageSize(url)
      const { width, height } = size

      const scale = Math.min(
        this.width / width,
        this.height / height,
      )

      this.fabricImage = await fabric.FabricImage.fromURL(url, {
        crossOrigin: 'anonymous',
      }, {
        id: nanoid(10),
        angle: 0,
        left: this.width / 2,
        top: this.height / 2,
        scaleX: scale,
        scaleY: scale * (this.height - 2 * this.gutter) / this.height,
        hasControls: false,
        hasBorders: true,
        opacity: 1,
        originX: 'center',
        originY: 'center',
        borderColor: '#ff8d23',
        name: 'image',
        lockMovementX: true,
        lockMovementY: true,
      })

      this.canvas.add(this.fabricImage)
    }
    catch (e) {
      console.error('Failed to draw image:', e)
    }
  }

  /**
   * 缩放
   * @param {number} factor number
   * @returns {undefined}
   */
  zoom(factor: number) {
    this.canvas.zoomToPoint(new fabric.Point(this.width / 2, this.height / 2), this.canvas.getZoom() * factor)
  }

  /**
   * 旋转
   * @param {number} angle 旋转角度
   * @returns {undefined}
   */
  rotate(angle: number) {
    if (this.fabricImage) {
      const newAngle = this.fabricImage.angle + angle
      this.fabricImage.rotate(newAngle)
      this.canvas.renderAll()
    }
  }

  /**
   * 图片左转
   * @param {number} angle number=-10 旋转角度
   * @returns {undefined}
   */
  turnLeft(angle: number = -10) {
    this.rotate(angle)
  }

  /**
   * 图片右转
   * @param {number} angle number=10 旋转角度
   * @returns {undefined}
   */
  turnRight(angle: number = 10) {
    this.rotate(angle)
  }

  /**
   * 图片放大
   * @param {number} factor number=1.1 缩放因子
   * @returns {undefined}
   */
  zoomIn(factor: number = 1.1) {
    this.zoom(factor)
  }

  /**
   * 图片缩小
   * @param {number} factor number=1/1.1 缩放因子
   * @returns {undefined}
   */
  zoomOut(factor: number = 1 / 1.1) {
    this.zoom(factor)
  }

  /**
   * 笔刷功能
   * @param {number} width number=12
   * @param {string} color string='#ff0000'
   * @returns {undefined}
   */
  brush(width: number = 12, color: string = '#ff0000') {
    this.canvas.isDrawingMode = true
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)
    this.canvas.freeDrawingBrush.color = color
    this.canvas.freeDrawingBrush.width = width
  }

  /**
   * 橡皮功能，暂未支持
   * @returns {undefined}
   */
  eraser() {
    // 等fabric v6版本更新橡皮功能
    // https://github.com/fabricjs/fabric.js/issues/8299
  }

  /**
   * 清空画笔
   * @returns {undefined}
   */
  clear() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj.type === 'path')
        this.canvas!.remove(obj)
    })
  }

  /**
   * 导出图片到本地
   * @returns string
   */
  export() {
    // 可以使用 this.canvas.toBlob 导出为二进制文件并上传到服务器获取url

    // 导出为base64
    const result = this.canvas.toDataURL({
      multiplier: 1,
      quality: 0.8,
      format: this.format,
      width: this.width,
      height: this.height,
    })

    const base64Image = changeDataURLDPI(result, 300)

    // 下载文件到本地
    downloadFormUrl(base64Image, `dcy-design_${Date.now()}.${this.format}`)

    return base64Image
  }
}
