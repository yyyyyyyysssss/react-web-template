import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import { Divider, Dropdown, Flex, Tree, Modal, Tooltip } from 'antd'
import { deleteMenu, fetchMenuTree, menuDrag } from '../../../services/SystemService'
import { Plus, Pencil, Trash2 } from 'lucide-react';
import MenuDetails from './details';
import MenuAuthority from './details/menu-authority';
import { AuthorityType } from '../../../enums';
import IdGen from '../../../utils/IdGen';
import Highlight from '../../../components/Highlight';
import HasPermission from '../../../components/HasPermission';
import { getMessageApi } from '../../../utils/MessageUtil';
import { useRequest } from 'ahooks';



const MenuItem = ({ item, onAddMenu, onEditMenu, onDeleteMenu }) => {


    const [hovering, setHovering] = useState(false)

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const showOps = hovering || dropdownOpen


    return (
        <div
            className="flex justify-between items-center w-full"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div>
                {item.name}
            </div>
            <HasPermission requireAll={true} hasPermissions={['system:menu:write', 'system:menu:delete']}>
                <div className={`flex items-center transition-opacity ${showOps ? 'opacity-100' : 'opacity-0'}`}>
                    <Dropdown
                        menu={{
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
                                event.stopPropagation()
                                onAddMenu(key, item)
                            }
                        }}
                        onOpenChange={(open) => setDropdownOpen(open)}
                    >
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
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditMenu(item)
                        }}
                    >
                        <Tooltip title='编辑菜单'>
                            <Pencil size={16} color='gray' />
                        </Tooltip>
                    </div>
                    <div
                        className='menu-ops-btn'
                        onClick={(e) => {
                            e.stopPropagation()
                            onDeleteMenu(item)
                        }}
                    >
                        <Tooltip title='删除菜单'>
                            <Trash2 size={16} color='gray' />
                        </Tooltip>
                    </div>
                </div>
            </HasPermission>
        </div>
    )
}

