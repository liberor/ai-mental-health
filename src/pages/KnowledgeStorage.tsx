import { getBooks } from '@/api/knowledgeStorage'
import book from '@/assets/images/book.png'
import { BarChartOutlined, ClockCircleOutlined, FundProjectionScreenOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Card, Pagination, Skeleton, Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import './KnowledgeStorage.css'
import { useNavigate } from 'react-router-dom'



export default function KnowledgeStorage() {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [recommends, setRecommends] = useState([])
    const [hasRecommends, setHasRecommends] = useState(false)
    const [books, setBooks] = useState([])
    const [hasBooks, setHasBooks] = useState(false)
    const Nav = useNavigate()
    useEffect(() => {
        getBooks({
            sortField: 'readCount',
            sortDirection: 'desc',
            currentPage: '1',
            size: '5'
        }).then(res => {
            setRecommends(res.records)
            setHasRecommends(true)
        })
        getBooks({
            sortField: 'publishedAt',
            sortDirection: 'desc',
            currentPage: current,
            size: pageSize
        }).then(res => {
            setBooks(res.records)
            setTotal(res.total)
            setHasBooks(true)
        })
    }, [])
    return (
        <div className='knowledge-storage'>
            <div className='h-[12vh] pt-6 pl-9' style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)' }}>
                <Avatar src={book} size={90}></Avatar>
                <span className='text-2xl font-bold text-white ml-3'>心理健康知识库</span>
            </div>
            <div className='flex px-[20vw] pt-6' style={{ background: 'linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%)' }}>
                <div className=' w-[18vw] mr-6'>
                    <Card hoverable style={{ cursor: 'default' }}>
                        <div className='text-xl font-bold'>推荐阅读</div>
                        {!hasRecommends && <div className='h-[36vh] flex justify-center items-center'>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: '48px' }} spin />}></Spin>
                        </div>}
                        {hasRecommends && <div>
                            {recommends.map(item => {
                                return (<div key={item.id} className='recommend flex flex-col justify-between my-6 pl-3 cursor-pointer' style={{ borderLeft: 'solid #dfac60 5px' }}
                                    onClick={() => Nav(`/knowledgestorage/article/${item.id}`)}>
                                    <div className='text-[18px] font-bold mb-4'>{item.title}</div>
                                    <div className='text-[16px]'><BarChartOutlined />&nbsp;&nbsp;阅读量&nbsp;:&nbsp;&nbsp;{item.readCount}</div>
                                </div>)
                            })}
                        </div>}
                    </Card>
                </div>
                <div className='flex-1 pb-[100px]'>
                    {!hasBooks && Array.from({length:5},(_,i)=><div key={i} className='mb-13'><Skeleton active></Skeleton></div>) }
                    {hasBooks && <div>
                        {books.map(item => {
                            return (<div key={item.id} className='mb-6'>
                                <Card hoverable onClick={() => Nav(`/knowledgestorage/article/${item.id}`)}>
                                    <div className='flex h-[160px]'>
                                        <div className='h-full w-[240px] bg-red-400'>
                                            <img style={{ width: '240px', height: '160px' }} src={item.coverImage ? 'http://159.75.169.224:1235' + item.coverImage : 'https://file.itndedu.com/psychology_ai.png'}></img>
                                        </div>
                                        <div className='h-full flex-1 pl-3 flex flex-col'>
                                            <div className='text-xl font-bold mb-4 flex items-center'><span className='mr-3'>{item.title}</span><Tag color='blue'>{item.categoryName}</Tag></div>
                                            <div className='text-[16px]'><UserOutlined style={{ marginRight: '10px' }} />{item.authorName}</div>
                                            <div className='text-[16px] mb-4'><ClockCircleOutlined style={{ marginRight: '10px' }} />{item.updatedAt}</div>
                                            <div className='text-[16px]'><FundProjectionScreenOutlined style={{ marginRight: '10px' }} />观看人数:&nbsp;{item.readCount}</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>)
                        })}
                        <Pagination total={total} size='large' current={current} pageSize={pageSize}
                            onChange={(p, ps) => {
                                setCurrent(p)
                                setPageSize(ps)
                                getBooks({
                                    sortField: 'publishedAt',
                                    sortDirection: 'desc',
                                    currentPage: p,
                                    size: ps
                                }).then(res => {
                                    setBooks(res.records)
                                    setTotal(res.total)
                                    setHasBooks(true)
                                })
                            }} showTotal={(total) => <span className='text-[16px]'>共{total}条</span>}></Pagination>
                    </div>}
                </div>
            </div>
        </div>
    )
}
