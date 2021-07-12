import {FEED_BACK_LIST} from './api'
import {request,METHOD } from '@/utils/request'

/**
 * 获取问题反馈列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function feedBackList(pageSize, pageNum, params) {
    return request(FEED_BACK_LIST + `/${pageSize}/${pageNum}`, METHOD.POST, params)
}

export default {
    feedBackList
}