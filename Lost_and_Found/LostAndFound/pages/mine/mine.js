const Http = require('../../utils/http.js');
const util = require('../../utils/util.js');
var app = getApp()
// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLost();
    this.getFound();

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
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: app.globalData.userInfo
    })
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  OnSelectedFound(e) {
    let index = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '../itemdetail/itemdetail?item=' + JSON.stringify(this.data.origFound[index]) + '&type=found',
    })
  },
  OnSelectedLost(e) {
    let index = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../itemdetail/itemdetail?item=' + JSON.stringify(this.data.origLost[index]) + '&type=lost',
    })
  },
  async getLost() {
    let losts = new Array()
    let res = await Http.getLosts(app.globalData.openid);

    for (let i = 0; i < res.length; i++) {
      let icon = '../' + res[i]['iconPath'];
      let TYPE = parseInt(res[i]['type_num'] + '');
      let location = res[i]['location'];
      let lost = {
        icon: icon,
        label: util.TYPE[TYPE],
        value: location
      }
      losts.push(lost)
    }

    this.setData({
      losts: losts,
      lostSum: losts.length,
      origLost: res
    })

  },
  async getFound() {
    let res = await Http.getFounds(app.globalData.openid);
    console.log(res)
    let founds = new Array()

    for (let i = 0; i < res.length; i++) {
      let icon = '../' + res[i]['iconPath'];
      let TYPE = parseInt(res[i]['type_num'] + '');
      let location = res[i]['location'];

      let found = {
        icon: icon,
        label: util.TYPE[TYPE],
        value: location
      }
      founds.push(found)
    }

    this.setData({
      founds: founds,
      foundSum: founds.length,
      origFound: res
    })
  },
  toMyLost(e) {
    wx.navigateTo({
      url: '/pages/aroundlist/aroundlist?list=' + JSON.stringify(this.data.origLost) + '&isLost=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toMyFound(e) {
    wx.navigateTo({
      url: '/pages/aroundlist/aroundlist?list=' + JSON.stringify(this.data.origFound) + '&isLost=0',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  }
})