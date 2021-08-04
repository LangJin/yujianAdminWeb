import {
    MESSAGE_TEMPLATE_LIST,
    SAVE_MESSAGE_TEMPLATE,
    UPDATE_MESSAGE_TEMPLATE_STATUS,
    MESSAGE_LIST,
    SAVE_MESSAGE,
    GET_USER_MESSAGES
} from './api'
import {
    request,
    METHOD
} from '@/utils/request'

/**
 * 获取消息模板列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function messageTemplateList(pageSize, pageNum, params) {
    return request(MESSAGE_TEMPLATE_LIST + `/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 保存消息模板信息
 * @param {*} params 消息模板对象
 * @returns 
 */
export async function saveMessageTemplate(params) {
    return request(SAVE_MESSAGE_TEMPLATE, METHOD.POST, params);
}

/**
 * 修改消息模板状态
 * @param {*} messageTemplateId 消息模板ID
 * @param {*} isTrue 是否有效1 有效 0无效
 * @returns 
 */
export async function updateMessageTemplateStatus(messageTemplateId, isTrue) {
    return request(UPDATE_MESSAGE_TEMPLATE_STATUS + `/${messageTemplateId}/${isTrue}`, METHOD.POST)
}

/**
 * 获取消息列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function messageList(pageSize, pageNum, params) {
    return request(MESSAGE_LIST + `/${pageSize}/${pageNum}`, METHOD.POST, params);
}

/**
 * 发送消息
 * @param {*} userId 用户ID
 * @param {*} params 消息对象
 * @returns 
 */
export async function saveMessage(userId, params){
    return request(SAVE_MESSAGE+`/${userId}`, METHOD.POST, params);
}

/**
 * 获取聊天框信息
 * @param {*} userId 
 * @param {*} toUserId 
 * @param {*} pageSize 
 * @param {*} pageNum 
 * @returns 
 */
export async function getUserMessage(userId, toUserId, pageSize, pageNum){
    return request(GET_USER_MESSAGES+`/${userId}/${toUserId}/${pageSize}/${pageNum}`, METHOD.POST);
}

export default {
    messageTemplateList,
    saveMessageTemplate,
    updateMessageTemplateStatus,
    messageList,
    saveMessage,
    getUserMessage
}