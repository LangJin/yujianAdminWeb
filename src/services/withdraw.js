import { USER_WITHDRAWAL_LIST, AUDIT_WITHDRAWAL, GET_UNTREATED_WITHDRAW_NUM} from './api'
import { request, METHOD } from '@/utils/request'

/**
 * 获取用户提现申请列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function withdrawalList(pageSize, pageNum, params){
    return request(USER_WITHDRAWAL_LIST+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 审核提现申请记录
 * @param {*} params 审核对象
 * @returns 
 */
export async function auditWithdrawal(params){
    return request(AUDIT_WITHDRAWAL, METHOD.POST, params)
}

/**
 * 获取未处理提现条数
 * @returns 
 */
export async function getUntreatedWithdrawNum(){
    return request(GET_UNTREATED_WITHDRAW_NUM, METHOD.POST);
}

export default{
    withdrawalList, auditWithdrawal,getUntreatedWithdrawNum
}