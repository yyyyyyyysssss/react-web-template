import React from 'react'
import type { FormInstance } from 'antd'

export const EditableContext = React.createContext<FormInstance | null>(null)