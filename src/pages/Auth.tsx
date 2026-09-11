import { Row, Col,Avatar } from 'antd'
import { Outlet } from 'react-router-dom'
import robot from '@/assets/images/robot-fill.png'
import './Auth.css'
export default function Auth() {
    return (
        <Row gutter={0}>
            <Col span={12} style={{ height: '100vh',background: 'linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95)' }}>
                <div className='flex flex-col items-center pt-[30vh]' >
                    <h2 className='title text-xl'>心理AI助手</h2>
                    <p className='text text-xl'>每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖每一天</p>
                    <div className='robot' >
                        <Avatar src={robot} size={81}></Avatar>
                    </div>
                </div>
            </Col>
            <Col span={12} style={{ height: '100vh' }}>
                <div className='flex justify-center items-center h-full'>
                    <Outlet></Outlet>
                </div>
            </Col>
        </Row>
    )
}
