import { useLocation } from "react-router-dom"


const useQueryParams = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const params = {}
    queryParams.forEach((value, key) => {
        params[key] = value;
    })
    return params
}

export default useQueryParams