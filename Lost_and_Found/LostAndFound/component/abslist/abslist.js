// component/abslist/abslist.js
//抽象节点
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLost: Boolean,
    list: {
      // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: []// 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onDetail(e) {
      const id = e.currentTarget.id
      console.log(this.data.list[id])
      if (this.data.isLost) {
        wx.navigateTo({
          url: '/pages/itemdetail/itemdetail?item=' + JSON.stringify(this.data.list[id]) + '&type=lost',
        })
      } else {
        wx.navigateTo({
          url: '/pages/itemdetail/itemdetail?item=' + JSON.stringify(this.data.list[id]) + '&type=found',
        })
      }
    }
  }
})
