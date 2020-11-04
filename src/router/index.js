import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/Login.vue'
// import Home from '../views/Home.vue'
// import Welcome from '../views/Welcome.vue'
// import Users from '../views/User/Users.vue'
// 路由懒加载
const Login = () => import('../views/Login')
const Home = () => import('../views/Home')
const Welcome = () => import('../views/Welcome')
const Users = () => import('../views/User/Users')
const Roles = () => import('../views/Power/Roles')
const Rights = () => import('../views/Power/Rights.vue')
Vue.use(VueRouter)

const routes = [
  {
    // 路由重定位
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    
    children:[
      {
        // 子路由的路由重定位
        path:'/',
        redirect:'/welcome'
      },
      {
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/users',
      component:Users
    }
    ,
    {
      path:'/rights',
      component:Rights
     },
     {
       path:'/roles',
       component:Roles
     }
      
  ]
  },

  
]


const router = new VueRouter({
  routes,
  mode:'history'
  
})


// 挂载一个路由导航守卫,目的是为了没有登录权限的时候无法登陆进类似home这样的需要有权限的界面
router.beforeEach((to,from,next) => {
  // to表示将要访问的路径
  // from代表从哪个路径跳转而来
  // next是个函数，表示放行
  //  next() 直接放行   next('/login) 强制跳转到'/login'的路径
  if(to.path == '/login') return next();
  // 获取token
  const tokeyStr = window.sessionStorage.getItem('token')
  if(!tokeyStr) return next('/login')
  next()
})

export default router
