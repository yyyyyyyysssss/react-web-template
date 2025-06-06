import { Button, Dropdown, Flex, Form, Input, Menu, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd'
import './index.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteUserById, fetchUserList, updateUserEnabled } from '../../../services/SystemService';
import { DownOutlined } from '@ant-design/icons';
import Highlight from '../../../component/Highlight';


const initQueryParam = {
    pageNum: 1,
    pageSize: 10,
    enabled: null,
    keyword: null
}

const UserManage = () => {

    const [modal, contextHolder] = Modal.useModal()

    const navigate = useNavigate()

    const [searchForm] = Form.useForm()

    const [userData, setUserData] = useState({})

    const [loading, setLoading] = useState(false)

    const [queryParam, setQueryParam] = useState(initQueryParam)


    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const users = await fetchUserList(queryParam)
                setUserData(users)
            } finally {
                setLoading(false)
            }

        }
        getData()
    }, [queryParam])


    const handleSearch = () => {
        searchForm.validateFields()
            .then(values => {
                const newQueryParam = { ...queryParam, ...values, pageNum: 1 }
                setQueryParam(newQueryParam)
            })
    }

    const handleReset = () => {
        searchForm.resetFields()
        setQueryParam({ ...initQueryParam })
    }

    const handleRefresh = () => {
        const newQueryParam = { ...queryParam }
        setQueryParam(newQueryParam)
    }

    const handleUpdateEnabled = (id, enabled) => {
        updateUserEnabled(id, enabled)
            .then(
                () => {
                    handleRefresh()
                }
            )
    }

    const handleDelete = (id) => {
        deleteUserById(id)
            .then(
                () => {
                    handleRefresh()
                }
            )
    }

    const columns = [
        {
            key: 'nickname',
            title: '用户名称',
            dataIndex: 'nickname',
            align: 'center',
            fixed: 'left',
        },
        {
            key: 'username',
            title: '用户账号',
            dataIndex: 'username',
            align: 'center',
        },
        {
            key: 'phone',
            title: '用户手机号',
            dataIndex: 'phone',
            align: 'center',
        },
        {
            key: 'email',
            title: '用户邮箱',
            dataIndex: 'email',
            align: 'center',
        },
        {
            key: 'enabled',
            title: '状态',
            dataIndex: 'enabled',
            width: '80px',
            align: 'center',
            render: (_, { enabled }) => {
                if (enabled === true) {
                    return <Tag color="success">启用</Tag>
                } else {
                    return <Tag color="error">停用</Tag>
                }
            }
        },
        {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            key: 'updateTime',
            title: '修改时间',
            dataIndex: 'updateTime',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                if (record.code === 'super_admin') {
                    return <></>
                }
                return (
                    <span>
                        <Typography.Link onClick={() => null} style={{ marginInlineEnd: 8 }}>
                            绑定角色
                        </Typography.Link>
                        <Typography.Link onClick={() => null} style={{ marginInlineEnd: 8 }}>
                            编辑
                        </Typography.Link>
                        {record.enabled === true
                            ?
                            (
                                <Popconfirm okText='确定' cancelText='取消' title="确定停用？" onConfirm={() => handleUpdateEnabled(record.id, false)} style={{ marginInlineEnd: 8 }}>
                                    <Typography.Link style={{ marginInlineEnd: 8 }}>
                                        停用
                                    </Typography.Link>
                                </Popconfirm>
                            )
                            :
                            (
                                <Typography.Link onClick={() => handleUpdateEnabled(record.id, true)} style={{ marginInlineEnd: 8 }}>
                                    启用
                                </Typography.Link>
                            )
                        }
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'reset',
                                        label: (
                                            <Typography.Link onClick={() => null} style={{ marginInlineEnd: 8 }}>
                                                重置密码
                                            </Typography.Link>
                                        )
                                    },
                                    {
                                        key: 'delete',
                                        label: (
                                            <Typography.Link
                                                style={{ marginInlineEnd: 8 }}
                                                onClick={() => {
                                                    modal.confirm({
                                                        title: '确定删除？',
                                                        okText: '确定',
                                                        cancelText: '取消',
                                                        content: (
                                                            <>
                                                                是否删除 <Highlight>{record.nickname}</Highlight> 的账号？删除后将无法恢复！
                                                            </>
                                                        ),
                                                        onOk: () => handleDelete(record.id),
                                                    })
                                                }}
                                            >
                                                删除
                                            </Typography.Link>
                                        )
                                    }
                                ]
                            }}
                            trigger={['click']}
                        >
                            <Typography.Link>
                                更多 <DownOutlined />
                            </Typography.Link>
                        </Dropdown>
                    </span>
                )
            }
        }
    ]

    const toUserDetails = () => {
        // navigate('/system/user/details',{
        //     state: {
        //         id: 1
        //     }
        // })

        navigate('/system/user/details?id=1')

        // navigate('/system/user/details')
    }

    return (
        <Flex
            gap={16}
            vertical
        >
            <Flex
                justify='center'
            >
                <Form
                    form={searchForm}
                    layout='inline'
                >
                    <Form.Item name="keyword" label="用户信息" style={{ width: 350 }}>
                        <Input placeholder="请输入用户名称、手机号、邮箱等" allowClear />
                    </Form.Item>
                    <Form.Item name="enabled" label="状态">
                        <Select
                            placeholder="请选择状态"
                            style={{ width: 120 }}
                            allowClear
                            options={[
                                {
                                    label: '启用',
                                    value: true
                                },
                                {
                                    label: '停用',
                                    value: false
                                }
                            ]}
                        />
                    </Form.Item>
                </Form>
                <Space>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
                </Space>
            </Flex>
            <Flex>
                <Space>
                    <Button type="primary" onClick={null}>新增</Button>
                </Space>
            </Flex>
            <Table
                className='w-full'
                columns={columns}
                dataSource={userData.list}
                scroll={userData?.list?.length > 10 ? { y: 1200, x: 'max-content' } : { x: 'max-content' }}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                    current: userData.pageNum,
                    pageSize: userData.pageSize,
                    total: userData.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: total => `共 ${total} 条`,
                    onChange: (pageNum, pageSize) => {
                        const newQueryParam = { ...queryParam, pageNum: pageNum, pageSize: pageSize }
                        setQueryParam(newQueryParam)
                    }
                }}
            />
            {contextHolder}
        </Flex>
    )
}

export default UserManage