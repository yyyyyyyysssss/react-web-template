import { Flex, Form, Tag } from 'antd'
import { RequestMethod } from '../../../../enums'
import { useEffect } from 'react'
import EditableTable from '../../../../component/smart-table/EditableTable'


const AuthorityUrl = ({ authorityId, authorityUrls, onChange, loading }) => {

    const [form] = Form.useForm()

    useEffect(() => {
        if (authorityUrls) {
            form.setFieldsValue({
                urls: authorityUrls
            })
        }
    }, [authorityUrls])


    const handleSave = async (_, rowIndex) => {
        try {
            const formValues = await form.validateFields()
            const { urls } = formValues
            await onChange(urls)
        } catch (err) {
            console.error(err)
        }

    }

    const handleDelete = async (_, rowIndex) => {
        try {
            const formValues = await form.validateFields()
            const urls = formValues.urls
            urls.splice(rowIndex, 1)
            await onChange(urls)
        } catch (err) {
            console.error(err)
        }

    }

    const columns = [
        {
            key: 'method',
            title: '请求方法',
            dataIndex: 'method',
            align: 'center',
            editable: true,
            inputType: 'select',
            options: Object.entries(RequestMethod).map(([key, value]) => ({
                label: key,
                value: value,
            })),
            required: true,
            render: (_, { method }) => {
                switch (method?.toUpperCase()) {
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
            required: true,
        },
        // {
        //     title: '操作',
        //     dataIndex: 'operation',
        //     align: 'center',
        //     render: (_, record) => {
        //         const editable = isEditing(record)
        //         return editable ?
        //             (
        //                 <HasPermission hasPermissions='system:menu:write'>
        //                     <Flex gap={8} justify='center' align='center'>
        //                         <Typography.Link onClick={() => save(record.id)}>
        //                             保存
        //                         </Typography.Link>
        //                         <Typography.Link onClick={() => cancel(record)}>
        //                             取消
        //                         </Typography.Link>
        //                     </Flex>
        //                 </HasPermission>
        //             )
        //             :
        //             (
        //                 <HasPermission hasPermissions='system:menu:write'>
        //                     <Flex gap={8} justify='center' align='center'>
        //                         <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
        //                             编辑
        //                         </Typography.Link>
        //                         <Popconfirm disabled={editingKey !== ''} okText='确定' cancelText='取消' title="确定删除？" okButtonProps={{ loading: loading }} onConfirm={async () => await del(record)}>
        //                             <Typography.Link disabled={editingKey !== ''}>
        //                                 删除
        //                             </Typography.Link>
        //                         </Popconfirm>
        //                     </Flex>
        //                 </HasPermission>
        //             )
        //     }
        // }
    ]


    return (
        <Form form={form} component={false}>
            <Flex gap={8} vertical>
                <Form.List
                    name="urls"
                    noStyle
                >
                    {(fields, { add, remove }) => (
                        <EditableTable
                            className='menu-authority'
                            columns={columns}
                            name='urls'
                            mode='single-edit'
                            fields={fields}
                            add={add}
                            remove={remove}
                            onSave={handleSave}
                            onDelete={handleDelete}
                        />
                    )}
                </Form.List>
            </Flex>
        </Form>
    )

}

export default AuthorityUrl