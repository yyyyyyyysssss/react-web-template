import { Spin, Tree } from "antd"
import { useEffect, useMemo, useState } from "react"
import { fetchAuthorityTree } from "../services/SystemService"
import { DataNode } from "antd/es/tree"
import Loading from "./loading"


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

    const { parentMap, childrenMap } = useMemo(() => {
        const parentMap = new Map<string, string>();
        const childrenMap = new Map<string, string[]>();
        const walk = (nodes: any[], parent?: string) => {
            nodes.forEach((node) => {
                if (parent) {
                    parentMap.set(node.id, parent)
                    const siblings = childrenMap.get(parent) || [];
                    siblings.push(node.id)
                    childrenMap.set(parent, siblings)
                }
                if (node.children?.length) walk(node.children, node.id)
            })
        }
        walk(treeData)
        return { parentMap, childrenMap }
    }, [treeData])

    const getAllParents = (id: string, parentMap: Map<string, string>) => {
        const parents: string[] = []
        let current = parentMap.get(id)
        while (current) {
            parents.push(current)
            current = parentMap.get(current)
        }
        return parents
    }

    const handleChange = (checked: string[]) => {
        const finalIds = new Set<string>(checked);

        checked.forEach((id) => {
            // 获取节点所有父节点id
            const parentIds = getAllParents(id, parentMap)
            parentIds.forEach(item => finalIds.add(item));
        })
        onChange?.(Array.from(finalIds))
    }

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
        const parentIds = new Set(childrenMap.keys())
        return (value || []).filter((id) => availableKeys.has(id) && !parentIds.has(id))
    }, [value, availableKeys])

    return (
        <Loading spinning={loading}>
            <Tree
                checkable
                onExpand={(keys) => setExpandedKeys(keys)}
                expandedKeys={expandedKeys}
                checkedKeys={safeValue}
                treeData={treeData}
                selectable={false}
                onCheck={(checkedKeys) => handleChange(checkedKeys as string[])}
                fieldNames={{
                    key: 'id',
                    title: 'name',
                    children: 'children'
                }}
            />
        </Loading>
    )
}

export default AuthorityTree