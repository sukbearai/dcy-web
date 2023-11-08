import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import codeMessage from './codeMessage'

const CancelToken = axios.CancelToken
const cancel: {
  value?: Canceler
} = {}

axios.defaults.headers.post['Content-Type']
  = 'application/x-www-form-urlencoded;charset=UTF-8'

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 1_000 * 20,
})

axiosInstance.interceptors.request.use(
  (value) => {
    let accessToken = null
    if (import.meta.client)
      accessToken = sessionStorage.getItem('access_token')

    if (accessToken) {
      return {
        ...value,
      }
    }
    return value
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200)
      return Promise.resolve(response)

    else
      return Promise.reject(response)
  },
  (error) => {
    if (error?.message?.includes?.('timeout')) {
      if (import.meta.client) {
        Message.error({
          content: '请求超时',
          duration: 5 * 1000,
        })
      }
    }
    else {
      if (import.meta.client) {
        Message.error({
          content: codeMessage?.[error?.response?.status as keyof typeof codeMessage]
          ?? '请求错误',
          duration: 5 * 1000,
        })
      }
      if (error?.response?.status === 403) {
        if (import.meta.client) {
          Message.error({
            content: '403',
            duration: 5 * 1000,
          })
        }
      }
    }
    Promise.reject(error)
  },
)

function request<ResponseType = unknown>(url: string,	options?: AxiosRequestConfig<unknown>): Promise<ResponseType> {
  return new Promise((resolve, reject) => {
    axiosInstance({
      url,
      cancelToken: new CancelToken((c) => {
        cancel.value = c
      }),
      ...options,
    })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function cancelAxios() {
  cancel?.value?.()
}

export { axiosInstance, request, cancelAxios }
