import { Avatar, Button, Card, Col, Input, message, Rate, Row, Select } from 'antd'
import {  useState } from 'react'
import './MoodDiary.css'
import happy from '@/assets/images/开心.png'
import peace from '@/assets/images/平静.png'
import anxiety from '@/assets/images/焦虑.png'
import sorrow from '@/assets/images/悲伤.png'
import thrill from '@/assets/images/兴奋.png'
import tired from '@/assets/images/疲惫.png'
import astonished from '@/assets/images/惊讶.png'
import confused from '@/assets/images/困惑.png'
import like from '@/assets/images/like.png'
import { createOrUpdateDiary } from '@/api/mooddiary'

export default function MoodDiary() {
    const [rate, setRate] = useState(0)
    const [picked, setPicked] = useState(false)
    const [dominantEmotion, setDominantEmotion] = useState('')
    const [emotionTriggers, setEmotionTriggers] = useState('')
    const [diaryContent, setDiaryContent] = useState('')
    const [sleepQuality, setSleepQuality] = useState('')
    const [stressLevel, setStressLevel] = useState('')
    const handleReset = () => {
        setRate(0)
        setDominantEmotion('')
        setEmotionTriggers('')
        setDiaryContent('')
        setSleepQuality('')
        setStressLevel('')
        setPicked(false)
    }
    const handleSubmit = ()=>{
        const body = {moodScore:rate,dominantEmotion,emotionTriggers,diaryContent,sleepQuality,stressLevel,diaryDate:(new Date()).toLocaleDateString().replace(/\//g,'-')}
        createOrUpdateDiary(body).then(res=>{
            if(res) message.success('成功上传')
        })
    }
    const TextToImage = {
        '开心': happy,
        '平静': peace,
        '焦虑': anxiety,
        '悲伤': sorrow,
        '兴奋': thrill,
        '疲惫': tired,
        '惊讶': astonished,
        '困惑': confused,
    }
    const rateToText = {
        0: '糟糕透顶',
        1: '非常低落',
        2: '很不开心',
        3: '心情不好',
        4: '低落不悦',
        5: '风平浪静',
        6: '有点高兴',
        7: '情绪很好',
        8: '心情畅快',
        9: '非常高兴',
        10: '无比开心',
    }
    return (
        <div className='mooddiary' style={{background:'linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%)'}}>
            <div className='h-[12vh] pt-6 pl-9' style={{ background: 'linear-gradient(135deg, #7ED321 0%, #F5A623 100%)' }}>
                <Avatar src={like} size={90}></Avatar>
                <span className='text-2xl font-bold text-white ml-3'>情绪日记</span>
            </div>
            <div className='m-[20px] px-[25vw]'>
                <Card hoverable style={{ marginBottom: '20px', cursor: "default" }}>
                    <div className='text-2xl font-bold mb-5'>今日情绪评分</div>
                    <div className='text-[16px] opacity-70 mb-4'>您今天的整体情绪状态如何？(1-10 分)</div>
                    <div className='text-[16px] flex items-center'>
                        <Rate count={10} value={rate} onChange={(v) => { setRate(v); setPicked(true) }}></Rate>
                        {picked && <span className='ml-3'>{rateToText[rate]}</span>}
                    </div>
                </Card>
                <Card hoverable style={{ marginBottom: '20px', cursor: "default" }}>
                    <div className='text-2xl font-bold mb-5'>主要情绪</div>
                    <div className='chooseMood' onClick={(e) => {
                        if (e.target.dataset && e.target.dataset.mood) {
                            setDominantEmotion(e.target.dataset.mood)
                        }
                    }}>
                        <Row gutter={15}>
                            {Object.keys(TextToImage).map(k => {
                                return (
                                    <Col span={6} key={k} style={{ marginBottom: '15px' }}>
                                        <Card hoverable>
                                            <div data-mood={k} className='flex flex-col items-center p-[20px]' style={{ backgroundColor: (dominantEmotion == k) ? '#f1fef4' : 'white', border: (dominantEmotion == k) ? 'solid #a7cd7c 2px' : 'solid rgba(0,0,0,0) 2px', borderRadius: '8px' }}>
                                                <Avatar src={TextToImage[k]} size={64} onClick={() => setDominantEmotion(k)}></Avatar>
                                                <div className='mt-3 text-[16px]' onClick={() => setDominantEmotion(k)}>{k}</div>
                                            </div>
                                        </Card>
                                    </Col>)
                            })}
                        </Row>
                    </div>
                </Card>
                <Card hoverable style={{ marginBottom: '20px', cursor: "default" }}>
                    <div className='text-2xl font-bold mb-5'>详细记录</div>
                    <div className='text-[16px] opacity-80 m-2'>情绪触发因素</div>
                    <div className='text-[16px]'>
                        <Input.TextArea placeholder='今天什么事情影响了您的情绪？' maxLength={1000} autoSize={{ minRows: 4, maxRows: 4 }} showCount
                            value={emotionTriggers} onChange={(e) => setEmotionTriggers(e.currentTarget.value)}></Input.TextArea>
                    </div>
                    <div className='text-[16px] opacity-80 m-2'>今日感想</div>
                    <div className='text-[16px]'>
                        <Input.TextArea placeholder='写下您今天的想法、感受或发生的有趣事情…' maxLength={2000} autoSize={{ minRows: 6, maxRows: 6 }} showCount
                            value={diaryContent} onChange={(e) => setDiaryContent(e.currentTarget.value)}></Input.TextArea>
                    </div>
                    <Row gutter={20}>
                        <Col span={12}>
                            <div className=' text-[16px] my-3'>睡眠质量</div>
                            <Select style={{ width: '100%' }} placeholder='请选择' value={sleepQuality} onChange={(v) => setSleepQuality(v)} options={[
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                                { value: '4', label: '4' },
                                { value: '5', label: '5' },
                            ]}></Select>
                        </Col>
                        <Col span={12}>
                            <div className=' text-[16px] my-3'>压力水平</div>
                            <Select style={{ width: '100%' }} placeholder='请选择' value={stressLevel} onChange={(v) => setStressLevel(v)} options={[
                                { value: '1', label: '1' },
                                { value: '2', label: '2' },
                                { value: '3', label: '3' },
                                { value: '4', label: '4' },
                                { value: '5', label: '5' },
                            ]}></Select>
                        </Col>
                    </Row>
                    <div className='mt-9'>
                        <Button type='default' style={{ marginRight: '15px' }} onClick={handleReset}>重置</Button>
                        <Button type='primary' onClick={handleSubmit}>提交记录</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
