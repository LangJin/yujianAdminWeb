import { ORDER_LIST} from './api'
import { request, METHOD } from '@/utils/request'

/**
 * 获取订单列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function orderList(pageSize, pageNum, params){
    return request(ORDER_LIST+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

export default{
    orderList
}