import { Button, Drawer, Dropdown, Flex, Form, Input, Modal, Popconfirm, Radio, Select, Space, Switch, Typography } from 'antd'
import './index.css'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { bindRoleByUserId, createUser, deleteUserById, fetchUserList, resetPassword, updateUser, updateUserEnabled } from '../../../services/SystemService';
import { CopyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import Highlight from '../../../component/Highlight';
import { getMessageApi } from '../../../utils/MessageUtil';
import RoleSelect from '../../../component/RoleSelect';
import HasPermission from '../../../component/HasPermission';
import { useRequest } from 'ahooks';
import SmartTable from '../../../component/smart-table';


const initQueryParam = {
    pageNum: 1,
    pageSize: 10,
    enabled: null,
    keyword: null
}

const UserManage = () => {

    const [modal, contextHolder] = Modal.useModal()

    const navigate = useNavigate()

    const [editForm] = Form.useForm()

    const [bindRoleForm] = Form.useForm()

    const [searchForm] = Form.useForm()

    const [userData, setUserData] = useState({})


    const [queryParam, setQueryParam] = useState(initQueryParam)

    // 列表查询
    const { runAsync: fetchUserListAsync, loading: fetchUserLoading } = useRequest(fetchUserList, {
        manual: true
    })

    const { runAsync: createUserAsync, loading: createUserLoading } = useRequest(createUser, {
        manual: true
    })

    const { runAsync: updateUserAsync, loading: updateUserLoading } = useRequest(updateUser, {
        manual: true
    })

    const { runAsync: resetPasswordAsync, loading: resetPasswordLoading } = useRequest(resetPassword, {
        manual: true
    })

    const { runAsync: deleteUserByIdAsync, loading: deleteUserByIdLoading } = useRequest(deleteUserById, {
        manual: true
    })

    const { runAsync: bindRoleByUserIdAsync, loading: bindRoleByUserIdLoading } = useRequest(bindRoleByUserId, {
        manual: true
    })

    const [userEnabledLoadingMap, setUserEnabledLoadingMap] = useState({})

    const [userOperation, setUserOperation] = useState({
        open: false,
        title: null,
        operationType: null,
        userItem: null,
    })

    const [bindRole, setBindRole] = useState({
        open: false,
        title: null,
        userItem: null,
    })


    useEffect(() => {
        const getData = async () => {
            const users = await fetchUserListAsync(queryParam)
            setUserData(users)
        }
        getData()
    }, [queryParam])

    useEffect(() => {
        if (userOperation && userOperation.open === true && userOperation.operationType === 'EDIT') {
            editForm.setFieldsValue(userOperation.userItem)
        }
    }, [userOperation])

    useEffect(() => {
        if (bindRole && bindRole.open === true) {
            bindRoleForm.setFieldsValue(bindRole.userItem)
        }
    }, [bindRole])


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

    const handleAddUser = () => {
        // navigate('/system/user/details?id=1')
        setUserOperation({
            open: true,
            title: '新增用户',
            operationType: 'ADD',
            userItem: null,
        })
    }

    const handleEditUser = (userItem) => {
        setUserOperation({
            open: true,
            title: '编辑用户',
            operationType: 'EDIT',
            userItem: userItem,
        })
    }

    const handleSaveUser = () => {
        editForm.validateFields()
            .then(
                (values) => {
                    if (userOperation.operationType === 'ADD') {
                        createUserAsync(values)
                            .then(
                                (data) => {
                                    handleClose()
                                    handleRefresh()
                                    modal.success({
                                        title: `用户创建成功`,
                                        okText: '知道了',
                                        content: (
                                            <div style={{ userSelect: 'text' }}>
                                                <p>
                                                    用户 <strong>{values.nickname}</strong> 的初始密码为：
                                                </p>
                                                <div className='bg-gray-100 py-2 px-3 rounded-md flex justify-between items-center font-mono'>
                                                    <span>{data.initialPassword}</span>
                                                    <CopyOutlined
                                                        className='cursor-pointer ml-2 p-1 rounded hover:bg-gray-200'
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(data.initialPassword)
                                                            getMessageApi().success('已复制到剪贴板')
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    })
                                }
                            )
                    } else {
                        updateUserAsync(values)
                            .then(
                                () => {
                                    getMessageApi().success('修改成功')
                                    handleClose()
                                    handleRefresh()
                                }
                            )
                    }

                }
            )
    }

    const handleClose = () => {
        setUserOperation({
            open: false,
            title: null,
            operationType: null,
            userItem: null,
        })
        editForm.resetFields()
    }

    const handleUpdateEnabled = async (id, enabled) => {
        setUserEnabledLoadingMap(prev => ({ ...prev, [id]: true }))
        try {
            await updateUserEnabled(id, enabled)
            if (enabled) {
                getMessageApi().success('账号启用成功')
            } else {
                getMessageApi().success('账号停用成功')
            }
            handleRefresh()
        } finally {
            setUserEnabledLoadingMap(prev => ({ ...prev, [id]: false }))
        }

    }

    const handleResetPassword = async (userItem) => {
        const newPassword = await resetPasswordAsync(userItem.id)
        modal.success({
            title: '新密码已生成',
            okText: '知道了',
            content: (
                <div style={{ userSelect: 'text' }}>
                    <p>
                        用户 <strong>{userItem.nickname}</strong> 的新密码为：
                    </p>
                    <div className='bg-gray-100 py-2 px-3 rounded-md flex justify-between items-center font-mono'>
                        <span>{newPassword}</span>
                        <CopyOutlined
                            className='cursor-pointer ml-2 p-1 rounded hover:bg-gray-200'
                            onClick={() => {
                                navigator.clipboard.writeText(newPassword)
                                getMessageApi().success('已复制到剪贴板')
                            }}
                        />
                    </div>
                </div>
            ),
        })
    }

    const handleDelete = async (id) => {
        await deleteUserByIdAsync(id)
        getMessageApi().success('删除成功')
        handleRefresh()

    }

    const handleBindRole = (userItem) => {
        setBindRole({
            open: true,
            title: `分配角色[${userItem.nickname}]`,
            userItem: userItem,
        })
    }

    const handleBindRoleSave = () => {
        bindRoleForm.validateFields()
            .then(values => {
                bindRoleByUserIdAsync(values.id, values.roleIds)
                    .then(
                        () => {
                            getMessageApi().success('分配成功')
                            handleBindRoleClose()
                            handleRefresh()
                        }
                    )
            })
    }

    const handleBindRoleClose = () => {
        setBindRole({
            open: false,
            title: null,
            userItem: null,
        })
    }

    const columns = [
        {
            key: 'nickname',
            title: '用户名称',
            dataIndex: 'nickname',
            align: 'center',
            fixed: 'left',
            width: '140px',
            showSorterTooltip: { target: 'full-header' },
            visible: true,
            sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        },
        {
            key: 'username',
            title: '用户账号',
            dataIndex: 'username',
            align: 'center',
            visible: true,
        },
        {
            key: 'phone',
            title: '用户手机号',
            dataIndex: 'phone',
            align: 'center',
            visible: true,
        },
        {
            key: 'email',
            title: '用户邮箱',
            dataIndex: 'email',
            align: 'center',
            visible: true,
        },
        {
            key: 'enabled',
            title: '状态',
            dataIndex: 'enabled',
            width: '100px',
            align: 'center',
            visible: true,
            render: (_, record) => {
                const { id, enabled } = record
                const handleChange = (checked) => {
                    handleUpdateEnabled(id, checked)
                }
                return enabled ?
                    (
                        <HasPermission
                            hasPermissions='system:user:write'
                            fallback={
                                <Switch
                                    disabled
                                    checkedChildren="启用"
                                    unCheckedChildren="停用"
                                    checked={enabled}
                                />
                            }

                        >
                            <Popconfirm
                                okText='确定'
                                cancelText='取消'
                                title="确定停用？"
                                onConfirm={() => handleChange(false)}
                                style={{ marginInlineEnd: 8 }}
                            >
                                <Switch
                                    loading={!!userEnabledLoadingMap[id]}
                                    checkedChildren="启用"
                                    unCheckedChildren="停用"
                                    checked={enabled}
                                />
                            </Popconfirm>
                        </HasPermission>


                    )
                    :
                    (
                        <HasPermission
                            hasPermissions='system:user:write'
                            fallback={
                                <Switch
                                    disabled
                                    checkedChildren="启用"
                                    unCheckedChildren="停用"
                                    checked={enabled}
                                />
                            }
                        >
                            <Switch
                                loading={!!userEnabledLoadingMap[id]}
                                checkedChildren="启用"
                                unCheckedChildren="停用"
                                checked={enabled}
                                onChange={handleChange}
                            />
                        </HasPermission>
                    )
            }
        },
        {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            visible: true,
        },
        {
            key: 'updateTime',
            title: '修改时间',
            dataIndex: 'updateTime',
            align: 'center',
            visible: true,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            fixed: 'right',
            visible: true,
            render: (_, record) => {
                if (record.code === 'super_admin') {
                    return <></>
                }
                return (
                    <span>
                        <HasPermission
                            hasPermissions='system:user:write'
                        >
                            <Typography.Link onClick={() => handleBindRole(record)} style={{ marginInlineEnd: 8 }}>
                                分配角色
                            </Typography.Link>
                            <Typography.Link onClick={() => handleEditUser(record)} style={{ marginInlineEnd: 8 }}>
                                编辑
                            </Typography.Link>
                            <Typography.Link
                                style={{ marginInlineEnd: 8 }}
                                onClick={() => {
                                    modal.confirm({
                                        title: '确定重置？',
                                        okText: '确定',
                                        cancelText: '取消',
                                        maskClosable: false,
                                        confirmLoading: resetPasswordLoading,
                                        content: (
                                            <>
                                                是否重置 <Highlight>{record.nickname}</Highlight> 的密码？
                                            </>
                                        ),
                                        onOk: async () => {
                                            await handleResetPassword(record)
                                        },
                                    })
                                }}
                            >
                                重置密码
                            </Typography.Link>
                        </HasPermission>
                        <HasPermission
                            hasPermissions='system:user:delete'
                        >
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'delete',
                                            label: (
                                                <Typography.Link
                                                    style={{
                                                        marginInlineEnd: 8,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        width: '100%',
                                                    }}
                                                    onClick={() => {
                                                        modal.confirm({
                                                            title: '确定删除？',
                                                            okText: '确定',
                                                            cancelText: '取消',
                                                            maskClosable: false,
                                                            confirmLoading: deleteUserByIdLoading,
                                                            content: (
                                                                <>
                                                                    是否删除 <Highlight>{record.nickname}</Highlight> 的账号？删除后将无法恢复！
                                                                </>
                                                            ),
                                                            onOk: async () => {
                                                                await handleDelete(record.id)
                                                            },
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
                        </HasPermission>
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
                    onFinish={handleSearch}
                >
                    <Form.Item name="keyword" label="用户信息" style={{ width: 365 }}>
                        <Input placeholder="请输入用户名称、账号、手机号、邮箱" allowClear />
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
                    <Button loading={fetchUserLoading} type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
                </Space>
            </Flex>
            <SmartTable
                className='w-full'
                columns={columns}
                headerExtra={(
                    <Space>
                        <HasPermission hasPermissions='system:user:write'>
                            <Button type="primary" onClick={handleAddUser}>新增</Button>
                        </HasPermission>
                    </Space>
                )}
                dataSource={userData.list}
                scroll={userData?.list?.length > 10 ? { y: 600, x: 'max-content' } : { x: 'max-content' }}
                rowKey={(record) => record.id}
                loading={fetchUserLoading}
                onSearch={handleSearch}
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
            <Modal
                title={userOperation.title}
                width={400}
                centered
                confirmLoading={createUserLoading || updateUserLoading}
                open={userOperation.open}
                onOk={handleSaveUser}
                onCancel={handleClose}
                onClose={handleClose}
                maskClosable={false}
                keyboard={false}
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
                            label="用户姓名"
                            name="nickname"
                            rules={[
                                {
                                    required: true,
                                    message: `用户姓名不能为空`,
                                },
                            ]}
                        >
                            <Input placeholder="请输入用户姓名" />
                        </Form.Item>
                        <Form.Item
                            label="用户账号"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: `角色账号不能为空`,
                                },
                            ]}
                        >
                            <Input placeholder="请输入用户账号" />
                        </Form.Item>
                        <Form.Item
                            label="用户邮箱"
                            name="email"
                        >
                            <Input placeholder="请输入用户邮箱" />
                        </Form.Item>
                        <Form.Item
                            label="用户手机号"
                            name="phone"
                        >
                            <Input placeholder="请输入用户手机号" />
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
                            label="分配角色"
                            name="roleIds"
                        >
                            <RoleSelect />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Drawer
                title={bindRole.title}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={handleBindRoleClose}
                open={bindRole.open}
                width={400}
                footer={
                    <Space>
                        <Button loading={bindRoleByUserIdLoading} type="primary" onClick={handleBindRoleSave}>保存</Button>
                        <Button onClick={handleBindRoleClose}>取消</Button>
                    </Space>
                }
            >
                <Form
                    form={bindRoleForm}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="roleIds"
                    >
                        <RoleSelect type='checkbox' />
                    </Form.Item>
                </Form>
            </Drawer>
            {contextHolder}
        </Flex>
    )
}

export default UserManage