export const APP_LANGUAGE = 'zh'
export const ONE_DAY_IN_SECONDS = 60 * 60 * 24 // 1 day in seconds
export const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7 // 7 days in seconds
export const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 31 // 31 days in seconds
export const FOREVER_IN_SECONDS = 60 * 60 * 24 * 365 * 1000 // 1000 years in seconds
export const TASK_LOCK_INIT_TIME = new Date(0) // 1970-01-01 00:00:00
export const MILLISECONDS_PER_DAY = 60 * 60 * 24 * 1000 // 1 day in milliseconds
export const MILLISECONDS_PER_MINUTE = 60 * 1000 // 1 minute in milliseconds

// Resource units
export const CPU_UNIT = 1000
export const MB = 1024 * 1024
export const GB = 1024 * MB

// auth constants
export const PHONE_AUTH_PROVIDER_NAME = 'phone'
export const PASSWORD_AUTH_PROVIDER_NAME = 'user-password'
export const EMAIL_AUTH_PROVIDER_NAME = 'email'
export const GITHUB_AUTH_PROVIDER_NAME = 'github'

// Sms constants
export const ALISMS_KEY = 'alisms'
export const LIMIT_CODE_FREQUENCY = 60 * 1000 // 60 seconds (in milliseconds)
export const LIMIT_CODE_PER_IP_PER_DAY = 10 // 10 times
export const CODE_VALIDITY = 10 * 60 * 1000 // 10 minutes (in milliseconds)

export const locales = [
  "en",
  "zh",
  "tw",
  "fr",
  "ja",
  "ko",
  "de",
  "pt",
  "es",
  "ar",
] as const;

export type Locale = (typeof locales)[number];

export const UserOmitProps = [
  'password',
  'phone',
  'salt',
  'hashedPassword',
  'deleted_at',
]