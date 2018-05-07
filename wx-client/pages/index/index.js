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
        wx.showLoading({ title: '疯狂合体中...' })
        wx.uploadFile({
          url: 'https://facecup.leanapp.cn/images',
          filePath: res.tempFilePaths[0],
          name: 'userImage',
          success: (imgRes) => {
            if (imgRes.statusCode !== 200) {
              wx.showToast({
                title: '服务器出错啦！',
                icon: 'none'
              })
              return 
            } else if (imgRes.data === 'server error') {
              wx.showToast({
                title: '未能识别到人脸，请重试...',
                icon: 'none'
              })
              return 
            } else {
              const resultData = JSON.parse(imgRes.data)
              wx.setStorageSync('mergeImage', `data:image/png;base64,${resultData.img}`)
              wx.setStorageSync('name', resultData.name)
              wx.setStorageSync('price', resultData.price)
              wx.navigateTo({
                url: '/pages/merge/merge',
              })
            }
          },
          fail: (err) => {
            wx.showToast({
              title: '网络错误，请稍后重试...',
            })
            console.log(err)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    })
  }
})
