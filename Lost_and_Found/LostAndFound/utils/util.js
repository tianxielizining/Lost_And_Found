function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const TYPE = [
  '衣服',
  '手表',
  '雨伞',
  '书',
  '文具',
  '钱包',
  '电子产品',
  '卡',
  '钥匙',
  '运动器材',
  '其他'
]

function isPoneAvailable(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}  
function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
module.exports = {
  formatTime: formatTime,
  TYPE: TYPE,
  isPoneAvailable: isPoneAvailable,
  PrefixInteger: PrefixInteger
}