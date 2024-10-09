export enum VerifyCodeType {
  Signin = 'Signin',
  Signup = 'Signup',
  ResetPassword = 'ResetPassword',
  Bind = 'Bind',
  Unbind = 'Unbind',
  Change = 'Change',
}

export enum Currency {
  CNY = "CNY",
  USD = "USD",
}

export enum OrderPhase {
  Pending = "Pending",
  Paid = "Paid",
  Canceled = "Canceled",
  Failed = "Failed",
}

export const OrderPhaseTextMap: Record<OrderPhase, string> = {
  [OrderPhase.Pending]: '待支付',
  [OrderPhase.Paid]: '已支付',
  [OrderPhase.Canceled]: '已取消',
  [OrderPhase.Failed]: '失败',
}

export enum PaymentChannelType {
  Alipay = "Alipay",
  WeChat = "WeChat",
  Stripe = "Stripe",
  GiftCode = "GiftCode",
  InviteCode = "InviteCode",
  ActivityCredit = "Event Gift",
}

export const PaymentChannelTypeTextMap: Record<PaymentChannelType, string> = {
  [PaymentChannelType.Alipay]: '支付宝',
  [PaymentChannelType.WeChat]: '微信',
  [PaymentChannelType.Stripe]: 'Stripe',
  [PaymentChannelType.GiftCode]: '礼品码',
  [PaymentChannelType.InviteCode]: '邀请码',
  [PaymentChannelType.ActivityCredit]: '活动赠送',
}

export enum BillingType {
  Refund = "Refund", // 退款
  Withdraw = "Withdraw",
}

export const BillingTypeTextMap: Record<BillingType, string> = {
  [BillingType.Refund]: '退款',
  [BillingType.Withdraw]: '提现',
}

export enum FluxTaskStatus {
  Processing = "processing",
  Succeeded = "succeeded",
  Failed = "failed",
  Canceled = "canceled",
}

export const FluxTaskStatusTextMap: Record<FluxTaskStatus, string> = {
  [FluxTaskStatus.Processing]: '处理中',
  [FluxTaskStatus.Succeeded]: '成功',
  [FluxTaskStatus.Failed]: '失败',
  [FluxTaskStatus.Canceled]: '已取消',
}

export const locales = [
  'en',
  'zh',
  'tw',
  'fr',
  'ja',
  'ko',
  'de',
  'pt',
  'es',
  'ar',
] as const

export type Locale = (typeof locales)[number]

export const LocalesTextMap: Record<Locale, string> = {
  en: '英语',
  zh: '简体中文',
  tw: '繁体中文',
  fr: '法语',
  ja: '日语',
  ko: '韩语',
  de: '德语',
  pt: '葡萄牙语',
  es: '西班牙语',
  ar: '阿拉伯语',
}
