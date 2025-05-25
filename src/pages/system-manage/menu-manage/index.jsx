import { useEffect, useMemo, useState } from 'react'
import './index.css'
import { Button, Flex, Tree } from 'antd'
import { fetchMenuDetails, fetchMenuTree, menuDrag } from '../../../services/SystemService'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';


const MenuManage = () => {


    const [menuData, setMenuData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchMenuTree()
            setMenuData(data)
        }
        fetchData()
    }, [])

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


    const convertToTreeData = (data) => {
        return data.map(item => ({
            title: <Flex gap={10} justify='space-between' align='center'>
                {/* <Button danger type="text">
                    {item.name}
                </Button> */}
                <div>
                    {item.name}
                </div>
                <Flex gap={5}>
                    <div
                        className=''
                    >
                        <PlusCircleOutlined style={{ fontSize: 12, color: 'gray' }} />
                    </div>
                    <div>
                        <DeleteOutlined style={{ fontSize: 12, color: 'gray' }} />
                    </div>
                </Flex>
            </Flex>,
            key: item.id,
            children: item.children && item.children.length > 0 ? convertToTreeData(item.children) : [],
        }));
    }

    const menuItems = useMemo(() => convertToTreeData(menuData), [menuData]);

    const handleSelect = (selectedKeys, info) => {
        const menuId = info.node.key
        fetchMenuDetails(menuId)
            .then(data => {
                console.log('menuItem:', data)
            })
    }

    return (
        <Flex>
            <Flex flex={2}>
                <Tree
                    className="draggable-tree"
                    draggable
                    blockNode
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    treeData={menuItems}
                    onSelect={handleSelect}
                />
            </Flex>
            <Flex flex={8}>
                body
            </Flex>

            {/* <Suspense fallback={<Loading />}>
                <Await resolve={menuTree}>
                    {(data) => (
                        <Tree
                            className="draggable-tree"
                            draggable
                            blockNode
                            onDragEnter={onDragEnter}
                            onDrop={onDrop}
                            treeData={convertToTreeData(menuData)}
                            onSelect={handleSelect}
                        />
                    )}
                </Await>
            </Suspense> */}
        </Flex>
    )
}

export default MenuManage