import React, { useState } from 'react'

import { Button, Image, Typography, Popconfirm, Space, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import ProTable from '@/components/pro-table'
import { FormOptions } from '@/components/pro-table/form'
import { useModel } from '@/store'
import type { ColumnsType } from 'antd/es/table'
import { formatDate, formatPrice, formatNumberWithCommas } from '@/utils/format'
import UpdateModal from './mods/upload-dialog'
import { StatusEnumOptions, StatusEnumText, StatusEnum } from './constants'
import { UserControllerFindAll } from '@/apis/v1/user'

const { Text } = Typography

const formOptions: FormOptions[] = [
  {
    fieldName: 'id',
    label: '用户ID',
    type: 'Input',
    placeholder: '请输入 用户ID',
    allowClear: true,
  },
  {
    fieldName: 'state',
    label: '状态',
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
  const queryKey = 'getAdminUserList'
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
  const [type, setType] = useState<'create' | 'view'>('create')
  const callback = async (record: Record<string, any>, type: 'create' | 'view') => {
    setData(record)
    setFormVisible(true)
    setType(type)
  }

  const columns: ColumnsType<any> = [
    {
      title: "用户ID",
      dataIndex: "id",
      width: 180,
      fixed: 'left',
      render: (code) => <Text copyable>{code}</Text>,
    },
    {
      title: "用户名",
      dataIndex: "name",
      width: 200,
      render: (userId) => <Text copyable>{userId}</Text>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 150,
      render: (email) => <Text copyable>{email}</Text>,
    },
    {
      title: "状态",
      dataIndex: "state",
      width: 150,
      render: (state) => StatusEnumText[state as StatusEnum],
    },
    {
      title: "创建时间",
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
          <Button
            type="default"
            size="small"
            onClick={() => callback(record, 'view')}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <ProTable
      columns={columns}
      showSearchForm
      showCreatedTime
      defaultQueryData={{ id: null, state: StatusEnum.Active }}
      queryKey={queryKey}
      formOptions={formOptions}
      queryFn={(params: Record<string, any>) => {
        return UserControllerFindAll(params)
      }}
      title={
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          运营人员管理
        </h3>
      }
      empty={<span>未查询到数据</span>}
      operation={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setType('create')
              setFormVisible(true)
            }}
          >
            创建
          </Button>
        </Space>
      }
    >
      <UpdateModal
        detail={data}
        type={type}
        open={addFormVisible}
        onClose={() => {
          setFormVisible(false)
          refresh()
        }}
      />
    </ProTable>
  )
}

