// 标准格式转换date对象的日期格式
export function dateFormat(obj, fmt) {
  let result = null
  if (typeof obj === 'object' && obj !== null) {
    const demo = {
      'y+': obj.getFullYear(),
      'm+': obj.getMonth() + 1,
      'd+': obj.getDate(),
      'H+': obj.getHours(),
      'M+': obj.getMinutes(),
      's+': obj.getSeconds()
    }
    for (const k in demo) {
      const pattern = new RegExp('(' + k + ')')
      if (pattern.test(fmt)) {
        if (demo[k] < 10) {
          demo[k] = '0' + demo[k]
        }
        fmt = fmt.replace(RegExp.$1, demo[k])
      }
    }
    result = fmt
  } else {
    result = obj
  }
  return result
}
/*
 * 将时间戳或者中国标准时间处理成 2018-05-01 00:00:00  这种格式
 * @param {时间戳或者中国标准时间} timestamp
 * @param {一状态 } state   ture要时分秒  false不要时分秒
 */
export function timestampToTime(timestamp, state) {
  let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-' // 年
  let M = (date.getMonth() + 1).toString().padStart(2, '0') + '-'
  let D =
    date
      .getDate()
      .toString()
      .padStart(2, '0') + ' '
  let h =
    date
      .getHours()
      .toString()
      .padStart(2, '0') + ':'
  let m =
    date
      .getMinutes()
      .toString()
      .padStart(2, '0') + ':'
  let s = date
    .getSeconds()
    .toString()
    .padStart(2, '0')
  return state ? Y + M + D + h + m + s : Y + M + D
}

// 日期字符串转为date对象; 只支持 ‘yyyy-mm-dd HH:MM:ss’
export function stringToDate(val = String) {
  const list = val.split(' ')
  let result = null
  let reg = list[0].indexOf('-') === -1 ? '/' : '-'
  let temp = list[0].split(reg)
  temp[1] = Number(temp[1]) - 1
  let hours = list[1] ? list[1] : '00:00:00'
  result = new Date(...temp, ...hours.split(':'))
  return result
}

// 将 年月日 时分 转化为 标准日期 格式以便回显 - yangxiaoying
export function handleDateRef(dateStr) {
  if (dateStr) {
    let dateArr = dateStr.split(/[^\d]/) // ^ 匹配数字以外的字符 其实就是以\来匹配分割成数组
    dateArr.filter(Boolean)
    dateArr[1] = Number(dateArr[1]) - 1 // 标准月份减一
    return new Date(...dateArr)
  } else {
    return dateStr
  }
}

// 回显文书表格数据 - yangxiaoying
export function reflectEntity(entityArr, fieldArr) {
  let dataInfo = [],
    re = /\d/g
  entityArr.map(item => {
    let arr = [...item.tagName.matchAll(re)]
    let rowIndex = Number(arr[0]) - 1,
      colIndex = Number(arr[1]) - 1,
      field = fieldArr[colIndex] //行， 列， 第几列对应的字段名
    if (!dataInfo[rowIndex]) dataInfo[rowIndex] = {} // dataInfo[rowIndex] 为 undefined
    if (item.tagContent && item.tagContent.replace(/\d/g, '').slice(0, 3) === '年月日') {
      // 为 年月日格式 时
      dataInfo[rowIndex][field] = handleDateRef(item.tagContent)
    } else {
      dataInfo[rowIndex][field] = item.tagContent
    }
  })
  return dataInfo
}

// 生成文书参数处理
export function getWritParams(obj = {}) {
  const result = []
  for (const k in obj) {
    if (obj[k] instanceof Array) {
      obj[k].forEach(item => {
        result.push({
          tagName: k,
          tagContent: item
        })
      })
    } else {
      result.push({
        tagContent: obj[k],
        tagName: k
      })
    }
  }
  return result
}

// 防抖
export function debounce(func, wait = 1000, immediate = false) {
  let timer, context, args
  // 延迟执行函数
  const later = () => 
    setTimeout(() => {
      if (!immediate) {
        func.apply(context, args)
        context = args = null
      }
      timer = null // 延迟函数执行完毕，清空缓存的定时器序号
    }, wait)

  // 每次实际调用的函数
  return function(...params) {
    if (!timer) {
      timer = later()
      if (immediate) {
        args = params
        func.apply(context, args)
      } else {
        context = this
        args = params
      }
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t) => {
  let last
  let timer
  let interval = t || 500
  return function() {
    let args = arguments
    let now = new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(this, args)
      }, interval)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}

// 获取当前日期 toSeconds:精确到秒
export function getNowFormatDate(toSeconds) {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  if (toSeconds) {
    currentdate += ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
  }
  return currentdate
}

// 钱转大写
export function toSuperMoney(n) {
  if (n + '' === '0') return '零'
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return ''
  var unit = '京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分',
    str = ''
  n += '00'
  var p = n.indexOf('.')
  if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
  unit = unit.substr(unit.length - n.length)
  for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
  return str
    .replace(/零(仟|佰|拾|角)/g, '零')
    .replace(/(零)+/g, '零')
    .replace(/零(兆|万|亿|元)/g, '$1')
    .replace(/(兆|亿)万/g, '$1')
    .replace(/(京|兆)亿/g, '$1')
    .replace(/(京)兆/g, '$1')
    .replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2零$3仟')
    .replace(/^元零?|零分/g, '')
    .replace(/(元|角)$/g, '$1')
}

// 金钱大写转数字
export function toCommonMoney(n) {
  if (typeof n !== 'string' || n.length === 0) return
  let example = [
    ['零', 0],
    ['壹', 1],
    ['贰', 2],
    ['叁', 3],
    ['肆', 4],
    ['伍', 5],
    ['陆', 6],
    ['柒', 7],
    ['捌', 8],
    ['玖', 9]
  ]
  let numMap = new Map(example)
  let handleNum = function(str) {
    let first = str.indexOf('仟') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('仟') - 1)) * 1000
    let second = str.indexOf('佰') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('佰') - 1)) * 100
    let third = str.indexOf('拾') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('拾') - 1)) * 10
    let fourth = str.indexOf('元') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('元') - 1)) ? numMap.get(str.charAt(str.indexOf('元') - 1)) : 0
    let fifth = str.indexOf('角') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('角') - 1)) * 0.1
    let sixth = str.indexOf('分') < 0 ? 0 : numMap.get(str.charAt(str.indexOf('分') - 1)) * 0.01
    return first + second + third + fourth + fifth + sixth
  }
  let arr = n.split('万').reverse()
  let num = 0
  arr.forEach((item, index) => {
    if (item.indexOf('罚款人民币') !== -1) {
      item = item.slice(item.indexOf('罚款人民币') + 5)
      if (item.length === 1) {
        num += numMap.get(item) * Math.pow(10000, index)
      } else {
        num += numMap.get(item.slice(-1)) * Math.pow(10000, index)
        num += handleNum(item) * Math.pow(10000, index)
      }
    } else {
      num += handleNum(item) * Math.pow(10000, index)
    }
  })
  return num.toString()
}

// 日期转大写 - yangxiaoying
export function toSuperDate(date, fmt) {
  let unitMapper = null,
    dateStr = '',
    unit = []
  let month = '',
    day = ''
  unit = [
    ['0', '〇'],
    ['1', '一'],
    ['2', '二'],
    ['3', '三'],
    ['4', '四'],
    ['5', '五'],
    ['6', '六'],
    ['7', '七'],
    ['8', '八'],
    ['9', '九'],
    ['a', '十']
  ]
  unitMapper = new Map(unit)
  month = date.getMonth() + 1
  day = date.getDate()
  dateStr = dateFormat(date, fmt)
  if (dateStr) {
    // 加 ‘十’ 字
    if (month > 10) {
      dateStr = dateStr.replace(/(?<=\u5E74)1/, 'a')
    } else if (month === 10) {
      dateStr = dateStr.replace(/(?<=\u5E74)10/, 'a')
    } else {
      dateStr = dateStr.replace(/(?<=\u5E74)0/, '')
    }
    if (day < 10) {
      dateStr = dateStr.replace(/(?<=\u6708)0/, '')
    } else if (day === 10) {
      dateStr = dateStr.replace(/(?<=\u6708)10/, 'a')
    } else if (day === 20) {
      dateStr = dateStr.replace(/(?<=\u6708)20/, '2a')
    } else if (day === 30) {
      dateStr = dateStr.replace(/(?<=\u6708)30/, '3a')
    } else {
      let dayStr = 'a' + dateStr.slice(-2)
      dateStr = dateStr.slice(0, -2) + dayStr
    }
    for (let i of dateStr) {
      if ([...unitMapper.keys()].indexOf(i) >= 0) {
        dateStr = dateStr.replace(i, unitMapper.get(i))
      }
    }
  }
  return dateStr
}

