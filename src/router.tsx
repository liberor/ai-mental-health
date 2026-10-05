import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'
import { lazy } from 'react'
import App from '@/App'
import BackLayout from '@/components/BackLayout'
import Auth from './pages/Auth'
import { message } from 'antd'
import Suitable from './pages/Suitable'
const DashBoard = lazy(()=>import('@/pages/DashBoard'))
const Knowledge = lazy(()=>import('@/pages/Knowledge'))
const Consultations = lazy(()=>import('@/pages/Consultations'))
const Emotional = lazy(()=>import('@/pages/Emotional'))
const NotFound = lazy(()=>import('./pages/NotFound'))
const Login = lazy(()=>import('./pages/Login'))
const Register = lazy(()=>import('./pages/Register'))
const Home = lazy(()=>import('./pages/Home'))
const AiConsultation = lazy(()=>import('./pages/AiConsultation'))
const MoodDiary = lazy(()=>import('./pages/MoodDiary'))
const KnowledgeStorage = lazy(()=>import('./pages/KnowledgeStorage'))
const Article = lazy(()=>import('./pages/Article'))


const AuthRoutes = [
  {
    path: '/auth',
    element: <Auth />,
    loader:()=>{
      if(window.innerWidth < 1920 || window.innerHeight < 1000){
        return redirect('/suitable')
      }
    },
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ]
  }
]
const ClientRoutesAuthGuard = () => {
  if(window.innerWidth < 1920 || window.innerHeight < 1000){
        return redirect('/suitable')
      }
  if (localStorage.getItem('mental-token') === null || localStorage.getItem('userInfo') === null) {
    message.error('请先登录')
    return redirect('/auth/login')
  }
  if (JSON.parse(localStorage.getItem('userInfo')!).userType != 1) {
    message.error('请使用用户账号')
    return redirect('/')
  }
}
const BackRoutesAuthGuard = () => {
  if(window.innerWidth < 1920 || window.innerHeight < 1000){
        return redirect('/suitable')
      }
  if (localStorage.getItem('mental-token') === null || localStorage.getItem('userInfo') === null) {
    message.error('请先登录')
    return redirect('/auth/login')
  }
  if (JSON.parse(localStorage.getItem('userInfo')!).userType != 2) {
    message.error('非管理员无权访问')
    return redirect('/')
  }
}
const BackRoutes = [
  {
    path: '/back',
    element: <BackLayout />,
    loader: BackRoutesAuthGuard,
    children: [
      {
        index: true,
        element: <Navigate to="/back/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashBoard />
      },
      {
        path: 'knowledge',
        element: <Knowledge />
      },
      {
        path: 'consultations',
        element: <Consultations />
      },
      {
        path: 'emotional',
        element: <Emotional />
      },

    ],
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: () => {
      if(window.innerWidth < 1920 || window.innerHeight < 1000){
        return redirect('/suitable')
      }
      if (localStorage.getItem('mental-token') && localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')!).userType == 2) {
        return redirect('/back')
      }
    },
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: 'aiconsultation',
        loader:ClientRoutesAuthGuard,
        element: <AiConsultation></AiConsultation>
      },
      {
        path: 'mooddiary',
        loader:ClientRoutesAuthGuard,
        element: <MoodDiary></MoodDiary>
      },
      {
        path: 'knowledgestorage',
        loader:ClientRoutesAuthGuard,
        element: <KnowledgeStorage></KnowledgeStorage>,
      },
      {
        path: 'knowledgestorage/article/:id',
        loader:ClientRoutesAuthGuard,
        element: <Article></Article>
      }
    ]
  },
  ...AuthRoutes,
  ...BackRoutes,
  {
    path:'/suitable',
    element:<Suitable/>
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router