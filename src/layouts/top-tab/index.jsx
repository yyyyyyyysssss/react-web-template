import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css'
import { Tabs } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { findRouteByPath } from '../../router/router';
import { useDispatch, useSelector } from 'react-redux';
import { addTabIem, removeTabItem, setActiveKey } from '../../redux/slices/layoutSlice';
import TabRightClickMenu from './TabRightClickMenu';


const TopMenuTab = ({style}) => {

    const location = useLocation()

    const dispatch = useDispatch()

    const activeKey = useSelector(state => state.layout.activeKey)

    const tabItems = useSelector(state => state.layout.tabItems)

    const navigate = useNavigate()

    useEffect(() => {
        const pathnames = location.pathname
        const route = findRouteByPath(pathnames)
        if (route && route.path !== '') {
            add(location, route)
        }
        // eslint-disable-next-line
    }, [location])

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

    const rightMenuClose = useCallback((targetKey) => {
        setRightMenu({
            visible: false,
            x: 0,
            y: 0,
            tabKey: null,
            index: null
        })
        if (targetKey && targetKey !== activeKey) {
            switchTab(targetKey)
        }
        // eslint-disable-next-line
    }, [activeKey])

    const add = (location, route) => {
        const key = location.pathname
        const closable = route.path !== 'home'
        const tabItem = {
            key: key,
            label: route.breadcrumbName,
            search: location.search,
            state: location.state,
            closable: closable
        }
        dispatch(addTabIem({ key: key, tabItem: tabItem }))
    }

    const remove = targetKey => {
        const selectKey = afterRemoveSelectKey(targetKey)
        dispatch(removeTabItem({ targetKey: targetKey, selectKey: selectKey }))
        if (selectKey) {
            switchTab(selectKey)
        }
    }

    const afterRemoveSelectKey = useCallback((targetKey) => {
        const targetIndex = tabItems.findIndex(pane => pane.key === targetKey)
        const newPanes = tabItems.filter(pane => pane.key !== targetKey)
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
            return key
        }
        return null
    }, [tabItems, activeKey])

    const onChange = key => {
        dispatch(setActiveKey({ key: key }))
        switchTab(key)
    }

    const onEdit = (targetKey, action) => {
        if (action !== 'add') {
            remove(targetKey)
        }
    }

    const switchTab = useCallback((tabKey) => {
        const tabItem = tabItems.find(item => item.key === tabKey)
        if (tabItem) {
            const path = tabItem.search ? tabKey + tabItem.search : tabKey
            navigate(path, {
                state: tabItem.state
            })
        }
        // eslint-disable-next-line
    }, [tabItems])

    const items = useMemo(() => {
        return tabItems.map((item, index) => ({
            key: item.key,
            index: index,
            label: <div onContextMenu={(event) => handleContextMenu(event, item.key, index)}>{item.label}</div>,
            closable: item.closable
        }))
    }, [tabItems])

    return (
        <div style={style} className='layout-panel-tabs'>
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