import './index.css'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';

const Loading = () => {


    useEffect(() => {
        NProgress.start()
        return () => {
            NProgress.done();
        }
    }, [])

    return <></>
}

export default Loading