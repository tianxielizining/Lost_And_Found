//index.js
//获取应用实例
var app = getApp()

const Http = require('../../utils/http.js');
const util = require('../../utils/util.js')
Page({
  data: {
    open: false,
    scale: 18,
    latitude: 0,
    longitude: 0,
    markers: [],
    userInfo: null,
    map: false,
    animation: {},
    opacity: 1,
    animDetail: {},
    detailOpen: false,
    detail: {},
    lostsData: [],
    foundsData: [],
    isViewing: false, //是否正在查看详情 用户预览图片的时候 在返回时判断是否需要收回详情弹框
    showModal: false,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalLocation: false
  },
  // 页面加载
  async onLoad(options) {

    if (wx.canIUse('button.open-type.getUserInfo'))
      this.setMapController();

  },
  // 页面显示
  onShow() {
    if (this.data.isViewing) {
      this.setData({
        isViewing: false
      })
      return
    }
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("lafMap");
    this.movetoPosition();
    this.getLocation();
    this.onCheckUserInfo();
  },
  // 地图控件点击事件
  controltap(e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1:
        this.movetoPosition();
        break;
      case 2:

        if (app.globalData.openid === '') {
          wx.showModal({
            title: '权限提示',
            content: '未能获取用户信息，请进入设置界面授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          return;
        }
        wx.navigateTo({
          url: '../postlost/postlost',
        })
        break;
      case 3:
        if (app.globalData.openid === '') {
          wx.showModal({
            title: '权限提示',
            content: '未能获取用户信息，请进入设置界面授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')

              }
            }
          })
          return;
        }
        wx.navigateTo({
          url: '../postfound/postfound',
        })
        break;
      case 4:
        //list
        this.onTapSlide()
        break;
      case 5:
        break;
      case 6:
        if (app.globalData.openid === '') {
          wx.showModal({
            title: '权限提示',
            content: '未能获取用户信息，请进入设置界面授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')

              }
            }
          })
          return;
        }
        wx.navigateTo({
          url: '../mine/mine',
        })
        break;
      default:
        break;
    }
  },
  // 地图视野改变事件
  bindregionchange(e) {
    if (this.data.isViewing) {
      this.setData({
        isViewing: false
      })
      return
    }

    // 拖动地图，获取位置
    if (e.type == "begin") {
      //预览归来 不收回弹框
      if (this.data.isViewing) {
        this.setData({
          isViewing: false
        })
      } else { //不是预览 弹框收回
        this.onDetail(0, true);
      }
      //如果侧边栏打开状态 那么滑动地图就会收起侧边栏
      if (this.data.open) {
        this.onTapSlide()
      }
    } else if (e.type == "end") { }
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap(e) {
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    console.log(markerId)
    console.log(currMaker)
    console.log(_markers)
    if (currMaker.detail.date.label === '捡到时间') {
      this.onDetail(-360);
    } else {
      this.onDetail(-320);
    }
    this.setData({
      detail: currMaker.detail,
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  setMapController() {
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: 10,
              top: res.windowHeight - 106,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/forlost.png',
            position: {
              left: res.windowWidth / 2 - 150,
              top: res.windowHeight - 55,
              width: 150,
              height: 45
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/forfound.png',
            position: {
              left: res.windowWidth / 2,
              top: res.windowHeight - 55,
              width: 150,
              height: 45
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/list.png',
            position: {
              left: 10,
              top: 61,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 5,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 20,
              height: 30
            },
            clickable: true
          },
          {
            id: 6,
            iconPath: '/images/Mine.png',
            position: {
              left: 10,
              top: 10,
              width: 50,
              height: 50
            },
            clickable: true
          }
          ]
        })
      }
    });
  },
  async setMarkers(res, markers, isLost = false) {
    for (let i = 0; i < res.length; i++) {
      res[i]['id'] = markers.length;
      console.log(res[i]);
      console.log(markers.length)
      console.log(res[i]['id'] )
      let latitude = parseFloat(res[i]['altitude'] + '');
      let longitude = parseFloat(res[i]['longitude'] + '');
      let icon = '../' + res[i]['iconPath'];
      let location = res[i]['location'];
      let Type = util.TYPE[parseInt(res[i]['type_num'])];

      let detail = {
        'good': {
          'label': '物品',
          'value': Type
        },
        'location': {
          label: '地点',
          value: location
        },
        'image': res[i]['image'],
        'tel': res[i]['tel'],
        'note': res[i]['note']
      };
      if (isLost) {
        detail['date'] = {
          label: '丢失时间',
          value: res[i]['lost_date']
        }
      } else {
        detail['date'] = {
          label: '捡到时间',
          value: res[i]['found_date']
        }
        detail['pick_location'] = {
          label: '领取地点',
          value: res[i]['pick_location']
        }
      }
      if (latitude > 90 || latitude < -90) {
        continue;
      }
      let marker = {
        iconPath: icon,
        id: markers.length,
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 30,
        detail: detail
      }
      markers.push(marker)
    }
    return markers;
  },
  getLocation() {
    let that = this;
    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: async (res) => {
        console.log(res)
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          showModalLocation: false
        })
        that.getMarkers(res.latitude, res.longitude);
      },
      fail: function (res) {
        that.setData({
          showModalLocation: true,
        })
      }
    });
  },
  async getMarkers(latitude, longitude) {
    let markers = new Array()
    let res = await Http.getFounds(null, latitude, longitude);
    this.setMarkers(res, markers);
    let res2 = await Http.getLosts(null, latitude, longitude);
    this.setMarkers(res2, markers, -1);
    console.log(markers)
    this.setData({
      markers: markers,
      map: true,
      foundsData: res,
      lostsData: res2
    })
  },
  onTapSlide() {
    let that = this
    if (this.data.open) {
      let animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease-in-out'
      })
      animation.translateX(0).step();
      this.setData({
        animation: animation.export(),
        open: false,
        opacity: 1
      })
    } else {
      let animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease-in-out'
      })
      animation.translateX(200).step();
      this.setData({
        animation: animation.export(),
        open: true

      })
      setTimeout(() => {
        that.setData({
          opacity: 0.9
        })
      }, 100)
    }
  },
  onDetail(distance, isHide = false) {
    //已经展开 判断是要更新数据还是直接隐藏
    if (this.data.detailOpen) {
      let animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease-in-out'
      })

      //直接隐藏
      if (isHide) {
        animation.translateY(0).step();
        this.setData({
          animDetail: animation.export(),
          detailOpen: false
        })
      } else { //更新数据 不更改open参数
        animation.translateY(0).step().translateY(distance).step();
        this.setData({
          animDetail: animation.export()
        })
      }

    } else {
      //当前处于隐藏状态
      let animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease-in-out'
      })

      //判断是继续隐藏 还是打开
      if (!isHide) {
        animation.translateY(distance).step();
        this.setData({
          animDetail: animation.export(),
          detailOpen: true
        })
      }
    }
  },
  onCall(e) {
    const tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
    this.setData({
      isViewing: true
    })
  },
  onPreview(e) {
    let that = this
    // 预览图片
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url],
      success: function (res) {
        that.setData({
          isViewing: true
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onListTap(index) {
    index = parseInt(index.detail + '')
    console.log(index)
    if (index === 1) { //lost
      wx.navigateTo({
        url: '/pages/aroundlist/aroundlist?list=' + JSON.stringify(this.data.lostsData) + '&isLost=1',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (index === 2) { //found
      wx.navigateTo({
        url: '/pages/aroundlist/aroundlist?list=' + JSON.stringify(this.data.foundsData) + '&isLost=0',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  preventTouchMove: function () {

  },
  go: function () {
    this.setData({
      showModal: false
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onCheckUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        showModal: false
      })
    } else {
      this.setData({
        hasUserInfo: false,
        showModal: true
      })
    }
  }
})