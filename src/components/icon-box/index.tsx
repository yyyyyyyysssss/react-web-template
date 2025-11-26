import React, { CSSProperties, FC } from 'react';
import './index.css';
import { theme } from 'antd';


export interface IconBoxProps extends React.HTMLProps<HTMLDivElement>{
    icon?: React.ReactNode;
    children?: React.ReactNode;
    padding?: number;                        // 控制点击区域大小
    className?: string;
    onClick?: () => void;
}

const IconBox: FC<IconBoxProps> = ({
    icon,
    children,
    padding = 6,
    className = '',
    onClick,
    ...rest
}) => {

    const { token } = theme.useToken()

    const content = children ?? icon;

    return (
        <div
            className={`icon-button ${className}`}
            style={{
                borderRadius: token.borderRadius,
                padding
            }}
            onClick={onClick}
            {...rest}
        >
            {content}
        </div>
    )
}

export default IconBox