import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import './index.css'

const messageConfig = {
  top: 66,
  duration: 3,
  maxCount: 3,
  styles: {
    root: { borderRadius: 12, padding: '10px 20px' },
    title: { fontSize: '18px' },
    icon: { fontSize: '18px' },
  },
}

ConfigProvider.config({
  holderRender: (children) => (
    <ConfigProvider locale={zhCN}>
      <AntdApp message={messageConfig}>{children}</AntdApp>
    </ConfigProvider>
  ),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <AntdApp message={messageConfig}>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
