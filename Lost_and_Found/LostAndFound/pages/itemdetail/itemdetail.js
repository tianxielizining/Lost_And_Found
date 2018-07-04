// pages/itemdetail/itemdetail.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '/images/addImg.png',
    isMine: false,
    contentFound: {
      date: '拾到时间',
      location: '拾到地点',
      pickLocation: '领取地点',
      tel: '联系方式',
      btn: '联系对方',
      note: '物品描述'
    },
    contentLost: {
      date: '丢失时间',
      location: '丢失地点',
      tel: '联系方式',
      btn: '通知他',
      note: '物品描述'
    },
    content: {},
    isLostItem: 0,
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let lof = options.type
    console.log(options.item)
    let item = JSON.parse(options.item);
    if (lof === 'lost') {
      item.date = item.lost_date;
      this.setData({
        isLostItem: 1,
        content: this.data.contentLost
      })
    } else {
      item.date = item.found_date;
      this.setData({
        isLostItem: 0,
        content: this.data.contentFound
      })
    }

    console.log(item)
    this.setData({
      item: item
    })
    console.log(item)
    console.log(item.user_id)
    console.log(app.globalData.openid)
    if (item.user_id === app.globalData.openid) {
      console.log(';;;;;;;;')
      this.setData({
        isMine: true
      })
    }else{
      console.log(';;kkkkk;;;;;;')
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  preView(e) {
    const img = this.data.item.image
    wx.previewImage({
      current: img, //当前图片地址
      urls: [img], //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onTap(e) {
    //不是合法手机号
    if (!util.isPoneAvailable(this.data.item.tel)) {
      wx.showModal({
        title: '提示',
        content: '对方手机号格式异常',
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.item.tel + '',
    })
  }
})