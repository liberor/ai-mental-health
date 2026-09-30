import { Avatar, Card, Divider, Input, message, Spin } from 'antd'
import robot from '@/assets/images/robot-fill.png'
import users from '@/assets/images/users.png'
import "./AiConsultation.css"
import { ClockCircleOutlined, DeleteFilled, DeleteOutlined, DownCircleFilled, EllipsisOutlined, LoadingOutlined, MessageOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons'
import like from '@/assets/images/like.png'
import { getHistoryList, deleteHistorySession, startNewSession, getHistorySessionMessages, getEmotion } from '@/api/aiconsul'
import { useEffect, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import dayjs from 'dayjs'
import contentToMarkdown from '@/utils/contentToMarkdown'
import GardenDots from '@/components/GardenDots'

const riskTextMap: Record<number, string> = {
  0: '正常',
  1: '关注',
  2: '预警',
  3: '危机'
}
const getEmotionScoreColor = (isNegative: boolean, score: number) => {
  if (isNegative) {
    if (score <= 40) return '#67c23a'
    if (score <= 60) return '#909399'
    if (score <= 80) return '#e6a23c'
    return '#f56c6c'
  } else {
    if (score <= 40) return '#f56c6c'
    if (score <= 60) return '#e6a23c'
    if (score <= 80) return '#909399'
    return '#67c23a'
  }
}

export default function AiConsultation() {
  const h = document.documentElement.clientWidth
  const [historyList, setHistoryList] = useState<Array<any>>([])
  const [hasHistoryList, setHasHistoryList] = useState(false)
  const [userMsg, setUserMsg] = useState('')
  const [currentSession, setCurrentSession] = useState(() => ({ id: '', title: '' }))
  const [currentEmotion, setCurrentEmotion] = useState<any>(null)
  const [messages, setMessages] = useState<Array<any>>([])
  const [sliceLen, setSliceLen] = useState(1)
  const helloStr = '您好！我是小暖，您的 AI 心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？'
  const timer = useRef<number | null>(null)
  const [isShowHistoryOnly, setIsShowHistoryOnly] = useState(false)
  const [current,] = useState(1)
  const [pageSize,] = useState(10)
  const [, setTotal] = useState(0)
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const container = useRef<HTMLElement | null>(null)
  const selfScrolled = useRef<boolean>(false)
  const userScrolled = useRef<boolean>(false)
  const timer_scroll = useRef<null | number>(null)
  useEffect(() => {
    if (sliceLen === 1 && timer.current == null) {
      timer.current = setInterval(() => setSliceLen((s) => s + 1), 25)
    }
    else if (sliceLen >= helloStr.length && timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }, [sliceLen])

  useEffect(() => {
    getHistoryList({ pageNum: current, pageSize }).then((res: any) => {
      setHistoryList((res && res.records) ?? [])
      setTotal(res.total)
      setHasHistoryList(true)
    })
    container.current = document.getElementById('chat-container')
    container.current?.addEventListener('scroll', () => {
      if (selfScrolled.current) return
      userScrolled.current = true
      const el = container.current
      if(el && el.scrollTop + el.clientHeight + 300 < el.scrollHeight){
        setShowHint(true)
      }else{
        setShowHint(false)
      }
    })
    container.current?.addEventListener('scrollend', () => {
      selfScrolled.current = false
    })
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }

  }, [])
  const handleDeleteHistorySession = (id: string | number) => {
    deleteHistorySession(id).then((_) => {
      message.success('删除成功')
      getHistoryList({ pageNum: current, pageSize }).then((res: any) => {
        setHistoryList((res && res.records) ?? [])
        setTotal(res.total)
        setHasHistoryList(true)
      })
      if ('session_' + id === currentSession.id) {
        setMessages([])
        setCurrentSession({ id: '', title: '' })
        setCurrentEmotion(null)
      }
    }).catch(_ => {
      message.error('删除失败')
    })
  }
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()   // 阻止插入换行
      handleSend()
    }
  }
  const handleSend = () => {
    if (!userMsg.trim()) return
    if (isAiTyping) {
      message.warning('AI回复中,请稍等')
      return
    }
    const userMsgCopy = userMsg
    setUserMsg('')
    setTimeout(() => {
      container.current?.scrollTo({ top: container.current.scrollHeight, behavior: 'smooth' })
    }, 200);
    setMessages(messages => ([...messages, {
      id: Date.now(),
      content: userMsgCopy,
      senderType: 1,
      createdAt: new Date().toISOString()
    }]))
    setIsAiTyping(true)
    if (!currentSession.id) {
      const dateStrForTitle = `心理健康AI助手 - ${new Date().toLocaleString()}`
      startNewSession(dateStrForTitle, userMsgCopy).then((res: any) => {

        if (res) {
          setCurrentSession({ id: res.sessionId, title: dateStrForTitle })
          startAiStream(res.sessionId, userMsgCopy)
        }
      })

    }
    else {
      startAiStream(currentSession.id, userMsgCopy)
    }
  }
  const startAiStream = (sessionId: number | string, userMessage: string) => {
    setMessages(messages => ([...messages, {
      id: 'ai_' + Date.now(),
      content: '',
      senderType: 2,
      createdAt: new Date().toISOString()
    }]))
    const ctrl = new AbortController()
    fetchEventSource(import.meta.env.VITE_APP_BASE_API + '/psychological-chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': localStorage.getItem('mental-token') ?? '',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        sessionId, userMessage
      }),
      signal: ctrl.signal,
      onopen: async (res) => {
        if (res.headers.get('Content-Type') !== 'text/event-stream') {
          message.error('服务器返回非流式数据')
        }
        userScrolled.current = false
        selfScrolled.current = true
        container.current?.scrollTo({ top: container.current.scrollHeight, behavior: 'smooth' })
      },
      onmessage: (res) => {
        if (res.event == 'done') {
          setIsAiTyping(false)
          ctrl.abort()
          getHistoryList({ pageNum: current, pageSize }).then((res: any) => {
            setHistoryList((res && res.records) ?? [])
            setTotal(res.total)
            setHasHistoryList(true)
          })
          getEmotion(sessionId).then((res: any) => {
            setCurrentEmotion(res)
          })
          return
        }
        const raw = res.data.trim()
        if (!raw) return
        const payload = JSON.parse(raw)
        if (payload.code?.toString() === '200' && payload.data?.content) {
          setMessages(prev => {
            const last = prev[prev.length - 1]
            return [
              ...prev.slice(0, -1),
              { ...last, content: (last.content ?? '') + payload.data.content },
            ]
          })
        }
        if (!userScrolled.current) {
          if (!timer_scroll.current) {
            timer_scroll.current = setTimeout(() => {
              selfScrolled.current = true
              container.current?.scrollBy({ top: 50, behavior: 'smooth' })
              timer_scroll.current = null
            }, 500);
          }
        }
        if (payload.code.toString() !== '200') {
          handleError(payload.message ?? 'AI回复失败')
        }
      },
      onerror: (err) => {
        setIsAiTyping(false)
        handleError(err ?? 'AI回复失败')
      },
      onclose: () => {
        setIsAiTyping(false)
      }
    })
  }
  const handleError = (error: any) => {
    setMessages(prev => {
      const last = prev[prev.length - 1]
      return [
        ...prev.slice(0, -1),
        { ...last, content: 'AI回复失败,请重试' },
      ]
    })
    message.error(error)
  }
  const handleClickPlus = () => {
    setMessages([])
    setCurrentSession({ id: '', title: '' })
    setSliceLen(1)
    setCurrentEmotion(null)
  }
  return (
    <div className='ai-consultation w-full h-full px-[16vw] py-[2vh]'>
      <div className=' w-full h-full  flex'>

        <div className=' h-full  mr-6 flex flex-col' style={{ width: isShowHistoryOnly ? '16vw' : '16vw', transition: 'all 0.2s' }}>
          {!isShowHistoryOnly && <div className='w-full h-[14vh]  mb-6' >
            <Card hoverable style={{ cursor: 'default', height: '100%' }}>
              <div className=' h-full flex flex-col items-center'>
                <div className='breathing-circle' style={{ marginBottom: h == 1920 ? '3px' : '12px' }}><Avatar src={robot} size={42}></Avatar></div>
                <div className='assistant-name' style={{ marginBottom: h == 1920 ? '2px' : '6px' }}>健康AI助手</div>
                <div className='online-status'><span className='status-dot'></span>在线服务中</div>
              </div>
            </Card>
          </div>}
          {!isShowHistoryOnly && <div className='w-full  mb-6'>
            <Card hoverable style={{ cursor: 'default', background: ' linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%)' }}>
              <div>
                <div className='text-xl font-bold' style={{ color: '#8b4513' }}>情绪花园</div>
                <div className='h-[15vh] flex flex-col items-center' style={{ paddingTop: h == 1920 ? '0px' : '12px' }}>
                  <div className='emotion-info ' style={{ marginBottom: h == 1920 ? '0px' : '12px' }}>
                    <div className='text-[18px] font-bold'>{currentEmotion == null ? "中性" : (currentEmotion.isNegative ? '消极' : '积极')}</div>
                    <div className='text-[18px] font-bold' style={{ color: currentEmotion ? getEmotionScoreColor(currentEmotion.isNegative, currentEmotion.emotionScore) : 'white' }}>{currentEmotion == null ? "50" : currentEmotion.emotionScore}</div>
                  </div>
                  <div className='flex justify-center items-center' style={{ marginBottom: h == 1920 ? '5px' : '12px', marginTop: h == 1920 ? '5px' : '0px' }}>
                    <span className='text-[16px] mr-3 opacity-80'>今天感觉</span>
                    <span className='text-xl font-bold'>{currentEmotion == null ? "很不错" : currentEmotion.primaryEmotion}</span>
                  </div>
                  <div className='flex justify-center items-center'>
                    <GardenDots riskLevel={(currentEmotion && currentEmotion.riskLevel) ? currentEmotion.riskLevel : 0}></GardenDots>
                    <span className=' opacity-80'>{(currentEmotion && currentEmotion.riskLevel) ? riskTextMap[currentEmotion.riskLevel] : riskTextMap[0]}</span>
                  </div>
                </div>
                <div className='flex items-center p-3' style={{ borderRadius: '12px', backgroundColor: '#FDFDF8', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                  <div className='h-full w-[2vw] mr-1 text-3xl flex justify-center items-center'><span>💝</span></div>
                  <div className='h-full flex-1'>
                    <div className='text-[18px] font-bold mb-1' style={{ color: '#a38d6e' }}>给你的小建议</div>
                    <div className='text-[15px] ' style={{ color: '#9D9487', fontWeight: '500' }}>{currentEmotion == null ? "情绪状态平稳" : currentEmotion.suggestion}</div>
                  </div>
                </div>
                {currentEmotion && currentEmotion.improvementSuggestions && currentEmotion.improvementSuggestions.length > 0 && <div>
                  <div className='text-[18px] font-bold ' style={{ marginBottom: h == 1920 ? '8px' : '16px', marginTop: h == 1920 ? '10px' : '20px', color: '#a38d6e', textAlign: "center" }}>治愈小行动</div>
                  {currentEmotion.improvementSuggestions.map((item: string) => {
                    return <div key={item} className='py-1 pl-5 mb-3' style={{ borderRadius: '12px', backgroundColor: '#FDFDF8', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}><span className='text-xl mr-2'>✨</span><span className='text-[15px] ' style={{ color: '#9D9487', fontWeight: '500' }}>{item}</span></div>
                  })}
                </div>}
                {currentEmotion && currentEmotion.isNegative && currentEmotion.riskLevel > 1 && <div className='risk-notice flex mt-5'>
                  <div className='h-full w-[2vw] text-3xl flex justify-center items-center pt-3'><span>🤗</span></div>
                  <div className='h-full flex-1 pr-5'>
                    <div className='text-[18px] font-bold mb-1' style={{ color: '#a38d6e', textAlign: 'center' }}>温馨提醒</div>
                    <div className='text-[16px] ' style={{ color: '#d39949', fontWeight: '500', textAlign: 'center' }}>{currentEmotion == null ? "情绪状态平稳" : currentEmotion.riskDescription}</div>
                  </div>
                </div>}
              </div>
            </Card>
          </div>}
          <div className='w-full flex-1 min-h-0'>
            <Card hoverable className='history-list' style={{ cursor: 'default', height: '100%' }}>
              {!hasHistoryList && <div className='h-full flex justify-center items-center'><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}></Spin></div>}
              {hasHistoryList && <div className=' h-full  flex flex-col'>
                <div className='w-full text-xl font-bold flex justify-between'><span>会话历史</span><EllipsisOutlined style={{ fontSize: '28px', cursor: 'pointer' }} onClick={() => setIsShowHistoryOnly((pre) => !pre)} /></div>
                <Divider></Divider>
                <div className='w-full flex-1  overflow-auto'>
                  {hasHistoryList && historyList.length === 0 && <div className='text-xl font-bold opacity-60 '>没有历史记录...</div>}
                  {hasHistoryList && historyList.length > 0 && historyList.map(obj => {
                    return (<div key={obj.id} className='history-list-item mb-3 cursor-pointer p-3' onClick={async () => {
                      // getHistorySessionMessages(obj.id).then((res: Array<any> | any) => {
                      //   setMessages(res ?? [])
                      //   setCurrentSession({ id: 'session_' + obj.id, title: obj.sessionTitle })
                      // })
                      // getEmotion('session_' + obj.id).then(res => {
                      //   setCurrentEmotion(res)
                      // })
                      setLoadingHistory(true)
                      const [res1,res2] : any = await Promise.all([getHistorySessionMessages(obj.id),getEmotion('session_' + obj.id)])
                      setMessages(res1 ?? [])
                      setCurrentSession({ id: 'session_' + obj.id, title: obj.sessionTitle })
                      setCurrentEmotion(res2)
                      setLoadingHistory(false)
                    }}>
                      <div className='flex justify-between items-center'><span className='text-[18px] font-bold'>{obj.sessionTitle}</span><DeleteFilled className='delete-icon' onClick={(e) => { e.stopPropagation(); handleDeleteHistorySession(obj.id) }} /></div>
                      <div className='text-[16px] opacity-70 mb-1'>{obj.startedAt}</div>
                      <div className='text-[16px] mb-1'>{obj.lastMessageContent}</div>
                      <div className='text-[16px] opacity-70'><span className='mr-6'><MessageOutlined className='mr-1' />{obj.messageCount}</span><span><ClockCircleOutlined className='mr-1' />{obj.durationMinutes}分钟</span></div>
                    </div>)
                  })}
                  {/* 后端不处理 pageNum, pageSize*/}
                  {/* {historyList.length > 0 && isShowHistoryOnly && <Pagination current={current} pageSize={pageSize} total={total} showSizeChanger={true} onChange={(p, ps) => {
                    getHistoryList({ pageNum: p, pageSize: ps }).then(res => {
                      setHistoryList((res && res.records) ?? [])
                      setTotal(res.total)
                    })
                    setCurrent(p)
                    setPageSize(ps)
                  }}></Pagination>} */}
                </div>
              </div>}
            </Card>
          </div>
        </div>

        <div className='flex-1 h-full chat-main relative'>
          <Card hoverable style={{ cursor: 'default', height: '100%' }} >
            <div className='w-full h-[8vh] flex px-6' style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)', borderRadius: '18px 18px 0 0' }}>
              <div className='h-full w-[4vw] flex justify-center items-center'><div className='w-[2.5vw] h-[2.5vw] flex justify-center items-center' style={{ backgroundColor: 'rgba(256,256,256,0.25)', borderRadius: '50%' }}><Avatar size={39} src={like}></Avatar></div></div>
              <div className='h-full flex-1 py-5 flex flex-col justify-between'>
                <div className='text-2xl font-bold opacity-90' style={{ color: 'white' }}>健康 AI 助手</div>
                <div className='text-xl font-bold opacity-80' style={{ color: 'white' }}>您的贴心 AI 心理健康助手</div>
              </div>
              <div className='h-full w-[5vw] flex justify-center items-center'><div onClick={handleClickPlus} className='w-[1.6vw] h-[1.6vw] flex justify-center items-center cursor-pointer bg-white' style={{ borderRadius: '50%' }}> <PlusOutlined style={{ fontSize: '18px', opacity: "70%" }}></PlusOutlined> </div></div>
            </div>
            <div className=' w-full flex-1 overflow-auto p-6' id="chat-container">
              {loadingHistory && <div className=' h-full flex justify-center items-center'>
                <Spin description="加载中..." size="large"></Spin>
              </div>}
              {!loadingHistory && messages.length === 0 && <div className='flex'>
                <div className='breathing-circle-chat-avatar mr-5'><Avatar src={robot} size={25}></Avatar></div>
                <div className='text-[18px] opacity-90 font-bold break-words p-3 relative' style={{ maxWidth: '33vw', borderRadius: '12px', border: 'solid #eee 1px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <p>{helloStr.slice(0, sliceLen)}</p>
                  <span className=' absolute text-[16px] opacity-50' style={{ bottom: '-25px', left: '0' }}>刚刚</span>
                </div>
              </div>}
              {!loadingHistory && messages.length > 0 && messages.map((obj,index) => {
                if (obj.senderType == 1) {
                  return <div key={obj.id} className='flex justify-end mb-12'>
                    <div className='text-[18px] opacity-90 font-bold break-words p-3 relative' style={{ maxWidth: '33vw', borderRadius: '12px', border: 'solid #eee 1px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <div className='markdown-content'>{obj.content}</div>
                      <div className=' absolute text-[16px] opacity-50 whitespace-nowrap' style={{ bottom: '-25px', right: '0' }}>{dayjs(obj.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </div>
                    <div className='breathing-circle-chat-avatar-user ml-5'><Avatar src={users} size={25}></Avatar></div>
                  </div>
                } else {
                  return <div key={obj.id} className='flex mb-12'>
                    <div className='breathing-circle-chat-avatar mr-5'><Avatar src={robot} size={25}></Avatar></div>
                    <div className='text-[18px] opacity-90 font-bold break-words p-3 relative' style={{ maxWidth: '33vw', borderRadius: '12px', border: 'solid #eee 1px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <div className='ai-markdown' dangerouslySetInnerHTML={{ __html: contentToMarkdown(obj.content == '' ? 'AI思考中,请稍候...' : obj.content) }}></div>
                      {(index != messages.length-1 || isAiTyping == false) && <span className=' absolute text-[16px] opacity-50 whitespace-nowrap' style={{ bottom: '-25px', left: '0' }}>{obj.content && dayjs(obj.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>}
                    </div>
                  </div>
                }
              })
              }
              <div className=' absolute bottom-[18.5vh] down-arrow-div' style={{borderRadius:'50%',transition:'all 0.5s',left:'50%',transform:showHint ? "translate(-50%,0)" : "translate(-50%,-50px)"}}><DownCircleFilled style={{transition:'all 0.5s',fontSize:'36px',color:'#888',backgroundColor:'#fff',opacity: showHint ? "1" : "0",cursor:showHint ? "pointer":'default'}} onClick={()=>{if(showHint){container.current?.scrollTo({ top: container.current.scrollHeight, behavior: 'smooth' })}}}/></div>
            </div>
            
            <div className='w-full h-[18vh] flex p-6' style={{ borderRadius: '0 0 18px 18px', borderTop: 'solid 1px #ddd' }}>
              <div className='flex-1 h-full'>
                <Input.TextArea value={userMsg} onKeyDown={(e) => handleEnter(e)} onChange={(e) => { setUserMsg(e.currentTarget.value) }} showCount maxLength={500} autoSize={{ minRows: 6, maxRows: 6 }} style={{ fontSize: '16px' }} placeholder='请输入您想要分享的内容...'></Input.TextArea>
              </div>
              <div className='w-[3vw] ml-3 h-full flex flex-col justify-between'>
                <div onClick={handleSend} className='w-[2.5vw] h-[2.5vw] mb-[10px] justify-center flex items-center cursor-pointer' style={{ borderRadius: '20px', backgroundColor: '#f59e0b' }}><SendOutlined style={{ fontSize: '24px', color: 'white' }} /></div>
                <div onClick={() => setUserMsg('')} className='w-[1.5vw] h-[1.5vw] flex justify-center items-center cursor-pointer mb-5' style={{ borderRadius: '10px', border: "solid 1px #ddd" }}><DeleteOutlined style={{ fontSize: '18px', opacity: "60%" }} /></div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
