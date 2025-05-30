import { Space, Flex, Form, Input, Table, Tag, Popconfirm, Typography, Drawer, Button, message } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { AuthorityType, RequestMethod } from '../../../../enums';
import { useEffect, useState } from 'react';
import { fetchMenuDetails, updateAuthorityUrlsById } from '../../../../services/SystemService';
import AuthorityEditableCell from './AuthorityEditCell';
import IdGen from '../../../../utils/IdGen';
import Authority from './Authority';


const MenuDetails = ({ menuId }) => {

    const [menuData, setMenuData] = useState({})

    const [authorityUrls, setAuthorityUrls] = useState({})

    const [openInfo, setOpenInfo] = useState({
        open: false,
        title: '',
        authorityId: ''
    })

    useEffect(() => {
        const getData = async () => {
            const data = await fetchMenuDetails(menuId)
            if (data.children && data.children.length > 0) {
                data.children.forEach(child => {
                    if (child.urls && child.urls.length > 0) {
                        child.urls = child.urls.map(item => ({
                            ...item,
                            id: IdGen.nextId()
                        }))
                    }
                })

            }
            setMenuData(data)
        }
        if (menuId) {
            getData()
        }
    }, [menuId])

    const handleAuthorityChange = async (newAuthorityUrls) => {
        const authorityId = openInfo.authorityId
        return updateAuthorityUrlsById(authorityId, newAuthorityUrls)
            .then(
                (data) => {
                    //更新当前权限urls
                    setAuthorityUrls(newAuthorityUrls)
                    //更新权限数据
                    setMenuData(prev => ({
                        ...prev,
                        children: prev.children.map(child =>
                            child.id === authorityId
                                ? { ...child, urls: newAuthorityUrls }
                                : child
                        )
                    }))
                }
            )
    }


    const showDrawer = (menuItem) => {
        setOpenInfo({
            open: true,
            title: menuItem.name,
            authorityId: menuItem.id
        })
        setAuthorityUrls(menuItem.urls)
    }
    const onClose = () => {
        setOpenInfo({
            open: false,
            title: '',
            authorityId: ''
        })
    }


    const columns = [
        {
            key: 'name',
            title: '权限名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            key: 'code',
            title: '权限编码',
            dataIndex: 'code',
            align: 'center',
        },
        {
            key: 'type',
            title: '权限类型',
            dataIndex: 'type',
            align: 'center',
            render: (_, { type }) => {
                let color
                if (type === AuthorityType.BUTTON) {
                    color = 'geekblue'
                } else if (type === AuthorityType.API) {
                    color = 'volcano'
                } else {
                    color = 'gray'
                }
                return (
                    <Tag color={color}>
                        {type.toUpperCase()}
                    </Tag>
                )
            }

        },
        {
            key: 'action',
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => {
                return (
                    <Space size='middle'>
                        <a onClick={() => showDrawer(record)}>查看</a>
                        <a>删除</a>
                    </Space>
                )
            }
        }
    ]

    return (
        <Flex
            className='w-full'
            vertical
        >
            <Form
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                layout="horizontal"
                disabled={true}
            >
                <Form.Item label="菜单名称:">
                    <Input value={menuData.name} />
                </Form.Item>
                <Form.Item label="菜单编码:">
                    <Input value={menuData.code} />
                </Form.Item>
                <Form.Item label="路由:">
                    <Input value={menuData.routePath} />
                </Form.Item>
                <Form.Item label="图标:">
                    <div className='flex items-center'>
                        <SettingOutlined size={18} color='gray' />
                    </div>
                </Form.Item>
                <Form.Item label="排序:">
                    <Input value={menuData.sort} />
                </Form.Item>
            </Form>
            <Table
                columns={columns}
                dataSource={menuData.children}
                rowKey={(record) => record.id}
                pagination={false}
            />
            <Drawer
                title={openInfo.title}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openInfo.open}
                width={700}
            >
                <Authority
                    authorityId={openInfo.authorityId}
                    authorityUrls={authorityUrls}
                    onChange={handleAuthorityChange}
                />
            </Drawer>
        </Flex>
    )
}

export default MenuDetails