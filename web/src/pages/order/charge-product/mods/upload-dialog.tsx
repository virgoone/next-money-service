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
import { ChargeProductControllerUpdate } from '@/apis/v1/charge-product'
import type { ChargeProductDto } from '../constants'
const FormItem = Form.Item

const useUpdateMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      ChargeProductControllerUpdate(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const UploadDialog = (props: {
  detail: ChargeProductDto
  open: boolean
  onClose: () => void
}) => {
  const { open, detail, onClose } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const updateMutation = useUpdateMutation()
  const onFinish: FormProps['onFinish'] = async (values) => {
    await updateMutation.mutateAsync({
      id: detail.id,
      amount: values.amount,
      originalAmount: values.originalAmount,
      credit: values.credit,
      currency: values.currency,
      locale: values.locale,
      title: values.title,
      tag: values.tag,
      message: values.message,
      state: values.state,
    })
    message.success('更新成功')
    onClose?.()
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

  useEffect(() => {
    form.setFieldsValue(detail)
  }, [detail])

  return (
    <>
      <Drawer
        open={open}
        onClose={() => onClose()}
        title="Update Charge Product"
        size="large"
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinishFailed={onFinishFailed}
          onFinish={onFinishDebounce}
          initialValues={{
            ...detail,
          }}
        >
          <FormItem
            label="ID"
            name="id"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input className="!w-full" placeholder="Please input..." disabled />
          </FormItem>
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
            <Button type="default" htmlType="reset" onClick={() => onClose()}>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={updateMutation.isPending}
            >
              更新
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}

export default UploadDialog
