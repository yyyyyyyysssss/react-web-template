import { Dropdown, theme, Tooltip } from 'antd';
import './index.css'
import { Check, Palette } from 'lucide-react';
import IconBox from '../../../components/icon-box';
import { useContext } from 'react';
import { ColorPrimaryContext } from '../../../App';

const ThemeColor = () => {

    const { token } = theme.useToken()

    const { colorPrimary, setColorPrimary } = useContext(ColorPrimaryContext)

    const colorOptions = [
        { color: '#1DA57A', label: '极光绿' },
        { color: '#1890FF', label: '拂晓' },
        { color: '#F5222D', label: '薄暮' },
        { color: '#FA5418', label: '火山' },
        { color: '#FAAD14', label: '日暮' },
        { color: '#722ED1', label: '酱紫' },
    ]

    const switchColor = (color) => {
        setColorPrimary(color)
    }

    const colorItems = colorOptions.map(option => ({
        key: option.color,
        label: (
            <Tooltip title={option.label}>
                <div
                    onClick={() => switchColor(option.color)}
                    style={{
                        position: 'relative',
                        backgroundColor: option.color,
                        borderRadius: token.borderRadius,
                        width: '25px',
                        height: '25px'
                    }}
                >
                    {colorPrimary === option.color && (
                        <Check
                            size={22}
                            style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                bottom: '2px',
                                left: '2px',
                                color: '#fff',
                                fontSize: '8px',
                            }}
                        />
                    )}
                </div>
            </Tooltip>
        ),
    }))

    return (
        <Dropdown
            menu={{
                items: colorItems
            }}
            placement="bottomCenter"
            trigger={['click']}
        >
            <IconBox>
                <Palette size={20} />
            </IconBox>
        </Dropdown >
    )
}

export default ThemeColor