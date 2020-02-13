// 此文件是 kite 的总配置文件
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_NODE_ENV = process.env.NODE_ENV === 'development'

function ProcessCwd(val) {
  return path.resolve(process.cwd(), val)
}

module.exports = {
  version: 0.9,
  theme: {
    'font-family': 'Microsoft YaHei'
  },
  env: NODE_ENV,
  admin: {
    // admin spa
    port: 8083, // 后台调试端口号
    basePath: ProcessCwd('./'),
    srcDir: ProcessCwd('src'),
    outDir: IS_NODE_ENV
      ? ProcessCwd('_admin')
      : path.resolve('../kite/static/_admin'),
    publicPath: IS_NODE_ENV ? './' : '/_admin/',
    proxy: {
      '/api-admin/v1': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      },
      '/default': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      },
      '/upload': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      }
    }
  }
}
