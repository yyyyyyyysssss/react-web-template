import React from 'react'
import type { FormInstance } from 'antd'

interface EditableContextProps {
  form: FormInstance
  rowOnChange?: (rowData: any) => void
}

export const EditableContext = React.createContext<EditableContextProps | null>(null)