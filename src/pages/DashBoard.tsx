import { Row, Col, Card, Avatar, Spin, Skeleton } from 'antd'
import { getAllData } from '@/api/dashboard'
import { useEffect, useRef, useState } from 'react'
import users from '@/assets/images/users.png'
import like from '@/assets/images/like.png'
import comments from '@/assets/images/comments.png'
import smile from '@/assets/images/smile.png'
import * as echarts from 'echarts'
import { LoadingOutlined } from '@ant-design/icons'
import gsap from 'gsap'
import { useNavigate } from 'react-router-dom'
gsap.ticker.fps(52)


export default function DashBoard() {
  const h = document.documentElement.clientWidth
  const Nav = useNavigate()
  const [data, setData] = useState(null)
  const [hasdata, setHasdata] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [totalDiaries, setTotalDiaries] = useState(0)
  const [todayNewDiaries, setTodayNewDiaries] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [todayNewSessions, setTodayNewSessions] = useState(0)
  const [avgMoodScore, setAvgMoodScore] = useState(0)
  const nums = useRef({
    totalUsers: 0,
    activeUsers: 0,
    totalDiaries: 0,
    todayNewDiaries: 0,
    totalSessions: 0,
    todayNewSessions: 0,
    avgMoodScore: 0,
  })
  useEffect(() => {
    getAllData().then(res => {
      setHasdata(true)
      setData(res)
      gsap.to(nums.current, {
        totalUsers: res.systemOverview.totalUsers,
        activeUsers: res.systemOverview.activeUsers,
        totalDiaries: res.systemOverview.totalDiaries,
        todayNewDiaries:res.systemOverview.todayNewDiaries,
        totalSessions: res.systemOverview.totalSessions,
        todayNewSessions:res.systemOverview.todayNewSessions,
        avgMoodScore: res.systemOverview.avgMoodScore,
        duration:0.5,
        onUpdate:()=>{
          setTotalUsers(nums.current.totalUsers)
          setActiveUsers(nums.current.activeUsers)
          setTotalDiaries(nums.current.totalDiaries)
          setTodayNewDiaries(nums.current.todayNewDiaries)
          setTotalSessions(nums.current.totalSessions)
          setTodayNewSessions(nums.current.todayNewSessions)
          setAvgMoodScore(nums.current.avgMoodScore)
        },
        snap:{
          totalUsers: 1,
          activeUsers: 1,
          totalDiaries: 1,
          todayNewDiaries:1,
          totalSessions:1,
          todayNewSessions:1,
          avgMoodScore:1,
        },
      })
    })
  }, [])
  useEffect(() => {
    if (hasdata) {
      const echartsDom1 = document.getElementById('emotion')
      const myChart1 = echarts.init(echartsDom1);
      const echartsDom2 = document.getElementById('session')
      const myChart2 = echarts.init(echartsDom2);
      const echartsDom3 = document.getElementById('activity')
      const myChart3 = echarts.init(echartsDom3);
      const option1: echarts.EChartsOption = {
        title: {
          text: '情绪趋势分析',
          textStyle: {
            color: '#2d3436',
            fontSize: 16,
            fontWeight: 600
          },
          left: 'center',
          top: 0
        },
        tooltip: {
          trigger: 'axis',
          borderColor: '#fab1a0',
          borderWidth: 1,
          textStyle: {
            color: '#2d3436',
          }
        },
        legend: {
          data: ['平均情绪评分', '记录数量'],
          top: 30
        },
        xAxis: {
          type: 'category',
          data: data.emotionTrend.map(item => item.date),
          axisLine: {
            lineStyle: {
              color: '#2d3436',
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '情绪评分',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#2d3436',
              }
            }
          },
          {
            type: 'value',
            name: '记录数量',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#2d3436',
              }
            }
          }
        ],
        series: [
          {
            name: '平均情绪评分',
            data: data.emotionTrend.map(item => item.avgMoodScore),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#faebaf'
            },
            itemStyle: {
              color: '#faebaf'
            }
          },
          {
            name: '记录数量',
            data: data.emotionTrend.map(item => item.recordCount),
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#eeb5a3'
            },
            itemStyle: {
              color: '#eeb5a3'
            }
          }
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 0
        }
      };
      const option2: echarts.EChartsOption = {
        title: {
          text: '咨询活动统计',
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: '#2d3436'
          },
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#fab1a0',
          borderWidth: 1,
          textStyle: {
            color: '#2d3436'
          }
        },
        legend: {
          data: ['会话数量', '参与用户数'],
          top: 40,
          textStyle: {
            color: '#636e72'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.consultationStats.dailyTrend.map(item => item.date),
          axisLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.3)'
            }
          },
          axisLabel: {
            color: '#636e72'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#636e72'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.1)'
            }
          }
        },
        series: [
          {
            name: '会话数量',
            type: 'bar',
            data: data.consultationStats.dailyTrend.map(item => item.sessionCount),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#74b9ff' },
                  { offset: 1, color: '#0984e3' }
                ]
              }
            },
            barWidth: '40%'
          },
          {
            name: '参与用户数',
            type: 'bar',
            data: data.consultationStats.dailyTrend.map(item => item.userCount),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#fdcb6e' },
                  { offset: 1, color: '#f39c12' }
                ]
              }
            },
            barWidth: '40%'
          }
        ]
      };
      const { userActivity: activityData } = data
      const option3: echarts.EChartsOption = {
        title: {
          text: '用户活跃度趋势',
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: '#2d3436'
          },
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#fab1a0',
          borderWidth: 1,
          textStyle: {
            color: '#2d3436'
          }
        },
        legend: {
          data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
          top: 40,
          textStyle: {
            color: '#636e72'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: activityData.map(item => item.date),
          axisLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.3)'
            }
          },
          axisLabel: {
            color: '#636e72'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#636e72'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(244, 162, 97, 0.1)'
            }
          }
        },
        series: [
          {
            name: '活跃用户',
            type: 'line',
            data: activityData.map(item => item.activeUsers),
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#a29bfe'
            },
            itemStyle: {
              color: '#a29bfe'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
                  { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
                ]
              }
            }
          },
          {
            name: '新增用户',
            type: 'line',
            data: activityData.map(item => item.newUsers),
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#fdcb6e'
            },
            itemStyle: {
              color: '#fdcb6e'
            }
          },
          {
            name: '日记用户',
            type: 'line',
            data: activityData.map(item => item.diaryUsers),
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#00b894'
            },
            itemStyle: {
              color: '#00b894'
            }
          },
          {
            name: '咨询用户',
            type: 'line',
            data: activityData.map(item => item.consultationUsers),
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#fab1a0'
            },
            itemStyle: {
              color: '#fab1a0'
            }
          }
        ]
      };
      option1 && myChart1.setOption(option1)
      option2 && myChart2.setOption(option2)
      option3 && myChart3.setOption(option3)
    }
  }, [hasdata])
  return (
    <div>
      <Row gutter={20} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <div className='flex'>
              <Avatar src={users} size={88} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '21%' }}></Avatar>
              <div className='flex flex-col justify-between ml-4'>
                <div className=' text-[18px] opacity-60'>总用户数</div>
                <div className=' text-[24px]'>{hasdata ? totalUsers : <Skeleton paragraph={false} active />}</div>
                <div className=' text-[16px] opacity-60 flex items-center'><span className='mr-3'>活跃用户:</span>{hasdata ? activeUsers : <Skeleton style={{ width: '50px' }} styles={{ title: { height: '20px' } }} paragraph={false} active />}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'default' }} onClick={()=>Nav('/back/emotional')}>
            <div className='flex'>
              <Avatar src={like} size={88} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '21%' }}></Avatar>
              <div className='flex flex-col justify-between ml-4'>
                <div className=' text-[18px] opacity-60'>情绪日志</div>
                <div className=' text-[24px]'>{hasdata ? totalDiaries : <Skeleton paragraph={false} active />}</div>
                <div className=' text-[16px] opacity-60 flex items-center'><span className='mr-3'>今日新增:</span>{hasdata ? todayNewDiaries : <Skeleton style={{ width: '50px' }} styles={{ title: { height: '20px' } }} paragraph={false} active />}</div>
              </div>
            </div>

          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'default' }} onClick={()=>Nav('/back/consultations')}>
            <div className='flex'>
              <Avatar src={comments} size={88} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '21%' }}></Avatar>
              <div className='flex flex-col justify-between ml-4 '>
                <div className=' text-[18px] opacity-60'>咨询会话</div>
                <div className=' text-[24px]'>{hasdata ? totalSessions : <Skeleton paragraph={false} active />}</div>
                <div className=' text-[16px] opacity-60 w-full flex items-center'><span className='mr-3'>今日新增:</span>{hasdata ? todayNewSessions : <Skeleton style={{ width: '50px' }} styles={{ title: { height: '20px' } }} paragraph={false} active />}</div>
              </div>
            </div>

          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'default' }}>
            <div className='flex'>
              <Avatar src={smile} size={88} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: '21%' }}></Avatar>
              <div className='flex flex-col justify-between ml-4'>
                <div className=' text-[18px] opacity-60'>平均情绪</div>
                <div className=' text-[24px] flex items-center'>{hasdata ? avgMoodScore : <Skeleton style={{ width: '30px' }} styles={{ title: { height: '20px' } }} paragraph={false} active />}<span className='ml-3'>/10</span></div>
                <div className=' text-[16px] opacity-60'>情绪健康指数</div>
              </div>
            </div>

          </Card>
        </Col>
      </Row>
      <Row gutter={20} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card title='情绪趋势分析' styles={{ title: { fontSize: '20px' } }} hoverable style={{ cursor: 'default', height: '560px' }}>
            <div className='flex w-full h-[450px] justify-center items-end '>
              <div id="emotion" style={{height:h == 1920 ? '300px':'400px',width:h == 1920 ? '675px':'900px'}}>
                {!hasdata && <div className='h-full flex justify-center items-center pb-[30px]'>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '48px' }} spin />}></Spin>
                </div>}
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='咨询会话统计' styles={{ title: { fontSize: '20px' } }} hoverable style={{ cursor: 'default', height: '560px' }}>
            <div className='flex flex-col w-full h-[460px] items-center justify-between'>
              <div className='h-[80px] w-[900px] '>
                {hasdata &&
                  <div className='h-full flex justify-between items-center px-18'>
                    <div className='flex flex-col items-center'>
                      <span className=' opacity-60'>总会话数</span>
                      <span className=' text-xl font-bold'>{data.consultationStats.totalSessions}</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <span className=' opacity-60'>平均时长</span>
                      <span className=' text-xl font-bold'>{data.consultationStats.avgDurationMinutes}分钟</span>
                    </div>
                    <div className='flex flex-col items-center'>
                      <span className=' opacity-60'>活跃用户</span>
                      <span className=' text-xl font-bold'>{data.systemOverview.activeUsers}</span>
                    </div>
                  </div>}
              </div>
              <div id="session" style={{height:h == 1920 ? '270px':'360px',width:h == 1920 ? '675px':'900px'}}>
                {!hasdata && <div className='h-full flex justify-center items-center pb-[80px]'>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: '48px' }} spin />}></Spin>
                </div>}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <div>
        <Card title='用户活跃度趋势' styles={{ title: { fontSize: '20px' } }} hoverable style={{ cursor: 'default', height: '800px' }}>
          <div className='flex w-full h-[660px] justify-center items-end'>
            <div id="activity" style={{height:h == 1920 ? '450':'600px',width:h == 1920 ? '1500px':'2000px'}} className='h-[600px] w-[2000px]'>
              {!hasdata && <div className='h-full flex justify-center items-center'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: '48px' }} spin />}></Spin>
              </div>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
