import { Spin, TreeSelect, TreeSelectProps } from "antd";
import { DataNode } from "antd/es/tree";
import React, { useEffect, useState } from "react";
import { fetchAuthorityTree } from "../services/SystemService";



interface Permission {
  id: string;
  name: string;
  children?: Permission[];
}

interface PermissionTreeSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}


const formatTreeData = (nodes: Permission[]): any[] =>
  nodes.map(node => ({
    title: node.name,
    value: node.id,
    key: node.id,
    children: node.children && node.children.length > 0 ? formatTreeData(node.children) : [],
  }))

const PermissionTreeSelect: React.FC<PermissionTreeSelectProps> = ({ value, onChange }) => {

  const [treeData, setTreeData] = useState<DataNode[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchAuthorityTree()
        const formatted = formatTreeData(data)
        setTreeData(formatted)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Spin spinning={loading}>
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        treeData={treeData}
        onChange={(v) => onChange?.(v)}
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_PARENT}
        placeholder="请选择权限"
        treeDefaultExpandAll={true}
      />
    </Spin>
  )
}

export default PermissionTreeSelect;