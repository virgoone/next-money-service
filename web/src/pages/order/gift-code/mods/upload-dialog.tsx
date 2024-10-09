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
import { GiftCodeControllerUpdate } from '@/apis/v1/gift-code'
import { generateGifCode } from '@/utils'
import { GiftCodeDto } from '../constants'

const FormItem = Form.Item

const useUpdateMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      GiftCodeControllerUpdate(data),
    onSuccess: (data) => {
      config?.onSuccess?.(data)
    },
  })
}

const UploadDialog = (props: {
  open: boolean
  detail: GiftCodeDto
  onClose: () => void
  refresh?: () => void
}) => {
  const { open, detail, onClose, refresh } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const updateMutation = useUpdateMutation()
  const onFinish: FormProps['onFinish'] = async (values) => {
    if (detail.used) {
      return message.error("已使用不允许修改");
    }
    await updateMutation.mutateAsync({
      id: detail.id,
      creditAmount: values.creditAmount,
      code: values.code,
    })
    message.success('更新成功')
    onClose()
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

  useEffect(() => {
    form.setFieldsValue(detail)
  }, [detail])

  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
      title="更新礼品码"
      size="large"
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinishDebounce}
        disabled={detail.used}
      >
        <FormItem
          label="ID"
          name="id"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input className="!w-full" placeholder="Please input..." disabled />
        </FormItem>
        <FormItem
          label="礼品码积分"
          name="creditAmount"
          rules={[{ required: true, message: '请输入' }]}
        >
          <InputNumber min={1} step={1} className="!w-full" placeholder="Please input..." />
        </FormItem>
        <FormItem
          label="礼品码代码"
          name="code"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input.Search className="!w-full" enterButton={
            <Button
              type="default"
              onClick={() => {
                form.setFieldValue("code", generateGifCode(12));
              }}
            >
              生成
            </Button>
          } placeholder="Please input..." />
        </FormItem>

        <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
          <Button
            type="default"
            htmlType="reset"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={updateMutation.isPending}
          >
            提交
          </Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default UploadDialog
