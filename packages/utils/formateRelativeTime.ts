import relativeTime from 'dayjs/plugin/relativeTime'
import cn from 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)
dayjs.locale(cn)

export const formateRelativeTime = dayjs
