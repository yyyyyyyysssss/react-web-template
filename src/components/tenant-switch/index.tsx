import { Swiper, SwiperSlide } from 'swiper/react';
import './index.css'
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'swiper/modules';
import { Avatar, Flex, Typography } from 'antd';
import { switchTenant } from '../../redux/slices/layoutSlice';



interface TenantItem {
    id: string
    tenantName: string
    tenantCode: string
    logo: string
}

interface TenantSwitchProps {
    onTenantChange?: (tenant: TenantItem) => void
}

const TenantSwitch: React.FC<TenantSwitchProps> = ({
    onTenantChange
}) => {

    const dispatch = useDispatch()


    const { tenants } = useSelector((state: any) => state.auth.userInfo) || []

    const handleSwitchTenant = (tenant: TenantItem) => {
        dispatch(switchTenant({ tenant: tenant }))
        window.location.href = '/'
        onTenantChange?.(tenant)
    }

    return (
        <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
                clickable: true,
            }}
            loop={tenants.length >= 3}
            modules={[Pagination]}
            className="w-full h-full"
        >
            {tenants.map((item: TenantItem, index: number) => (
                <SwiperSlide
                    key={item.id}
                    onClick={() => handleSwitchTenant(item)}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}
                >
                    <Flex
                        className='tenant-item'
                        gap={15}
                        justify='center'
                        align='center'
                        vertical
                    >
                        <Avatar
                            src={item.logo}
                            size={78}
                        />
                        <Typography.Text>
                            {item.tenantName}
                        </Typography.Text>
                    </Flex>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default TenantSwitch