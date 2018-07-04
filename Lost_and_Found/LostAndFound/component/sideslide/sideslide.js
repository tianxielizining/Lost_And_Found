// component/sideslide/sideslide.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(e) {
      const index = e.currentTarget.id;
      console.log(index);
      switch (index) {
        case '0':
          break;
        case '1':

          break;
        case '2':

          break;
        case '3':
          wx.openSetting({
            success(res) {

            }
          })
          break;
      }
      this.triggerEvent("hideSlide");
      this.triggerEvent("onList", index)
    },
    openSetting() {
      console.log('hhhh')
    }
  }
})
