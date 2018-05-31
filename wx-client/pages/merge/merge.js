
Page({
  data: {
    imgSrc: null,
    name: '',
    price: '',
    bounceImg: 'http://lc-rnprdxci.cn-n1.lcfile.com/95da3efd26f3c8fdd39c.jpg'
  },
  onReady: function () {
    this.Modal = this.selectComponent("#modal");
  },
  onLoad: function () {
    wx.showLoading({
      title: '照片生成中...',
    })
    const imgSrc = wx.getStorageSync('mergeImage')
    const name = wx.getStorageSync('name')
    const price = wx.getStorageSync('price')
    this.setData({
      imgSrc: imgSrc,
      name: name,
      price: price
    })
    wx.hideLoading()
  },
  onShareAppMessage (res) {
    return {
      title: `与我合体的球星照片是：${this.data.name}，试试你的呢？`,
      path: 'pages/index/index'
    }
  },
  bindBackTap () {
    wx.navigateBack()
  },
  bindBounceTap () {
    this.Modal.showModal()
  },
  previewImage () {
    wx.previewImage({
      urls: [this.data.bounceImg]
    })
  }
})