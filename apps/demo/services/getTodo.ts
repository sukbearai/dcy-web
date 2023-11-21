import { request } from '@dcyjs/network'

interface HttpResponse {
  userId: number
  id: number
  title: string
  completed: boolean
}

/**
 * 测试 useRequest HttpResponses是接口返回json类型，根据接口文档手动编写
 * @param {any} {id}:{id:number}
 * @returns Promise<HttpResponse>
 */
export function getTodo({ id }: { id: number }): Promise<HttpResponse> {
  return request<HttpResponse>(`https://jsonplaceholder.typicode.com/todos/${id}`)
}
