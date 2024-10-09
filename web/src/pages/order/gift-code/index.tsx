import React, { useState } from 'react'

import { Button, Image, Typography, Popconfirm, Space, Tag } from 'antd'
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
import { GiftCodeControllerDelete, GiftCodeControllerFindAll } from '@/apis/v1/gift-code'
// import Form from './form'

const { Text } = Typography

const formOptions: FormOptions[] = [
  {
    fieldName: 'id',
    label: 'ID',
    type: 'Input',
    placeholder: '请输入 ID',
    allowClear: true,
  },
  {
    fieldName: 'code',
    label: '礼品码',
    type: 'Input',
    placeholder: '请输入礼品码',
    allowClear: true,
  },
  {
    fieldName: 'state',
    label: '使用状态',
    type: 'Select',
    placeholder: '请选择使用状态',
    allowClear: true,
    options: StatusEnumOptions,
  },
]
export default function VoucherPage() {
  const [addFormVisible, setFormVisible] = useState(false)
  const queryClient = useQueryClient()
  const [data, setData] = useState<any>({})
  const { showSuccess, showError } = useModel((state) => state)
  const queryKey = 'getGiftCodeList'
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
  const callback = async (record: Record<string, any>, type: string) => {
    if (type === 'delete') {
      try {
        await GiftCodeControllerDelete({
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
      title: "ID",
      dataIndex: "id",
      render: (code) => <Text copyable>{code}</Text>,
    },
    {
      title: "充值积分",
      dataIndex: "creditAmount",
    },
    {
      title: "礼品码",
      dataIndex: "code",
      render: (code) => <Text copyable>{code}</Text>,
    },
    {
      title: "状态",
      dataIndex: "used",
      render: (used) => (used ? "已使用" : "未使用"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
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
          {record.used ? null : (
            <Popconfirm
              title="确认删除该礼品码吗？"
              onConfirm={() => callback(record, 'delete')}
            >
              <Button type="dashed" danger size="small">
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]
  return (
    <ProTable
      columns={columns}
      showSearchForm
      showCreatedTime
      defaultQueryData={{ id: null, code: null, state: 'enable' }}
      queryKey={queryKey}
      formOptions={formOptions}
      queryFn={(params: Record<string, any>) => {
        return GiftCodeControllerFindAll(params)
      }}
      title={
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          礼品码管理
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
              创建礼品码
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

