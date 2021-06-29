import {LOGIN, USERINFO, SYSTEM_USER_LIST,SAVE_SYSTEM_USER,UPDATE_SYSTEM_USERINFO,UPDATE_SYSTEM_USER_STATUS,
        ALL_SYSTEM_USER_LSIT, SAVE_USER_ROLE, DELETE_USER,USER_LIST,USER_DETAIL,UPDATE_USER_STATUS,SAVE_USER_INFO} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    userName: name,
    password: password
  })
}

/**
 * 获取当前登录用户信息
 */
 export async function getUserInfo(){
  return request(USERINFO, METHOD.POST)
}

/**
 * 获取管理员列表
 * @param {*} pageNum 页码
 * @param {*} pageSize 页大小
 * @param {*} params 查询参数
 */
 export async function systemUserList(pageNum, pageSize, params) {
  return request(SYSTEM_USER_LIST+`/${pageNum}/${pageSize}`, METHOD.POST, params)
}

/**
 * 保存、修改管理员信息
 * @param {*} params 管理员对象
 */
export async function saveSystemUser(params) {
  return request(SAVE_SYSTEM_USER, METHOD.POST, params)
}

/**
 * 保存、修改登录用户信息
 * @param {*} params 登录用户对象
 */
export async function updateUserInfo(params) {
  return request(UPDATE_SYSTEM_USERINFO, METHOD.POST, params)
}

/**
 * 获取所有管理员
 */
export async function getAllSystemUser() {
  return request(ALL_SYSTEM_USER_LSIT, METHOD.POST)
}

/**
 * 为管理员分配角色
 * @param {*} userId 
 * @param {*} params 
 * @returns 
 */
export async function saveUserRole(userId, roleCode){
  return request(SAVE_USER_ROLE+`/${userId}/${roleCode}`, METHOD.POST)
}

/**
 * 修改管理员状态
 * @returns 
 */
export async function updateSystemUserStatus(userId, status){
  return request(UPDATE_SYSTEM_USER_STATUS+`/${userId}/${status}`, METHOD.POST)
}

/**
 * 删除管理员
 * @param {*} userId 管理员ID
 * @returns 
 */
export async function deleteUserById(userId){
  return request(DELETE_USER+`/${userId}`, METHOD.POST)
}

/**
 * 获取用户列表
 * @param {*} pageSize 页大小
 * @param {*} pageNum 页码
 * @returns 
 */
export async function userList(pageSize, pageNum, params){
  return request(USER_LIST+`/${pageSize}/${pageNum}`, METHOD.POST, params)
}

/**
 * 根据ID获取用户详情
 * @param {*} userId 用户ID
 * @returns 
 */
export async function getUserDetailById(userId){
  return request(USER_DETAIL+`/${userId}`, METHOD.POST)
}

/**
 * 修改用户状态
 * @param {*} userId 用户ID
 * @param {*} status 用户状态：1正常；0禁用 9注销
 * @returns 
 */
export async function updateUserStatus(userId, status){
  return request(UPDATE_USER_STATUS+`/${userId}/${status}`, METHOD.POST);
}

/**
 * 保存用户信息
 * @param {*} params 用户对象
 * @returns 
 */
export async function saveAndUpdateUser(params){
  return request(SAVE_USER_INFO, METHOD.POST, params)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getUserInfo,
  systemUserList,
  saveSystemUser,
  updateUserInfo,
  getAllSystemUser,
  saveUserRole,
  updateSystemUserStatus,
  deleteUserById,
  userList,
  getUserDetailById,
  updateUserStatus,
  saveAndUpdateUser
}
