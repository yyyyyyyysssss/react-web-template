import type { Rule } from 'antd/es/form';
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import React, { useMemo } from 'react';

interface EditableCellProps {
    editing: boolean
    dataIndex: string
    title: string
    record: any
    index: number
    children: React.ReactNode
    inputType?: 'input' | 'number' | 'select' | 'date' | 'datetime' | 'custom'
    options?: Array<{ label: string; value: any }>
    required?: boolean
    rules?: Rule[]
    onChange?: (value: any) => void
    rowOnChange?: (value: any, record: any, dataIndex: string) => void
    customRender?: React.ReactNode | ((record: any) => React.ReactNode)
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    inputType = 'input',
    options = [],
    required = false,
    rules,
    onChange,
    rowOnChange,
    customRender,
    ...restProps
}) => {

    const mergedRules = [
        ...(required ? [{ required: true, message: `${title}不能为空` }] : []),
        ...(rules || []),
    ]

    const handleChange = (val: any) => {
        onChange?.(val)
        rowOnChange?.(val, record, dataIndex)
    }

    const inputNode = useMemo(() => {
        switch (inputType) {
            case 'custom':
                return typeof customRender === 'function' ? customRender(record) : customRender
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
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={mergedRules}
                    >
                        {inputNode}
                    </Form.Item>
                )
                :
                (children)
            }
        </td>
    )
}

export default EditableCell