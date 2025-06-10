import { useCallback, useContext, useEffect, useMemo } from 'react';
import './index.css'
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadMenuItems, setActiveKey, setOpenKeys } from '../../redux/slices/layoutSlice';
import { ThemeContext } from '../../context/ThemeContext';
import { findRouteByPath } from '../../router/router';
import { Square } from 'lucide-react';
import { fetchUserMenuTree } from '../../services/UserProfileService';



const Sider = () => {

    const themeContext = useContext(ThemeContext)

    const menuItems = useSelector(state => state.layout.menuItems)

    const flattenMenuItems = useSelector(state => state.layout.flattenMenuItems)

    const collapsed = useSelector(state => state.layout.menuCollapsed)

    const activeKey = useSelector(state => state.layout.activeKey)

    const openKeys = useSelector(state => state.layout.openKeys)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        const fetchMenus = async () => {
            fetchUserMenuTree()
                .then(
                    (data) => {
                        dispatch(loadMenuItems({ menuItems: data }))
                    }
                )
        }
        fetchMenus()
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (location.pathname && location.pathname !== '/' && flattenMenuItems && flattenMenuItems.length > 0) {
            dispatch(setActiveKey({ path: location.pathname }))
        }
        // eslint-disable-next-line
    }, [flattenMenuItems, location.pathname])

    const handleOpenChange = useCallback((keys) => {
        dispatch(setOpenKeys({ keys: keys }))
    },[])

    const switchMenu = (e) => {
        const menuItem = flattenMenuItems.find(item => item.id === e.key)
        const key = menuItem.routePath
        if (key !== activeKey) {
            navigate(menuItem.routePath)
        }
    }

    const goHome = () => {
        navigate('home')
        dispatch(setActiveKey({ path: '/home' }))
    }

    const matchMenuKey = useMemo(() => {
        const menuItem = flattenMenuItems.find(item => item.id === activeKey)
        return menuItem?.id
    }, [activeKey, flattenMenuItems])

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
            <div onClick={goHome} className="logo-vertical" />
            <Menu
                key={collapsed ? 'collapsed' : 'expanded'}
                theme={themeContext}
                inlineCollapsed={collapsed}
                selectedKeys={matchMenuKey}
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