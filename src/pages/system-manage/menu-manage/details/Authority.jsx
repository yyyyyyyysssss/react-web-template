import { Flex, Form, Table, Tag, Popconfirm, Typography, Button } from 'antd'
import AuthorityEditableCell from './AuthorityEditCell'
import { RequestMethod } from '../../../../enums'
import { useEffect, useState } from 'react'
import IdGen from '../../../../utils/IdGen'

const Authority = ({ authorityId, authorityUrls, onChange }) => {

    const [form] = Form.useForm()

    const [authorityData, setAuthorityData] = useState([])

    const [editingKey, setEditingKey] = useState('')

    useEffect(() => {
        setAuthorityData(authorityUrls)
    }, [authorityUrls])

    const isEditing = record => record.id === editingKey

    const edit = record => {
        form.setFieldsValue(Object.assign({ id: '', method: '', url: '' }, { ...record, method: record.method?.toUpperCase() || '', }))
        setEditingKey(record.id)
    }

    const cancel = (record) => {
        if (record.type && record.type === 'ADD') {
            const newData = authorityData.filter(f => f.id !== record.id)
            setAuthorityData(newData)
        }
        form.resetFields()
        setEditingKey('')
    }

    const save = (key) => {
        form.validateFields()
            .then(values => {
                const newData = [...authorityData]
                const index = newData.findIndex(item => key === item.id)
                const item = newData[index]
                const { type, ...restItem } = item
                newData.splice(index, 1, { ...restItem, ...values })
                onChange(newData)
                    .then(() => {
                        form.resetFields()
                        setEditingKey('')
                    }
                    )
            })
            .catch(errorInfo => {
                console.log('校验失败，错误信息:', errorInfo)
            })

    }

    const del = (record) => {
        const newData = authorityData.filter(f => f.id !== record.id)
        //更新权限数据
        onChange(newData)
            .then(() => {
                setEditingKey('')
            })
    }

    const handleAdd = () => {
        if (editingKey !== '') {
            form.validateFields()
            return
        }
        const newData = [...authorityData]
        const id = IdGen.nextId()
        const item = {
            id: id,
            authorityId: authorityId,
            method: '',
            type: 'ADD',
            url: ''
        }
        newData.push(item)
        setAuthorityData(newData)
        setEditingKey(id)
    }

    const columns = [
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
                    case RequestMethod.PATCH:
                        return <Tag color="yellow">PATCH</Tag>
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
                            <Typography.Link onClick={() => cancel(record)} style={{ marginInlineEnd: 8 }}>
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
                            <Popconfirm disabled={editingKey !== ''} okText='确定' cancelText='取消' title="确定删除？" onConfirm={() => del(record)} style={{ marginInlineEnd: 8 }}>
                                <Typography.Link disabled={editingKey !== ''}>
                                    删除
                                </Typography.Link>
                            </Popconfirm>
                        </span>
                    )
            }
        }
    ]

    const mergedColumns = columns.map(col => {
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
        <Form form={form} component={false}>
            <Flex gap={8} vertical>
                <Button onClick={handleAdd} type="primary" className='w-15'>新增</Button>
                <Table
                    className='w-full'
                    components={{
                        body: { cell: AuthorityEditableCell }
                    }}
                    columns={mergedColumns}
                    dataSource={authorityData}
                    rowClassName="editable-row"
                    rowKey={(record) => record.id}
                    pagination={false}
                />
            </Flex>
        </Form>
    )

}

export default Authority