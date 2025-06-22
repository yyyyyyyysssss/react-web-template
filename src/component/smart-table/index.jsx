import { useSortable } from '@dnd-kit/sortable'
import './index.css'
import { Checkbox, Dropdown, Flex, List, Table, Tooltip, Typography } from 'antd'
import { RotateCw, Settings, ArrowUpToLine, GripVertical, ArrowDownToLine, MoveVertical } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const reorderColumnsForFixed = (columns) => {
    const left = columns.filter(c => c.fixed === 'left')
    const right = columns.filter(c => c.fixed === 'right')
    const middle = columns
        .filter(c => !c.fixed)
    return [...left, ...middle, ...right]
}

const SortableItem = ({ item, index, tableColumns, unfixedColumns, onToggleColumn, onFixedHeader, onFixedFooter }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.key })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '4px 0'
    }
    const showUnfixedTitle = index === 0 && tableColumns.length !== unfixedColumns.length
    return (
        <Flex vertical>
            {showUnfixedTitle && (
                <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: '25px' }} >不固定</Typography.Text>
            )}
            <List.Item ref={setNodeRef} style={style} {...attributes} className="hoverable-list-item">
                <Flex
                    flex={1}
                    justify='space-between'
                    align='center'
                >
                    <Flex gap={25} justify='center' align='center'>
                        <span {...listeners}>
                            <GripVertical style={{ cursor: 'grab' }} color='var(--ant-color-text-disabled)' size={16} />
                        </span>
                        <Flex flex={1}>
                            <Checkbox
                                style={{ width: '100%' }}
                                onChange={(e) => onToggleColumn(e, item.key)}
                                checked={item.visible !== false}
                            >
                                <Typography.Text
                                    className='typography-text-checkbox-title'
                                    ellipsis={{ tooltip: true }}
                                >
                                    {item.title}
                                </Typography.Text>
                            </Checkbox>
                        </Flex>
                    </Flex>
                    <Flex className='actions' gap={6}>
                        <Tooltip title='固定在列首'>
                            <Typography.Link onClick={() => onFixedHeader(item.key)}>
                                <ArrowUpToLine size={16} />
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip title='固定在列尾'>
                            <Typography.Link onClick={() => onFixedFooter(item.key)}>
                                <ArrowDownToLine size={16} />
                            </Typography.Link>
                        </Tooltip>
                    </Flex>
                </Flex>
            </List.Item>
        </Flex>
    )
}

