import { Outlet, useNavigation } from "react-router-dom";
import 'nprogress/nprogress.css';
import Loading from "./loading";

const PageWithLoadingPlaceholder = () => {

    const navigation = useNavigation()

    if (navigation.state === 'loading') {
        return <Loading />
    }

    return <Outlet />;
}

export default PageWithLoadingPlaceholder