import axios from 'axios'
import originJSONP from 'jsonp'
// 734da7a2040d7a8a0d8e602f323ea52d 用户 ceshi2
// 30be7b6182f093964a403fd365a362d2 用户 线上
export const usergroups = '/priapi1/get_puber_contacters'
export const baseUrl = 'http://www.weicaixun.com'
let commonParams = {'token': '30be7b6182f093964a403fd365a362d2', 'myclient': 'iphone', 'myversion': '4.9'}

export function get (url, params) {
  var requestUrl = baseUrl + url
  axios.get(requestUrl, {
    params: commonParams
  }).then((res) => {
    console.log(res.data)
  }).catch((err) => {
    console.log(err)
  })
};
export function jsonp (url, params, options) {
  let paramsURL = parserParams(params)
  let completeUrl = baseUrl + url + paramsURL
  console.log(completeUrl)
  var promise = new Promise((resolve, reject) => {
    originJSONP(completeUrl, options, (err, data) => {
      if (!err) {
        if (data['code'] === 1) {
          resolve(data.data)
        } else {
          reject(data)
        }
      } else {
        reject(err)
      }
    })
  })
  return promise
};

function parserParams (params) {
  let url = ''
  for (let commonKey in commonParams) {
    let value = commonParams[commonKey] !== undefined ? commonParams[commonKey] : null
    url += `&${commonKey}=${encodeURIComponent(value)}`
  }
  for (let key in params) {
    let value = params[key] !== undefined ? params[key] : null
    url += `&${key}=${encodeURIComponent(value)}`
  }
  let parseUrl = url.substring(1)
  return '?' + parseUrl
}
