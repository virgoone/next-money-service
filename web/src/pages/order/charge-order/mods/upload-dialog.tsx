import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  Descriptions,
  Spin,
  Typography,
} from 'antd'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { GiftCodeDto } from '../constants'
import { ChargeOrderControllerFindById } from '@/apis/v1/charge-order'
import { formatNumberWithCommas, formatDate, formatPrice } from '@/utils/format'
import { PaymentChannelTypeTextMap, OrderPhase, OrderPhaseTextMap, PaymentChannelType } from '@/constants/type'
const FormItem = Form.Item

const { Text } = Typography
const UploadDialog = (props: {
  open: boolean
  detail: GiftCodeDto
  onClose: () => void
  refresh?: () => void
}) => {
  const { open, detail, onClose, refresh } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['get-order-detail', detail.id],
    enabled: !!detail.id && open,
    queryFn: () => ChargeOrderControllerFindById({
      id: detail.id,
    }),
  })
  const order = data?.data || {}
  const userInfo = (order?.userInfo || {}) as Record<string, any>
  const paymentInfo = (order?.result || {}) as Record<string, any>
  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
      title="查看订单"
      size="large"
    >
      <Spin spinning={isFetching || isLoading}>
        <Descriptions column={2} title="订单信息">
          <Descriptions.Item label="订单ID">
            <Text copyable>{order?.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="充值积分">
            {formatNumberWithCommas(order?.credit)}
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">
            {formatPrice(order?.amount / 100)}
          </Descriptions.Item>
          <Descriptions.Item label="支付渠道">
            {PaymentChannelTypeTextMap[order?.channel as PaymentChannelType]}
          </Descriptions.Item>
          <Descriptions.Item label="支付状态">
            {OrderPhaseTextMap[order?.phase as OrderPhase]}
          </Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {formatDate(order?.createdAt)}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions className='mt-4' column={2} title="支付用户信息">
          <Descriptions.Item label="用户ID">
            {order?.userId}
          </Descriptions.Item>
          <Descriptions.Item label="用户名">
            {userInfo?.username}
          </Descriptions.Item>
          <Descriptions.Item label="用户邮箱">
            <Text copyable>{userInfo?.email}</Text>
          </Descriptions.Item>
        </Descriptions>
        {
          order?.channel === PaymentChannelType.Stripe && (
            <Descriptions className='mt-4' column={2} title="支付信息">
              <Descriptions.Item label="支付时间">
                {formatDate(paymentInfo?.created * 1000)}
              </Descriptions.Item>
              <Descriptions.Item label="支付渠道">
                {PaymentChannelTypeTextMap[order?.channel as PaymentChannelType]}
              </Descriptions.Item>
              <Descriptions.Item label="渠道订单ID">
                <Text copyable>{paymentInfo?.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="产品ID">
                <Text copyable>{paymentInfo?.metadata?.chargeProductId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="平台订单ID">
                <Text copyable>{paymentInfo?.metadata?.orderId}</Text>
              </Descriptions.Item>
            </Descriptions>
          )
        }

      </Spin>
    </Drawer>
  )
}

export default UploadDialog
