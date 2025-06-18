import { Flex, Form, Table, Tag, Popconfirm, Typography, Button, Input, Select, Spin } from 'antd'
import { RequestMethod } from '../../../../enums'
import { useEffect, useState } from 'react'
import IdGen from '../../../../utils/IdGen'
import HasPermission from '../../../../component/HasPermission'


var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

const AuthorityEditableCell = _a => {
    var { editing, dataIndex, title, record, index, children } = _a,
        restProps = __rest(_a, [
            'editing',
            'dataIndex',
            'title',
            'record',
            'index',
            'children',
        ])

    const methodOptions = Object.entries(RequestMethod).map(([key, value]) => ({
        label: key,
        value: value,
    }))

    const handleChange = (value) => {

    }

    return (
        <td {...restProps}>
            {editing ?
                (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `${title}不能为空`,
                            },
                        ]}
                    >
                        {
                            dataIndex === 'method' ?
                                (
                                    <Select
                                        style={{ width: 100 }}
                                        onChange={handleChange}
                                        options={methodOptions}
                                    />
                                )
                                :
                                (
                                    <Input />
                                )
                        }

                    </Form.Item>
                )
                :
                (children)
            }
        </td>
    )
}

const AuthorityUrl = ({ authorityId, authorityUrls, onChange, loading }) => {

    const [form] = Form.useForm()

    const [authorityData, setAuthorityData] = useState([])

    const [editingKey, setEditingKey] = useState('')

    useEffect(() => {
        setAuthorityData(authorityUrls)
        if (authorityId === '') {
            if (authorityUrls && authorityUrls.length > 0) {
                cancel(authorityUrls[authorityUrls.length - 1])
            }
        }
    }, [authorityUrls, authorityId])

    const isEditing = record => record.id === editingKey

    const edit = record => {
        form.setFieldsValue(Object.assign({ id: '', method: '', url: '' }, { ...record, method: record.method?.toUpperCase() || '', }))
        setEditingKey(record.id)
    }

    const resetEdit = () => {
        form.resetFields()
        setEditingKey('')
    }

    const cancel = (record) => {
        if (record && record.type && record.type === 'ADD') {
            const newData = authorityData.filter(f => f.id !== record.id)
            setAuthorityData(newData)
        }
        resetEdit()
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
                        resetEdit()
                    }
                    )
            })
            .catch(errorInfo => {
                console.log('校验失败，错误信息:', errorInfo)
            })

    }

    const del = async (record) => {
        const newData = authorityData.filter(f => f.id !== record.id)
        //更新权限数据
        await onChange(newData)
        resetEdit()
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
                        <HasPermission hasPermissions='system:menu:write'>
                            <Flex gap={8} justify='center' align='center'>
                                <Typography.Link onClick={() => save(record.id)}>
                                    保存
                                </Typography.Link>
                                <Typography.Link onClick={() => cancel(record)}>
                                    取消
                                </Typography.Link>
                            </Flex>
                        </HasPermission>
                    )
                    :
                    (
                        <HasPermission hasPermissions='system:menu:write'>
                            <Flex gap={8} justify='center' align='center'>
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    编辑
                                </Typography.Link>
                                <Popconfirm disabled={editingKey !== ''} okText='确定' cancelText='取消' title="确定删除？" okButtonProps={{ loading: loading }} onConfirm={async () => await del(record)}>
                                    <Typography.Link disabled={editingKey !== ''}>
                                        删除
                                    </Typography.Link>
                                </Popconfirm>
                            </Flex>
                        </HasPermission>
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
                <HasPermission hasPermissions='system:menu:write'>
                    <Button onClick={handleAdd} type="primary" className='w-15'>新增</Button>
                </HasPermission>
                <Table
                    loading={loading}
                    className='w-full'
                    components={{
                        body: { cell: AuthorityEditableCell }
                    }}
                    scroll={authorityData?.length > 10 ? { y: 'calc(100vh - 200px)', x: 'max-content' } : { x: 'max-content' }}
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

export default AuthorityUrl