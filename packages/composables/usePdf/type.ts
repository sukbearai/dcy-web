import type {
  DocumentInitParameters,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/src/display/api'
import type { DeepReadonly } from 'vue'
import type { PageViewport } from 'pdfjs-dist/types//src/display/display_utils'

export interface PDFHookReturn {
  pdfDocument: DeepReadonly<Ref<PDFDocumentProxy | undefined>>
  pdfPage: DeepReadonly<Ref<PDFPageProxy | undefined>>
  viewport: DeepReadonly<
    ComputedRef<
      | PageViewport
      | {
        height: number
        width: number
      }
    >
  >
  page: DeepReadonly<Ref<number>>
  rotate: DeepReadonly<Ref<number>>
  scale: DeepReadonly<Ref<number>>
  canvasAttributes: DeepReadonly<
    Ref<{
      width: number
      height: number
      class: string
      style: string
    }>
  >
  rotateCW: () => void
  rotateCCW: () => void
  scaleIn: () => void
  scaleOut: () => void
  fitAuto: () => void
  fitWidth: () => void
  nextPage: () => void
  prevPage: () => void
  setPage: (page: number) => void
}

export interface PDFHookOptions {
  element: Ref<HTMLElement | HTMLCanvasElement | undefined>
  file: Ref<string>
  renderType: 'svg' | 'canvas'
  onDocumentLoadSuccess?: (document: PDFDocumentProxy) => void
  onDocumentLoadFail?: (err: Error) => void
  onPageLoadSuccess?: (page: PDFPageProxy) => void
  onPageLoadFail?: (err: Error) => void
  onPageRenderSuccess?: (page: PDFPageProxy) => void
  onPageRenderFail?: (err: Error) => void
  onPassword?: (
    callback: (password: string) => void,
    reason: 'NEED_PASSWORD' | 'INCORRECT_PASSWORD'
  ) => void
  // 已弃用
  // workerSrc?: string
  config?: DocumentInitParameters
}

// eslint-disable-next-line import/no-mutable-exports
export let usePDF: (options: PDFHookOptions) => PDFHookReturn
