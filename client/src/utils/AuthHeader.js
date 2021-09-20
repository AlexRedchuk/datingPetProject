import datingBase from '../APIs/datingBase'

export function setAuthHeader(token) {
  datingBase.defaults.headers['Authorization'] = token ? 'Bearer ' + token : ''
}
