import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css'
import { Flex, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveKey, setOpenKeys } from '../../redux/slices/layoutSlice';
import { findRouteByPath } from '../../router/router';
import { Square } from 'lucide-react';



const Sider = () => {

    const themeValue = useSelector(state => state.layout.theme)

    const menuItems = useSelector(state => state.layout.menuItems)

    const flattenMenuItems = useSelector(state => state.layout.flattenMenuItems)

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const activeKey = useSelector(state => state.layout.activeKey)

    const openKeys = useSelector(state => state.layout.openKeys)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const location = useLocation()

    const [selectKey, setSelectKey] = useState(null)

    useEffect(() => {
        if (location.pathname && location.pathname !== '/' && flattenMenuItems && flattenMenuItems.length > 0) {
            dispatch(setActiveKey({ path: location.pathname }))
        }

    }, [flattenMenuItems, location.pathname])

    useEffect(() => {
        if (activeKey) {
            setSelectKey(activeKey)
        }
    }, [activeKey])

    const handleOpenChange = useCallback((keys) => {
        dispatch(setOpenKeys({ keys: keys }))
    }, [])

    const switchMenu = (e) => {
        setSelectKey(e.key)
        const menuItem = flattenMenuItems.find(item => item.id === e.key)
        if (!menuItem) {
            return
        }
        const targetPath = menuItem.routePath
        if (location.pathname !== targetPath) {
            navigate(targetPath)
        }
    }

    const goHome = () => {
        navigate('home')
        dispatch(setActiveKey({ path: '/home' }))
    }

    const formatMenuItems = (items) => {

        return items.map(item => {
            const route = findRouteByPath(item.routePath)
            const defaultIcon = route?.defaultIcon
            return {
                key: item.id,
                label: item.name,
                icon: item.icon || defaultIcon || <Square size={18} />,
                path: item.routePath,
                children: item.children && item.children.length > 0 ? formatMenuItems(item.children) : undefined,
            }
        })
    }

    const items = useMemo(() => {
        return formatMenuItems(menuItems)
    }, [menuItems])


    return (
        <>
            <Flex
                onClick={goHome}
                justify='center'
                align='center'
                style={{
                    height: '64px',
                    cursor: 'pointer',
                }}
            >
                <img style={{ height: '58px' }} src='/temp-logo.png' />
            </Flex>
            <Menu
                key={collapsed ? 'collapsed' : 'expanded'}
                style={{
                    maxHeight: 'calc(100vh - 64px)',
                    borderRight: 'none',
                    overflowY: 'auto',
                    scrollbarGutter: 'stable',
                }}
                theme={themeValue}
                inlineCollapsed={collapsed}
                selectedKeys={[selectKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={switchMenu}
                mode='inline'
                items={items}
            />
        </>

    )
}

export default Sider