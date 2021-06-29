// 视图组件
const view = {
  tabs: () => import("@/layouts/tabs"),
  blank: () => import("@/layouts/BlankView"),
  page: () => import("@/layouts/PageView"),
};

// 路由组件注册
const routerMap = {
  login: {
    authority: "*",
    path: "/login",
    component: () => import("@/pages/login"),
  },
  root: {
    path: "/",
    name: "首页",
    redirect: "/login",
    component: view.tabs,
  },
  dashboard: {
    path: "dashboard",
    name: "系统首页",
    icon: "dashboard",
    component: () => import("@/pages/dashboard"),
  },
  userInfo: {
    path: "userInfo",
    name: "个人资料",
    invisible: true,
    component: () => import('@/pages/userInfo')
  },
  role: {
    name: "权限管理",
    icon: "team",
    component: view.page,
  },
  roleList: {
    path: "roleList",
    name: "角色权限",
    component: () => import("@/pages/authority/role"),
  },
  administratorList: {
    path: "administratorList",
    name: "管理员列表",
    component: () => import("@/pages/authority/administrator"),
  },
  user: {
    name: '用户管理',
    icon: 'user',
    component: view.page
  },
  userList: {
    path: 'userList',
    name: '用户列表',
    component: () => import('@/pages/user/userList')
  },
  userDetail: {
    path: 'userDetail/:id',
    name: '用户详情',
    invisible: true,
    component: () => import('@/pages/user/detail')
  },
  order: {
    name: '订单管理',
    icon: 'snippets',
    component: view.page
  },
  orderList: {
    path: 'orderList',
    name: '订单列表',
    component: () => import('@/pages/order/orderList')
  },
  system: {
    name: '系统设置',
    icon: 'setting',
    component: view.page
  },
  systemSetting: {
    path: 'systemSetting',
    name: '通用设置',
    component: () => import('@/pages/system')
  },
  version: {
    name: '版本管理',
    icon: 'exclamation-circle',
    component: view.page
  },
  versionList: {
    path: 'versionList',
    name: '版本列表',
    component: () => import('@/pages/version/versionList')
  },
  invite: {
    name: '推荐管理',
    icon: 'solution',
    component: view.page
  },
  inviteList: {
    path: 'inviteList',
    name: '推荐列表',
    component: () => import('@/pages/invite/inviteList')
  },
  withdrawal: {
    name: '提现管理',
    icon: 'money-collect',
    component: view.page
  },
  withdrawalList: {
    path: 'withdrawalList',
    name: '提现列表',
    component: () => import('@/pages/withdrawal/withdrawalList')
  },
  message: {
    name: '消息管理',
    icon: 'message',
    component: view.page
  },
  messageList: {
    path: 'messageList',
    name: '消息列表',
    component: () => import('@/pages/message')
  },
  exception: {
    name: "异常页",
    icon: "warning",
    component: view.blank,
  },
  exp403: {
    authority: "*",
    name: "exp403",
    path: "403",
    component: () => import("@/pages/exception/403"),
  },
  exp404: {
    name: "exp404",
    path: "404",
    component: () => import("@/pages/exception/404"),
  },
  exp500: {
    name: "exp500",
    path: "500",
    component: () => import("@/pages/exception/500"),
  },
};
export default routerMap;