const SmartTable = ({ columns, headerExtra, onSearch, ...rest }) => {

    const [tableColumns, setTableColumns] = useState([])

    useEffect(() => {
        const updatedColumns = columns.map((col) => ({
            ...col,
            key: col.key || col.dataIndex, // 如果没有 key，则使用 dataIndex 作为 key
        }))
        setTableColumns(updatedColumns)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const total = tableColumns.length
    const checkedCount = tableColumns.filter(col => col.visible != false).length

    const checkAll = useMemo(() => checkedCount === total, [checkedCount, total])
    const indeterminate = useMemo(() => checkedCount > 0 && checkedCount < total, [checkedCount, total])

    const visibleColumns = useMemo(() => {
        return tableColumns.filter(col => col.visible !== false)
    }, [tableColumns])

    const handleCheckAllChange = (e) => {
        setTableColumns(prev => prev.map(col => ({ ...col, visible: e.target.checked })))
    }

    const handleToggleColumn = (e, key) => {
        const checked = e.target.checked
        setTableColumns(prev => prev.map(col => col.key === key ? { ...col, visible: checked } : col))
    }

    const handleFixedHeader = (key) => {
        setTableColumns(prev => {
            const updated = prev.map(col => col.key === key ? { ...col, fixed: 'left' } : col)
            return reorderColumnsForFixed(updated)
        })
    }

    const handleNotFixed = (key) => {
        setTableColumns(prev => {
            const updated = prev.map(col => col.key === key ? { ...col, fixed: undefined } : col)
            return reorderColumnsForFixed(updated)
        })
    }

    const handleFixedFooter = (key) => {
        setTableColumns(prev => {
            const updated = prev.map(col => col.key === key ? { ...col, fixed: 'right' } : col)
            return reorderColumnsForFixed(updated)
        })
    }

    const renderHeaderItem = useMemo(() => {
        const headerItemTableColumns = tableColumns.filter(item => item.fixed === 'left') || []
        if (headerItemTableColumns.length === 0) {
            return <></>
        }
        return (
            <Flex style={{ marginLeft: '25px' }} vertical>
                <Typography.Text type="secondary" style={{ fontSize: 12 }} >固定在左侧</Typography.Text>
                {
                    headerItemTableColumns
                        .map(item => (
                            <List.Item key={item.key} className="hoverable-list-item" style={{ padding: '4px 0' }}>
                                <Flex
                                    flex={1}
                                    justify='space-between'
                                    align='center'
                                >
                                    <Flex justify='center' align='center'>
                                        <Checkbox style={{ width: '100%' }} onChange={(e) => handleToggleColumn(e, item.key)} checked={item.visible != false}>
                                            <Typography.Text
                                                className='typography-text-checkbox-title'
                                                ellipsis={{ tooltip: true }}
                                            >
                                                {item.title}
                                            </Typography.Text>
                                        </Checkbox>
                                    </Flex>
                                    <Flex className='actions' gap={6}>
                                        <Tooltip title='不固定'>
                                            <Typography.Link onClick={() => handleNotFixed(item.key)}>
                                                <MoveVertical size={16} />
                                            </Typography.Link>
                                        </Tooltip>
                                        <Tooltip title='固定在列尾'>
                                            <Typography.Link onClick={() => handleFixedFooter(item.key)}>
                                                <ArrowDownToLine size={16} />
                                            </Typography.Link>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </List.Item>
                        ))
                }
            </Flex>
        )
    }, [tableColumns])

    const unfixedColumns = useMemo(() => {
        return tableColumns.filter(item => item.fixed !== 'left' && item.fixed !== 'right')
    }, [tableColumns])

    const renderFooterItem = useMemo(() => {
        const footerItemTableColumns = tableColumns.filter(item => item.fixed === 'right') || []
        if (footerItemTableColumns.length === 0) {
            return <></>
        }
        return (
            <Flex style={{ marginLeft: '25px' }} vertical>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>固定在右侧</Typography.Text>
                {
                    footerItemTableColumns
                        .map(item => (
                            <List.Item key={item.key} className="hoverable-list-item" style={{ padding: '4px 0' }}>
                                <Flex
                                    flex={1}
                                    justify='space-between'
                                    align='center'
                                >
                                    <Flex justify='center' align='center'>
                                        <Checkbox style={{ width: '100%' }} onChange={(e) => handleToggleColumn(e, item.key)} checked={item.visible != false}>
                                            <Typography.Text
                                                className='typography-text-checkbox-title'
                                                ellipsis={{ tooltip: true }}
                                            >
                                                {item.title}
                                            </Typography.Text>
                                        </Checkbox>
                                    </Flex>
                                    <Flex className='actions' gap={6}>
                                        <Tooltip title='不固定'>
                                            <Typography.Link onClick={() => handleNotFixed(item.key)}>
                                                <MoveVertical size={16} />
                                            </Typography.Link>
                                        </Tooltip>
                                        <Tooltip title='固定在列首'>
                                            <Typography.Link onClick={() => handleFixedHeader(item.key)}>
                                                <ArrowUpToLine size={16} />
                                            </Typography.Link>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </List.Item>
                        ))
                }
            </Flex>
        )
    }, [tableColumns])


    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setTableColumns((items) => {
            const oldIndex = items.findIndex((item) => item.key === active.id)
            const newIndex = items.findIndex((item) => item.key === over.id)

            if (oldIndex === -1 || newIndex === -1) return items // 防御性判断

            return arrayMove(items, oldIndex, newIndex)
        })
    }

    return (
        <Flex
            gap={10}
            vertical
        >
            <Flex
                justify='space-between'
                align='center'
            >
                {headerExtra !== undefined && headerExtra !== null ? headerExtra : <div />}
                <Flex
                    style={{ marginRight: 8 }}
                    gap={10}
                >
                    {onSearch && (
                        <Tooltip title='刷新'>
                            <Typography.Text onClick={onSearch} className='typography-text-icon'>
                                <RotateCw size={18} />
                            </Typography.Text>
                        </Tooltip>
                    )}
                    <Dropdown
                        trigger={['click']}
                        dropdownRender={() => (
                            <Flex gap={10} className="ant-dropdown-menu" style={{ width: '220px', padding: 10 }} vertical>
                                <Flex justify='space-between'>
                                    <Checkbox indeterminate={indeterminate} onChange={handleCheckAllChange} checked={checkAll}>
                                        列展示
                                    </Checkbox>
                                    <Typography.Link onClick={() => setTableColumns(columns)}>
                                        重置
                                    </Typography.Link>
                                </Flex>
                                <Flex vertical>
                                    {renderHeaderItem}
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={unfixedColumns.map((item) => item.key)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <List
                                                split={false}
                                                style={{
                                                    maxHeight: '400px',
                                                    overflowY: 'auto',
                                                    overflowX: 'hidden'
                                                }}
                                                dataSource={unfixedColumns}
                                                renderItem={(item, index) => (
                                                    <SortableItem
                                                        key={item.key}
                                                        item={item}
                                                        index={index}
                                                        tableColumns={tableColumns}
                                                        unfixedColumns={unfixedColumns}
                                                        onToggleColumn={handleToggleColumn}
                                                        onFixedHeader={handleFixedHeader}
                                                        onFixedFooter={handleFixedFooter}
                                                    />
                                                )}
                                            />
                                        </SortableContext>
                                    </DndContext>
                                    {renderFooterItem}
                                </Flex>
                            </Flex>
                        )}
                    >
                        <Tooltip title='列设置'>
                            <Typography.Text className='typography-text-icon'>
                                <Settings size={18} />
                            </Typography.Text>
                        </Tooltip>
                    </Dropdown>
                </Flex>
            </Flex>
            <Table
                className='w-full'
                columns={visibleColumns}
                {...rest}
            />
        </Flex>
    )
}

export default SmartTable