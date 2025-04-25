import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"


const useQueryParams = () => {

    const [searchParams] = useSearchParams()

    const params = useMemo(() => {
        const result = {}
        searchParams.forEach((value, key) => {
            result[key] = value;
        })
        return result
    },[searchParams])
    
    return params
}

export default useQueryParams