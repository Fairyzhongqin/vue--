import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error => error)
// }
// 固定路由 放置不需要权限的页面
export const constantRoutes = [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/pages/login'),
    // props: (route) => ({ query: route.query.userId })
    // component:resolve=>(require(['@/pages/login/login']),resolve),
  },

  {
    path: '/content',
    name: '工作台',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/messageReminder', // 消息提醒
        name: '消息提醒',
        component: () => import('@/pages/messageReminder'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/inspectionScheme', // 检查方案
        name: '检查方案',
        component: () => import('@/pages/inspectionScheme'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/onSiteInspection', // 现场检查记录
        name: '现场检查记录',
        component: () => import('@/pages/onSiteInspection'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/inspectionResultHandle', // 检查结果处理
        name: '检查结果处理',
        component: () => import('@/pages/inspectionResultHandle'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/rectificationReview', // 整改复查
        name: '整改复查',
        component: () => import('@/pages/rectification/rectificationReview'),
        meta: {
          keepAlive: true
        }
        // beforeEnter: (to, from, next) => {
        //   store.commit("getCurrentReview", true);
        //   next();
        // }
      },
      {
        path: '/rectificationDelay', // 延期申请审批
        name: '延期申请审批',
        component: () => import('@/pages/rectification/rectificationDelay'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/rectificationReviewDelay', // 延期整改复查-整改复查
        name: '整改复查',
        component: () => import('@/pages/rectification/innerReview/index'),
        meta: {
          keepAlive: true
        }
        // beforeEnter: (to, from, next) => {
        //   store.commit("getCurrentReview", false);
        //   next();
        // }
      },
      {
        path: '/commonHandle',
        name: '一般程序行政处罚',
        component: () => import('@/pages/commonHandle/index'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/simpleHandle',
        name: '简易程序行政处罚',
        component: () => import('@/pages/simpleHandle'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/inspectionTemplate',
        name: '检查方案模板',
        component: () => import('@/pages/inspectionTemplate/index'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/audit',
    name: '审核审批',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/todoTask', // 待办事项
        name: '待办任务',
        // params: 'todo',
        component: () => import('@/pages/myTask/index'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/doneTask', // 已办事项
        name: '已办任务',
        component: () => import('@/pages/myTask/index'),
        // params: 'done',
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/lawAudit',
    name: '法制审核',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/todoAudit', // 法制审核 - 待处理
        name: '待审核',
        component: () => import('@/pages/legalAudit'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/doneAudit', // 法制审核 - 已处理
        name: '已审核',
        component: () => import('@/pages/legalAudit'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/group',
    name: '集体讨论',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/todoDiscussion',
        name: '待讨论',
        component: () => import('@/pages/groupDiscussion'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/doneDiscussion',
        name: '已讨论',
        component: () => import('@/pages/groupDiscussion'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/sign',
        name: '会签',
        component: () => import('@/pages/groupSign'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/hear',
    name: '组织听证',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/todoHear',
        name: '待听证',
        component: () => import('@/pages/penatlyHear/index'),
        // params: 'todo',
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/doneHear',
        name: '已听证',
        component: () => import('@/pages/penatlyHear/index'),
        // params: 'done',
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/overdueHear',
        name: '超期未听证',
        component: () => import('@/pages/penatlyHear/index'),
        // params: 'todo',
        meta: {
          keepAlive: true
        }
      },
    ]
  },
  {
    path: '/knowledge',
    name: '执法知识库',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/discretionaryContent',
        name: '自由裁量内容',
        component: () => import('../pages/knowledgeBase/discretionaryContent'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/discretionaryFactor',
        name: '自由裁量因子',
        component: () => import('../pages/knowledgeBase/discretionaryFactor'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/freeCoefficien',
        name: '自由裁量系数',
        component: () => import('../pages/knowledgeBase/freeCoefficien'),
        meta: {
          keepAlive: true
        }
        // children: [
        //   {
        //     path: '/addFreeCoefficien',
        //     name: '新增自由裁量系数',
        //     component: () => import('../pages/knowledgeBase/freeCoefficien/compomnents/AddFreeCoefficien.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        //   {
        //     path: '/editFreeCoefficien',
        //     name: '修改自由裁量系数',
        //     component: () => import('../pages/knowledgeBase/freeCoefficien/compomnents/EditFreeCoefficien.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        // ]
      },
      {
        path: '/inspectionContents',
        name: '执法检查内容',
        component: () => import('../pages/knowledgeBase/inspectionContents'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/commonChecks',
        name: '常用检查项',
        component: () => import('../pages/knowledgeBase/commonChecks'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/standardQueries',
        name: '标准查询大全',
        component: () => import('../pages/knowledgeBase/standardQueries'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/company',
    name: '企业信息',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/enterpriseInfo', // 企业信息
        name: '企业信息',
        component: () => import('@/pages/enterpriseInfo'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },

  {
    path: '/judge',
    name: '分析研判',
    meta: {
      affix: true
    },
    // component: () => import('@/pages/home'),
    component: () => import('@/pages/analysisAndJudgement/index'),
    children: []
  },
  {
    path: '/system',
    name: '系统管理',
    meta: {
      affix: true
    },
    component: () => import('@/pages/home'),
    children: [
      {
        path: '/adminiManagement',
        name: '用户管理',
        component: () => import('../pages/systemManagement/adminiManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/departmentManagement',
        name: '部门管理',
        component: () => import('../pages/systemManagement/departmentManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/roleManagement',
        name: '角色管理',
        component: () => import('../pages/systemManagement/roleManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/menuManagement',
        name: '菜单管理',
        component: () => import('../pages/systemManagement/menuManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/parameterManagement',
        name: '参数管理',
        component: () => import('../pages/systemManagement/parameterManagement/index.vue'),
        meta: {
          keepAlive: true
        }
        // children: [
        //   {
        //     path: '/addParameterInfo',
        //     name: '新增参数信息',
        //     component: () => import('@/pages/systemManagement/parameterManagement/components/AddParameterInfo.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        //   {
        //     path: '/editParameterInfo',
        //     name: '修改参数信息',
        //     component: () => import('@/pages/systemManagement/parameterManagement/components/EditParameterInfo.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        // ],
      },
      {
        path: '/dictionaryManagement',
        name: '字典管理',
        component: () => import('@/pages/systemManagement/dictionaryManagement/index.vue'),
        meta: {
          keepAlive: true
        }
        // children: [
        //   {
        //     path: '/addDictionaryInfo',
        //     name: '新增字典信息',
        //     component: () => import('@/pages/systemManagement/dictionaryManagement/components/AddDictionaryInfo.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        //   {
        //     path: '/editDictionaryInfo',
        //     name: '修改字典信息',
        //     component: () => import('@/pages/systemManagement/dictionaryManagement/components/EditDictionaryInfo.vue'),
        //     meta: {
        //       keepAlive: true
        //     },
        //   },
        // ]
      },
      {
        path: '/writTypeEnumManagement',
        name: '文书管理',
        component: () => import('@/pages/systemManagement/writTypeEnumManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/autoSignManagement',
        name: '自动签章管理',
        component: () => import('@/pages/systemManagement/autoSignManagement/index.vue'),
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/operationMaintenance',
        name: '运维管理',
        component: () => import('@/pages/systemManagement/operationMaintenance/index.vue'),
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/taskMaintenance',
        name: '任务管理',
        component: () => import('@/pages/systemManagement/taskMaintenance/index.vue'),
        meta: {
          keepAlive: true
        }
      }

    ]
  },
  {
    path: '/transfer',
    name: '链接',
    component: () => import('@/pages/login/transfer'),
    params: 'userId',
    // props: (route) => ({ query: route.query.userId })
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  },
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/permission',
    component: () => import('@/pages/home'),
    name: '权限测试',
    meta: {
      role: ['admin', 'super_editor']
    } // 页面需要的权限
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

// 处理 Loading chunk {数字} failed.
/* router.onError(error => {
  console.info('iswork')
  const pattern = /Loading chunk (\d)+ failed/g
  const matchedMsg = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (matchedMsg.length > 0) {
    router.replace(targetPath)
  }
}) */

const getPathStr = (list = []) => {
  let path = list.reduce((total, item) => {
    let child = ''
    if (item.children && item.children.length > 0) {
      child = getPathStr(item.children)
      child += item.path
    } else {
      total += item.path
    }
    total += child
    return total
  }, '')
  return path
}

const commonPath = getPathStr(constantRoutes[1].children) + '/content'
const auditPath = getPathStr(constantRoutes[2].children) + '/audit'
const lawAuditPath = getPathStr(constantRoutes[3].children) + '/lawAudit'
const groupPath = getPathStr(constantRoutes[4].children) + '/group'
const hearPath = getPathStr(constantRoutes[5].children) + '/hear'
const knowledgePath = getPathStr(constantRoutes[6].children) + '/knowledge'
const companyPath = getPathStr(constantRoutes[7].children) + '/company'
const judgePath = getPathStr(constantRoutes[8].children) + '/judge'
const systemPath = getPathStr(constantRoutes[9].children) + '/system'
const alonePath = '/legalAudit/groupDiscussion/penatlyHear/enterpriseInfo'
const adminPathList = [auditPath, knowledgePath, judgePath, systemPath, lawAuditPath, groupPath, hearPath, companyPath, alonePath]
const commonPathList = commonPath
const hasChildPathList = [commonPath, auditPath, hearPath, groupPath, knowledgePath, systemPath, lawAuditPath]
let loginState = sessionStorage.getItem('role_permision')
console.log('router debug:')
console.table({
  adminPathList: adminPathList,
  commonPathList: commonPathList,
  hasChildPathList: hasChildPathList
})
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/login' || from.fullPath === '/login' || to.fullPath.indexOf('/transfer') !== -1 || from.fullPath.indexOf('/transfer') !== -1) {
    console.log('rjs1')
    next()
    return
  }
  if (adminPathList.join(',').indexOf(to.fullPath) !== -1 && from.fullPath === '/' && loginState.indexOf('admin') !== -1) {
    console.log('rjs2')
    next()
    return
  }
  if (commonPathList.indexOf(to.fullPath) !== -1 && from.fullPath === '/' && loginState.indexOf('common') !== -1) {
    console.log('rjs3')
    next()
    return
  }
  for (let item of hasChildPathList) {
    if (item.indexOf(to.fullPath) !== -1) {
      if (item.indexOf(from.fullPath) !== -1 && from.fullPath !== '/') {
        console.log('rjs4')
        next()
        return
      } else {
        next('/login')
      }
    }
  }
})

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
