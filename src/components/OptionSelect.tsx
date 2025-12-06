import { useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectProps } from "antd";
import { useRequest } from 'ahooks';
import Loading from "./loading";
import NoDataEmpty from "./NoDataEmpty";




interface OptionSelectProps extends SelectProps<any> {
    value?: any; // 选中的值
    mode: any,
    labelFieldName: string,
    valueFieldName: string
    onChange?: (value: any) => void; // 值变化时的回调
    fetchOptions: () => Promise<any[]>; // 获取选项数据的接口
}

const OptionSelect: React.FC<OptionSelectProps> = ({
    fetchOptions,
    value,
    labelFieldName = 'label',
    valueFieldName = 'value',
    mode = null,
    onChange,
    ...props
}) => {

    const [optionsData, setOptionsData] = useState<any[]>([])

    const [loaded, setLoaded] = useState(false)

    const isFetching = useRef(false)

    useEffect(() => {
        if (value && value.length > 0) {
            fetchData()
        }
    }, [value])

    const { runAsync: fetchOptionsAsync, loading: fetchOptionsLoading } = useRequest(fetchOptions, {
        manual: true
    })

    const fetchData = async () => {
        if (loaded || isFetching.current) return
        isFetching.current = true
        const optionList = await fetchOptionsAsync()
        setLoaded(true)
        setOptionsData(optionList)
    }

    // 当下拉框打开时请求数据
    const handleDropdownVisibleChange = (open: boolean) => {
        if (open && !loaded) {
            fetchData()
        }
    }

    const availableKeys = useMemo(() => {
        const keys = new Set<string>()
        optionsData.forEach((node) => {
            keys.add(node[valueFieldName])
        })
        return keys
    }, [optionsData])

    const safeValue = useMemo(() => {
        if(mode === 'multiple'){
            return value?.filter((id: any) => availableKeys.has(id))
        }
        return value
    }, [value, availableKeys])

    return (
        <Select
            mode={mode}
            style={{ width: '100%' }}
            placeholder="请选择"
            value={safeValue}
            onChange={onChange}
            notFoundContent={fetchOptionsLoading ? <Loading size="small" style={{ display: 'block', margin: '0 auto' }} /> : <NoDataEmpty />}
            options={optionsData}
            fieldNames={{
                label: labelFieldName,
                value: valueFieldName,
            }}
            allowClear
            showSearch
            optionFilterProp={labelFieldName}
            onOpenChange={handleDropdownVisibleChange}
            {...props}
        />
    )

}

export default OptionSelect;