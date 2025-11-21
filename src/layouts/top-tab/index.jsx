import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css'
import { Tabs, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { findRouteByPath } from '../../router/router';
import { useDispatch, useSelector } from 'react-redux';
import { addTabIem, removeTabItem, setTabIem } from '../../redux/slices/layoutSlice';
import TabRightClickMenu from './TabRightClickMenu';
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import classNames from 'classnames';


const SortableTabItem = ({ tab, index, activeKey, dragging, onTabClick, onEdit, onContextMenu }) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: tab.key,
    })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '4px 0',
        opacity: dragging ? 0 : 1,
    }

    const isActive = tab.key === activeKey
    const closable = tab.props.closable !== false

    return (
        <div
            key={tab.key}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onTabClick(tab.key)}
            onContextMenu={(event) => onContextMenu(event, tab.key, index)}
            className={classNames('ant-tabs-tab', {
                'ant-tabs-tab-active': isActive,
            })}
        >
            <div className="ant-tabs-tab-btn">
                {tab.props.label ?? tab.props.tab}
            </div>
            {closable && (
                <button
                    type="button"
                    className="ant-tabs-tab-remove"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.('remove', { key: tab.key, e });
                    }}
                >
                    <span
                        role="img"
                        aria-label="close"
                        className="anticon anticon-close"
                    >
                        <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            data-icon="close"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L512 449.8 295.9 191.7c-3-3.6-7.5-5.7-12.3-5.7h-79.8c-6.8 0-10.5 7.9-6.1 13.1L460.2 512 197.7 824.9A7.95 7.95 0 00203.8 838h79.8c4.7 0 9.2-2.1 12.3-5.7L512 574.2l216.1 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                        </svg>
                    </span>
                </button>
            )}
        </div>
    )
}

const TopMenuTab = ({ style }) => {

    const { token } = theme.useToken()

    const location = useLocation()

    const dispatch = useDispatch()

    const flattenMenuItems = useSelector(state => state.layout.flattenMenuItems)

    const activeKey = useSelector(state => state.layout.activeKey)

    const tabItems = useSelector(state => state.layout.tabItems)

    const [draggedTab, setDraggedTab] = useState(null)

    const navigate = useNavigate()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (location.pathname && location.pathname !== '/' && flattenMenuItems && flattenMenuItems.length > 0) {
            const route = findRouteByPath(location.pathname)
            if (route && route.path !== '') {
                add(location, route)
            }
        }
        // eslint-disable-next-line
    }, [flattenMenuItems, location])

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
        const path = location.pathname
        const closable = route.path !== 'home'
        const tabItem = {
            path: path,
            label: route.breadcrumbName,
            search: location.search,
            state: location.state,
            closable: closable
        }
        dispatch(addTabIem({ tabItem: tabItem }))
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
        switchTab(key)
    }

    const handleEdit = (targetKey, action) => {
        if (action !== 'add') {
            remove(targetKey)
        }
    }

    const switchTab = useCallback((tabKey) => {
        const tabItem = tabItems.find(item => item.key === tabKey)
        if (tabItem) {
            const path = tabItem.search ? tabItem.path + tabItem.search : tabItem.path
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
            label: item.label,
            closable: item.closable
        }))
    }, [tabItems])

    const handleDragStart = (event) => {
        const { active } = event
        const tab = tabItems.find(t => t.key === active.id)
        setDraggedTab(tab)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) {
            setDraggedTab(null)
            return
        }
        const oldIndex = tabItems.findIndex(item => item.key === active.id)
        const newIndex = tabItems.findIndex(item => item.key === over.id)
        if (oldIndex === -1 || newIndex === -1) return items // 防御性判断
        const newOrder = arrayMove(tabItems, oldIndex, newIndex)
        dispatch(setTabIem({ tabItem: newOrder }))
        setDraggedTab(null)
    }

    const handleDragCancel = () => setDraggedTab(null)

    const renderTabBar = (props, _) => {
        const { panes, activeKey, onTabClick, editable } = props
        const onEdit = editable?.onEdit
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div className="ant-tabs-nav">
                    <div className="ant-tabs-nav-wrap">
                        <div className="ant-tabs-nav-list">
                            <SortableContext
                                items={panes.map((p) => p.key)}
                                strategy={verticalListSortingStrategy}
                            >
                                {panes.map((tab, index) => {
                                    return <SortableTabItem
                                        key={tab.key}
                                        tab={tab}
                                        index={index}
                                        activeKey={activeKey}
                                        dragging={draggedTab?.key === tab.key}
                                        onTabClick={onTabClick}
                                        onEdit={onEdit}
                                        onContextMenu={handleContextMenu}
                                    />
                                })}
                            </SortableContext>
                        </div>
                    </div>
                </div>
                <DragOverlay style={{ pointerEvents: 'none' }}>
                    {draggedTab ? (
                        <div
                            className="ant-tabs-tab ant-tabs-tab-active"
                            style={{
                                background: token.colorBgContainer,
                                boxShadow: token.boxShadow,
                                borderRadius: token.borderRadius,
                                padding: '5px 12px',
                                cursor: 'grabbing',
                            }}
                        >
                            {draggedTab.label ?? draggedTab.tab}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        )
    }

    return (
        <div style={style} className='layout-panel-tabs'>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={handleEdit}
                items={items}
                tabBarStyle={{ 
                    borderBottom: 'none',
                }}
                renderTabBar={renderTabBar}
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