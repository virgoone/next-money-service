import React, { useState } from 'react'

import { Button, Image, Typography, Popconfirm, Space, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import ProTable from '@/components/pro-table'
import { FormOptions, SearchFormItemType } from '@/components/pro-table/form'
import { useModel } from '@/store'
import { OrderPhase, PaymentChannelType, PaymentChannelTypeTextMap, OrderPhaseTextMap } from '@/constants/type'
import type { ColumnsType } from 'antd/es/table'
import { formatDate, formatPrice, formatNumberWithCommas } from '@/utils/format'
import UpdateModal from './mods/upload-dialog'
import { ChargeOrderControllerFindAll } from '@/apis/v1/charge-order'
// import Form from './form'

const { Text } = Typography

const formOptions: FormOptions[] = [
  {
    fieldName: 'id',
    label: '订单ID',
    type: 'Input',
    placeholder: '请输入 ID',
    allowClear: true,
  },
  {
    fieldName: 'userId',
    label: '用户ID',
    type: 'Input',
    placeholder: '请输入用户ID',
    allowClear: true,
  },
  {
    fieldName: 'state',
    label: '订单状态',
    type: 'Select',
    placeholder: '请选择订单状态',
    allowClear: true,
    options: Object.entries(OrderPhaseTextMap).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },
  {
    fieldName: 'channel',
    label: '支付渠道',
    type: 'Select',
    placeholder: '请选择支付渠道',
    allowClear: true,
    options: [{
      label: '全部',
      value: -1,
    }, ...Object.entries(PaymentChannelTypeTextMap).map(([key, value]) => ({
      label: value,
      value: key,
    }))],
  },
]
export default function VoucherPage() {
  const [addFormVisible, setFormVisible] = useState(false)
  const queryClient = useQueryClient()
  const [data, setData] = useState<any>({})
  const { showSuccess, showError } = useModel((state) => state)
  const queryKey = 'getChargeOrderList'
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
  const callback = async (record: Record<string, any>, type: string) => {
    setData(record)
    setFormVisible(true)
  }

  const columns: ColumnsType<any> = [
    {
      title: "订单ID",
      dataIndex: "id",
      width: 180,
      fixed: 'left',
      render: (code) => <Text copyable>{code}</Text>,
    },
    {
      title: "购买用户",
      dataIndex: "userId",
      width: 200,
      render: (userId) => <Text copyable>{userId}</Text>,
    },
    {
      title: "充值积分",
      dataIndex: "credit",
      width: 150,
      render: (credit) => formatNumberWithCommas(credit),
    },
    {
      title: "支付金额",
      dataIndex: "amount",
      width: 150,
      render: (amount) => formatPrice(amount / 100),
    },
    {
      title: "购买渠道",
      dataIndex: "channel",
      width: 150,
      render: (channel) => PaymentChannelTypeTextMap[channel as PaymentChannelType],
    },
    {
      title: "支付状态",
      dataIndex: "phase",
      width: 150,
      render: (phase) => OrderPhaseTextMap[phase as OrderPhase],
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      width: 150,
      fixed: 'right',
      render: (_: any, record: Record<string, any>) => (
        <Space>
          {
            record.phase === OrderPhase.Paid && (
              <Button
                type="default"
                size="small"
                onClick={() => callback(record, 'view')}
              >
                查看
              </Button>
            )
          }

        </Space>
      ),
    },
  ]
  return (
    <ProTable
      columns={columns}
      showSearchForm
      showCreatedTime
      defaultQueryData={{ id: null, userId: null, channel: -1, state: OrderPhase.Paid }}
      queryKey={queryKey}
      formOptions={formOptions}
      queryFn={(params: Record<string, any>) => {
        if (params.channel === -1) {
          delete params.channel
        }
        return ChargeOrderControllerFindAll(params)
      }}
      title={
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          充值订单管理
        </h3>
      }
      empty={<span>未查询到数据</span>}
      operation={null}
    >
      <UpdateModal
        detail={data}
        open={addFormVisible}
        onClose={() => {
          setFormVisible(false)
        }}
      />
    </ProTable>
  )
}

