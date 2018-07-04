// pages/postlost.js
const Http = require('../../utils/http.js');
const util = require('../../utils/util.js')
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var app = getApp()
var qqmapsdk;

const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const multiArray = []

years.push((date.getFullYear() - 1) + '年')
years.push(date.getFullYear() + '年')

var month = date.getMonth()
var day = date.getDate() - 1

var hour = date.getHours()
var minute = date.getMinutes()
var second = date.getSeconds()

for (let i = 1; i <= 12; i++) {
  months.push(util.PrefixInteger(i, 2) + '月')
}

for (let i = 1; i <= 31; i++) {
  days.push(i + '日')
}

for (let i = 0; i < 24; i++) {
  hours.push(util.PrefixInteger(i, 2) + '时')
}
for (let i = 0; i <= 59; i++) {
  minutes.push(util.PrefixInteger(i, 2) + '分')
}
multiArray.push(years)
multiArray.push(months)
multiArray.push(days)
multiArray.push(hours)
multiArray.push(minutes)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    currTime: null,
    location: '',
    TYPE: [],
    foundtype: '',
    longitude: 0,
    latitude: 0,
    index: 0,
    multiArray: multiArray,
    multiIndex: [1, month, day, hour, minute],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTime();
    this.initMap();
    this.getLocation();
    this.setData({
      TYPE: util.TYPE,
      foundtype: util.TYPE[0]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onTap(e) {
    console.log(e.currentTarget.dataset.type)
    switch (e.currentTarget.dataset.type) {
      case 'pickPic':
        this.choiseImage();
        break;
      case 'select':
        break;
      case 'post':

        break;
    }
  },
  getTime() {
    let time = util.formatTime(new Date());
    console.log(time);
    this.setData({
      currTime: time
    })
  },
  onGetLocation(res) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: res.latitude,
        longitude: res.longitude
      },
      success: function (addressRes) {
        var address = addressRes.result.formatted_addresses.recommend;
        console.log(address);
        that.setData({
          location: address
        })
      }
    })
  },
  getLocation() {
    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: async (res) => {
        this.onGetLocation(res);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        //await this.addLost(res);
      }
    });
  },
  initMap() {
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'RSFBZ-HSYKG-XFYQD-ITFOO-ZJ2B6-QZB7O' // 必填
    });
  },
  bindPickerChange(e) {
    let t = this.data.TYPE[e.detail.value];
    this.setData({
      foundtype: t,
      index: e.detail.value
    })
  },
  selectLocation(e) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        console.log(e.currentTarget.id);
        that.setData({
          location: res.name,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },
  choiseImage() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])

        that.setData({
          imgUrl: tempFilePaths
        })

      }
    })
  },
  upLoadImage(lost) {
    let that = this;
    wx.uploadFile({
      url: Http.uploadImage(),
      filePath: this.data.imgUrl[0], //图片路径，如tempFilePaths[0]
      name: 'image',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        userId: 12345678 //附加信息为用户ID
      },
      success: function (res) {
        console.log('-------')
        console.log(res)
        console.log(that.data.imgUrl[0].split('/')[3])
        lost['Image'] = that.data.imgUrl[0].split('/')[3]
        wx.showLoading({
          title: '发布中...',
        })
        that.doInsert(lost);
      },
      fail: function (res) {
        console.log(JSON.parse(res.data)['filename']);
      },
      complete: function (res) { }
    })
  },
  formSubmit(e) {
    let lostTime = e.detail.value.lostTime;
    let contact = e.detail.value.contact;
    if (!util.isPoneAvailable(contact)) {
      wx.showModal({
        title: '警告',
        content: '手机号格式错误',
      })
      return;
    }

    const note = e.detail.value.note
    if (note.length === 0) {
      wx.showModal({
        title: '警告',
        content: '请填写所有项',
      })
      return;
    }

    if (this.data.imgUrl.length === 0) {
      wx.showModal({
        title: '警告',
        content: '请添加物品图片',
      })
      return;
    }

    const lost = {
      Location: this.data.location,
      Longitude: this.data.longitude,
      Altitude: this.data.latitude,
      Lost_date: this.data.currTime,
      Tel: contact,
      Type_num: parseInt(this.data.index + ''),
      User_id: app.globalData.openid,
      note: note,
      state: 0,
    }
    this.upLoadImage(lost)
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
 
    let Y = years[e.detail.value[0]].match(/\d/g).join("")
    let M = months[e.detail.value[1]].match(/\d/g).join("")
    let D = days[e.detail.value[2]].match(/\d/g).join("")
    let h = hours[e.detail.value[3]].match(/\d/g).join("")
    let m = minutes[e.detail.value[4]].match(/\d/g).join("")
    let t = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + '00'
    this.setData({
      currTime: t
    })
  },
  async doInsert(lost){
    await Http.addLost(lost);
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      content: '发布成功',
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})