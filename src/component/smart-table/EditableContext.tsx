import React from 'react'

interface EditableContextProps {
  rowOnChange?: (rowData: any) => void
  rowIndex?: number
}

export const EditableContext = React.createContext<EditableContextProps | null>(null)