import './App.css'
import { Layout, Avatar, Tabs, Button, App as AntdApp } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import robot from '@/assets/images/机器人.png'
import { logout } from './api/logout';
import { useEffect } from 'react';
const { Header, Footer, Content } = Layout;
function App() {
  const Nav = useNavigate()
  const location = useLocation()
  const rootPathName = '/' + location.pathname.split('/')[1]
  const { message } = AntdApp.useApp()
  const HasClientAuth = localStorage.getItem('mental-token') && localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')!).userType == 1
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1900 || window.innerWidth > 2600 || window.innerHeight < 1000 || window.innerHeight > 1600) {
        Nav('/suitable', { replace: true })
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const handleLogout = () => {
    logout().then(_ => {
      localStorage.removeItem('mental-token')
      localStorage.removeItem('userInfo')
      Nav('/')
      message.success('登出成功')
    })
  }
  const tabItems = HasClientAuth ? [
    {
      label: 'AI咨询',
      key: '/aiconsultation'
    },
    {
      label: '情绪日志',
      key: '/mooddiary'
    },
    {
      label: '知识库',
      key: '/knowledgestorage'
    },

  ] : [
    {
      label: '知识库',
      key: '/knowledgestorage'
    },
    {
      label: '登录',
      key: '/auth/login'
    }
  ]
  return (

    <div>
      <Layout>
        <Header style={{ backgroundColor: '#eee', height: '6vh' }}>
          <div className=' flex justify-between items-center px-[12vw] h-full'>
            <div className=' flex items-center'>
              <Avatar src={robot} size={56}></Avatar>
              <span className=' text-2xl font-bold ml-3'>心理健康AI助手</span>
            </div>
            <div className='flex items-end h-full'>
              <Tabs
                activeKey={rootPathName}
                onChange={(key) => Nav(key)}
                items={[
                  {
                    label: '首页',
                    key: '/',
                  },
                  ...tabItems
                ]}
              />
              {!HasClientAuth ? <Button type='primary' style={{ fontSize: '20px', marginLeft: '48px', marginBottom: '11px' }} onClick={() => Nav('/auth/register')}>注册</Button>
                : <Button type='text' style={{ fontSize: '20px', marginLeft: '48px', marginBottom: '11px', padding: '5px 8px', border: "solid #ccc 2px", opacity: "70%" }} onClick={() => handleLogout()}>退出登录</Button>}
            </div>
          </div>
        </Header>
        <Content style={{ height: '90vh', overflow: "auto" }}>
          <Outlet></Outlet>
        </Content>
        <Footer style={{ backgroundColor: '#333', height: '4vh' }}>
          <div className=' flex justify-center items-center h-full'>
            <span className=' text-white'>©2026 心理健康AI助手. 保留所有权利.</span>
          </div>
        </Footer>
      </Layout>
    </div>
  )
}

export default App
