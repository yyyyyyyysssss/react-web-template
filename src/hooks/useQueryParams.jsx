import { useSearchParams } from "react-router-dom"


const useQueryParams = () => {

    const [searchParams] = useSearchParams()

    const params = {}
    searchParams.forEach((value, key) => {
        params[key] = value;
    })
    return params
}

export default useQueryParams