export enum VerifyCodeType {
  Signin = 'Signin',
  Signup = 'Signup',
  ResetPassword = 'ResetPassword',
  Bind = 'Bind',
  Unbind = 'Unbind',
  Change = 'Change',
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
