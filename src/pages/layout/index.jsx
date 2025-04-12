import React, { useEffect, useState } from 'react';
import { Button, Flex, Layout, Menu, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import './index.css'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopBreadcrumbTab from '../../component/top-tab/breadcrumb-tab';
import TopMenuTab from '../../component/top-tab/menu-tab';
import { useDispatch, useSelector } from 'react-redux';
import { menuCollapsed, setActiveKey, setOpenKeys } from '../../redux/slices/layoutSlice';


function menuHandle(arr) {
    return arr.map((item, index) => {
        const menuItem = {
            key: item.key,
            label: item.label,
        }
        if (item.path) {
            menuItem.label = <Link to={item.path}>{item.label}</Link>
        }
        return menuItem
    })
}

const menuItems = [
    {
        key: 'system',
        label: '系统管理',
        icon: <SettingOutlined />,
        children: [
            {
                key: '/system/user',
                label: '用户管理',
                path: '/system/user',
            },
            {
                key: '/system/role',
                label: '角色管理',
                path: '/system/role',
            },
            {
                key: '/system/auth',
                label: '权限管理',
                path: '/system/auth',
            }
        ],
    }
].map((item, index) => {
    const menuItem = {
        key: item.key,
        label: item.label,
        icon: item.icon,
        children: item.children ? menuHandle(item.children) : null
    }
    if (item.path) {
        menuItem.label = <Link to={item.path}>{item.label}</Link>
    }
    return menuItem
})

const { Header, Content, Sider } = Layout;

const AppLayout = () => {

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const activeKey = useSelector(state => state.layout.activeKey)

    const openKeys = useSelector(state => state.layout.openKeys)

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const {
        token: {
            colorBgContainer,
            borderRadiusLG
        }
    } = theme.useToken()

    const handleOpenChange = (keys) => {
        dispatch(setOpenKeys({keys: keys}))
    }

    const handleCollapsed = () => {
        dispatch(menuCollapsed())
    }

    const goHome = () => {
        navigate('home')
        dispatch(setActiveKey({key: '/home'}))
    }

    const switchMenu = (e) => {
        const key = e.key
        dispatch(setActiveKey({key: key}))
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
                <Menu
                    selectedKeys={activeKey}
                    openKeys={openKeys}
                    onOpenChange={handleOpenChange}
                    onClick={switchMenu}
                    theme='dark'
                    mode='inline'
                    items={menuItems}
                />
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
                    <TopMenuTab/>
                    <div
                        style={{
                            height: 'calc(100vh - 100px)',
                            overflow: 'auto',
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout