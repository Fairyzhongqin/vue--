import Cookies from 'js-cookie'

export function getToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setToken(TokenKey, token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
  return Cookies.remove(TokenKey)
}

export function savePsw(username, password) {
  return Cookies.set(`${username}_PSW`, password, { expires: 7, path: '' })
}

export function getPsw(username) {
  return Cookies.get(`${username}_PSW`)
}

export function delPsw(username) {
  return Cookies.remove(`${username}_PSW`, { path: '' })
}