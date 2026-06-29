Page({
  data: {
    wechatId: '',
    serviceTime: '',
    guideText: '',
    qrCode: ''
  },

  onLoad() {
    const saved = wx.getStorageSync('contactAdminInfo') || {}
    this.setData({
      wechatId: saved.wechatId || '',
      serviceTime: saved.serviceTime || '工作日 9:00-18:00，节假日可能延迟回复',
      guideText: saved.guideText || '微信搜索客服号或扫描下方二维码，添加时备注「Petit Aura」即可获得专属服务。',
      qrCode: saved.qrCode || ''
    })
  },

  onWechatIdInput(e) {
    this.setData({ wechatId: e.detail.value })
  },

  onServiceTimeInput(e) {
    this.setData({ serviceTime: e.detail.value })
  },

  onGuideTextInput(e) {
    this.setData({ guideText: e.detail.value })
  },

  onChooseQR() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath
        wx.showLoading({ title: '正在保存...' })
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => {
            wx.hideLoading()
            this.setData({ qrCode: saveRes.savedFilePath })
            wx.showToast({ title: '图片已上传', icon: 'success' })
          },
          fail: () => {
            wx.hideLoading()
            // saveFile 失败时直接用临时路径（开发者工具兼容）
            this.setData({ qrCode: tempPath })
            wx.showToast({ title: '图片已选择', icon: 'success' })
          }
        })
      }
    })
  },

  onSave() {
    const { wechatId, serviceTime, guideText, qrCode } = this.data
    if (!wechatId) {
      wx.showToast({ title: '请填写客服微信号', icon: 'none' })
      return
    }
    wx.setStorageSync('contactAdminInfo', { wechatId, serviceTime, guideText, qrCode })
    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1200)
  },

  goBack() {
    wx.navigateBack()
  }
})
