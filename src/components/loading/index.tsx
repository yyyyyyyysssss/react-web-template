import { Spin } from 'antd';
import './index.css'
import React from 'react';


interface LoadingProps extends React.HtmlHTMLAttributes<HTMLDivElement>{
    spinning?: boolean,
    children?: React.ReactNode
    size?: any
    resetProps?: any,
}

const Loading: React.FC<LoadingProps> = ({
    spinning = true,
    children,
    size,
    ...resetProps
}) => {

    return (
        <Spin spinning={spinning} size={size} {...resetProps} >
            {children}
        </Spin>
    )
}

export default Loading