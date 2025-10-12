import { Form, FormInstance } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { EditableContext } from './EditableContext'
import './editable.css'

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
    const raw = (props as any)['data-row-index']
    const rowIndex = Number(raw)

    return (
        <EditableContext.Provider value={{ rowIndex: rowIndex, rowOnChange }}>
            <tr {...props}>{children}</tr>
        </EditableContext.Provider>
    )
}

export default EditableRow