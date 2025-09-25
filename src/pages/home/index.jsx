import React, { } from 'react';
import './index.css'
import { Card, Divider, Flex, Progress, Statistic, Tooltip, theme } from 'antd';
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/charts';
import { Tiny } from '@ant-design/plots';


const Home = () => {

  const { token } = theme.useToken();

  const visitVolumeDataset = [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
  ].map((value, index) => ({ value, index }));

  const visitVolumeConfig = {
    data: visitVolumeDataset,
    shapeField: 'smooth',
    xField: 'index',
    yField: 'value',
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkgreen 100%)',
      fillOpacity: 0.6,
    },
    tooltip: {
      title: '',
    }
  };

  const paymentDataset = [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
  ].map((value, index) => ({ value, index }));
  const paymentConfig = {
    data: paymentDataset,
    xField: 'index',
    yField: 'value',
    style: {
      
    },
    tooltip: {
      title: '',
    }
  };

  return (
    <Flex flex={1} vertical>
      <Flex flex={1} gap={25} style={{ maxHeight: '250px' }}>
        <Card
          title="总销售额"
          style={{ width: '25%', boxShadow: 'var(--ant-box-shadow-tertiary)' }}
        >
          <Flex flex={1} vertical>
            <Flex gap={20} style={{ height: '100px' }} vertical>
              <Statistic
                title={
                  <Flex justify='space-between'>
                    <span>总销售额</span>
                    <Tooltip title="指标说明">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </Flex>
                }
                value={126560}
                precision={2}
                prefix="¥"
              />
              <Flex>
                <div>
                  周同比 12% <ArrowUpOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                </div>
                <div>
                  日同比 11% <ArrowDownOutlined style={{ color: '#52c41a' }} />
                </div>
              </Flex>
            </Flex>

            <Flex>
              <Divider style={{ margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
            </Flex>

            <Flex gap={8} align='center'>
              <span style={{ fontSize: 14 }}>日销售额</span>
              <span style={{ fontSize: 14 }}>¥ 12,423</span>
            </Flex>

          </Flex>
        </Card>

        <Card
          title="访问量"
          style={{ width: '25%', boxShadow: 'var(--ant-box-shadow-tertiary)' }}
        >
          <Flex flex={1} vertical>
            <Flex style={{ height: '100px' }} vertical>
              <Statistic
                title={
                  <Flex justify='space-between'>
                    <span>访问量</span>
                    <Tooltip title="指标说明">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </Flex>
                }
                value={8846}
              />
              <Tiny.Area
                {...visitVolumeConfig}
              />
            </Flex>

            <Flex>
              <Divider style={{ margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
            </Flex>

            <Flex gap={8} align='center'>
              <span style={{ fontSize: 14 }}>日访问量</span>
              <span style={{ fontSize: 14 }}>1,234</span>
            </Flex>

          </Flex>

        </Card>

        <Card
          title="支付笔数"
          style={{ width: '25%', boxShadow: 'var(--ant-box-shadow-tertiary)' }}
        >
          <Flex flex={1} vertical>
            <Flex style={{ height: '100px' }} vertical>
              <Statistic
                title={
                  <Flex justify='space-between'>
                    <span>支付笔数</span>
                    <Tooltip title="指标说明">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </Flex>
                }
                value={6560}
              />
              <Tiny.Column {...paymentConfig} />
            </Flex>

            <Flex>
              <Divider style={{ margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
            </Flex>

            <Flex gap={8} align='center'>
              <span style={{ fontSize: 14 }}>转化率</span>
              <span style={{ fontSize: 14 }}>60%</span>
            </Flex>

          </Flex>
        </Card>

        <Card
          title="运营活动效果"
          style={{ width: '25%', boxShadow: 'var(--ant-box-shadow-tertiary)' }}
        >
          <Flex flex={1} vertical>
            <Flex style={{ height: '100px' }} vertical>
              <Statistic
                title={
                  <Flex justify='space-between'>
                    <span>运营活动效果</span>
                    <Tooltip title="指标说明">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </Flex>
                }
                value='78%'
              />
              <Progress
                percent={78}
                strokeColor={token.colorPrimary}
              />
            </Flex>

            <Flex>
              <Divider style={{ margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
            </Flex>

            <Flex gap={8} align='center'>
              <div>
                周同比 12% <ArrowUpOutlined style={{ color: '#f5222d', marginRight: 8 }} />
              </div>
              <div>
                日同比 11% <ArrowDownOutlined style={{ color: '#52c41a' }} />
              </div>
            </Flex>

          </Flex>
        </Card>

      </Flex>
      <Flex flex={4}>

      </Flex>
      <Flex flex={4}>

      </Flex>
    </Flex>
  )
}

export default Home