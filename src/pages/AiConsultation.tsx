import { Avatar, Button, Card, Divider, Input } from 'antd'
import robot from '@/assets/images/robot-fill.png'
import "./AiConsultation.css"
import { DeleteOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons'
import like from '@/assets/images/like.png'



export default function AiConsultation() {
  return (
    <div className='ai-consultation w-full h-full px-[16vw] py-[2vh]'>
      <div className=' w-full h-full  flex'>

        <div className='w-[16vw] h-full  mr-6 flex flex-col'>
          <div className='w-full h-[16vh]  mb-6'>
            <Card hoverable style={{cursor:'default',height:'100%'}}>
              <div className=' h-full flex flex-col items-center'>
                <div className='breathing-circle'><Avatar src={robot} size={54}></Avatar></div>
                <div className='assistant-name'>宁渡AI助手</div>
                <div className='online-status'><span className='status-dot'></span>在线服务中</div>
              </div>
            </Card>
          </div>
          <div className='w-full  mb-6'>
            <Card hoverable style={{cursor:'default',background:' linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%)'}}>
              <div>
                <div className='text-xl font-bold' style={{color:'#8b4513'}}>情绪花园</div>
                <div className='h-[20vh] pt-6  flex flex-col items-center'>
                  <div className='emotion-info mb-3'>
                    <div>中性</div>
                    <div>50</div>
                  </div>
                  <div className='flex justify-center items-center mb-3'>
                    <span className='text-[16px] mr-3 opacity-80'>今天感觉</span>
                    <span className='text-xl font-bold'>很不错</span>
                  </div>
                  <div className='flex justify-center items-center'>
                    <span className='emotion-info-dot mr-1'></span>
                    <span className='emotion-info-dot mr-1'></span>
                    <span className='emotion-info-dot mr-2'></span>
                    <span className=' opacity-80'>正常</span>
                  </div>
                </div>

              </div>
            </Card>
          </div>
          <div className='w-full flex-1 '>
            <Card hoverable style={{cursor:'default',height:'100%'}}>
              <div className='text-xl font-bold'>会话列表</div>
              <Divider></Divider>

            </Card>
          </div>
        </div>

        <div className='flex-1 h-full chat-main'>
          <Card hoverable style={{cursor:'default',height:'100%'}} >
            <div className='w-full h-[8vh] flex px-6' style={{background:'linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)',borderRadius:'18px 18px 0 0'}}>
              <div className='h-full w-[4vw] flex justify-center items-center'><div className='w-[2.5vw] h-[2.5vw] flex justify-center items-center' style={{backgroundColor:'rgba(256,256,256,0.25)',borderRadius:'50%'}}><Avatar size={39} src={like}></Avatar></div></div>
              <div className='h-full flex-1 py-5 flex flex-col justify-between'>
                <div className='text-2xl font-bold opacity-90' style={{color:'white'}}>宁渡 AI 助手</div>
                <div className='text-xl font-bold opacity-80' style={{color:'white'}}>您的贴心 AI 心理健康助手</div>
              </div>
              <div className='h-full w-[5vw] flex justify-center items-center'><div className='w-[1.6vw] h-[1.6vw] flex justify-center items-center bg-white' style={{borderRadius:'50%'}}> <PlusOutlined style={{fontSize:'18px'}}></PlusOutlined> </div></div>
            </div>
            <div className='w-full flex-1 '>

            </div>
            <div className='w-full h-[16vh] flex p-6' style={{borderRadius:'0 0 18px 18px',borderTop:'solid 1px #ddd'}}>
              <div className='flex-1 h-full'>
                <Input.TextArea showCount maxLength={500} autoSize={{minRows:6,maxRows:6}} placeholder='请输入您想要分享的内容...'></Input.TextArea>
              </div>
              <div className='w-[3vw] ml-3 h-full flex flex-col justify-between'>
                <div className='w-[2.5vw] h-[2.5vw] mb-[10px] justify-center flex items-center cursor-pointer' style={{borderRadius:'20px',backgroundColor:'#f59e0b'}}><SendOutlined style={{fontSize:'24px',color:'white'}}/></div>
                <div className='w-[1.5vw] h-[1.5vw] flex justify-center items-center cursor-pointer' style={{borderRadius:'10px',border:"solid 1px #ddd"}}><DeleteOutlined style={{fontSize:'18px'}}/></div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
