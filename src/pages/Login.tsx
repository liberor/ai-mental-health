import { App, Button, Input, Form, message } from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import { login } from '@/api/login';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  username: string;
  password: string;
}
export default function Login() {
  const Nav = useNavigate()
  const { message: messageApi } = App.useApp()
  const onFinish = (values: FormValues) => {
    login(values).then((res:any) => {
      if (!Object.hasOwn(res, 'token') || ('token' in res && res.token == null)) {
        messageApi.open({
          type: 'error',
          content: '登录失败'
        })
        return
      }
      message.success('登录成功')
      localStorage.setItem('mental-token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      if (res.userInfo.userType === 2) {
        Nav('/back/dashboard', { replace: true })
      }
      else if (res.userInfo.userType === 1) {
        Nav('/', { replace: true })
      }
    })
  }
  return (
    <div className=' h-[56vh] w-[16vw]'>
      <div>
        <span className=' text-[18px] cursor-pointer' onClick={() => Nav('/')}><ArrowLeftOutlined />返回首页</span>
      </div>
      <div className='flex flex-col items-center'>
        <h3 className='text-4xl font-bold mt-[8vh] mb-[6vh]'>登录您的账户</h3>
        <Form onFinish={onFinish} style={{ width: '100%' }}>
          <Form.Item name='username' rules={[{ required: true, message: '请输入用户名或邮箱' }]}>
            <Input placeholder='管理员admin/用户allen' size='large'></Input>
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder='123456' size='large' style={{ marginTop: '2vh' }}></Input.Password>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType='submit' size='large' style={{ marginTop: '3vh', width: '100%' }}>登录账户</Button>
          </Form.Item>
        </Form>
        <span>还没有账户?&nbsp;<span className=' text-purple-500 cursor-pointer' onClick={() => Nav('/auth/register')}>去注册</span></span>
      </div>
    </div>
  )
}
