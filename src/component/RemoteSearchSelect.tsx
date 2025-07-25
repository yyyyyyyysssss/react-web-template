import { useState, useMemo, useCallback, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { useRequest } from 'ahooks';
import debounce from 'lodash/debounce';


interface RemoteSearchSelectProps<T> {
    // 远程搜索的接口
    fetchData: (keyword: string | string[], page: number, pageSize: number) => Promise<{ list: T[], total: number }>;
    labelField: keyof T;
    valueField: keyof T;
    value?: any;
    onChange?: (value: any) => void;
    // 防抖时间
    debounceDelay?: number;
    // 提示文本
    placeholder?: string;
    // 每页大小
    pageSize?: number;
    mode: 'multiple' | 'tags' | undefined;
    optionRender;

    [key: string]: any;
}

const RemoteSearchSelect = <T,>({
    fetchData,
    labelField,
    valueField,
    value = null,
    onChange,
    debounceDelay = 500,
    placeholder = '请输入关键字',
    pageSize = 10,
    mode = undefined,
    optionRender,
    ...rest
}: RemoteSearchSelectProps<T>) => {

    const [options, setOptions] = useState<T[]>([])
    const [pageNum, setPageNum] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [keyword, setKeyword] = useState<string | string[]>('')

    const { runAsync: fetchDataAsync, loading: fetchDataLoading } = useRequest(
        (keyword: string | string[], pageNum: number, pageSize: number) => fetchData(keyword, pageNum, pageSize),
        { manual: true }
    )


    useEffect(() => {
        if (value) {
            if (Array.isArray(value)) {
                if(value.length > 0){
                    fetchDataHandler(value, 1, pageSize)
                }
            }else {
                fetchDataHandler([value], 1, pageSize)
            }
        }
    }, [])

    const fetchDataHandler = async (keyword: string | string[], pageNum: number, pageSize: number) => {
        fetchDataAsync(keyword, pageNum, pageSize)
            .then(
                (data) => {
                    const { list, total } = data
                    setOptions((prevOptions) => (pageNum === 1 ? list : [...prevOptions, ...list]))
                    setTotal(total)
                }
            )
    }

    const debounceFetcher = useCallback(
        debounce((keyword: string) => {
            setPageNum(1)
            fetchDataHandler(keyword, 1, pageSize)
        }, debounceDelay),
        [debounceDelay]
    )

    const handleSearch = (keyword: string) => {
        setKeyword(keyword)
        debounceFetcher(keyword)
    }

    const handleChange = (value: string) => {
        if (onChange) {
            onChange(value)
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (open && options.length === 0) {
            fetchDataHandler('', 1, pageSize)
        }
    }

    const handlePopupScroll = (e: any) => {
        const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight
        if (bottom && !fetchDataLoading && options.length < total) {
            setPageNum(prevPageNum => prevPageNum + 1)
            fetchDataHandler(keyword, pageNum + 1, pageSize)
        }
    }

    const selectOptions = useMemo(() => {
        const optionsWithLoading = [...(options || [])]
        if (fetchDataLoading) {
            optionsWithLoading.push({ label: <Spin size="small" />, value: 'loading', disabled: true } as any)
        }
        return optionsWithLoading?.map((option) => ({
            label: option[labelField],
            value: option[valueField],
            ...option,
        }))
    }, [options, labelField, valueField, fetchDataLoading])

    return (
        <Select
            style={{
                minWidth: '120px'
            }}
            showSearch
            mode={mode}
            maxTagCount={3}
            placeholder={placeholder}
            notFoundContent={fetchDataLoading ? <Spin size="small" style={{ display: 'block', margin: '0 auto' }} /> : <div style={{ textAlign: 'center' }}>没有数据</div>}
            onSearch={handleSearch}
            onChange={handleChange}
            value={value}
            filterOption={false}
            options={selectOptions}
            onDropdownVisibleChange={handleOpenChange}
            onPopupScroll={handlePopupScroll}
            onClear={() => {
                setOptions([])
                setKeyword('')
                setPageNum(1)
            }}
            optionRender={
                option => (
                    <div>
                        {
                            optionRender ?
                                optionRender(option)
                                :
                                (
                                    <div style={{ textAlign: 'center' }}>{option.label}</div>
                                )
                        }
                    </div>
                )
            }
            {...rest}
        />
    )
}

export default RemoteSearchSelect