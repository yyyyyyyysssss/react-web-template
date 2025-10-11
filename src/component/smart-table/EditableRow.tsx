import { Form, FormInstance } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { EditableContext } from './EditableContext'

interface EditableRowProps {
    record: any
    rowOnChange?: (rowData: any) => void
    children: React.ReactNode
}

const EditableRow: React.FC<EditableRowProps> = ({
    record = {},
    rowOnChange,
    children,
    ...props
}) => {

    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue(record)
    }, [record,form])

    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={{ form, rowOnChange }}>
                <tr {...props}>{children}</tr>
            </EditableContext.Provider>
        </Form>
    )
}

export default EditableRow