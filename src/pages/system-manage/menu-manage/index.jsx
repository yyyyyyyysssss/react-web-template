import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import { Divider, Dropdown, Flex, Tree } from 'antd'
import { fetchMenuTree, menuDrag } from '../../../services/SystemService'
import { Plus, Pencil, Trash2 } from 'lucide-react';
import MenuDetails from './details';


const MenuManage = () => {


    const [menuData, setMenuData] = useState([])

    const [selectedMenu, setSelectedMenu] = useState(null)

    const [selectedKeys, setSelectedKeys] = useState(null)

    const flattenTreeRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchMenuTree()
            setMenuData(data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const flattenTree = (menuData) => {
            const result = []
            const dfs = (nodes) => {
                nodes.forEach(node => {
                    result.push({ ...node, children: null })
                    if (node.children && node.children.length > 0) {
                        dfs(node.children)
                    }
                })
            }
            dfs(menuData)
            return result
        }
        flattenTreeRef.current = flattenTree(menuData)
    }, [menuData])

    const onDragEnter = (info) => {

    }

    const onDrop = (info) => {
        // 目标节点（被放下的节点）
        const dropKey = info.node.key
        //拖动的节点
        const dragKey = info.dragNode.key
        //相对于目标节点的位置（-1=上方，0=中间，1=下方）
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
        //true = 插入到目标节点的前/后；false = 插入为目标节点的子节点
        const dropToGap = info.dropToGap

        //根据key找节点
        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === key) {
                    return callback(data[i], i, data)
                }
                if (data[i].children && data[i].children.length > 0) {
                    loop(data[i].children, key, callback)
                }
            }
        }

        const data = [...menuData]
        //找到拖动的节点
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            // 删除旧位置
            arr.splice(index, 1)
            dragObj = item
        })
        //为目标节点的子节点
        if (!dropToGap) {
            //找到目标节点 并将拖动的节点插入为该节点的子节点
            loop(data, dropKey, item => {
                item.children = item.children || []
                item.children.unshift(dragObj)
            })
        } else { // 为目标节点的兄弟节点
            let ar = []
            let i
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr
                i = index
            })

            if (dropPosition === -1) {
                // 插入目标节点前
                ar.splice(i, 0, dragObj)
            } else {
                // 插入目标节点后
                ar.splice(i + 1, 0, dragObj)
            }
        }
        const position = dropToGap ? (dropPosition === -1 ? 'BEFORE' : 'AFTER') : 'INSIDE'
        menuDrag(dragKey, dropKey, position)
            .then(d => {
                if (d === true) {
                    setMenuData(data)
                }
            })
    }

    const addMenu = (e, type, menuItem) => {
        e.stopPropagation()
        handleSelectMenu(menuItem.id)
        if (type === 'child') {
            console.log('新增子节点')
        } else {
            console.log('新增兄弟节点')
        }

    }

    const editMenu = (e, menuItem) => {
        e.stopPropagation()
        handleSelectMenu(menuItem.id)
    }


    const deleteMenu = (e, menuItem) => {
        e.stopPropagation()
        handleSelectMenu(menuItem.id)
    }

    const convertToTreeData = (data) => {
        return data.map(item => ({
            title: <div
                className="flex justify-between items-center w-full"
            >
                <div>
                    {item.name}
                </div>
                <div className='flex items-center'>
                    <Dropdown menu={{
                        items: [
                            {
                                key: 'child',
                                label: '新增子菜单'
                            },
                            {
                                key: 'brother',
                                label: '新增同级菜单'
                            }
                        ],
                        onClick: (info) => {
                            const event = info.domEvent
                            const key = info.key
                            addMenu(event, key, item)
                        }
                    }}>
                        <div
                            className='menu-ops-btn'
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            <Plus size={18} color='gray' />
                        </div>
                    </Dropdown>
                    <div
                        className='menu-ops-btn'
                        onClick={(e) => editMenu(e, item)}
                    >
                        <Pencil size={16} color='gray' />
                    </div>
                    <div
                        className='menu-ops-btn'
                        onClick={(e) => deleteMenu(e, item)}
                    >
                        <Trash2 size={16} color='gray' />
                    </div>
                </div>
            </div>,
            key: item.id,
            children: item.children && item.children.length > 0 ? convertToTreeData(item.children) : [],
        }));
    }

    const menuItems = useMemo(() => convertToTreeData(menuData), [menuData]);

    const handleSelect = (selectedKeys, info) => {
        const clickedKey = info.node.key
        handleSelectMenu(clickedKey)

    }

    const handleSelectMenu = (menuId) => {
        // 不取消选中
        setSelectedKeys([menuId])
        const menu = flattenTreeRef.current.find(f => f.id === menuId)
        setSelectedMenu(menu)
    }

    return (
        <Flex flex={1} gap={10} className='h-full'>
            <Flex
                style={{
                    minWidth: '240px',
                }}
            >
                <Tree
                    className="draggable-tree"
                    draggable={{
                        icon: false
                    }}
                    blockNode
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    treeData={menuItems}
                    selectedKeys={selectedKeys}
                    onSelect={handleSelect}
                />
            </Flex>
            <Divider
                type="vertical"
                style={{
                    height: '100%',
                    width: '2px',
                    backgroundColor: 'lightgray',
                    marginInline: '12px'
                }}
            />
            <Flex flex={8}>
                {selectedKeys && (
                    <MenuDetails menuId={selectedMenu.id} />
                )}
            </Flex>
        </Flex>
    )
}

export default MenuManage