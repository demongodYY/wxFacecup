
Page({
  data: {
    imgSrc: null,
    name: '',
    price: ''
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
  bindBackTap () {
    wx.navigateBack()
  }
})