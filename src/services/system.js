import {SAVE_SYSTEM_DICTIONARY, GET_SYSTEM_DICTIONARY} from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 * 获取系统配置信息
 * @returns 
 */
export async function getSystemDictionary(pageSize, pageNum, params){
    return request(GET_SYSTEM_DICTIONARY+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 修改系统配置信息
 * @param {*} params 
 * @returns 
 */
export async function saveSystemDictionary(params){
    return request(SAVE_SYSTEM_DICTIONARY, METHOD.POST, params)
}

export default{
    getSystemDictionary, saveSystemDictionary
}
