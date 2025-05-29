import { Space, Flex, Form, Input, Table, Tag, Popconfirm, Typography, Drawer } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { AuthorityType, RequestMethod } from '../../../../enums';
import { useEffect, useState } from 'react';
import { fetchMenuDetails } from '../../../../services/SystemService';
import AuthorityEditableCell from './AuthorityEditCell';
import IdGen from '../../../../utils/IdGen';


const MenuDetails = ({ menuId }) => {

    const [menuData, setMenuData] = useState({})

    const [currentMenuItem, setCurrentMenuItem] = useState({})

    const [open, setOpen] = useState(false)

    const [form] = Form.useForm()

    const [editingKey, setEditingKey] = useState('')

    useEffect(() => {
        const getData = async () => {
            const data = await fetchMenuDetails(menuId)
            if (data.children && data.children.length > 0) {
                data.children.forEach(child => {
                    if (child.authorityUrls && child.authorityUrls.length > 0) {
                        child.authorityUrls = child.authorityUrls.map(item => ({
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

    const isEditing = record => record.id === editingKey

    const edit = record => {
        form.setFieldsValue(Object.assign({ id: '', method: '', url: '' }, { ...record, method: record.method?.toUpperCase() || '', }))
        setEditingKey(record.id)
    }

    const del = (record) => {

    }

    const cancel = () => {
        setEditingKey('')
    }

    const save = (key) => {
        console.log('save:', key)
        form.validateFields()
            .then(values => {
                setEditingKey('')
            })
            .catch(errorInfo => {
                console.log('校验失败，错误信息:', errorInfo)
            })

    }


    const showDrawer = (menuItem) => {
        setOpen(true)
        setCurrentMenuItem(menuItem)
    }
    const onClose = () => {
        setOpen(false)
    }


    const tableColumns = [
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


    const authorityTableColumns = [
        {
            key: 'method',
            title: '请求方法',
            dataIndex: 'method',
            align: 'center',
            editable: true,
            render: (_, { method }) => {
                switch (method.toUpperCase()) {
                    case RequestMethod.GET:
                        return <Tag color="green">GET</Tag>
                    case RequestMethod.POST:
                        return <Tag color="blue">POST</Tag>
                    case RequestMethod.PUT:
                        return <Tag color="orange">PUT</Tag>
                    case RequestMethod.DELETE:
                        return <Tag color="red">DELETE</Tag>
                    case RequestMethod.ALL:
                        return <Tag color="purple">ALL</Tag>
                    default:
                        return <Tag color="gray">未知</Tag>
                }
            }
        },
        {
            key: 'url',
            title: '请求路径',
            dataIndex: 'url',
            align: 'center',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record)
                return editable ?
                    (
                        <span>
                            <Typography.Link onClick={() => save(record.id)} style={{ marginInlineEnd: 8 }}>
                                保存
                            </Typography.Link>
                            <Typography.Link onClick={cancel} style={{ marginInlineEnd: 8 }}>
                                取消
                            </Typography.Link>
                        </span>
                    )
                    :
                    (
                        <span>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginInlineEnd: 8 }}>
                                编辑
                            </Typography.Link>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => del(record)} style={{ marginInlineEnd: 8 }}>
                                删除
                            </Typography.Link>
                        </span>
                    )
            }
        }
    ]

    const mergedColumns = authorityTableColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return Object.assign(Object.assign({}, col), {
            onCell: record => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        })
    })

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
                columns={tableColumns}
                dataSource={menuData.children}
                rowKey={(record) => record.id}
                pagination={false}
            />
            <Drawer
                title="查看权限"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={open}
                width={700}
            >
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: { cell: AuthorityEditableCell }
                        }}
                        columns={mergedColumns}
                        dataSource={currentMenuItem.authorityUrls}
                        rowClassName="editable-row"
                        rowKey={(record) => record.id}
                        pagination={false}
                    />
                </Form>
            </Drawer>
        </Flex>
    )
}

export default MenuDetails