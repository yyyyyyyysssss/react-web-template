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
    inputType?: 'input' | 'number' | 'select' | 'date' | 'datetime'
    options?: Array<{ label: string; value: any }>
    required?: boolean
    rules?: Rule[]
    onChange?: (value: any) => void
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
    ...restProps
}) => {

    const mergedRules = [
        ...(required ? [{ required: true, message: `${title}不能为空` }] : []),
        ...(rules || []),
    ]

    const inputNode = useMemo(() => {
        switch (inputType) {
            case 'number':
                return <InputNumber style={{ width: '100%' }} onChange={onChange} />
            case 'date':
                return <DatePicker style={{ width: '100%' }} onChange={onChange} />
            case 'datetime':
                return <DatePicker showTime style={{ width: '100%' }} onChange={onChange} />
            case 'select':
                return <Select style={{ width: '100%' }} options={options} onChange={onChange} />
            case 'input':
            default:
                return <Input style={{ width: '100%' }} onChange={(e) => onChange?.(e.target.value)} />
        }
    }, [inputType, options, onChange])

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