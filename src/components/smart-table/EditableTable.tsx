import { Button, Flex, Form, Popconfirm, Table, Typography } from "antd"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import EditableRow from "./EditableRow"
import EditableCell from "./EditableCell"
import React from "react"
import './editable.css'
import IdGen from "../../utils/IdGen"
import { getMessageApi } from "../../utils/MessageUtil"
import HasPermission from '../../component/HasPermission';


interface EditableTableProps {
    columns: any[]
    name: string
    rowKey?: string
    fields: any[]
    mode: 'single-edit' | 'multi-add'
    editPermission?: string | string[]
    deletePermission?: string | string[]
    add: (defaultValue?: any, insertIndex?: number) => void
    remove: (index: number) => void
    onSave?: (rowData: any, rowIndex: number) => Promise<any>
    onDelete?: (rowData: any, rowIndex: number) => Promise<any>
}

const EditableTable: React.FC<EditableTableProps> = ({
    columns,
    name,
    rowKey = 'id',
    fields,
    mode = 'multi-add',
    editPermission,
    deletePermission,
    add,
    remove,
    onSave,
    onDelete,
    ...props
}) => {

    const form = Form.useFormInstance()

    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [pendingAdd, setPendingAdd] = useState<any>({
        key: null,
        flag: false
    })

    const editRowDataRef = useRef<any>(null)

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

    const isEditing = useCallback((rowData: any) => {

        return mode === 'multi-add' ? true : rowData[rowKey] === editingKey
    }, [mode, rowKey, editingKey])

    const addRow = useCallback((rowData: any) => {
        const newRowData = { ...rowData, type: 'add' }
        add(newRowData)
    }, [add])

    useEffect(() => {
        if (pendingAdd.flag && editingKey && pendingAdd.key) {
            const newRowData = { [rowKey]: pendingAdd.key }
            addRow(newRowData)
            setPendingAdd({
                key: null,
                flag: false
            })
        }
    }, [editingKey, pendingAdd, addRow])

    const handleAdd = useCallback(async () => {
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
    }, [mode, editingKey, addRow, rowKey])


    const handleSave = useCallback(async (rowData: any, rowIndex: number) => {
        await rowValidate(rowIndex)
        await onSave?.(rowData, rowIndex)
        setEditingKey(null)
        editRowDataRef.current = null
    }, [onSave])

    const handleEdit = useCallback((rowData: any, rowIndex: number) => {
        editRowDataRef.current = rowData
        setEditingKey(rowData[rowKey])
        form.setFieldsValue({
            [name]: form.getFieldValue(name).map((row: any, index: number) =>
                index === rowIndex ? { ...row, ...rowData, type: 'edit' } : row
            ),
        })
    }, [form, name, rowKey])

    const handleCancel = useCallback((rowData: any, rowIndex: number) => {
        setEditingKey(null)
        if (rowData.type && rowData.type === 'add') {
            remove(rowIndex)
        } else {
            const oldRowData = editRowDataRef.current || {}
            form.setFieldsValue({
                [name]: form.getFieldValue(name).map((row: any, index: number) =>
                    index === rowIndex ? { ...row, ...oldRowData } : row
                ),
            })
        }
        editRowDataRef.current = null
    }, [form, name, rowKey, remove])


    const handleDelete = useCallback(async (rowData: any, rowIndex: number) => {
        await onDelete?.(rowData, rowIndex)
        remove(rowIndex)
        setEditingKey(null)
    }, [onDelete, remove])

    const rowValidate = useCallback((rowIndex: number) => {
        const fields = columns
            .filter(col => col.dataIndex)
            .map(col => [name, rowIndex, col.dataIndex])
        return form.validateFields(fields);
    }, [columns, form, name])

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
                        editRender: col.editRender,
                        editing: isEditing(rowData) && col.editable && col.editable !== false,
                        onChange: col.onChange,
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
                                <Popconfirm title="确定删除?" onConfirm={() => handleDelete(rowData, rowIndex)}>
                                    <Typography.Link>删除</Typography.Link>
                                </Popconfirm>
                            </Flex>
                        )
                    } else {
                        const editable = isEditing(rowData)
                        return editable ?
                            (
                                <Flex gap={8} justify='center' align='center'>
                                    <HasPermission hasPermissions={editPermission}>
                                        <Typography.Link onClick={() => handleSave(rowData, rowIndex)}>
                                            保存
                                        </Typography.Link>
                                        <Typography.Link onClick={() => handleCancel(rowData, rowIndex)}>
                                            取消
                                        </Typography.Link>
                                    </HasPermission>
                                </Flex >
                            )
                            :
                            (
                                <Flex gap={8} justify='center' align='center'>
                                    <HasPermission hasPermissions={editPermission}>
                                        <Typography.Link disabled={editingKey !== null} onClick={() => handleEdit(rowData, rowIndex)}>
                                            编辑
                                        </Typography.Link>
                                    </HasPermission>
                                    <HasPermission hasPermissions={deletePermission}>
                                        <Popconfirm disabled={editingKey !== null} okText='确定' cancelText='取消' title="确定删除？" onConfirm={() => handleDelete(rowData, rowIndex)}>
                                            <Typography.Link disabled={editingKey !== null}>
                                                删除
                                            </Typography.Link>
                                        </Popconfirm>
                                    </HasPermission>
                                </Flex>
                            )
                    }

                },
            },
        ]
    }, [columns, form, name, add, remove, handleDelete, handleSave, handleEdit, handleCancel, rowKey, editingKey])

    return (
        <Flex gap={8} vertical>
            <HasPermission hasPermissions={editPermission}>
                <Button onClick={handleAdd} type="primary" className='w-20'>新增一行</Button>
            </HasPermission>
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