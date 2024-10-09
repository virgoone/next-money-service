import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
} from 'antd'
import type { FormProps } from 'antd/lib/form'
import { useNavigate } from 'react-router'
import { locales, Locale, LocalesTextMap } from '@/constants/type'
import { debounce } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { ChargeProductControllerCreate } from '@/apis/v1/charge-product'

const FormItem = Form.Item

const useCreateMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      ChargeProductControllerCreate(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const CreateDialog = (props: {
  children: React.ReactElement
  refresh?: () => void
}) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const createMutation = useCreateMutation()
  const onFinish: FormProps['onFinish'] = async (values) => {
    await createMutation.mutateAsync(values)
    message.success('创建成功')
    setOpen(false)
    props.refresh?.()
  }
  const onFinishDebounce = debounce(onFinish, 1000)
  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('errorInfo', errorInfo)
    if (errorInfo.errorFields.length > 0) {
      form.scrollToField(errorInfo.errorFields[0].name?.[0], {
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <>
      {React.cloneElement(props.children, {
        onClick: () => setOpen(true),
      })}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create Charge Product"
        size="large"
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          onFinish={onFinishDebounce}
        >
          <FormItem
            label="Title"
            name="title"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input className="!w-full" placeholder="Please input..." />
          </FormItem>
          <FormItem
            label="Amount"
            name="amount"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem
            label="Original Amount"
            name="originalAmount"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem
            label="Credit"
            name="credit"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem
            rules={[{ required: true, message: '请选择' }]}
            label="Currency"
            name="currency"
          >
            <Select
              options={[
                {
                  label: 'CNY',
                  value: 'CNY',
                },
                {
                  label: 'USD',
                  value: 'USD',
                },
              ]}
            />
          </FormItem>
          <FormItem label="State" name="state" initialValue={'enable'}>
            <Select
              options={[
                {
                  label: '启用',
                  value: 'enable',
                },
                {
                  label: '禁用',
                  value: 'disabled',
                },
              ]}
            />
          </FormItem>
          <FormItem
            label="Message"
            name="message"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input.TextArea
              rows={3}
              className="!w-full"
              placeholder="Please input..."
            />
          </FormItem>
          <FormItem label="Tag" name="tag">
            <Select
              mode="tags"
              className="!w-full"
              placeholder="Please input..."
            />
          </FormItem>
          <FormItem
            label="Locale"
            name="locale"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select
              options={locales.map((item) => ({
                value: item,
                label: LocalesTextMap[item as Locale],
              }))}
            />
          </FormItem>
          <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
            <Button
              type="default"
              htmlType="reset"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={createMutation.isPending}
            >
              提交
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateDialog
