import { getArticle } from "@/api/article"
import { ClockCircleOutlined, FundProjectionScreenOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Card, Divider, Skeleton, Tag } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import book from '@/assets/images/book.png'




export default function Article() {
    const Nav = useNavigate()
    const { id } = useParams()
    const [article, setArticle] = useState<any>(null)
    const [hasArticle, setHasArticle] = useState(false)
    useEffect(() => {
        if (!id) {
            Nav(-1)
            return
        }
        getArticle(id).then((res:any) => {
            setArticle(res)
            setHasArticle(true)
        })
    }, [])
    return (
        <div>

            <div className='h-[12vh] pt-6 pl-9' style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)' }}>
                <Avatar src={book} size={90}></Avatar>
                <span className='text-2xl font-bold text-white ml-3'>知识文章详情</span>
            </div>
            <div className="px-[20vw] p-6">
                <Card style={{ marginBottom: '30px' }}>
                    {!hasArticle && <div><Skeleton active></Skeleton></div>}
                    {hasArticle && <>
                        <div className="text-xl font-bold mb-3">文章信息</div>
                        <div className="flex items-center mb-5"><Tag color='blue'>{article!.categoryName}</Tag><span className="ml-3"><ClockCircleOutlined style={{ marginRight: '8px' }} />{article.updatedAt}</span></div>
                        <div className="text-3xl font-bold mb-3">{article.title}</div>
                        <div className="text-[16px] py-2 pl-4 mb-3" style={{ backgroundColor: '#F3FBEB', borderLeft: 'solid #95CD49 5px' }}>{article.summary}</div>
                        <div className="flex items-center text-[16px]"><UserOutlined /><span className="ml-2 mr-8">{article.authorName}</span> <FundProjectionScreenOutlined /><span>&nbsp;&nbsp;{article.readCount}&nbsp;&nbsp;次阅读</span></div>
                    </>}
                </Card>
                <Card>
                    {!hasArticle && Array.from({length:3},(_,i)=><div className="mb-10" key={i}><Skeleton active></Skeleton></div>)}
                    {hasArticle && <>
                        <div>
                            <div className="text-xl font-bold mb-5">正文内容</div>
                            <div className="text-[16px]" dangerouslySetInnerHTML={{ __html: article.content }}>
                            </div>
                        </div>
                        <Divider></Divider>
                        <div className="mb-3 text-[16px]">相关标签</div>
                        <div className="mb-3">
                            {article.tagArray && article.tagArray.map((item:string) => {
                                return (<Tag key={item} style={{ marginRight: '10px' }}><span className="text-[15px] opacity-70">{item}</span></Tag>)
                            })}
                        </div>
                    </>}
                </Card>
            </div>

        </div>
    )
}
