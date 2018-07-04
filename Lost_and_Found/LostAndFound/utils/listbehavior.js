var Type = require('./util.js')
module.exports = Behavior({
  behaviors: [],
  properties: {
    item: {
      type: Object,
      value: null,
      observer: function (newVal, oldVal) {
        const ty = parseInt(newVal.type_num)
        newVal.type_num = Type.TYPE[ty];
        this.setData({ item: newVal })
      }
    }
  },
  data: {
    data: {}
  },
  attached: function () { },
  methods: {
    myBehaviorMethod: function () { }
  }
})