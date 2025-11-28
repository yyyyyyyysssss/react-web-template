import React, { useEffect } from 'react';
import { Button, Flex, Form, Input, InputNumber, Modal, Upload } from 'antd';
import './index.css'
import { AuthorityType, RequestMethod } from '../../../../../enums';
import { UploadOutlined } from '@ant-design/icons';
import { addAuthority, createMenu, updateAuthority, updateMenu } from '../../../../../services/SystemService';
import { useRequest } from 'ahooks';
import EditableTable from '../../../../../components/smart-table/EditableTable';
import { getMessageApi } from '../../../../../utils/MessageUtil';
import { useTranslation } from 'react-i18next';


const MenuAuthority = ({ open, title, type, operation, data, parentId, parentCode, onClose, onSuccess, }) => {

    const { t } = useTranslation()

    const [form] = Form.useForm()

    const { runAsync: createMenuAsync, loading: createMenuLoading } = useRequest(createMenu, {
        manual: true
    })

    const { runAsync: updateMenuAsync, loading: updateMenuLoading } = useRequest(updateMenu, {
        manual: true
    })

    const { runAsync: addAuthorityAsync, loading: addAuthorityLoading } = useRequest(addAuthority, {
        manual: true
    })

    const { runAsync: updateAuthorityAsync, loading: updateAuthorityLoading } = useRequest(updateAuthority, {
        manual: true
    })

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data)
        }
    }, [data])

    const columns = [
        {
            key: 'method',
            title: '请求方法',
            dataIndex: 'method',
            align: 'center',
            width: '32%',
            editable: true,
            inputType: 'select',
            options: Object.entries(RequestMethod).map(([key, value]) => ({
                label: key,
                value: value,
            })),
            required: true,
        },
        {
            key: 'url',
            title: '请求路径',
            dataIndex: 'url',
            align: 'center',
            width: '45%',
            editable: true,
            required: true,
        }
    ]

    const handleSaveMenuAuthority = async () => {
        try {

            const formValues = await form.validateFields()

            const requestParam = {
                ...formValues,
                code: operation === 'ADD' ? `${parentCode}:${formValues.code}` : formValues.code,
                parentId: parentId
            }
            if (operation === 'ADD') {
                if (type === AuthorityType.BUTTON) {
                    addAuthorityAsync(requestParam)
                        .then(
                            (data) => {
                                getMessageApi().success(t('新增成功'))
                                const newData = { ...requestParam, id: data, type: AuthorityType.BUTTON }
                                onSuccess(newData, operation)
                                reset()
                            })
                } else if (type === AuthorityType.MENU) {
                    createMenuAsync(requestParam)
                        .then(
                            (data) => {
                                getMessageApi().success(t('新增成功'))
                                const newData = { ...requestParam, id: data, type: AuthorityType.MENU }
                                onSuccess(newData, operation)
                                reset()
                            }
                        )
                }

            } else {
                if (type === AuthorityType.BUTTON) {
                    updateAuthorityAsync(requestParam)
                        .then(() => {
                            getMessageApi().success(t('修改成功'))
                            const newData = { ...requestParam }
                            onSuccess(newData, operation)
                            reset()
                        })
                } else {
                    updateMenuAsync(requestParam)
                        .then(() => {
                            getMessageApi().success(t('修改成功'))
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
    }

    return (
        <Modal
            title={t(title)}
            width={type === AuthorityType.MENU ? 400 : 500}
            centered
            open={open}
            confirmLoading={createMenuLoading || updateMenuLoading || addAuthorityLoading || updateAuthorityLoading}
            onOk={handleSaveMenuAuthority}
            onCancel={handleClose}
            onClose={handleClose}
            maskClosable={false}
            keyboard={false}
            okText={t('保存')}
            cancelText={t('取消')}
            destroyOnHidden
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
                                    <Button icon={<UploadOutlined />}>{t('点击上传')}</Button>
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
                    {type && type === AuthorityType.BUTTON && (
                        <Form.List
                            name="urls"
                            noStyle
                        >
                            {(fields, { add, remove }) => (
                                <EditableTable
                                    className='menu-authority'
                                    columns={columns}
                                    name='urls'
                                    mode='multi-add'
                                    fields={fields}
                                    add={add}
                                    remove={remove}
                                    scroll={{
                                        y: 200
                                    }}
                                />
                            )}
                        </Form.List>
                    )}
                </Form>
            </Flex>
        </Modal>
    );
}

export default MenuAuthority