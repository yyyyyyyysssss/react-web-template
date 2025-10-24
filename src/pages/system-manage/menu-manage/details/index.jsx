import { Space, Flex, Form, Input, Table, Tag, Drawer, Button, Modal, Popconfirm, Typography, Spin, Avatar, Image } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { AuthorityType } from '../../../../enums';
import { useEffect, useState } from 'react';
import { deleteAuthorityById, fetchMenuDetails, updateAuthorityUrlsById } from '../../../../services/SystemService';
import IdGen from '../../../../utils/IdGen';
import AuthorityUrl from './AuthorityUrl';
import MenuAuthority from './menu-authority';
import HasPermission from '../../../../components/HasPermission';
import { getMessageApi } from '../../../../utils/MessageUtil';
import { useRequest } from 'ahooks';


const MenuDetails = ({ menuId }) => {

    if(!menuId){
        return <></>
    }

    const [menuData, setMenuData] = useState({})

    const [authorityUrls, setAuthorityUrls] = useState({})

    const { runAsync: fetchMenuDetailsAsync, loading: fetchMenuDetailsLoading } = useRequest(fetchMenuDetails, {
        manual: true
    })

    const { runAsync: updateAuthorityUrlsByIdAsync, loading: updateAuthorityUrlsByIdLoading } = useRequest(updateAuthorityUrlsById, {
        manual: true
    })

    const { runAsync: deleteAuthorityByIdAsync, loading: deleteAuthorityByIdLoading } = useRequest(deleteAuthorityById, {
        manual: true
    })


    const [openInfo, setOpenInfo] = useState({
        open: false,
        title: '',
        authorityId: ''
    })

    const [menuAuthorityOpen, setMenuAuthorityOpen] = useState({
        open: false,
        type: '',
        operation: '',
        title: '',
        data: null
    })

    const fetchAndSetMenuData = async (id) => {
        const data = await fetchMenuDetailsAsync(id)
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

    useEffect(() => {
        if (menuId) {
            fetchAndSetMenuData(menuId)
        }
    }, [menuId])

    const handleAuthorityChange = async (newAuthorityUrls) => {
        const authorityId = openInfo.authorityId
        await updateAuthorityUrlsByIdAsync(authorityId, newAuthorityUrls)
        getMessageApi().success('修改成功')
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

    const handleMenuAuthority = (title, type, operation, data) => {
        setMenuAuthorityOpen({
            open: true,
            type: type,
            operation: operation,
            title: title,
            data: data
        })
    }

    const handleDeleteAuthority = async (authorityId) => {
        await deleteAuthorityByIdAsync(authorityId)
        getMessageApi().success('删除成功')
        const newMenuData = {
            ...menuData,
            children: [...(menuData.children.filter(f => f.id !== authorityId))]
        }
        setMenuData(newMenuData)
    }

    const handleSuccessMenuAuthority = (newData, operation) => {
        if (operation === 'ADD') {
            const newMenuData = {
                ...menuData,
                children: [...(menuData.children || []), newData]
            }
            setMenuData(newMenuData)
        } else {
            const updatedChildren = (menuData.children || []).map(child =>
                child.id === newData.id ? { ...child, ...newData } : child
            )
            const newMenuData = {
                ...menuData,
                children: updatedChildren,
            }
            setMenuData(newMenuData)
        }
        handleCloseMenuAuthority()
    }

    const handleCloseMenuAuthority = () => {
        setMenuAuthorityOpen({
            open: false,
            type: '',
            operation: '',
            title: '',
            data: null
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
                        <HasPermission hasPermissions='system:menu:read'>
                            <Typography.Link onClick={() => showDrawer(record)}>API权限</Typography.Link>
                        </HasPermission>
                        <HasPermission hasPermissions='system:menu:write'>
                            <Typography.Link onClick={() => handleMenuAuthority('编辑权限', AuthorityType.BUTTON, 'EDIT', record)}>编辑</Typography.Link>
                        </HasPermission>
                        <HasPermission hasPermissions='system:menu:delete'>
                            <Popconfirm okText='确定' cancelText='取消' title="确定删除？" okButtonProps={{ loading: deleteAuthorityByIdLoading }} onConfirm={async () => await handleDeleteAuthority(record.id)} style={{ marginInlineEnd: 8 }}>
                                <Typography.Link>
                                    删除
                                </Typography.Link>
                            </Popconfirm>
                        </HasPermission>
                    </Space>
                )
            }
        }
    ]

    if (fetchMenuDetailsLoading) {
        return (
            <Flex flex={1} justify='center' align='center'>
                <Spin />
            </Flex>
        )
    }

    return (

        <Flex
            className='w-full'
            gap={8}
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
                    {menuData.icon && (
                        <Image width={48} src={menuData.icon} />
                    )}
                </Form.Item>
                <Form.Item label="排序:">
                    <Input value={menuData.sort} />
                </Form.Item>
            </Form>
            <HasPermission hasPermissions='system:menu:write'>
                <Button type="primary" onClick={() => handleMenuAuthority('新增权限', AuthorityType.BUTTON, 'ADD', null)} className='w-20'>新增权限</Button>
            </HasPermission>
            <Table
                columns={columns}
                dataSource={menuData.children}
                rowKey={(record) => record.id}
                pagination={false}
            />
            <MenuAuthority
                {...menuAuthorityOpen}
                parentId={menuData.id}
                parentCode={menuData.code}
                onClose={handleCloseMenuAuthority}
                onSuccess={handleSuccessMenuAuthority}
            />
            <Drawer
                title={`API权限[${openInfo.title}]`}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openInfo.open}
                width={700}
                destroyOnHidden
            >
                <AuthorityUrl
                    authorityId={openInfo.authorityId}
                    authorityUrls={authorityUrls}
                    onChange={handleAuthorityChange}
                    loading={updateAuthorityUrlsByIdLoading}
                />
            </Drawer>
        </Flex>

    )
}

export default MenuDetails