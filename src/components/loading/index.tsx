import { Spin } from 'antd';
import './index.css'
import React from 'react';


interface LoadingProps {
    spinning?: boolean,
    children?: React.ReactNode
    resetProps?: any,
}

const Loading: React.FC<LoadingProps> = ({
    spinning = true,
    children,
    resetProps
}) => {

    return (
        <Spin spinning={spinning} {...resetProps} >
            {children}
        </Spin>
    )
}

export default Loading