import React, { useEffect, useMemo } from 'react';
import './index.css'
import {
    SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadMenuItems, setActiveKey, setOpenKeys } from '../../redux/slices/layoutSlice';

const menuItemList = [
    {
        key: 'system',
        label: '系统管理',
        icon: 'SettingOutlined',
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
]

const SiderMenu = () => {

    const menuItems = useSelector(state => state.layout.menuItems)

    const activeKey = useSelector(state => state.layout.activeKey)

    const openKeys = useSelector(state => state.layout.openKeys)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchMenuItems = async () => {
            dispatch(loadMenuItems({ menuItems: menuItemList }))
        }

        fetchMenuItems()
    }, [])

    useEffect(() => {
        navigate(activeKey)
    }, [activeKey])

    const handleOpenChange = (keys) => {
        dispatch(setOpenKeys({ keys: keys }))
    }

    const switchMenu = (e) => {
        const key = e.key
        if (key !== activeKey) {
            dispatch(setActiveKey({ key: key }))
        }
    }

    const matchMenuKey = useMemo(() => {
        for (const menuItem of menuItems) {
            if (menuItem.key === activeKey) {
                return menuItem.key
            }
            if (activeKey.startsWith(menuItem.key)) {
                return menuItem.key
            }
            if (menuItem.children) {
                for (const child of menuItem.children) {
                    if (child.key === activeKey) {
                        return child.key
                    }
                    if (activeKey.startsWith(child.key)) {
                        return child.key
                    }
                }
            }

        }
        return null
    }, [activeKey, menuItems])

    const items = useMemo(() => {
        return menuItems.map((item) => ({
            key: item.key,
            label: item.label,
            icon: <SettingOutlined />,
            children: item.children
        }))
    },[menuItems])

    return (
        <Menu
            selectedKeys={matchMenuKey}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            onClick={switchMenu}
            theme='dark'
            mode='inline'
            items={items}
        />
    )
}

export default SiderMenu