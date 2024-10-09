import React, { useState } from 'react'

import { Button, Image, Popconfirm, Space, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import ProTable from '@/components/pro-table'
import { FormOptions, SearchFormItemType } from '@/components/pro-table/form'
import { useModel } from '@/store'
import type { ColumnsType } from 'antd/es/table'
import { formatDate, formatPrice, formatNumberWithCommas } from '@/utils/format'
import CreateModal from './mods/create-dialog'
import { StatusEnum, StatusEnumOptions, StatusEnumText } from './constants'
import { LocalesTextMap, Locale } from '@/constants/type'
import UpdateModal from './mods/upload-dialog'
import {
  ChargeProductControllerDelete,
  ChargeProductControllerFindAll,
} from '@/apis/v1/charge-product'
// import Form from './form'

const formOptions: FormOptions[] = [
  {
    fieldName: 'id',
    label: 'ID',
    type: 'Input',
    placeholder: '请输入 ID',
    allowClear: true,
  },
  {
    fieldName: 'state',
    label: '启用状态',
    type: 'Select',
    placeholder: '请选择状态',
    allowClear: true,
    options: StatusEnumOptions,
  },
]
export default function VoucherPage() {
  const [addFormVisible, setFormVisible] = useState(false)
  const queryClient = useQueryClient()
  const [data, setData] = useState<any>({})
  const { showSuccess, showError } = useModel((state) => state)
  const queryKey = 'getChargeProductList'
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
  const callback = async (record: Record<string, any>, type: string) => {
    if (type === 'delete') {
      try {
        await ChargeProductControllerDelete({
          id: record.id,
        })
        showSuccess(`删除成功`)
        refresh()
      } catch (error) {
        console.log('error-->', error)
        showError(`删除失败`)
      }
    } else {
      setData(record)
      setFormVisible(true)
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 150,
      fixed: 'left',
    },
    {
      title: '语言',
      dataIndex: 'locale',
      ellipsis: true,
      width: 100,
      render: (_col: any, record: any, index: number) => {
        if (!record.locale) {
          return '未知'
        }
        return LocalesTextMap[record.locale as unknown as Locale]
      },
    },
    {
      title: '原价',
      width: 100,
      dataIndex: 'originalAmount',
      render: (originalAmount: number, record: any, index: number) => {
        return formatPrice(originalAmount / 100)
      },
    },
    {
      title: '单价',
      width: 100,
      dataIndex: 'amount',
      render: (amount: number, record: any, index: number) => {
        return formatPrice(amount / 100)
      },
    },
    {
      title: '货币',
      width: 100,
      dataIndex: 'currency',
    },
    {
      title: '赠送积分',
      width: 120,
      dataIndex: 'credit',
      render: (credit: number, record: any, index: number) => {
        return <span>{formatNumberWithCommas(credit)}</span>
      },
    },
    {
      title: '启用状态',
      dataIndex: 'state',
      width: 150,
      render: (state: any) => {
        return (
          <Tag color={state === 'enable' ? '#00b42a' : '#f53f3f'}>
            {state === 'enable' ? '已启用' : '已禁用'}
          </Tag>
        )
      },
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'createdAt',
      render: (_col: any, record: any, index: number) => {
        return <span>{formatDate(record.createdAt)}</span>
      },
    },
    {
      title: '操作',
      dataIndex: 'operations',
      width: 150,
      fixed: 'right',
      render: (_: any, record: Record<string, any>) => (
        <Space>
          <Button
            type="default"
            size="small"
            onClick={() => callback(record, 'edit')}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该项吗？"
            onConfirm={() => callback(record, 'delete')}
          >
            <Button type="dashed" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  return (
    <ProTable
      columns={columns}
      showSearchForm
      showCreatedTime
      defaultQueryData={{ id: null, state: -1 }}
      queryKey={queryKey}
      formOptions={formOptions}
      queryFn={(params: Record<string, any>) => {
        if (params.state === -1) {
          delete params.state
        }
        return ChargeProductControllerFindAll(params)
      }}
      title={
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          充值产品管理
        </h3>
      }
      empty={<span>未查询到数据，请新建</span>}
      operation={
        <Space>
          <CreateModal refresh={refresh}>
            <Button
              type="primary"
              onClick={() => {
                setData(null)
              }}
              icon={<PlusOutlined />}
            >
              创建充值产品
            </Button>
          </CreateModal>
        </Space>
      }
    >
      <UpdateModal
        detail={data}
        open={addFormVisible}
        onClose={() => {
          setFormVisible(false)
          refresh()
        }}
      />
    </ProTable>
  )
}