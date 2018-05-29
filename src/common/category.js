export function replcestr (completestr, rangelocation, oldStr, newStr) {
  let firstcom = completestr.substring(0, rangelocation)
  let lastcom = completestr.substring(rangelocation, completestr.length)
  return firstcom + lastcom.replace(oldStr, newStr)
}

// export function compress (img) {
//   var initSize = img.src.length
//   var width = img.width
//   var height = img.height
//   // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
//   var ratio
//   if ((ratio = width * height / 4000000) > 1) {
//     ratio = Math.sqrt(ratio)
//     width /= ratio
//     height /= ratio
//   } else {
//     ratio = 1
//   }
//   canvas.width = width
//   canvas.height = height
//   // 铺底色
//   ctx.fillStyle = "#fff"
//   ctx.fillRect(0, 0, canvas.width, canvas.height)
//   // 如果图片像素大于100万则使用瓦片绘制
//   var count
//   if ((count = width * height / 1000000) > 1) {
//     count = ~~(Math.sqrt(count) + 1)
//     // 计算每块瓦片的宽和高
//     var nw = ~~(width / count)
//     var nh = ~~(height / count)
//     tCanvas.width = nw
//     tCanvas.height = nh
//     for (var i = 0; i < count; i++) {
//       for (var j = 0; j < count; j++) {
//         tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
//         ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
//       }
//     }
//   } else {
//     ctx.drawImage(img, 0, 0, width, height)
//   }
//   // 进行最小压缩
//   var ndata = canvas.toDataURL('image/jpeg', 0.1)
//   tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
//   return ndata
// }

export function convertImgToBase64 (src, callback, outputFormat) {
  var canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  let img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function () {
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL(outputFormat || 'image/png')
    callback.call(dataURL)
    canvas = null
    dataURL = null
  }
  img.src = src
}

export function currentTime (isday, timestamp) {
  var day = '今天 '
  var date
  if (timestamp) {
    date = new Date(timestamp)
    let beforedate = date.getDate()
    let beforemonth = date.getMonth() + 1
    let now = new Date()
    let today = now.getDate()
    var diff = today - beforedate
    if (diff === 0) {
      day = '今天 '
    } else if (diff === 1) {
      day = '昨天'
    } else {
      if (beforemonth >= 1 && beforemonth <= 9) {
        beforemonth = '0' + beforemonth
      }
      if (beforedate >= 0 && beforedate <= 9) {
        beforedate = '0' + beforedate
      }
      day = beforemonth + '/' + beforedate + ' '
    }
  } else {
    date = new Date()
  }
  var seperator1 = '/'
  var seperator2 = ':'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var hour = date.getHours()
  var min = date.getMinutes()
  var second = date.getSeconds()

  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hour >= 0 && hour <= 9) {
    hour = '0' + hour
  }
  if (min >= 0 && min <= 9) {
    min = '0' + min
  }
  if (second >= 0 && second <= 9) {
    second = '0' + second
  }
  var currentdate
  if (isday === 0) {
    currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + min + seperator2 + second
  } else {
    currentdate = day + hour + seperator2 + min
  }
  return currentdate
}
