import { Form, FormInstance } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { EditableContext } from './EditableContext'

interface EditableRowProps {
    record: any
    rowOnChange?: (value: any, record: any, dataIndex: string) => void
    children: React.ReactNode
}

const EditableRow: React.FC<EditableRowProps> = ({
    record,
    rowOnChange,
    children,
    ...props
}) => {

    const [form] = Form.useForm()

    useEffect(() => {
        if (record) {
            form.setFieldsValue({ ...record })
        }
    }, [record])

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props}>
                    {React.Children.map(children, (child) =>
                        React.isValidElement(child)
                            ? React.cloneElement(child, { rowOnChange, record })
                            : child
                    )}
                </tr>
            </EditableContext.Provider>
        </Form>
    )
}

export default EditableRow