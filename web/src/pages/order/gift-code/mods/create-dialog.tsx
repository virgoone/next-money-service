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
import { GiftCodeControllerCreate } from '@/apis/v1/gift-code'
import { generateGifCode } from '@/utils'

const FormItem = Form.Item

const useCreateMutation = (config?: { onSuccess?: (data: any) => void }) => {
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      GiftCodeControllerCreate(data),
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
