import {App,Button,Input,Form} from 'antd'
import { register } from '@/api/register';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  username: string;
  email: string,
  nickname: string,
  phone: string,
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const Nav = useNavigate()
    const { message: messageApi } = App.useApp()
    const onFinish = (values:FormValues)=>{
        register({...values,gender:0,userType:1}).then(res=>{
          messageApi.open({
            type:'success',
            content:'注册成功,请返回登录',
            duration:5000
          })
        })
    }
  return (
    <div className=' h-[56vh] w-[16vw]'>
        <div className='flex flex-col items-center'>
            <h3 className='text-4xl font-bold mb-[1vh]'>创建您的账户</h3>
            <p className=' text-[16px] opacity-60 mb-[5vh]'>请填写注册信息</p>
            <Form onFinish={onFinish} style={{width:'100%'}}>
              <Form.Item name='username' rules={[{required:true,message:'请输入用户名'}]}>
                <Input placeholder='用户名' size='large'></Input>
              </Form.Item>
              <Form.Item name='email' rules={[{required:true,message:'请输入邮箱'},{ type: 'email', message: '请输入正确的邮箱地址' }]}>
                <Input placeholder='邮箱' size='large' style={{marginTop:'2vh'}}></Input>
              </Form.Item>
              <Form.Item name='nickname' >
                <Input placeholder='昵称(可选)' size='large' style={{marginTop:'2vh'}}></Input>
              </Form.Item>
              <Form.Item name='phone' rules={[{required:true,message:'请输入手机号'},{pattern:/^1[3-9]\d{9}$/,message:'请输入正确的手机号'}]}>
                <Input placeholder='手机号' size='large' style={{marginTop:'2vh'}}></Input>
              </Form.Item>
              <Form.Item name='password' rules={[{required:true,message:'请输入密码'}]}>
                <Input.Password placeholder='密码' size='large' style={{marginTop:'2vh'}}></Input.Password>
              </Form.Item>
              <Form.Item name='confirmPassword' rules={[{required:true,message:'请确认密码'}]}>
                <Input.Password placeholder='确认密码' size='large' style={{marginTop:'2vh'}}></Input.Password>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType='submit' size='large' style={{marginTop:'3vh',width:'100%'}}>创建账户</Button>
              </Form.Item>
            </Form>
            <span>已有账户?&nbsp;<span className=' text-purple-500 cursor-pointer' onClick={()=>Nav('/auth/login')}>立即登录</span></span>
        </div>
    </div>
  )
}
