import { useEffect, useState } from 'react'
import './index.css'
import { fetchRoleList } from '../../../services/SystemService'
import { Button, Flex, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd'

const initQueryParam = {
    pageNum: 1,
    pageSize: 10,
    code: null,
    name: null,
    enabled: null
}

const RoleManage = () => {

    const [form] = Form.useForm()

    const [queryParam, setQueryParam] = useState(initQueryParam)

    const [roleData, setRoleData] = useState({})

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const roles = await fetchRoleList(queryParam)
                setRoleData(roles)
            } finally {
                setLoading(false)
            }

        }
        getData()
    }, [queryParam])


    const handleSearch = () => {
        form.validateFields()
            .then(values => {
                const newQueryParam = { ...queryParam, ...values, pageNum: 1 }
                setQueryParam(newQueryParam)
            })
    }

    const handleReset = () => {
        form.resetFields()
        setQueryParam({ ...initQueryParam })
    }

    const handleCreateRole = () => {

    }

    const columns = [
        {
            key: 'code',
            title: '角色编码',
            dataIndex: 'code',
            align: 'center',
        },
        {
            key: 'name',
            title: '角色名称',
            dataIndex: 'name',
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
            render: (_, record) => {
                return (
                    <span>
                        <Typography.Link style={{ marginInlineEnd: 8 }}>
                            绑定权限
                        </Typography.Link>
                        <Typography.Link style={{ marginInlineEnd: 8 }}>
                            编辑
                        </Typography.Link>
                        {record.enabled === true
                            ?
                            (
                                <Typography.Link style={{ marginInlineEnd: 8 }}>
                                    停用
                                </Typography.Link>
                            )
                            :
                            (
                                <Typography.Link style={{ marginInlineEnd: 8 }}>
                                    启用
                                </Typography.Link>
                            )
                        }
                        <Popconfirm okText='确定' cancelText='取消' title="确定删除？" onConfirm={null} style={{ marginInlineEnd: 8 }}>
                            <Typography.Link style={{ marginInlineEnd: 8 }}>
                                删除
                            </Typography.Link>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ]

    return (
        <Flex
            gap={16}
            vertical
        >
            <Flex
            >
                <Form
                    form={form}
                    layout='inline'
                >
                    <Form.Item name="name" label="角色名称">
                        <Input placeholder="请输入角色名称" allowClear />
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
                    <Button type="primary" onClick={handleCreateRole}>新增</Button>
                </Space>
            </Flex>
            <Table
                className='w-full'
                columns={columns}
                dataSource={roleData.list}
                scroll={roleData?.list?.length > 10 ? { y: 1200 } : undefined}
                rowKey={(record) => record.id}
                loading={loading}
                pagination={{
                    current: roleData.pageNum,
                    pageSize: roleData.pageSize,
                    total: roleData.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: total => `共 ${total} 条`,
                    onChange: (pageNum, pageSize) => {
                        console.log(pageNum, pageSize)
                        const newQueryParam = { ...queryParam, pageNum: pageNum, pageSize: pageSize }
                        setQueryParam(newQueryParam)
                    }
                }}
            />
        </Flex>
    )
}

export default RoleManage