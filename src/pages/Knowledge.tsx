import { getKnowledgeCategory, getKnowledgeList } from '@/api/knowledge'
import { uploadFile } from '@/api/upload'
import { App, Button, Form, Input, Select, Table, Modal, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { useEffect, useState } from 'react'
import './Knowledge.css'
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'

export default function Knowledge() {
  const { message: messageApi } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [category, setCategory] = useState([])
  const [records, setRecords] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [status, setStatus] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [businessId, setBusinessId] = useState('');
  const params = {
    title,
    categoryId,
    authorName,
    status,
    currentPage: current,
    size: pageSize
  }
  const commonTags = [
    '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
    '冥想', '正念', '放松', '心理健康', '自我成长',
    '人际关系', '工作压力', '学习方法', '生活技巧'
  ]
  useEffect(() => {
    getKnowledgeCategory().then(res => {
      setCategory(res)
    })
    getKnowledgeList({}).then(res => {
      setRecords(res.records)
      setTotal(res.total)
    })
  }, [])
  const handleSearch = () => {
    getKnowledgeList(params).then(res => {
      setRecords(res.records)
      setTotal(res.total)
    })
  }
  const dataSource = records.map(item => {
    return {
      key: item.id,
      title: item.title,
      categoryName: item.categoryName,
      authorName: item.authorName,
      readCount: item.readCount,
      publishedAt: item.publishedAt,
      status: item.status
    }
  })
  const columns = [
    {
      title: <div className='px-6'>文章标题</div>,
      dataIndex: 'title',
      key: 'title',
      width: 400,
      render: (title) => (<div className='px-6'>{title}</div>)
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 360
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 360
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: 300
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 360
    },
    {
      title: '操作',
      align: 'center',
      key: 'operate',
      render: (_, item) => {
        return (<div>
          <Button type='text' style={{ color: '#1677ff', marginRight: '10px' }}>编辑</Button>
          <Button type='text' style={{ color: item.status === 2 ? '#52c41a' : '#faad14', marginRight: '10px' }} >{item.status === 2 ? '发布' : '下线'}</Button>
          <Button type='text' style={{ color: '#ff4d4f' }}>删除</Button>
        </div>)
      }
    },
  ];
  const options = category.map(item => {
    return { value: item.id, label: item.categoryName }
  })
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file.type.startsWith('image/')) {
      messageApi.error('只能上传图片文件!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      messageApi.error('图片大小不能超过 5MB!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const res: any = await uploadFile(file, { businessId });
      const url = typeof res === 'string' ? res : res?.filePath ?? res?.url ?? res?.fileUrl ?? res?.path;
      if (!url) {
        messageApi.error('图片上传失败');
        onError?.(new Error('no url returned'));
        return;
      }
      setImageUrl(url);
      onSuccess?.(res);
    } catch (err) {
      messageApi.error('图片上传失败');
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className='flex justify-between items-center p-3'>
        <span className='text-2xl font-bold'>知识文章</span>
        <span>
          <Button type='primary' style={{ marginRight: '8px' }} onClick={() => { setBusinessId(crypto.randomUUID()); setImageUrl(undefined); setIsModalOpen(true) }}>新增</Button>
          <Button type='primary'>编辑</Button>
        </span>
      </div>
      <div className='m-3'>
        <Form form={form} style={{ display: 'flex', padding: '10px' }} onFinish={handleSearch}>
          <Form.Item name='title' label='文章标题'>
            <Input style={{ width: '250px', marginRight: '20px' }} onChange={(e) => setTitle(e.currentTarget.value)}></Input>
          </Form.Item>
          <Form.Item name='categoryId' label='分类'>
            <Select
              style={{ width: '250px', marginRight: '20px' }}
              options={options}
              onChange={(v) => setCategoryId(v)}
            />
          </Form.Item>
          <Form.Item name='authorName' label='作者'>
            <Input style={{ width: '250px', marginRight: '20px' }} onChange={(e) => setAuthorName(e.currentTarget.value)}></Input>
          </Form.Item>
          <Form.Item name='status' label='状态'>
            <Select
              style={{ width: '250px', marginRight: '20px' }}
              options={[
                { value: 1, label: '已发布' },
                { value: 2, label: '已下线' }
              ]}
              onChange={(v) => setStatus(v)}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ marginRight: '8px' }}>查询</Button>
            <Button onClick={() => {
              form.resetFields()
              setTitle('')
              setCategoryId(null)
              setAuthorName('')
              setStatus(null)
            }}>重置</Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Table dataSource={dataSource} columns={columns} pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setCurrent(p)
            setPageSize(ps)
            getKnowledgeList({ ...params, currentPage: p, size: ps }).then(res => {
              setRecords(res.records)
              setTotal(res.total)
            })
          },
        }}>

        </Table>
      </div>
      <Modal open={isModalOpen} title='新增知识文章' width={800} okText='新增' onCancel={() => setIsModalOpen(false)}>
        <div className='h-[70vh] p-5'>
          <Form labelCol={{ span: 3 }} labelAlign='right'>
            <Form.Item name='title' label='文章标题' rules={[{ required: true }]}>
              <Input style={{ width: '600px' }} maxLength={200}
                showCount={{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }}></Input>
            </Form.Item>
            <Form.Item name='categoryId' label='分类' rules={[{ required: true }]}>
              <Select
                style={{ width: '600px' }}
                options={options}
              />
            </Form.Item>
            <Form.Item name='summary' label='文章摘要'>
              <Input.TextArea style={{ width: '600px' }} maxLength={1000} placeholder='(可选)' autoSize={{ minRows: 4, maxRows: 4 }}
                showCount={{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }}></Input.TextArea>
            </Form.Item>
            <Form.Item name='tags' label='标签' >
              <Select
                style={{ width: '600px' }}
                mode='tags'
                allowClear
                placeholder='请选择或输入标签(可选)'
                options={commonTags.map(item => ({ value: item, label: item }))}
              />
            </Form.Item>
            <Form.Item label='封面' >
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                maxCount={1}
                accept="image/*"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
              >
                {imageUrl ? (
                  <div className=' relative w-full h-full'>
                    <img draggable={false} src={imageUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Button
                      type='text'
                      size='small'
                      icon={<DeleteOutlined />}
                      onClick={(e) => { e.stopPropagation(); setImageUrl(undefined) }}
                      style={{ position: 'absolute', top: 4, right: 4, color: '#fff', background: 'rgba(0,0,0,0.45)' }}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>

            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
