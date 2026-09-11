import {Avatar,Button} from 'antd'
import './Home.css'
import robot from '@/assets/images/robot-fill.png'
import { useNavigate } from 'react-router-dom'





export default function Home() {
    const Nav = useNavigate()
    return (
        <div className=' w-full h-full flex justify-center items-center' style={{ background: 'linear-gradient(90deg, rgb(74, 156, 140) 0%, rgb(61, 138, 122) 100%) rgba(74, 156, 140, 0.95)' }}>
            <div className='flex items-center'>
                <div className='mr-8 w-[500px]'>
                    <h3 className='text-5xl font-bold mb-4 text-white'>一次温暖的对话</h3>
                    <h3 className='text-5xl font-bold mb-6 text-yellow-300'>化孤独为慰藉</h3>
                    <p className='mb-6 text-[16px]' style={{color:'#eee'}}>每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
                    <div>
                        <Button style={{marginRight:'10px',height:'3vh'}} onClick={()=>Nav('/aiconsultation')}>开始倾诉，获得陪伴</Button>
                        <Button type='text' style={{height:'3vh',border:'1px solid white',color:'white'}} onClick={()=>Nav('/mooddiary')}>记录心情，释放情感</Button>
                    </div>
                </div>
                <div>
                    <div className='robot' >
                        <Avatar src={robot} size={200}></Avatar>
                    </div>
                </div>
            </div>
        </div>
    )
}
