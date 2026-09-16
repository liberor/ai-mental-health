import { getKnowledgeCategory, getKnowledgeList, createKnowledge, updateKnowledgeStatus, deleteKnowledge, updateKnowledge } from '@/api/knowledge'
import { getArticle } from "@/api/article"
import { uploadFile } from '@/api/upload'
import { App, Button, Form, Input, Select, Table, Modal, Upload, Spin } from 'antd'
import type { TableColumnsType, UploadProps } from 'antd'
import { useEffect, useRef, useState } from 'react'
import './Knowledge.css'
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

export default function Knowledge() {
  const h = document.documentElement.clientWidth
  const { message: messageApi } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [category, setCategory] = useState([])
  const [records, setRecords] = useState([])
  const [hasRecords, setHasRecords] = useState(false)
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
  const [showPreview, setShowPreview] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategoryId, setModalCategoryId] = useState(null);
  const [modalSummary, setModalSummary] = useState('');
  const [modalTags, setModalTags] = useState([]);
  const [isEdit, setIsEdit] = useState(false)
  const currentId = useRef<any>(null)
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
    getKnowledgeCategory().then((res:any) => {
      setCategory(res)
    })
    getKnowledgeList({}).then((res:any) => {
      setRecords(res.records)
      setTotal(res.total)
      setHasRecords(true)
    })
  }, [])
  const handleSearch = () => {
    setHasRecords(false)
    getKnowledgeList(params).then((res:any) => {
      setRecords(res.records)
      setTotal(res.total)
      setHasRecords(true)
    })
  }
  const dataSource = records.map((item:any) => {
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
  const columns : TableColumnsType<any> = [
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
      width: h == 1920 ? 200 : 300
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: h == 1920 ? 240 : 360
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      key: 'readCount',
      width: h == 1920 ? 200 : 300
    },
    {
      title: '发布时间',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: h == 1920 ? 240 : 360
    },
    {
      title: '操作',
      align: 'center',
      key: 'operate',
      render: (_, item) => {
        return (<div>
          <Button type='text' style={{ fontSize:'17px',color: '#1677ff', marginRight: '10px' }} onClick={() => handleEdit(item)}>编辑</Button>
          <Button type='text' style={{ fontSize:'17px',color: item.status === 2 ? '#52c41a' : '#faad14', marginRight: '10px' }} onClick={() => handleUpdate(item)}>{item.status === 2 ? '发布' : '下线'}</Button>
          <Button type='text' style={{ fontSize:'17px',color: '#ff4d4f' }} onClick={() => handleDelete(item)}>删除</Button>
        </div>)
      }
    },
  ];
  const options = category.map((item:any) => {
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
      const url = res.filePath;
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

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 编辑器内容
  const [html, setHtml] = useState('')

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])
  const handleSubmit = () => {
    if (!isEdit) {
      createKnowledge({
        title: modalTitle,
        summary: modalSummary,
        categoryId: modalCategoryId,
        tags: modalTags.join(','),
        coverImage: imageUrl,
        content: html,
        id: ''
      }).then(_ => {
        messageApi.open({
          type: 'success',
          content: '新增成功'
        })
        setIsModalOpen(false)
        setImageUrl('')
        setHtml('')
        setModalTitle('')
        setModalCategoryId(null)
        setModalSummary('')
        setModalTags([])
        setHasRecords(false)
        getKnowledgeList({}).then((res:any) => {
          setRecords(res.records)
          setTotal(res.total)
          setHasRecords(true)
        })
      })
    } else {
      updateKnowledge(currentId.current, {
        title: modalTitle,
        summary: modalSummary,
        categoryId: modalCategoryId,
        tags: modalTags.join(','),
        coverImage: imageUrl,
        content: html,
        id: currentId
      }).then(_ => {
        messageApi.open({
          type: 'success',
          content: '编辑成功'
        })
        setIsModalOpen(false)
        setImageUrl('')
        setHtml('')
        setModalTitle('')
        setModalCategoryId(null)
        setModalSummary('')
        setModalTags([])
        setHasRecords(false)
        getKnowledgeList({}).then((res:any) => {
          setRecords(res.records)
          setTotal(res.total)
          setHasRecords(true)
        })
      })
    }
  }
  const handleUpdate = (row:any) => {
    updateKnowledgeStatus(row.key, { status: row.status == '2' ? '1' : '2' }).then(_ => {
      messageApi.open({
        type: 'success',
        content: '操作成功'
      })
      setHasRecords(false)
      getKnowledgeList(params).then((res:any) => {
        setRecords(res.records)
        setTotal(res.total)
        setHasRecords(true)
      })
    })
  }
  const handleDelete = (row:any) => {
    deleteKnowledge(row.key).then(_ => {
      messageApi.open({
        type: 'success',
        content: '删除成功'
      })
      setHasRecords(false)
      getKnowledgeList(params).then((res:any) => {
        setRecords(res.records)
        setTotal(res.total)
        setHasRecords(true)
      })
    })
  }
  const handleEdit = (row:any) => {
    currentId.current = row.key
    setIsEdit(true)
    setIsModalOpen(true)
    getArticle(row.key).then((res:any) => {
      setImageUrl(res.coverImage)
      setHtml(res.content)
      setModalTitle(res.title)
      setModalCategoryId(res.categoryId)
      setModalSummary(res.summary)
      setModalTags(res.tagArray)
    })
  }
  return (
    <div>
      <div className='flex justify-between items-center p-3'>
        <span className='text-2xl font-bold'>知识文章</span>
        <span>
          <Button type='primary' style={{ marginRight: '8px' }} onClick={() => { setBusinessId(crypto.randomUUID()); setImageUrl(undefined); setIsModalOpen(true); setShowPreview(false); setIsEdit(false) }}>新增</Button>

        </span>
      </div>
      <div className='m-3'>
        <Form style={{ display: 'flex', padding: '10px' }} onFinish={handleSearch}>
          <Form.Item label='文章标题'>
            <Input style={{ width: '250px', marginRight: '20px' }} value={title} onChange={(e) => setTitle(e.currentTarget.value)}></Input>
          </Form.Item>
          <Form.Item label='分类'>
            <Select
              style={{ width: '250px', marginRight: '20px' }}
              options={options}
              value={categoryId}
              onChange={(v) => setCategoryId(v)}
            />
          </Form.Item>
          <Form.Item label='作者'>
            <Input style={{ width: '250px', marginRight: '20px' }} value={authorName} onChange={(e) => setAuthorName(e.currentTarget.value)}></Input>
          </Form.Item>
          <Form.Item label='状态'>
            <Select
              style={{ width: '250px', marginRight: '20px' }}
              options={[
                { value: 1, label: '已发布' },
                { value: 2, label: '已下线' }
              ]}
              value={status}
              onChange={(v) => setStatus(v)}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ marginRight: '8px' }}>查询</Button>
            <Button onClick={() => {
              setTitle('')
              setCategoryId(null)
              setAuthorName('')
              setStatus(null)
            }}>重置</Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        {hasRecords && <Table dataSource={dataSource} columns={columns} pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setCurrent(p)
            setPageSize(ps)
            setHasRecords(false)
            getKnowledgeList({ ...params, currentPage: p, size: ps }).then((res:any) => {
              setRecords(res.records)
              setTotal(res.total)
              setHasRecords(true)
            })
          },
        }}>
        </Table>}
        {!hasRecords && <div className='h-[66vh] flex justify-center items-center'><Spin indicator={<LoadingOutlined style={{fontSize:'66px'}} spin/>}></Spin></div> }
      </div>
      <Modal closable={false} open={isModalOpen} styles={{ title: { fontSize: '20px' } }} title={isEdit ? '编辑文章' : '新增知识文章'} width={800} 
        okText={isEdit ? '编辑':'新增'}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button onClick={() => setShowPreview((pre) => !pre)}>{showPreview ? '隐藏预览' : '查看预览'}</Button>
            <CancelBtn />
            <OkBtn />
          </>)}>
        <div className='h-[70vh] p-5 overflow-auto'>
          <Form form={form} labelCol={{ span: 3 }} labelAlign='right'>
            <Form.Item label='文章标题' rules={[{ required: true }]}>
              <Input style={{ width: '600px' }} maxLength={200} value={modalTitle} onChange={(e) => setModalTitle(e.currentTarget.value)}
                showCount={{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }}></Input>
            </Form.Item>
            <Form.Item label='分类' rules={[{ required: true }]}>
              <Select
                style={{ width: '600px' }}
                value={modalCategoryId}
                onChange={(v) => setModalCategoryId(v)}
                options={options}
              />
            </Form.Item>
            <Form.Item label='文章摘要' rules={[{ required: true }]}>
              <Input.TextArea style={{ width: '600px' }} maxLength={1000} placeholder='(可选)' autoSize={{ minRows: 4, maxRows: 4 }}
                showCount={{ formatter: ({ count, maxLength }) => `${count}/${maxLength}` }}
                value={modalSummary} onChange={(e) => setModalSummary(e.currentTarget.value)}></Input.TextArea>
            </Form.Item>
            <Form.Item label='标签' rules={[{ required: true }]}>
              <Select
                style={{ width: '600px' }}
                mode='tags'
                allowClear
                placeholder='请选择或输入标签(可选)'
                options={commonTags.map(item => ({ value: item, label: item }))}
                value={modalTags}
                onChange={(tags) => setModalTags(tags)}
              />
            </Form.Item>
            <Form.Item label='封面'>
              <Upload
                listType="picture-card"
                showUploadList={false}
                maxCount={1}
                accept="image/*"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
              >
                {imageUrl ? (
                  <div className=' relative w-full h-full'>
                    <img draggable={false} src={import.meta.env.VITE_APP_BASE_FILES+imageUrl} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <Form.Item label='文章内容' rules={[{ required: true }]}>
              <div className='pr-4'>
                <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                  <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                  />
                  <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={(editor) => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '300px', overflowY: 'hidden' }}
                  />
                </div>
                {showPreview && <div className='mt-3'>
                  <div className='text-[16px] font-bold opacity-60'>预览效果如下</div>
                  <div dangerouslySetInnerHTML={{ __html: html }} className='mt-2 p-3' style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                </div>

                }
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div >
  )
}
