import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Login'),
      children:[
        {
          path:'',
          name:'login',
          meta:{title:'登录'},
          component: () => import('@/views/Login')
        }
      ]
    },
    {
      path: '/api',
      name: 'api',
      component: () => import('@/components/Layout'),
      children:[
        {
          path: 'student',
          name: 'student',
          component: () => import('@/views/teacher/student')
        },
        {//------------------学生管理-----------------
          path: 'student',
          name: 'student',
          component:resolve => require(['@/views/teacher/student'],resolve)
        },
        {//------------------成绩管理-----------------
          path: 'score',
          name: 'score',
          component:resolve => require(['@/views/teacher/score'],resolve)
        },
        {//------------------作业管理-----------------
          path: 'homework',
          name: 'homework',
          component:resolve => require(['@/views/teacher/homework'],resolve)
        },
        {//------------------教师信息----------------
          path: 'information',
          name: 'information',
          component:resolve => require(['@/views/teacher/information'],resolve)
        }
      ]
    },
    {
      path: '/stu',
      name: 'stu',
      component: () => import('@/components/stuLayout'),
      children:[
        {//------------------作业管理-----------------
          path: 'homework',
          name: 'homework',
          component: () => import('@/views/student/homework')
        },
        {//------------------学生管理-----------------
          path: 'score',
          name: 'score',
          component:resolve => require(['@/views/student/score'],resolve)
        },
        {//------------------学生信息----------------
          path: 'information',
          name: 'information',
          component:resolve => require(['@/views/student/information'],resolve)
        }
      ]
    },{
      path:'/register',
      name:'register',
      meta:{  title:'注册'},
      component: () => import('@/views/register')
    }
    
  ]
})