const MenuManage = () => {

    const [modal, contextHolder] = Modal.useModal()

    const [menuData, setMenuData] = useState([])

    const [selectedMenu, setSelectedMenu] = useState(null)

    const [selectedKeys, setSelectedKeys] = useState(null)

    const [menuDetailsKey, setMenuDetailsKey] = useState('0')

    const { runAsync: deleteMenuAsync, loading: deleteMenuLoading } = useRequest(deleteMenu, {
        manual: true
    })

    const [menuAuthorityOpen, setMenuAuthorityOpen] = useState({
        open: false,
        type: '',
        operation: '',
        title: '',
        parentId: null,
        parentCode: null,
        data: null
    })

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
                    getMessageApi().success('拖动成功')
                    setMenuData(data)
                }
            })
    }

    const handleAddMenu = (type, menuItem) => {
        handleSelectMenu(menuItem.id)
        if (type === 'child') {
            setMenuAuthorityOpen({
                open: true,
                type: AuthorityType.MENU,
                operation: 'ADD',
                title: '新增子菜单',
                data: null,
                parentId: menuItem.id,
                parentCode: menuItem.code
            })
        } else {
            const parentMenuItem = flattenTreeRef.current.find(f => f.id === menuItem.parentId)
            setMenuAuthorityOpen({
                open: true,
                type: AuthorityType.MENU,
                operation: 'ADD',
                title: '新增同级菜单',
                data: null,
                parentId: parentMenuItem ? parentMenuItem.id : '0',
                parentCode: parentMenuItem ? parentMenuItem.code : ''
            })
        }

    }

    const handleEditMenu = (menuItem) => {
        setMenuAuthorityOpen({
            open: true,
            type: AuthorityType.MENU,
            operation: 'EDIT',
            title: '编辑菜单',
            data: menuItem,
            parentId: menuItem.parentId,
            parentCode: null
        })
        handleSelectMenu(menuItem.id)
    }


    const handleDeleteMenu = (menuItem) => {
        handleSelectMenu(menuItem.id)
        modal.confirm({
            title: '确认删除？',
            content: (
                <>
                    是否删除 <Highlight>{menuItem.name}</Highlight> 菜单？删除后将一并移除其下所有子菜单和权限项。
                </>
            ),
            okText: '确认',
            cancelText: '取消',
            maskClosable: false,
            confirmLoading: deleteMenuLoading,
            onOk: async () => {
                await deleteMenuAsync(menuItem.id)
                getMessageApi().success('删除成功')
                const newMenuData = deleteTreeNode(menuData, menuItem.id)
                setMenuData(newMenuData)
                setSelectedKeys(null)
            },
        })
    }

    const convertToTreeData = (data) => {
        return data.map(item => ({
            title: <MenuItem
                item={item}
                onAddMenu={handleAddMenu}
                onEditMenu={handleEditMenu}
                onDeleteMenu={handleDeleteMenu}
            />,
            key: item.id,
            children: item.children && item.children.length > 0 ? convertToTreeData(item.children) : [],
        }));
    }

    const menuItems = useMemo(() => convertToTreeData(menuData), [menuData]);

    const handleSelect = (selectedKeys, info) => {
        const clickedKey = info.node.key
        handleSelectMenu(clickedKey)

    }

    const handleSelectMenu = async (menuId) => {
        // 不取消选中
        setSelectedKeys([menuId])
        const menu = flattenTreeRef.current.find(f => f.id === menuId)
        setSelectedMenu(menu)
    }

    const handleSuccessMenuAuthority = (newData, operation) => {
        if (operation === 'ADD') {
            const newMenuData = addTreeNode(menuData, newData.parentId, newData)
            setMenuData(newMenuData)
        } else {
            const newMenuData = updateTreeNode(menuData, newData)
            setMenuData(newMenuData)
            //刷新详情组件
            setMenuDetailsKey(IdGen.nextId())
        }
        handleCloseMenuAuthority()
    }

    const handleCloseMenuAuthority = () => {
        setMenuAuthorityOpen({
            open: false,
            type: '',
            operation: '',
            title: '',
            parentId: null,
            parentCode: null,
            data: null
        })
    }

    const sortBySortValue = (a, b) => {
        if (a.sort == null && b.sort == null) return 0;
        if (a.sort == null) return 1
        if (b.sort == null) return -1
        return a.sort - b.sort
    }

    const addTreeNode = (treeData, parentId, targetData) => {
        if (parentId == 0) {
            return [...(treeData || []), targetData].sort(sortBySortValue)
        }
        return treeData.map(node => {
            if (node.id === parentId) {
                const children = [...(node.children || []), targetData].sort(sortBySortValue)
                return { ...node, children }
            } else if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: addTreeNode(node.children, parentId, targetData),
                };
            } else {
                return node
            }
        })
    }

    const updateTreeNode = (treeData, targetData) => {
        return treeData.map(node => {
            if (node.id === targetData.id) {
                return { ...node, ...targetData }
            } else if (node.children && node.children.length > 0) {
                return {
                    ...node,
                    children: updateTreeNode(node.children, targetData),
                };
            } else {
                return node
            }
        })
    }

    const deleteTreeNode = (treeData, targetId) => {
        return (treeData || []).filter(node => {
            // 如果当前节点是要删除的，直接过滤掉
            if (node.id === targetId) return false;

            // 如果当前节点有子节点，递归删除子节点
            if (node.children && node.children.length > 0) {
                node.children = deleteTreeNode(node.children, targetId);
            }

            return true;
        })
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
                    height: 'calc(100% + 40px)',
                    width: '1px',
                    backgroundColor: 'lightgray',
                    marginInline: '12px',
                    marginTop: '-20px',
                    marginBottom: '-20px'
                }}
            />
            <Flex flex={8}>
                {selectedKeys && (
                    <MenuDetails key={menuDetailsKey} menuId={selectedMenu.id} />
                )}
            </Flex>
            <MenuAuthority
                {...menuAuthorityOpen}
                onClose={handleCloseMenuAuthority}
                onSuccess={handleSuccessMenuAuthority}
            />
            {contextHolder}
        </Flex>
    )
}

export default MenuManage