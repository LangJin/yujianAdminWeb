import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  mode: 'history',
  routes: [{
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [{
          path: 'dashboard',
          name: '系统首页',
          meta: {
            icon: 'dashboard'
          },
          component: () => import('@/pages/dashboard')
        }, {
          path: 'userInfo',
          name: '个人资料',
          meta: {
            icon: 'dashboard',
            invisible: true
          },
          component: () => import('@/pages/userInfo')
        },
        {
          path: 'role',
          name: '权限管理',
          meta: {
            icon: 'team',
          },
          component: PageView,
          children: [{
            path: 'roleList',
            name: '角色列表',
            component: () => import('@/pages/authority/role')
          }, {
            path: 'administratorList',
            name: '管理员列表',
            component: () => import('@/pages/authority/administrator')
          }]
        },
        {
          path: 'user',
          name: '用户管理',
          meta: {
            icon: 'user'
          },
          component: PageView,
          children: [{
              path: 'userList',
              name: '用户列表',
              component: () => import('@/pages/user/userList')
            },
            {
              path: 'userDetail/:id',
              name: '用户详情',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/user/detail')
            }
          ]
        },
        {
          path: 'order',
          name: '订单管理',
          meta: {
            icon: 'snippets'
          },
          component: PageView,
          children: [{
            path: 'orderList',
            name: '订单列表',
            component: () => import('@/pages/order/orderList')
          }]
        },
        {
          path: 'system',
          name: '系统设置',
          meta: {
            icon: 'setting'
          },
          component: PageView,
          children: [{
            path: 'systemSetting',
            name: '通用设置',
            component: () => import('@/pages/system')
          }]
        },
        {
          path: 'version',
          name: '版本管理',
          meta: {
            icon: 'exclamation-circle'
          },
          component: PageView,
          children: [{
            path: 'versionList',
            name: '版本列表',
            component: () => import('@/pages/version/versionList')
          }]
        },
        {
          path: 'invite',
          name: '推荐管理',
          meta: {
            icon: 'solution'
          },
          component: PageView,
          children: [{
            path: 'inviteList',
            name: '推荐列表',
            component: () => import('@/pages/invite/inviteList')
          }]
        },
        {
          path: 'exception',
          name: '异常页',
          meta: {
            icon: 'warning',
          },
          component: BlankView,
          children: [{
              path: '404',
              name: 'Exp404',
              component: () => import('@/pages/exception/404')
            },
            {
              path: '403',
              name: 'Exp403',
              component: () => import('@/pages/exception/403')
            },
            {
              path: '500',
              name: 'Exp500',
              component: () => import('@/pages/exception/500')
            }
          ]
        }
      ]
    }
  ]
}

export default options