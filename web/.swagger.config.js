module.exports = [
  {
    swaggerPath: 'http://localhost:3000/docs/json',
    typingFileName: 'api-auto.d.ts',

    outDir: 'src/apis/v1',
    request: "import request from '@/utils/ajax';",
    fileNameRule: function (url) {
      return url.split('/')[2]
    },
  },
]
