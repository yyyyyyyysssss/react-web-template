import { useLocation } from "react-router-dom"


const useStateParams = () => {

    const location = useLocation()

    return location.state || {}
}

export default useStateParams