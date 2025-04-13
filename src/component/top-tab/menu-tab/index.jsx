import { useEffect, useMemo, useRef, useState } from 'react';
import './index.css'
import { Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { findRouteByPath } from '../../../router/router';
import { useDispatch, useSelector } from 'react-redux';
import { addTabIem, removeTabItem, setActiveKey } from '../../../redux/slices/layoutSlice';
import TabRightClickMenu from './TabRightClickMenu';


const TopMenuTab = () => {

    const location = useLocation()

    const dispatch = useDispatch()

    const activeKey = useSelector(state => state.layout.activeKey)

    const tabItems = useSelector(state => state.layout.tabItems)

    // 右键菜单
    const [rightMenu, setRightMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        tabKey: null
    })

    const handleContextMenu = (event, tabKey, index) => {
        event.preventDefault()
        const { clientX, clientY } = event
        setRightMenu({
            visible: true,
            x: clientX,
            y: clientY,
            tabKey: tabKey,
            index: index
        })
    }

    const rightMenuClose = () => {
        setRightMenu({
            visible: false,
            x: 0,
            y: 0,
            tabKey: null,
            index: null
        })
    }

    useEffect(() => {
        const pathnames = location.pathname
        const route = findRouteByPath(pathnames)
        if (route && route.path !== '') {
            add(pathnames, route.breadcrumbName, route.path !== 'home')
        }
    }, [location])

    const add = (key, label, closable = true) => {
        const tabItem = {
            label: label,
            key: key,
            closable: closable
        }
        dispatch(addTabIem({ key: key, tabItem: tabItem }))
    }
    const remove = targetKey => {
        dispatch(removeTabItem({ targetKey: targetKey }))
    }

    const onChange = key => {
        dispatch(setActiveKey({ key: key }))
    }

    const onEdit = (targetKey, action) => {
        if (action !== 'add') {
            remove(targetKey)
        }
    }

    const items = useMemo(() => {
        return tabItems.map((item, index) => ({
            key: item.key,
            label: <div onContextMenu={(event) => handleContextMenu(event, item.key, index)}>{item.label}</div>,
            closable: item.closable
        }))
    }, [tabItems])

    return (
        <div className='layout-panel-tabs'>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
            {rightMenu.visible && (
                <TabRightClickMenu
                    x={rightMenu.x}
                    y={rightMenu.y}
                    tabKey={rightMenu.tabKey}
                    index={rightMenu.index}
                    close={rightMenuClose}
                />
            )}
        </div>
    )
}

export default TopMenuTab