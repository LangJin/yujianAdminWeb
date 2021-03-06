//跨域代理前缀
const API_PROXY_PREFIX = '/yujian'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX

// const BASE_URL = process.env.VUE_APP_API_BASE_URL

module.exports = {
  LOGIN: `${BASE_URL}/sass/systemUser/release/getLogin`, //登录    
  USERINFO: `${BASE_URL}/sass/systemUser/getSystemUser`, //获取个人信息  
  UPDATE_SYSTEM_USERINFO: `${BASE_URL}//sass/systemUser/saveSystemUser`, //保存登录用户信息

  //角色管理
  ROLE_LIST: `${BASE_URL}/sass/systemRole/sassListSystemRole`, //角色列表
  SAVE_ROLE: `${BASE_URL}/sass/systemRole/saveSystemRole`, //添加角色
  DELETE_ROLE: `${BASE_URL}/sass/systemRole/deleteSystemRole`, //删除角色
  MENU_TREE: `${BASE_URL}/sass/systemMenu/getMenuTree`, //通过角色id获取菜单树
  SAVE_MENU_ROLE: `${BASE_URL}//sass/systemMenu/saveSystemMenuRole`, //保存角色权限
  ALL_ROLES: `${BASE_URL}/sass/systemRole/getAllRole`, //获取所有有效角色
  UPDATE_ROLE_STATUS: `${BASE_URL}/sass/systemRole/updateSystemRole`, //修改角色状态

  //系统设置
  GET_SYSTEM_DICTIONARY: `${BASE_URL}/sass/dictionary/listSystemDictionary`, //获取系统配置信息
  SAVE_SYSTEM_DICTIONARY: `${BASE_URL}/sass/dictionary/updateSystemDictionary`, //修改系统配置信息

  //管理员
  SYSTEM_USER_LIST: `${BASE_URL}/sass/systemUser/listSystemUser`, //管理员列表
  SAVE_SYSTEM_USER: `${BASE_URL}/sass/systemUser/addSystemUser`, //添加、修改管理员
  UPDATE_SYSTEM_USER_STATUS: `${BASE_URL}/sass/systemUser/updateUserStatus`, //修改管理员状态
  ALL_SYSTEM_USER_LSIT: `${BASE_URL}/open/system/release/openListSystemUser`, //获取所有后台管理员
  SAVE_USER_ROLE: `${BASE_URL}/sass/systemUser/saveSystemUserRole`, //为管理员分配角色
  DELETE_USER: `${BASE_URL}/sass/systemUser/deleteUser`, //删除管理员

  //用户管理
  USER_LIST: `${BASE_URL}/sass/user/sassListUser`, //用户列表
  USER_DETAIL: `${BASE_URL}/sass/user/getSassUser`, //用户详情
  UPDATE_USER_STATUS: `${BASE_URL}/sass/user/updateUserStatus`, //修改用户状态
  SAVE_USER_INFO: `${BASE_URL}/sass/user/sassSaveUserDTO`,     //保存用户信息
  SAVE_USER_PHOTOS: `${BASE_URL}/sass/user/sassSaveUserPhoneDTO`, //保存用户图片信息
  SAVE_USER_INTEREST: `${BASE_URL}/sass/user/sassSaveUserInterestDTO`,  //保存用户兴趣信息

  //订单管理
  ORDER_LIST: `${BASE_URL}/sass/order/sassListOrder`, //订单列表

  //版本控制
  VERSION_LIST: `${BASE_URL}/sass/version/sassListVersion`,      //版本列表
  SAVE_VERSION: `${BASE_URL}/sass/version/createNewVersion`,    //新增版本
  UPDATE_VERSION_STATUS: `${BASE_URL}/sass/version/updateVersionStatus`,  //修改版本状态

  //推荐管理
  USER_BONUS_RECORDS: `${BASE_URL}/sass/userBonusRecord/listUserBonusRecord`,    //用户奖金领取记录列表

  //提现记录
  USER_WITHDRAWAL_LIST: `${BASE_URL}/sass/userWithdrawal/sassListUserWithdrawal`, //提现申请列表
  AUDIT_WITHDRAWAL: `${BASE_URL}/sass/userWithdrawal/updateWithdrawalId`,         //审核提现申请记录
  GET_UNTREATED_WITHDRAW_NUM: `${BASE_URL}/sass/userWithdrawal/getNotWithdrawalNum`,  //获取未处理提现条数

  //消息模板模板
  MESSAGE_TEMPLATE_LIST: `${BASE_URL}/sass/messageTemplate/sassListMessageTemplate`,  //消息模板管理列表
  SAVE_MESSAGE_TEMPLATE: `${BASE_URL}/sass/messageTemplate/saveSassMessageTemplate`,  //保存消息模板
  UPDATE_MESSAGE_TEMPLATE_STATUS: `${BASE_URL}/sass/messageTemplate/updateMessageTemplateStatus`,   //修改模板状态

  //消息列表
  MESSAGE_LIST: `${BASE_URL}/sass/message/sassListMessage`,   //消息列表
  SAVE_MESSAGE: `${BASE_URL}/sass/message/saveUserMessage`,   //发送消息
  GET_USER_MESSAGES: `${BASE_URL}/sass/message/getMessage`,        //获取聊天框信息

  //问题反馈
  FEED_BACK_LIST: `${BASE_URL}/sass/feedback/listFeedback`,       //问题反馈列表
}