// 判断两个数是否能除尽
export function judgeDivisor(m, n) {
  var num = {}
  var i = 0
  var x = parseInt(m / n)
  m = m % n
  var result = ''
  while (m != 0 && !(m in num)) {
    num[m] = i++
    result += parseInt((m * 10) / n)
    m = (m * 10) % n
  }
  return m == 0
}

// toFixed 修复
export function toFixed(num, s) {
  var times = Math.pow(10, s)
  var des = num * times + 0.5
  des = parseInt(des, 10) / times
  return des + ''
}

/*
处理下载的报表
* @param {file}  文件对象
* @param {filename}  需要保存的文件对象名称
* 保存的文件格式为：filename-年月日.xlsx
*/
export function operateFile(file, filename) {
  let blobObject = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  let time = new Date()
  let fileName =
    filename +
    ' ' +
    time.getFullYear() +
    '-' +
    (time.getMonth() + 1) +
    '-' +
    time.getDate() +
    ' ' +
    time.getHours() +
    '.' +
    time.getMinutes() +
    '.' +
    time.getSeconds() +
    '.xls'
  // 是IE浏览器
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    window.navigator.msSaveOrOpenBlob(blobObject, fileName)
  } else {
    // 火狐谷歌都兼容
    // 模板中要有一个预定义好的a标签
    let link = document.getElementById('a_id')
    link.href = URL.createObjectURL(blobObject)
    link.download = fileName
    link.click()
  }
}
export default {
  operateFile: operateFile
}

//获取 el 表单验证错误信息的第一条
export function getFirstErrMsg(obj) {
  for (let key in obj) {
    return obj[key][0].message
  }
}

// 根据身份证号计算年龄
export function GetAge(identityCard) {
  var len = (identityCard + '').length
  if (len == 0) {
    return ''
  } else {
    if (len != 15 && len != 18) {
      //身份证号码只能为15位或18位其它不合法
      return ''
    }
  }
  var strBirthday = ''
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和码性别代
    strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
  }
  if (len == 15) {
    strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday)
  var nowDateTime = new Date()
  var age = nowDateTime.getFullYear() - birthDate.getFullYear()
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
// 根据身份证判断性别 true 男
export function GetSex(identityCard) {
  return parseInt(identityCard.substr(16, 1)) % 2 == 1
}
// GetBirthday
export function GetBirthday(identityCard) {
  // return parseInt()
  return new Date(`${identityCard.substring(6, 10)}-${identityCard.substring(10, 12)}-${identityCard.substring(12, 14)}`)
}
//数字改变（加万位）
export function figureChange(param) {
  if (typeof param !== 'string') return
  let num = param / 10000
  let result = Number(num).toFixed(2)
  return result
}
// 分两行
export function splitToLine(str) {
  let result = ''
  if (typeof str !== 'string') return
  if (str.includes(';')) {
    result = str.replace(/;/g, '</br>')
  } else {
    result = str
  }
  return result
}
//是否包含数组,是返回true,不是返回false a是大的 b是小的 - shiyan
export function isContained(a, b) {
  let result = true
  if (!(a instanceof Array) || !(b instanceof Array)) return false
  if (a.length <= b.length) return (result = false)
  let aStr = a.toString()

  for (let i = 0, len = b.length; i < len; i++) {
    if (aStr.indexOf(b[i]) == -1) {
      result = false
    }
  }
  return result
}

//获取数组重复的元素
export function refrain(arr) {
  let tmp = []
  if (Array.isArray(arr)) {
    arr
      .concat()
      .sort()
      .sort(function(a, b) {
        if (a == b && tmp.indexOf(a) === -1) tmp.push(a)
      })
  }
  return tmp
}

//获取数组重复的元素 根据某种属性value去重
export function refrainWithPro(arr) {
  const res = new Map()
  return arr.filter(a => !res.has(a.value) && res.set(a.value, 1))
}
//获取数组重复的元素 根据某种属性id去重
export function refrainWithProId(arr) {
  const res = new Map()
  return arr.filter(a => !res.has(a.id) && res.set(a.id, 1))
}
