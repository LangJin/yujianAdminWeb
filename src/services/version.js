import { VERSION_LIST, SAVE_VERSION, UPDATE_VERSION_STATUS } from './api'
import { request, METHOD } from '@/utils/request'

/**
 * 获取版本列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function versionList(pageSize, pageNum, params){
    return request(VERSION_LIST+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 保存版本
 * @param {*} params 版本对象
 * @returns 
 */
export async function saveVersion(params){
    return request(SAVE_VERSION, METHOD.POST, params)
}

/**
 * 修改版本状态
 * @param {*} versionId 版本ID
 * @param {*} status 有效状态；1启用；0默认
 * @returns 
 */
export async function updateVersionStatus(versionId, status){
    return request(UPDATE_VERSION_STATUS+`/${versionId}/${status}`, METHOD.POST)
}

export default{
    versionList, saveVersion, updateVersionStatus
}