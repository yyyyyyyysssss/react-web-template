import type { Rule } from 'antd/es/form';
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import React, { useContext, useMemo } from 'react';
import { EditableContext } from './EditableContext';
import { NamePath } from 'antd/es/form/interface';
import './editable.css'

interface EditableCellProps {
    editing: boolean
    dataIndex: string
    title: string
    rowData: any
    index: number
    children: React.ReactNode
    inputType?: 'input' | 'number' | 'select' | 'date' | 'datetime' | 'custom'
    options?: Array<{ label: string; value: any }>
    required?: boolean
    rules?: Rule[]
    onChange?: (value: any) => void
    customRender?: React.ReactNode | ((record: any) => React.ReactNode)
    rowKeyValue?: string | number
    rowIndex: number
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    rowData,
    index,
    children,
    inputType = 'input',
    options = [],
    required = false,
    rules,
    onChange,
    customRender,
    rowKeyValue,
    rowIndex,
    ...restProps
}) => {

    const { rowOnChange } = useContext(EditableContext) || {}

    const mergedRules = [
        ...(required ? [{ required: true, message: `${title}不能为空` }] : []),
        ...(rules || []),
    ]

    const handleChange = (val: any) => {
        onChange?.(val)
        rowData[dataIndex] = val
        rowOnChange?.(rowData)
    }

    const inputNode = useMemo(() => {
        switch (inputType) {
            case 'custom':
                return typeof customRender === 'function' ? customRender(rowData) : customRender
            case 'number':
                return <InputNumber style={{ width: '100%' }} onChange={handleChange} />
            case 'date':
                return <DatePicker style={{ width: '100%' }} onChange={handleChange} />
            case 'datetime':
                return <DatePicker showTime style={{ width: '100%' }} onChange={handleChange} />
            case 'select':
                return <Select style={{ width: '100%' }} options={options} onChange={handleChange} />
            case 'input':
            default:
                return <Input style={{ width: '100%' }} onChange={(e) => handleChange(e.target.value)} />
        }
    }, [inputType, options, customRender])

    return (
        <td {...restProps}>
            {editing
                ?
                (
                    <Form.Item
                        className="editable-cell-form-item"
                        name={[rowIndex, dataIndex] as NamePath}
                        style={{ margin: 0 }}
                        rules={mergedRules}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                    >
                        {inputNode}
                    </Form.Item>
                )
                :
                (rowData?.[dataIndex] !== undefined ? rowData[dataIndex].toString() : children)
            }
        </td>
    )
}

export default EditableCell