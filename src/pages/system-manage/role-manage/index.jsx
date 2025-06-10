import { useEffect, useState } from 'react'
import './index.css'
import { bindAuthorityByRoleId, createRole, deleteRoleById, fetchRoleList, updateRole, updateRoleEnabled } from '../../../services/SystemService'
import { Button, Drawer, Flex, Form, Input, Modal, Popconfirm, Radio, Select, Space, Switch, Table, Tag, Tree, Typography } from 'antd'
import AuthorityTreeSelect from '../../../component/AuthorityTreeSelect'
import AuthorityTree from '../../../component/AuthorityTree'
import Highlight from '../../../component/Highlight'

const initQueryParam = {
    pageNum: 1,
    pageSize: 10,
    keyword: null,
    enabled: null
}

const RoleManage = () => {

    const [modal, contextHolder] = Modal.useModal()

    const [searchForm] = Form.useForm()

    const [editForm] = Form.useForm()

    const [bindAuthorityForm] = Form.useForm()

    const [queryParam, setQueryParam] = useState(initQueryParam)

    const [roleData, setRoleData] = useState({})

    const [loading, setLoading] = useState(false)

    const [roleOperation, setRoleOperation] = useState({
        open: false,
        title: null,
        operationType: null,
        roleItem: null,
    })

    const [bindAuthority, setBindAuthority] = useState({
        open: false,
        title: null,
        roleItem: null,
    })

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

    useEffect(() => {
        if (roleOperation && roleOperation.open === true && roleOperation.operationType === 'EDIT') {
            editForm.setFieldsValue(roleOperation.roleItem)
        }
    }, [roleOperation])

    useEffect(() => {
        if (bindAuthority && bindAuthority.open === true) {
            bindAuthorityForm.setFieldsValue(bindAuthority.roleItem)
        }
    }, [bindAuthority])


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

    const handleAddRole = () => {
        setRoleOperation({
            open: true,
            title: '新增角色',
            operationType: 'ADD',
            roleItem: null,
        })
    }

    const handleEditRole = (roleItem) => {
        setRoleOperation({
            open: true,
            title: '编辑角色',
            operationType: 'EDIT',
            roleItem: roleItem,
        })
    }

    const handleClose = () => {
        setRoleOperation({
            open: false,
            title: null,
            operationType: null,
            roleItem: null,
        })
        editForm.resetFields()
    }

    const handleSaveRole = () => {
        editForm.validateFields()
            .then(
                (values) => {
                    if (roleOperation.operationType === 'ADD') {
                        createRole(values)
                            .then(
                                () => {
                                    handleClose()
                                    handleRefresh()
                                }
                            )
                    } else {
                        console.log('values',values)
                        updateRole(values)
                            .then(
                                () => {
                                    handleClose()
                                    handleRefresh()
                                }
                            )
                    }

                }
            )
    }

    const handleUpdateEnabled = (id, enabled) => {
        updateRoleEnabled(id, enabled)
            .then(
                () => {
                    handleRefresh()
                }
            )
    }

    const handleDelete = (id) => {
        deleteRoleById(id)
            .then(
                () => {
                    handleRefresh()
                }
            )
    }

    const handleBindAuthority = (roleItem) => {
        setBindAuthority({
            open: true,
            title: `分配权限[${roleItem.name}]`,
            roleItem: roleItem,
        })
    }

    const handleBindAuthoritySave = () => {
        bindAuthorityForm.validateFields()
            .then(values => {
                bindAuthorityByRoleId(values.id, values.authorityIds)
                    .then(
                        () => {
                            handleBindAuthorityClose()
                            handleRefresh()
                        }
                    )
            })
    }

    const handleBindAuthorityClose = () => {
        setBindAuthority({
            open: false,
            title: null,
            roleItem: null,
        })
    }

    const columns = [
        {
            key: 'name',
            title: '角色名称',
            dataIndex: 'name',
            align: 'center',
            fixed: 'left',
        },
        {
            key: 'code',
            title: '角色编码',
            dataIndex: 'code',
            align: 'center',
        },
        {
            key: 'enabled',
            title: '状态',
            dataIndex: 'enabled',
            width: '100px',
            align: 'center',
            render: (_, record) => {
                const { id, enabled } = record
                const handleChange = (checked) => {
                    if (checked) {
                        handleUpdateEnabled(id, true)
                    }
                }
                return enabled ?
                    (
                        <Popconfirm
                            okText='确定'
                            cancelText='取消'
                            title="确定停用？"
                            onConfirm={() => handleUpdateEnabled(record.id, false)}
                            style={{ marginInlineEnd: 8 }}
                        >
                            <Switch
                                checkedChildren="启用"
                                unCheckedChildren="停用"
                                checked={enabled}
                                onChange={handleChange}
                            />
                        </Popconfirm>

                    )
                    :
                    (
                        <Switch
                            checkedChildren="启用"
                            unCheckedChildren="停用"
                            checked={enabled}
                            onChange={handleChange}
                        />
                    )
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
                if (record.type === 'SUPER_ADMIN') {
                    return <></>
                }
                return (
                    <span>
                        <Typography.Link onClick={() => handleBindAuthority(record)} style={{ marginInlineEnd: 8 }}>
                            分配权限
                        </Typography.Link>
                        <Typography.Link onClick={() => handleEditRole(record)} style={{ marginInlineEnd: 8 }}>
                            编辑
                        </Typography.Link>
                        <Typography.Link
                            style={{ marginInlineEnd: 8 }}
                            onClick={() => {
                                modal.confirm({
                                    title: '确定删除？',
                                    okText: '确定',
                                    cancelText: '取消',
                                    content: (
                                        <>
                                            是否删除 <Highlight>{record.name}</Highlight> 角色？删除后将无法恢复！
                                        </>
                                    ),
                                    onOk: () => handleDelete(record.id),
                                })
                            }}
                        >
                            删除
                        </Typography.Link>
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
                justify='center'
            >
                <Form
                    form={searchForm}
                    layout='inline'
                    onFinish={handleSearch}
                >
                    <Form.Item name="keyword" label="角色信息" style={{ width: 350 }}>
                        <Input placeholder="请输入角色名称或编码" allowClear />
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
                    <Form.Item style={{ display: 'none' }}>
                        <Button htmlType="submit" />
                    </Form.Item>
                </Form>
                <Space>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
                </Space>
            </Flex>
            <Flex>
                <Space>
                    <Button type="primary" onClick={handleAddRole}>新增</Button>
                </Space>
            </Flex>
            <Table
                className='w-full'
                columns={columns}
                dataSource={roleData.list}
                scroll={roleData?.list?.length > 10 ? { y: 1200, x: 'max-content' } : { x: 'max-content' }}
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
                        const newQueryParam = { ...queryParam, pageNum: pageNum, pageSize: pageSize }
                        setQueryParam(newQueryParam)
                    }
                }}
            />
            <Modal
                title={roleOperation.title}
                width={400}
                centered
                open={roleOperation.open}
                onOk={handleSaveRole}
                onCancel={handleClose}
                onClose={handleClose}
                okText="保存"
                cancelText="取消"
            >
                <div
                    className='w-full mt-5'
                >
                    <Form
                        form={editForm}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                    >
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="角色名称"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: `角色名称不能为空`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="角色编码"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: `角色编码不能为空`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="启用状态"
                            name="enabled"
                            rules={[
                                {
                                    required: true,
                                    message: `启用状态不能为空`,
                                },
                            ]}
                        >
                            <Radio.Group
                                options={[
                                    { value: true, label: '启用' },
                                    { value: false, label: '停用' }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="分配权限"
                            name="authorityIds"
                        >
                            <AuthorityTreeSelect />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Drawer
                title={bindAuthority.title}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={handleBindAuthorityClose}
                open={bindAuthority.open}
                width={400}
                footer={
                    <Space>
                        <Button type="primary" onClick={handleBindAuthoritySave}>保存</Button>
                        <Button onClick={handleBindAuthorityClose}>取消</Button>
                    </Space>
                }
            >
                <Form
                    form={bindAuthorityForm}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="authorityIds"
                    >
                        <AuthorityTree />
                    </Form.Item>
                </Form>
            </Drawer>
            {contextHolder}
        </Flex>
    )
}

export default RoleManage