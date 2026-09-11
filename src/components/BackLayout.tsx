import { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MailOutlined,
    UserOutlined,
    PieChartOutlined,
    ContainerOutlined,
    DownOutlined,
    UpOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Avatar, Tooltip, Dropdown, message } from 'antd';
import robot from '@/assets/images/机器人.png'
import '@/components/BackLayout.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '@/api/logout';

const { Header, Sider, Content } = Layout;

export default function BackLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [dropdown, setDropdown] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
        let timer = null
        if (collapsed) {
            setShowTitle(false)
        } else {
            timer = setTimeout(() => setShowTitle(true), 200)
        }
        return () => { if (timer) { clearTimeout(timer) } }
    }, [collapsed])
    const Nav = useNavigate()
    const current_path = useLocation().pathname
    const PathToLabel = {
        '/back/dashboard': '数据分析',
        '/back/knowledge': '知识文章',
        '/back/consultations': '咨询记录',
        '/back/emotional': '情绪日志',
    }
    const handleLogout = () => {
        logout().then(res => {
            localStorage.removeItem('mental-token')
            localStorage.removeItem('userInfo')
            Nav('/')
            message.success('登出成功')
        })
    }

    return (
        <Layout className='back-layout' style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme='light' width={'12vw'}>
                <div className=" h-[72px] flex justify-center  items-center">
                    <Avatar size={64} src={robot} />
                    {showTitle && <div className=' ml-3'>
                        <h2 className=' text-xl font-bold mb-1'>心理健康AI助手</h2>
                        <p className=' opacity-50'>管理后台</p>
                    </div>}
                </div>
                <Menu
                    onSelect={(args) => {
                        Nav('/back/' + args.key)
                    }}
                    theme="light"
                    mode="inline"
                    selectedKeys={[current_path.split('/').at(-1) as string]}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <PieChartOutlined />,
                            label: '数据分析',
                        },
                        {
                            key: 'knowledge',
                            icon: <ContainerOutlined />,
                            label: '知识文章',
                        },
                        {
                            key: 'consultations',
                            icon: <MailOutlined />,
                            label: '咨询记录',
                        },
                        {
                            key: 'emotional',
                            icon: <UserOutlined />,
                            label: '情绪日志',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex' }}>
                    <Tooltip title={collapsed ? '展开' : '折叠'}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 72,
                            }}
                        />
                    </Tooltip>
                    <div className=' flex justify-between items-center w-full p-5'>
                        <span className=' text-2xl font-bold'>{PathToLabel[current_path as keyof typeof PathToLabel]}</span>
                        <div className=' flex items-center px-5'>
                            <Avatar src={'http://159.75.169.224:1235'+ JSON.parse(localStorage.getItem('userInfo')).avatar}></Avatar>
                            <span className='w-[8px]'></span>
                            <Dropdown menu={{ items: [{ label: (<div className='px-2' onClick={handleLogout}>退出登录</div>), key: '0' }] }} trigger={['click']} placement='bottom'>
                                <div className=' cursor-pointer' onClick={() => setDropdown(!dropdown)}>
                                    <span className=' mr-2 text-xl'>{JSON.parse(localStorage.getItem('userInfo')).username}</span>
                                    {dropdown ? <UpOutlined /> : <DownOutlined />}
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: "auto"
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};