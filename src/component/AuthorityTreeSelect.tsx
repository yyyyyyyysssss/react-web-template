import { Spin, TreeSelect } from "antd";
import React, { useEffect, useMemo, useState } from "react";
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


const AuthorityTreeSelect: React.FC<PermissionTreeSelectProps> = ({ value, onChange }) => {

  const [treeData, setTreeData] = useState<Permission[]>([])

  const [loading, setLoading] = useState(false)

  const [loaded, setLoaded] = useState(false)

  const fetchData = async () => {
    if (loaded) return
    setLoading(true)
    try {
      const list = await fetchAuthorityTree()
      setTreeData(list)
      setLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (value && value.length > 0) {
      fetchData()
    }
  }, [value])

  const handleDropdownVisibleChange = (open: boolean) => {
    if (open) {
      fetchData()
    }
  }

  const availableKeys = useMemo(() => {
    const keys = new Set<string>()
    const walk = (nodes: Permission[]) => {
      nodes.forEach((node) => {
        keys.add(node.id)
        if (node.children) walk(node.children)
      })
    }
    walk(treeData)
    return keys
  }, [treeData])

  const safeValue = useMemo(() => {
    return (value || []).filter((id) => availableKeys.has(id))
  }, [value, availableKeys])


  return (
    <Spin spinning={loading}>
      <TreeSelect
        style={{ width: '100%' }}
        showSearch={true}
        value={safeValue}
        treeData={treeData}
        maxTagCount={3}
        onChange={(v) => onChange?.(v)}
        treeCheckable={true}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        placeholder="请选择权限"
        onDropdownVisibleChange={handleDropdownVisibleChange}
        fieldNames={{
          label: 'name',
          value: 'id',
          children: 'children'
        }}
        filterTreeNode={(input, treeNode) => (treeNode.name ?? treeNode.title ?? '').toLowerCase().includes(input.toLowerCase())}
        treeDefaultExpandAll={true}
      />
    </Spin>
  )
}

export default AuthorityTreeSelect;