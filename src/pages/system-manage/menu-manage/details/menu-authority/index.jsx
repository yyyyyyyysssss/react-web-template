import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, InputNumber, Modal, Radio, Select, Space, Table, Typography, Upload } from 'antd';
import './index.css'
import IdGen from '../../../../../utils/IdGen';
import { AuthorityType, RequestMethod } from '../../../../../enums';
import { UploadOutlined } from '@ant-design/icons';
import { addAuthority, createMenu, updateAuthority, updateMenu } from '../../../../../services/SystemService';

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
    };


const EditableContext = React.createContext(null);
const EditableRow = ({ index, record, ...props }) => {

    const [form] = Form.useForm()

    useEffect(() => {
        const key = props['data-row-key']
        if (key) {
            formMapRef.current.set(key, form)
        }
        return () => {
            if (key) formMapRef.current.delete(key)
        }
    }, [])

    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                method: record.method?.toUpperCase() || '',
                url: record.url || '',
            })
        }
    }, [record])

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

const EditableCell = _a => {
    var { title, editable, children, dataIndex, record, handleSave } = _a,
        restProps = __rest(_a, ['title', 'editable', 'children', 'dataIndex', 'record', 'handleSave'])

    let childNode = children;

    const methodOptions = Object.entries(RequestMethod).map(([key, value]) => ({
        label: key,
        value: value,
    }))

    if (editable) {
        childNode = (
            <Form.Item
                name={dataIndex}
                style={{ margin: 0 }}
                rules={[
                    {
                        required: true,
                        message: `${title} 不能为空`,
                    },
                ]}
            >
                {
                    dataIndex === 'method' ?
                        (
                            <Select
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
    }
    return <td {...restProps}>{childNode}</td>;
};

const initDataSource = [
    {
        key: IdGen.nextId(),
        method: '',
        url: '',
    }
]

const formMapRef = React.createRef()
formMapRef.current = new Map()

const MenuAuthority = ({ open, title, type, operation, data, parentId, parentCode, onClose, onSuccess, }) => {

    const [dataSource, setDataSource] = useState(initDataSource)

    const [form] = Form.useForm()

    useEffect(() => {
        if (data && data.urls && data.urls.length > 0) {
            const processed = data.urls.map((item) => ({
                ...item,
                key: item.id || IdGen.nextId(),
            }));
            setDataSource(processed)
        }
        if (data) {
            form.setFieldsValue(data)
        }
    }, [data])

    const handleDelete = key => {
        const newData = dataSource.filter(item => item.key !== key)
        setDataSource(newData)
        formMapRef.current.delete(key)
    };
    const defaultColumns = [
        {
            key: 'method',
            title: '请求方法',
            dataIndex: 'method',
            align: 'center',
            width: '32%',
            editable: true,
        },
        {
            key: 'url',
            title: '请求路径',
            dataIndex: 'url',
            align: 'center',
            width: '45%',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Typography.Link onClick={() => handleDelete(record.key)}>
                        删除
                    </Typography.Link>
                ) : null,
        },
    ];
    const handleAdd = () => {
        const updatedDataSource = [...dataSource]
        for (const [key, form] of formMapRef.current.entries()) {
            const index = dataSource.findIndex(item => item.key === key)
            if (index !== -1) {
                const values = form.getFieldsValue()
                updatedDataSource[index] = {
                    ...updatedDataSource[index],
                    ...values,
                }
            } else {
                updatedDataSource.push(values)
            }
        }
        const newData = {
            key: IdGen.nextId(),
            method: '',
            url: '',
        };
        setDataSource([...updatedDataSource, newData]);
    };

    const handleSave = row => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, Object.assign(Object.assign({}, item), row));
        setDataSource(newData);
    };
    const components = {
        body: {
            row: (props) => {
                const { 'data-row-key': key } = props
                const record = dataSource.find(item => item.key === key)
                return <EditableRow key={record?.key} {...props} record={record} />
            },
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return Object.assign(Object.assign({}, col), {
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        });
    });

    const handleSaveMenuAuthority = async () => {
        try {
            const formValues = await form.validateFields()
            const valuesList = []
            for (const [key, form] of formMapRef.current.entries()) {
                const values = await form.validateFields()
                valuesList.push({ ...values, id: key })
            }
            const requestParam = {
                ...formValues,
                code: operation === 'ADD' ? `${parentCode}:${formValues.code}` : formValues.code,
                parentId: parentId,
                urls: valuesList
            }
            if (operation === 'ADD') {
                if (type === AuthorityType.BUTTON) {
                    addAuthority(requestParam)
                        .then(
                            (data) => {
                                const newData = { ...requestParam, id: data, type: AuthorityType.BUTTON }
                                onSuccess(newData, operation)
                                reset()
                            })
                } else if (type === AuthorityType.MENU) {
                    createMenu(requestParam)
                        .then(
                            (data) => {
                                const newData = { ...requestParam, id: data, type: AuthorityType.MENU }
                                onSuccess(newData, operation)
                                reset()
                            }
                        )
                }

            } else {
                if (type === AuthorityType.BUTTON) {
                    updateAuthority(requestParam)
                        .then(() => {
                            const newData = { ...requestParam }
                            onSuccess(newData, operation)
                            reset()
                        })
                } else {
                    updateMenu(requestParam)
                        .then(() => {
                            const newData = { ...requestParam }
                            onSuccess(newData, operation)
                            reset()
                        })
                }
            }

        } catch (err) {
            console.warn(`行 ${key} 校验失败`, err)
        }

    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const reset = () => {
        form.resetFields()
        setDataSource(initDataSource)
    }

    return (
        <Modal
            title={title}
            width={type === AuthorityType.MENU ? 400 : 450}
            centered
            open={open}
            onOk={handleSaveMenuAuthority}
            onCancel={handleClose}
            onClose={handleClose}
            okText="保存"
            cancelText="取消"
            destroyOnClose
        >
            <Flex
                style={{ marginTop: '20px', height: type === AuthorityType.MENU ? 300 : 530 }}
                gap={10}
                vertical
            >
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={type === AuthorityType.MENU ? "菜单名称:" : "权限名称"}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: `名称不能为空`,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={type === AuthorityType.MENU ? "菜单编码:" : "权限编码"}
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: `编码不能为空`,
                            },
                        ]}
                    >
                        <Input addonBefore={operation === 'ADD' && parentCode ? `${parentCode}:` : ''} />
                    </Form.Item>
                    {type && type === AuthorityType.MENU && (
                        <>
                            <Form.Item
                                label="路由:"
                                name="routePath"
                                rules={[
                                    {
                                        required: true,
                                        message: `菜单路由不能为空`,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="图标:"
                                name="icon"
                            >
                                <Upload
                                    fileList={null}
                                    accept=".svg,.png,.jpg,.jpeg"
                                    maxCount={1}
                                    beforeUpload={null}
                                    customRequest={null}
                                >
                                    <Button icon={<UploadOutlined />}>点击上传</Button>
                                </Upload>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item
                        label="排序:"
                        name="sort"
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>

                {type && type === AuthorityType.BUTTON && (
                    <>
                        <Button className='w-20' onClick={handleAdd} type="primary">
                            新增一行
                        </Button>
                        <Table
                            className='menu-authority'
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered
                            scroll={{
                                y: 200
                            }}
                            rowKey="key"
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                        />
                    </>
                )}
            </Flex>
        </Modal>
    );
}

export default MenuAuthority