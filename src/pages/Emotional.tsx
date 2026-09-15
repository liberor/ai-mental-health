import { App, Button, Col, Divider, Form, Input, Modal, Popconfirm, Rate, Row, Slider, Table, Tag } from 'antd'
import { getEmotionals, deleteEmotionalById } from '@/api/emotional'
import { useEffect, useState } from 'react'

export default function Emotional() {
  const { message: messageApi } = App.useApp()
  const [emotionals, setEmotionals] = useState([])
  const [current, setCurrent] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [userId, setUserId] = useState('')
  const [minMoodScore, setMinMoodScore] = useState(0)
  const [maxMoodScore, setMaxMoodScore] = useState(10)
  const [currentEmotional, setCurrentEmotional] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    getEmotionals({ current, size }).then(res => {
      setEmotionals(res.records ? res.records : [])
      setTotal(res.total)
    })
  }, [])
  const [form] = Form.useForm()
  const onFinish = () => {
    getEmotionals({ current, size, userId, minMoodScore, maxMoodScore }).then(res => {
      setEmotionals(res.records ? res.records : [])
      setTotal(res.total)
    })
  }
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  const dataSource = emotionals.map((item: any) => {
    return {
      key: item.id,
      id: item.id,
      userId: item.userId,
      username: item.username,
      nickname: item.nickname,
      diaryDate: item.diaryDate,
      diaryContent: item.diaryContent,
      dominantEmotion: item.dominantEmotion,
      moodScore: item.moodScore,
      sleepQuality: item.sleepQuality,
      stressLevel: item.stressLevel,
      emotionTriggers: item.emotionTriggers,
      aiAnalysisStatus: item.aiAnalysisStatus,
      hasAiEmotionAnalysis: item.hasAiEmotionAnalysis,
      contentLength: item.contentLength,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      aiEmotionAnalysis: item.aiEmotionAnalysis ? JSON.parse(item.aiEmotionAnalysis) : {}
    }
  })
  const columns = [
    {
      title: <div className='px-6'>用户id</div>,
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      align: 'center'
    },
    {
      title: <div>会话id</div>,
      dataIndex: 'id',
      key: 'id',
      width: 150,
      align: 'center'
    },
    {
      title: <div>记录日期</div>,
      dataIndex: 'diaryDate',
      key: 'diaryDate',
      width: 270,
    },
    {
      title: <div>情绪评分</div>,
      key: 'moodScore',
      width: 450,
      render: (row) => {
        return <div>
          <Rate disabled allowHalf defaultValue={row.moodScore} count={10}></Rate>
        </div>
      }
    },
    {
      title: <div>生活指标</div>,
      key: 'lifeIndex',
      width: 160,
      render: (row) => {
        return <div>
          <div>睡眠:{row.sleepQuality ? row.sleepQuality + '/5' : <span className=' opacity-60'>未填写</span>}</div>
          <div>压力:{row.stressLevel ? row.stressLevel + '/5' : <span className=' opacity-60'>未填写</span>}</div>
        </div>
      }
    },
    {
      title: <div>情绪触发因素</div>,
      key: 'emotionTriggers',
      width: 400,
      render: (row) => {
        return <div className=' text-[16px]'>
          {row.emotionTriggers ? row.emotionTriggers : <span className=' opacity-60'>用户没有填写...</span>}
        </div>
      }
    },
    {
      title: <div>日记内容</div>,
      key: 'diaryContent',
      width: 400,
      render: (row) => {
        return <div className=' text-[16px]'>
          {row.diaryContent ? row.diaryContent : <span className=' opacity-60'>用户没有填写...</span>}
        </div>
      }
    },
    {
      title: <div>操作</div>,
      key: 'operate',
      align: 'center',
      render: (row) => {
        return <div>
          <Button type='text' style={{ color: '#1677ff',fontSize:'17px' }} onClick={() => {
            setCurrentEmotional(row); setIsModalOpen(true)
          }}>详情</Button>
          <Popconfirm title='删除记录' description='确认删除该记录?' onConfirm={() => {
            deleteEmotionalById(row.id).then(res => {
              getEmotionals({ current, size, userId, minMoodScore, maxMoodScore }).then(res => {
                setEmotionals(res.records ? res.records : [])
                setTotal(res.total)
              })
              messageApi.open({
                type: 'success',
                content: '删除成功'
              })
            })
          }}>
            <Button type='text' style={{ color: '#ff4d4f' }}>删除</Button>
          </Popconfirm>
        </div>
      }
    },
  ]
  return (
    <div>
      <div className='flex justify-between items-center p-3'>
        <span className='text-2xl font-bold'>情绪日志</span>
      </div>
      <div className='m-3 p-3'>
        <Form className='flex' form={form} onFinish={onFinish}>
          <Form.Item name='userId' label='用户ID' >
            <Input placeholder='请输入用户ID' style={{ width: '250px', marginRight: '20px' }} onChange={(e) => setUserId(e.currentTarget.value)}></Input>
          </Form.Item>
          <Form.Item label='情绪评分范围'>
            <Slider range min={0} max={10} value={[minMoodScore, maxMoodScore]} style={{ width: '250px', marginRight: '36px' }}
              onChange={(val) => {
                setMinMoodScore(val[0])
                setMaxMoodScore(val[1])
              }}>
            </Slider>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ marginRight: '8px' }}>查询</Button>
            <Button onClick={() => {
              form.resetFields()
              setUserId('')
              setMinMoodScore(0)
              setMaxMoodScore(10)
            }}>重置</Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{
          current,
          pageSize: size,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setCurrent(p)
            setSize(ps)
            getEmotionals({ current: p, size: ps, userId, minMoodScore, maxMoodScore }).then(res => {
              setEmotionals(res.records ? res.records : [])
              setTotal(res.total)
            })
          },
        }}></Table>
      </div>
      {currentEmotional &&
        <Modal title='情绪日志详情' styles={{ title: { fontSize: '24px', opacity: "60%" } }} centered width={1000} open={isModalOpen} onCancel={() => setIsModalOpen(false)}
          cancelText='关闭'  footer={(_, { CancelBtn }) => <CancelBtn />}>
          <div style={{ height: '86vh', overflow: "auto", padding: '0 20px 20px',fontWeight:'500' }}>
            <div className=' text-xl font-bold m-2 p-2'>用户信息</div>
            <div >
              <Row style={{ border: 'solid #e6e6e6 3px', borderBottom: 'none' }}>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>用户名</Col>
                <Col span={8} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.username}</Col>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>昵称</Col>
                <Col span={8} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.nickname}</Col>
              </Row>
              <Row style={{ border: 'solid #e6e6e6 3px' }}>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>用户ID</Col>
                <Col span={8} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.userId}</Col>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>记录日期</Col>
                <Col span={8} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.diaryDate}</Col>
              </Row>
            </div>
            <div className=' text-xl font-bold m-2 p-2'>情绪状态</div>
            <div >
              <Row style={{ border: 'solid #e6e6e6 3px', borderBottom: 'none' }}>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>情绪评分</Col>
                <Col span={12} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'><Rate value={currentEmotional.moodScore} count={10} allowHalf disabled></Rate><span className='px-5 text-[20px] font-bold opacity-80'>{currentEmotional.moodScore}</span></Col>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>主要情绪</Col>
                <Col span={4} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>
                  <div className='h-full flex justify-center items-center'>
                    <Tag style={{ padding: '2px 12px' }}><span style={{ fontSize: '16px', opacity: "60%" }}>{currentEmotional.dominantEmotion}</span></Tag>
                  </div>
                </Col>
              </Row>
              <Row style={{ border: 'solid #e6e6e6 3px' }}>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>睡眠质量</Col>
                <Col span={12} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.sleepQuality ? currentEmotional.sleepQuality + '/5' : '未填写'}</Col>
                <Col span={4} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>压力水平</Col>
                <Col span={4} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.stressLevel ? currentEmotional.stressLevel + '/5' : '未填写'}</Col>
              </Row>
            </div>
            <div className=' text-xl font-bold m-2 p-2'>日记内容</div>
            <Row style={{ border: 'solid #e6e6e6 3px', borderBottom: 'none' }}>
              <Col span={12} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>情绪触发因素</Col>
              <Col span={12} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.emotionTriggers}</Col>
            </Row>
            <Row style={{ border: 'solid #e6e6e6 3px' }}>
              <Col span={12} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>日记内容</Col>
              <Col span={12} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.diaryContent}</Col>
            </Row>
            {currentEmotional.hasAiEmotionAnalysis && <div>
              <div className=' text-xl font-bold m-2 p-2'>AI情绪分析结果</div>
              <Row style={{ border: 'solid #e6e6e6 3px', borderBottom: 'none' }}>
                <Col span={6} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>主要情绪</Col>
                <Col span={6} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.aiEmotionAnalysis.primaryEmotion}</Col>
                <Col span={6} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>情绪强度</Col>
                <Col span={6} style={{ backgroundColor: '#fff', fontSize: '16px', display: "flex" }} className='p-3'>
                  <Slider style={{ width: '200px' }} disabled value={currentEmotional.aiEmotionAnalysis.emotionScore}></Slider><span className='mt-1'>{currentEmotional.aiEmotionAnalysis.emotionScore}%</span>
                </Col>
              </Row>
              <Row style={{ border: 'solid #e6e6e6 3px' }}>
                <Col span={6} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>风险等级</Col>
                <Col span={6} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{riskTextMap[currentEmotional.aiEmotionAnalysis.riskLevel]}</Col>
                <Col span={6} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>情绪性质</Col>
                <Col span={6} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.aiEmotionAnalysis.isNegative ? '负面情绪' : '正面情绪'}</Col>
              </Row>
              <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#e8eff1', borderRadius: '12px' }} className='mt-5'>
                <div className='p-3 text-[18px] font-bold opacity-70'>专业建议</div>
                <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#fff', borderRadius: '8px' }} className='m-3 mt-0 p-3 text-[16px] opacity-60'>
                  {currentEmotional.aiEmotionAnalysis.suggestion}
                </div>
              </div>
              <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#e8eff1', borderRadius: '12px' }} className='mt-5'>
                <div className='p-3 text-[18px] font-bold opacity-70'>风险描述</div>
                <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#fff', borderRadius: '8px' }} className='m-3 mt-0 p-3 text-[16px] opacity-60'>
                  {currentEmotional.aiEmotionAnalysis.riskDescription}
                </div>
              </div>
              <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#e8eff1', borderRadius: '12px' }} className='mt-5'>
                <div className='p-3 text-[18px] font-bold opacity-70'>改善建议</div>
                <div style={{ border: 'solid #e6e6e6 3px', backgroundColor: '#fff', borderRadius: '8px' }} className='m-3 mt-0 p-3 text-[16px] opacity-60'>
                  <ul>
                    {currentEmotional.aiEmotionAnalysis.improvementSuggestions.map(item => {
                      return (
                        <li key={item}>
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <Divider></Divider>
              <div className=' opacity-60 px-2'>分析时间:{currentEmotional.aiEmotionAnalysis.timestamp}</div>
            </div>}
            <div className=' text-xl font-bold m-2 p-2'>时间信息</div>
            <Row style={{ border: 'solid #e6e6e6 3px' }}>
              <Col span={5} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>创建时间</Col>
              <Col span={7} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.createdAt}</Col>
              <Col span={5} style={{ backgroundColor: '#e8eff1', fontSize: '16px' }} className='p-3'>更新时间</Col>
              <Col span={7} style={{ backgroundColor: '#fff', fontSize: '16px' }} className='p-3'>{currentEmotional.updatedAt}</Col>
            </Row>
          </div>
        </Modal>}
    </div>
  )
}
