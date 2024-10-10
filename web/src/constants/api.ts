import pickEnv from 'penv.macro'

export const URL_API_BASE = pickEnv({
  production: 'https://api-moon.fluxaipro.art',
  staging: 'https://api-moon.fluxaipro.art',
  development: 'http://localhost:3000',
})
console.log('URL_API_BASE-->', URL_API_BASE)
export default {
  URL_API_BASE,
}
