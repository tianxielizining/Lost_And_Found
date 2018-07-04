let hotapp = require('./hotapp.js');
const HOST = "http://39.105.118.89:7777/";

async function getLosts(userId = null, latitude = null, longitude = null) {
  let url = HOST + 'lost/get';

  if (userId !== null) {
    return await httpRequest({
      openid: userId,
      Altitude: 0,
      Longitude: 0
    }, url, 'POST')
  } else {
    return await httpRequest({
      Altitude: parseFloat(latitude+''),
      Longitude: parseFloat(longitude+'')
    }, url, 'POST')
  }
}

async function getFounds(userId = null, latitude = null, longitude = null) {
  let url = HOST + 'found/get';
  if (userId !== null) {
    return await httpRequest({
      openid: userId,
      Altitude: 0,
      Longitude: 0
    }, url, 'POST')
  } else {
    return await httpRequest({
      Altitude: parseFloat(latitude + ''),
      Longitude: parseFloat(longitude + '')
    }, url, 'POST')
  }
}
async function addLost(lost) {
  // @RequestParam(value = "User_id") String User_id,
  // @RequestParam(value = "Longitude") double Longitude,
  // @RequestParam(value = "Altitude") double Altitude,
  // @RequestParam(value = "Lost_date") String Lost_date,
  // @RequestParam(value = "Tel") String Tel,
  // @RequestParam(value = "Type_num") int Type_num,
  // @RequestParam(value = "Image") String Image,
  // @RequestParam(value = "note") String note,
  // @RequestParam(value = "Location") String Location

  let url = HOST + 'lost/insert';
  return await httpRequest(lost, url, 'POST');
}

async function addUser(name, code) {
  // @RequestParam(value = "User_id") String User_id,
  // @RequestParam(value = "name") String name
  let url = HOST + 'user/tryAdd'
  return await httpRequest({
    code: code,
    name: name
  }, url, 'POST');
}

async function addFound(found){
  let url = HOST + 'found/insert';
  return await httpRequest(found, url, 'POST');
}
function uploadImage() {
  return HOST + 'upload/image';
}

function httpRequest(params = {}, url, method = 'GET') {
  return new Promise((resolve, reject) => {
    let TYPE = ''
    if (method === 'GET')
      TYPE = 'application/json';
    else
      TYPE = 'application/x-www-form-urlencoded';
    hotapp.request({
      useProxy: false,
      url: url, // 需要代理请求的网址
      method: method,
      data: params,
      header: {
        'content-type': TYPE
      },
      success: function (res) {
        wx.hideLoading();
        // Loading = false;
        if (res.data) {
          console.log(res.data)
          resolve(res.data)
        } else {
          // console.log('网络异常' + res.errMsg)
        }
      },
      fail: function (res) { }
    })
  })
}

module.exports = {
  getLosts: getLosts,
  getFounds: getFounds,
  addLost: addLost,
  addFound: addFound,
  addUser: addUser,
  uploadImage: uploadImage
}