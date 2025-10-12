import { Button, Flex, Form, FormInstance, Popconfirm, Table } from "antd"
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import EditableRow from "./EditableRow"
import EditableCell from "./EditableCell"
import IdGen from "../../utils/IdGen"
import React from "react"
import './editable.css'


interface EditableTableProps {
    columns: any[]
    value: any[]                // 受控数据源
    onChange?: (data: any[]) => void
    rowKey?: string
}

export interface EditableTableRef {
    validateAllRows: () => Promise<any>
}

const EditableTable: React.FC<EditableTableProps> = ({
    columns,
    value = [],
    onChange,
    rowKey = 'id',
    ...props
}) => {

    const handleAdd = () => {
        const newRow = { [rowKey]: IdGen.nextId() } // 简单生成唯一 key
        const newData = [...value, newRow]
        console.log('handleAdd',newData)
        onChange?.(newData)
    }

    const handleDelete = (key: any) => {
        const newData = value.filter((item) => item[rowKey] !== key)
        console.log('handleDelete',newData)
        onChange?.(newData)
    }

    const mergedColumns = useMemo(() => {
        return [
            ...columns.map((col) => ({
                ...col,
                onCell: (record: any) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    inputType: col.inputType,
                    options: col.options,
                    required: col.required,
                    rules: col.rules,
                    customRender: col.customRender,
                    editing: col.editable,
                    rowKeyValue: record[rowKey]
                }),
            })),
            {
                title: '操作',
                dataIndex: 'operation',
                width: 100,
                align: 'center',
                render: (_: any, record: any) => {
                    return (
                        <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record?.[rowKey])}>
                            <a>删除</a>
                        </Popconfirm>
                    )
                },
            },
        ]
    }, [columns, value])

    return (
        <Flex gap={8} vertical>
            <Button onClick={handleAdd} type="primary" className='w-20'>新增一行</Button>
            <Table
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                dataSource={value}
                columns={mergedColumns}
                rowKey={rowKey}
                pagination={false}
                onRow={(_, index) => {
                    return {
                        'data-row-index': index ?? -1,
                    } as  React.HTMLAttributes<HTMLTableRowElement>
                }}
                {...props}
            />
        </Flex>
    )
}

export default EditableTable