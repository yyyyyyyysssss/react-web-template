import React, { useState } from 'react'
import './index.css'
import { Button, Flex, Form, Input, Popconfirm, Select, Space, Tag, Typography } from 'antd'
import SmartTable from '../../../components/smart-table'
import { deleteTenantById, fetchTenantList, updateTenantStatus } from '../../../services/SystemService'
import HasPermission from '../../../components/HasPermission'
import { useRequest } from 'ahooks'
import Highlight from '../../../components/Highlight'
import ActionDropdown from '../../../components/ActionDropdown'
import { getMessageApi } from '../../../utils/MessageUtil'

const initQueryParam = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}

const TenantManage = () => {

  const [searchForm] = Form.useForm()

  const [queryParam, setQueryParam] = useState(initQueryParam)

  const { runAsync: deleteTenantByIdAsync, loading: deleteTenantLoading } = useRequest(fetchTenantList, {
    manual: true
  })

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

  const handleAddTenant = () => {

  }

  const handleEditTenant = (tenantData) => {

  }

  const handleBindUser = (tenantData) => {

  }

  const handleUpdateStatus = async (tenantId, status) => {
    const data = await updateTenantStatus(tenantId, status)
    if (data === true) {
      getMessageApi().success('操作成功')
      handleReset()
    }
  }

  const handleDelete = async (tenantId) => {
    const data = await deleteTenantById(tenantId)
    if (data === true) {
      getMessageApi().success('删除成功')
      handleReset()
    }
  }

  const columns = [
    {
      key: 'tenantCode',
      title: '租户编码',
      dataIndex: 'tenantCode',
      fixed: 'left',
      align: 'center',
      visible: true
    },
    {
      key: 'tenantName',
      title: '租户名称',
      dataIndex: 'tenantName',
      align: 'center',
      visible: true,
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      visible: true,
      render: (value) => {
        switch (value) {
          case 'PENDING':
            return <Tag color='default'>待启用</Tag>
          case 'ACTIVE':
            return <Tag color='success'>使用中</Tag>
          case 'DISABLED':
            return <Tag color='error'>已停用</Tag>
          case 'EXPIRED':
            return <Tag color='warning'>已过期</Tag>
          default:
            return <Typography.Text>-</Typography.Text>
        }
      }
    },
    {
      key: 'contactName',
      title: '联系人',
      dataIndex: 'contactName',
      align: 'center',
      visible: true,
    },
    {
      key: 'contactPhone',
      title: '联系人手机号',
      dataIndex: 'contactPhone',
      align: 'center',
      visible: true,
    },
    {
      key: 'contactEmail',
      title: '联系人邮箱',
      dataIndex: 'contactEmail',
      align: 'center',
      visible: true,
    },
    {
      key: 'expireTime',
      title: '过期时间',
      dataIndex: 'expireTime',
      align: 'center',
      visible: true,
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
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      visible: true,
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
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
        return (
          <Space>
            <HasPermission
              hasPermissions='system:tenant:write'
            >
              <Typography.Link onClick={() => handleBindUser(record)} style={{ marginInlineEnd: 8 }}>
                分配用户
              </Typography.Link>
              <Typography.Link onClick={() => handleEditTenant(record)} style={{ marginInlineEnd: 8 }}>
                编辑
              </Typography.Link>
              {
                record.status === 'DISABLED' || record.status === 'PENDING' ? (
                  <Typography.Link onClick={() => handleUpdateStatus(record.id, 'ACTIVE')} style={{ marginInlineEnd: 8 }}>
                    启用
                  </Typography.Link>
                ) : record.status === 'ACTIVE' ? (
                  <Popconfirm title="确定停用?" onConfirm={() => handleUpdateStatus(record.id, 'DISABLED')}>
                    <Typography.Link style={{ marginInlineEnd: 8 }}>
                      停用
                    </Typography.Link>
                  </Popconfirm>

                ) : null
              }
            </HasPermission>
            <HasPermission
              hasPermissions='system:tenant:delete'
            >
              <ActionDropdown
                items={[
                  {
                    key: 'delete',
                    label: '删除',
                    danger: true,
                    confirm: {
                      title: '确定删除？',
                      content: (
                        <>
                          是否删除 <Highlight>{record.tenantName}</Highlight> 租户？删除后将无法恢复！
                        </>
                      ),
                      onOk: () => {
                        handleDelete(record.id)
                      },
                      confirmLoading: deleteTenantLoading,
                    }
                  }
                ]}
              />
            </HasPermission>
          </Space>
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
          <Form.Item name="keyword" label="租户信息" style={{ width: 365 }}>
            <Input placeholder="请输入租户或联系人信息" allowClear />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              placeholder="请选择状态"
              style={{ width: 120 }}
              allowClear
              options={[
                {
                  label: '待启用',
                  value: 'PENDING'
                },
                {
                  label: '使用中',
                  value: 'ACTIVE'
                },
                {
                  label: '已停用',
                  value: 'DISABLED'
                },
                {
                  label: '已过期',
                  value: 'EXPIRED'
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
      <SmartTable
        className='w-full'
        columns={columns}
        headerExtra={(
          <Space>
            <HasPermission hasPermissions='system:tenant:write'>
              <Button type="primary" onClick={handleAddTenant}>新增</Button>
            </HasPermission>
          </Space>
        )}
        fetchData={fetchTenantList}
        queryParam={queryParam}
        setQueryParam={setQueryParam}
      />
    </Flex>
  )
}

export default TenantManage