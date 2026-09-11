import { createBrowserRouter, Navigate, redirect } from 'react-router-dom'
import App from '@/App'
import BackLayout from '@/components/BackLayout'
import DashBoard from '@/pages/DashBoard'
import Knowledge from '@/pages/Knowledge'
import Consultations from '@/pages/Consultations'
import Emotional from '@/pages/Emotional'
import NotFound from './pages/NotFound'
import Auth from './pages/Auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import { message } from 'antd'
import AiConsultation from './pages/AiConsultation'
import MoodDiary from './pages/MoodDiary'
import KnowledgeStorage from './pages/KnowledgeStorage'
import Article from './pages/Article'

const AuthRoutes = [
  {
    path: '/auth',
    element: <Auth />,
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
  if (localStorage.getItem('mental-token') === null || localStorage.getItem('userInfo') === null) {
    message.error('请先登录')
    return redirect('/auth/login')
  }
  if (JSON.parse(localStorage.getItem('userInfo')).userType != 1) {
    message.error('请使用用户账号')
    return redirect('/')
  }
}
const BackRoutesAuthGuard = () => {
  if (localStorage.getItem('mental-token') === null || localStorage.getItem('userInfo') === null) {
    message.error('请先登录')
    return redirect('/auth/login')
  }
  if (JSON.parse(localStorage.getItem('userInfo')).userType != 2) {
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
      if (localStorage.getItem('mental-token') && localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).userType == 2) {
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
    path: '*',
    element: <NotFound />
  }
])

export default router