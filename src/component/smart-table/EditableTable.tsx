import { Button, Flex, Form, Popconfirm, Table, Typography } from "antd"
import { useEffect, useMemo, useState } from "react"
import EditableRow from "./EditableRow"
import EditableCell from "./EditableCell"
import React from "react"
import './editable.css'
import IdGen from "../../utils/IdGen"
import { getMessageApi } from "../../utils/MessageUtil"


interface EditableTableProps {
    columns: any[]
    name: string
    rowKey?: string
    fields: any[]
    mode: 'single-edit' | 'multi-add'
    add: (defaultValue?: any, insertIndex?: number) => void
    remove: (index: number) => void
}

const EditableTable: React.FC<EditableTableProps> = ({
    columns,
    name,
    rowKey = 'id',
    fields,
    mode = 'multi-add',
    add,
    remove,
    ...props
}) => {

    const form = Form.useFormInstance()

    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [pendingAdd, setPendingAdd] = useState<any>({
        key: null,
        flag: false
    })

    const tableData = useMemo(() => {
        const listValues = form.getFieldValue(name) || []
        return fields.map((field, index) => {
            const recordValue = listValues[index] || {}
            const keyValue = recordValue[rowKey] || field.key
            return {
                ...recordValue,
                key: keyValue,
                [rowKey]: keyValue,
            }
        })
    }, [fields, form, name, rowKey])

    const isEditing = (rowData: any) => {

        return mode === 'multi-add' ? true : rowData[rowKey] === editingKey
    }

    useEffect(() => {
        if (pendingAdd.flag && editingKey && pendingAdd.key) {
            const newRowData = { [rowKey]: pendingAdd.key }
            addRow(newRowData)
            setPendingAdd({
                key: null,
                flag: false
            })
        }
    }, [editingKey, pendingAdd, add])

    const handleAddd = async () => {
        const newKey = IdGen.nextId()
        if (mode === 'single-edit') {
            if (editingKey !== null) {
                getMessageApi().warning('请先保存或取消当前正在编辑的行')
                return
            }
            setEditingKey(newKey)
            setPendingAdd({
                key: newKey,
                flag: true
            })
        } else {
            const newRowData = { [rowKey]: newKey }
            addRow(newRowData)
        }
    }

    const addRow = (rowData: any) => {
        const newRowData = { ...rowData, type: 'add' }
        add(newRowData)
    }

    const handleSave = (rowData: any, rowIndex: number) => {
        rowValidate(rowIndex)
            .then(() => {
                setEditingKey(null)
            })
    }

    const handleCancle = (rowData: any, rowIndex: number) => {
        setEditingKey(null)
        form.setFieldsValue({
            [name]: form.getFieldValue(name).map((row: any, index: number) =>
                index === rowIndex ? { ...row, ...rowData } : row
            ),
        })
    }

    const handleEdit = (rowData: any, rowIndex: number) => {
        setEditingKey(rowData[rowKey])
        form.setFieldsValue({
            [name]: form.getFieldValue(name).map((row: any, index: number) =>
                index === rowIndex ? { ...row, ...rowData } : row
            ),
        })
    }

    const handledelete = (rowData: any, rowIndex: number) => {
        remove(rowIndex)
        setEditingKey(null)
    }

    const rowValidate = (rowIndex: number) => {
        const fields = columns
            .filter(col => col.dataIndex)
            .map(col => [name, rowIndex, col.dataIndex])
        return form.validateFields(fields);
    }

    const mergedColumns = useMemo(() => {

        return [
            ...columns.map((col) => ({
                ...col,
                onCell: (record: any, rowIndex: number) => {
                    const rowData = form.getFieldValue([name, rowIndex])
                    return {
                        rowData: rowData,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        inputType: col.inputType,
                        options: col.options,
                        required: col.required,
                        rules: col.rules,
                        customRender: col.customRender,
                        editing: isEditing(rowData) && col.editable !== false,
                        rowKeyValue: record[rowKey],
                        rowIndex
                    }
                },
            })),
            {
                title: '操作',
                dataIndex: 'operation',
                width: 100,
                align: 'center',
                render: (_: any, record: any, rowIndex: number) => {
                    const rowData = form.getFieldValue([name, rowIndex])
                    if (mode === 'multi-add') {
                        return (
                            <Flex gap={8} justify='center' align='center'>
                                <Typography.Link
                                    onClick={() => {
                                        const copyRow = { ...rowData, [rowKey]: IdGen.nextId() }
                                        add(copyRow)
                                    }}
                                >
                                    复制
                                </Typography.Link>
                                <Popconfirm title="确定删除?" onConfirm={() => handledelete(rowData, rowIndex)}>
                                    <Typography.Link>删除</Typography.Link>
                                </Popconfirm>
                            </Flex>
                        )
                    } else {
                        const editable = isEditing(rowData)
                        return editable ?
                            (
                                <Flex gap={8} justify='center' align='center'>
                                    <Typography.Link onClick={() => handleSave(rowData, rowIndex)}>
                                        保存
                                    </Typography.Link>
                                    {
                                        rowData.type && rowData.type === 'add'
                                            ?
                                            (
                                                <Popconfirm okText='确定' cancelText='取消' title="确定删除？" onConfirm={() => handledelete(rowData, rowIndex)}>
                                                    <Typography.Link>
                                                        删除
                                                    </Typography.Link>
                                                </Popconfirm>
                                            )
                                            :
                                            (
                                                <Typography.Link onClick={() => handleCancle(rowData, rowIndex)}>
                                                    取消
                                                </Typography.Link>
                                            )
                                    }

                                </Flex >
                            )
                            :
                            (
                                <Flex gap={8} justify='center' align='center'>
                                    <Typography.Link disabled={editingKey !== null} onClick={() => handleEdit(rowData, rowIndex)}>
                                        编辑
                                    </Typography.Link>
                                    <Popconfirm disabled={editingKey !== null} okText='确定' cancelText='取消' title="确定删除？" onConfirm={() => handledelete(rowData, rowIndex)}>
                                        <Typography.Link disabled={editingKey !== null}>
                                            删除
                                        </Typography.Link>
                                    </Popconfirm>
                                </Flex>
                            )
                    }

                },
            },
        ]
    }, [columns, form, name, add, remove, rowKey, editingKey])

    return (
        <Flex gap={8} vertical>
            <Button onClick={handleAddd} type="primary" className='w-20'>新增一行</Button>
            <Table
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                dataSource={tableData}
                columns={mergedColumns}
                rowKey={rowKey}
                pagination={false}
                {...props}
            />
        </Flex>
    )
}

export default EditableTable