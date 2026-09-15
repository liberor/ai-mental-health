import { Table, Button ,Modal, Spin, Skeleton} from "antd"
import { useEffect, useState } from "react"
import { getConsultations,getConsultationById } from "@/api/consultations"
import './Consultations.css'
import { LoadingOutlined } from "@ant-design/icons"

export default function Consultations() {
  const [consultations, setConsultations] = useState([])
  const [hasConsultations, setHasConsultations] = useState(false)
  const [consultation, setConsultation] = useState(null)
  const [hasConsultation, setHasConsultation] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    getConsultations({}).then(res => {
      setConsultations(res.records)
      setTotal(res.total)
      setHasConsultations(true)
    })
  }, [])
  const handleDetail = (id,row)=>{
    setIsModalOpen(true)
    setHasConsultation(false)
    getConsultationById(id).then(res=>{
      setConsultation({
        nickname:row.nickname,
        startedAt:row.startedAt,
        messageCount: row.messageCount,
        list:res
      })
      setHasConsultation(true)
    })
  }
  const dataSource = consultations.map(item => {
    return {
      id: item.id,
      key: item.id,
      nickname:item.userNickname,
      startedAt:item.startedAt,
      sessionTitle: item.sessionTitle,
      lastMessageContent: item.lastMessageContent,
      messageCount: item.messageCount,
      lastMessageTime: item.lastMessageTime,
    }
  })
  const columns = [
    {
      title: <div className='px-6'>会话id</div>,
      dataIndex: 'id',
      key: 'id',
      width: 200,
      align: 'center'
    },
    {
      title: <div className='px-6'>情绪标签</div>,
      key: 'tag',
      width: 1100,
      render: (row) => {
        return (<div>
          <div className=" text-[18px] font-bold mb-2">
            {row.sessionTitle}
          </div>
          <div className=" opacity-80">
            {row.lastMessageContent}
          </div>
        </div>)
      }
    },

    {
      title: <div className='px-6'>消息数</div>,
      dataIndex: 'messageCount',
      key: 'messageCount',
      align: 'center',
      width: 250,
    },

    {
      title: <div className='px-6'>时间</div>,
      dataIndex: 'lastMessageTime',
      key: 'lastMessageTime',
      align: 'center',
      width: 400,
    },
    {
      title: <div className='px-6'>操作</div>,
      key: 'operate',
      align: 'center',
      render: (row) => {
        return <Button type='text' style={{ color: '#1677ff',fontSize:'17px' }} onClick={()=>{handleDetail(row.id,row)}}>详情</Button>
      }
    },

  ]
  return (
    <div className="consultation">
      <div className='flex justify-between items-center p-3'>
        <span className='text-2xl font-bold'>咨询记录</span>
      </div>
      <div>
        {!hasConsultations && <div className='h-[66vh] flex justify-center items-center'><Spin indicator={<LoadingOutlined style={{fontSize:'66px'}} spin/>}></Spin></div> }
        {hasConsultations && <Table dataSource={dataSource} columns={columns} pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setCurrent(p)
            setPageSize(ps)
            setHasConsultations(false)
            getConsultations({currentPage: p, size: ps ,emotionTag:''}).then(res => {
              setConsultations(res.records)
              setTotal(res.total)
              setHasConsultations(true)
            })
          },
        }}>

        </Table>}
      </div>
      <Modal styles={{title:{fontSize:'22px'}}} open={isModalOpen} width={1400} title='咨询会话详情' onCancel={()=>setIsModalOpen(false)} cancelText='关闭'
        footer={(_, { CancelBtn }) => <CancelBtn />}>
          {!hasConsultation && <div className="pt-6 h-[70vh]"><Skeleton active></Skeleton></div> }
          {hasConsultation && <div className=" h-[70vh]">
            <div className="m-4 px-4 h-[10vh] flex flex-col justify-evenly text-[16px]" style={{backgroundColor:'#f7faf9',borderRadius:'12px',border:"solid #f7f7f7 2px"}}>
              <div className="flex">
                <span className="w-[3.6vw]">用户&nbsp;:</span><span>{consultation.nickname}</span>
              </div>
              <div className="flex">
                <span className="w-[3.6vw]">开始时间&nbsp;:</span><span>{consultation.startedAt}</span>
              </div>
              <div className="flex">
                <span className="w-[3.6vw]">消息数&nbsp;:</span><span>{consultation.messageCount}</span>
              </div>
            </div>
            <span className=" text-xl font-bold">对话记录</span>
            <div className="m-4 h-[54vh]" style={{borderRadius:'12px',border:"solid #f7f7f7 2px",overflow:"auto"}}>
              {consultation.list.map(item=>{
                return <div key={item.id} className="px-5 py-3 m-3" style={{backgroundColor:item.senderType === 1 ? '#e9f4fa':'#f0faee',borderRadius:'12px',border:"solid #f7f7f7 2px"}}>
                    <div className="flex justify-between mb-2">
                      <span className=" text-[18px]">{item.senderTypeDesc}</span>
                      <span className="text-[17px] opacity-60">{item.createdAt}</span>
                    </div>
                    <div className="text-[16px] opacity-80" >
                      {item.content}
                    </div>
                </div>
              })}
            </div>
          </div>}
      </Modal>
    </div>
  )
}
