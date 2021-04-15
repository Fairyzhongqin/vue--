import config from './deployConfig'
const env = process.env.NODE_ENV
// const websocket = '//36.154.212.166:8989'
const websocket = env === 'development' ? '//192.168.0.52:8989' : `//${config.ip}:${config.wsPort}`
export default websocket
