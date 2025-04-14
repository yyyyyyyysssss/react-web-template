import React, { Suspense, useEffect } from 'react';
import { Button, Flex, Layout, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import './index.css'
import { Outlet, useNavigate } from 'react-router-dom';
import TopBreadcrumbTab from '../../component/top-tab/breadcrumb-tab';
import TopMenuTab from '../../component/top-tab/menu-tab';
import { useDispatch, useSelector } from 'react-redux';
import { menuCollapsed, setActiveKey } from '../../redux/slices/layoutSlice';
import SiderMenu from '../../component/sider-menu';
import Loading from '../../component/loading';


const { Header, Content, Sider } = Layout;

const AppLayout = () => {

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const {
        token: {
            colorBgContainer,
            borderRadiusLG
        }
    } = theme.useToken()

    const handleCollapsed = () => {
        dispatch(menuCollapsed())
    }

    const goHome = () => {
        navigate('home')
        dispatch(setActiveKey({ key: '/home' }))
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 侧边菜单 */}
            <Sider
                width='13%'
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    scrollbarGutter: 'stable'
                }}
                collapsible
                collapsed={collapsed}
                trigger={null}
            >
                <div onClick={goHome} className="logo-vertical" />
                <SiderMenu />
            </Sider>
            <Layout>
                {/* 头部 */}
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Flex>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={handleCollapsed}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Flex>
                </Header>
                {/* 主题内容 */}
                <Content style={{ margin: '0 16px', height: 'auto', overflow: 'initial', scrollbarGutter: 'stable' }}>
                    {/* 面包屑 */}
                    {/* <TopBreadcrumbTab style={{ paddingTop: 10, paddingBottom: 10 }} /> */}
                    <TopMenuTab />
                    <div
                        style={{
                            height: 'calc(100vh - 100px)',
                            overflow: 'auto',
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Suspense fallback={<Loading/>}>
                            <Outlet />
                        </Suspense>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout