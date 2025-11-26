import React from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, ModalFuncProps, theme, Typography } from 'antd'


interface ActionDropdownItem {
    key: string,
    label?: React.ReactNode
    danger?: boolean
    confirm?: {
        title?: string
        content?: React.ReactNode
        okText?: string
        cancelText?: string
        onOk: () => Promise<any> | void
        confirmLoading?: boolean
    }
    onClick?: () => void
}

interface ActionDropdownProps {
    items: ActionDropdownItem[]
    triggerText?: React.ReactNode
    disabled?: boolean
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
    items,
    triggerText = (
        <>
            更多 <DownOutlined />
        </>
    ),
    disabled,
}) => {

    const { token } = theme.useToken()

    const [modal, contextHolder] = Modal.useModal()

    const menuItems: MenuProps['items'] = items.map(item => ({
        key: item.key,
        label: (
            <Typography.Link
                type={item.danger ? 'danger' : undefined}
                style={{ display: 'flex', justifyContent: 'center', width: '100%', color: token.colorLink}}
                onClick={e => {
                    e.stopPropagation()
                    if (item.confirm) {
                        modal.confirm({
                            title: item.confirm.title ?? '确认操作',
                            content: item.confirm.content,
                            okText: item.confirm.okText ?? '确定',
                            cancelText: item.confirm.cancelText ?? '取消',
                            maskClosable: false,
                            confirmLoading: item.confirm.confirmLoading,
                            onOk: item.confirm.onOk,
                        } as ModalFuncProps & { confirmLoading?: boolean })
                    } else if (item.onClick) {
                        item.onClick()
                    }
                }}
            >
                {item.label}
            </Typography.Link>
        ),
    }))
    return (
        <>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} disabled={disabled}>
                <Typography.Link onClick={e => e.stopPropagation()}>{triggerText}</Typography.Link>
            </Dropdown>
            {contextHolder}
        </>
    )
}

export default ActionDropdown