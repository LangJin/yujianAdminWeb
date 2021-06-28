import { USER_BONUS_RECORDS } from './api';
import { request, METHOD } from '@/utils/request';

/**
 * 获取推荐列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function recommendList(pageSize, pageNum, params){
    return request(USER_BONUS_RECORDS+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

export default{
    recommendList
}