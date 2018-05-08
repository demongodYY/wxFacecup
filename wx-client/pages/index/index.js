//index.js
//获取应用实例
Page({
  data: {
    imgSrc: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        if (res.tempFiles[0].size > 1048576) {
          wx.showToast({
            title: '您上传的图片太大啦，请换一张试试...',
            icon: 'none'
          })
          return
        }
        wx.showLoading({ 
          title: '疯狂合体中...',
          mask: true 
        })
        wx.uploadFile({
          url: 'https://facecup.leanapp.cn/images',
          filePath: res.tempFilePaths[0],
          name: 'userImage',
          success: (imgRes) => {
            if (imgRes.statusCode !== 200) {
              wx.showToast({
                title: '服务器出错啦！请稍后重试...',
                icon: 'none'
              })
              return 
            } else if (imgRes.data === 'server error') {
              wx.showToast({
                title: '未能识别到人脸，请重试...',
                icon: 'none',
                duration: 3000
              })
              return 
            } else {
              const resultData = JSON.parse(imgRes.data)
              console.log('result size: ' + resultData.img.length)
              if (resultData.img.length < 1048576) {
                wx.setStorageSync('mergeImage', `data:image/png;base64,${resultData.img}`)
                wx.setStorageSync('name', resultData.name)
                wx.setStorageSync('price', resultData.price)
                wx.navigateTo({
                  url: '/pages/merge/merge',
                })
              } else {
                wx.showToast({
                  title: '未知错误，请换一张图片试试...',
                  icon: 'none',
                  duration: 3000
                })
                return 
              }
            }
            wx.hideLoading()
          },
          fail: (err) => {
            wx.showToast({
              title: '网络错误，请稍后重试...',
              icon: 'none',
              duration: 3000
            })
            console.log(err)
            setTimeout(() => {
              wx.hideLoading()
            }, 2000)
          }
        })
      }
    })
  }
})
