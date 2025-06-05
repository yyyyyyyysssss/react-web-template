import { Spin, Tree } from "antd"
import { useEffect, useMemo, useState } from "react"
import { fetchAuthorityTree } from "../services/SystemService"
import { DataNode } from "antd/es/tree"


interface Permission {
  id: string;
  name: string;
  children?: Permission[];
}

interface AuthorityTreeProps {
    value?: string[]
    onChange?: (value: string[]) => void
}

const AuthorityTree: React.FC<AuthorityTreeProps> = ({ value = [], onChange }) => {

    const [treeData, setTreeData] = useState<DataNode[]>([])

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])

    const [loading, setLoading] = useState(false)

    const [loaded, setLoaded] = useState(false)

    const fetchData = async () => {
        if (loaded) return
        setLoading(true)
        try {
            const list = await fetchAuthorityTree()
            setTreeData(list)
            const keys: string[] = []
            const walk = (nodes: any[]) => {
                nodes.forEach((node) => {
                    keys.push(node.id)
                    if (node.children) walk(node.children)
                })
            }
            walk(list)
            setExpandedKeys(keys)
            setLoaded(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const availableKeys = useMemo(() => {
        const keys = new Set<string>()
        const walk = (nodes: any[]) => {
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
            <Tree
                checkable
                onExpand={(keys) => setExpandedKeys(keys)}
                expandedKeys={expandedKeys}
                checkedKeys={safeValue}
                treeData={treeData}
                onCheck={(checkedKeys) => onChange?.(checkedKeys as string[])}
                fieldNames={{
                    key: 'id',
                    title: 'name',
                    children: 'children'
                }}
            />
        </Spin>
    )
}

export default AuthorityTree