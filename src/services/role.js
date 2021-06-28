import { ROLE_LIST, SAVE_ROLE, DELETE_ROLE, MENU_TREE, SAVE_MENU_ROLE, ALL_ROLES,UPDATE_ROLE_STATUS } from './api'
import { request, METHOD } from '@/utils/request'


/**
 * 获取角色列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @param {*} params 搜索参数
 * @returns 
 */
export async function roleList(pageSize, pageNum, params){
    return request(ROLE_LIST+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 保存角色
 * @param {*} params 角色对象
 * @returns 
 */
export async function saveRole(params){
    return request(SAVE_ROLE, METHOD.POST, params);
}

/**
 * 删除角色
 * @param {*} roleId 角色ID
 * @returns 
 */
export async function deleteRole(roleId){
    return request(DELETE_ROLE+`/${roleId}`, METHOD.POST)
}

/**
 * 通过角色ID获取菜单树
 * @param {*} roleId 角色ID
 * @returns 
 */
export async function getMenuTree(roleId){
    return request(MENU_TREE+`/${roleId}`, METHOD.POST)
}

/**
 * 保存角色权限
 * @param {*} roleId 角色ID
 * @returns 
 */
export async function saveMenuRole(roleId, params){
    return request(SAVE_MENU_ROLE+`/${roleId}`, METHOD.POST, params);
}

/**
 * 获取所有有效角色
 * @returns 
 */
export async function getAllRoles(){
    return request(ALL_ROLES, METHOD.POST)
}

/**
 * 修改角色状态
 * @param {*} roleId 角色ID
 * @param {*} status 是否冻结 1冻结 0未冻结
 * @returns 
 */
 export async function updateRoleStatus(roleId, status){
    return request(UPDATE_ROLE_STATUS+`/${roleId}/${status}`, METHOD.POST)
}

export default {
    roleList, saveRole, deleteRole, getMenuTree, saveMenuRole, getAllRoles, updateRoleStatus
}