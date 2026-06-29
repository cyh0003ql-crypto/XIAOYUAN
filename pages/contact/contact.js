Page({
  data: {
    contactInfo: {
      wechatId: '',
      serviceTime: '',
      guideText: '',
      qrCode: ''
    }
  },

  onShow() {
    const saved = wx.getStorageSync('contactAdminInfo') || {}
    this.setData({
      contactInfo: {
        wechatId: saved.wechatId || '',
        serviceTime: saved.serviceTime || '工作日 9:00-18:00，节假日可能延迟回复',
        guideText: saved.guideText || '微信搜索客服号或扫描下方二维码，添加时备注「Petit Aura」即可获得专属服务。',
        qrCode: saved.qrCode || ''
      }
    })
  },

  copyWechat() {
    const { wechatId } = this.data.contactInfo
    if (!wechatId) return
    wx.setClipboardData({
      data: wechatId,
      success() {
        wx.showToast({ title: '已复制微信号', icon: 'success' })
      }
    })
  },

  goBack() {
    wx.navigateBack()
  },

  onShareAppMessage() {
    return {
      title: '联系我们 - Petit Aura校园服务',
      path: '/pages/contact/contact'
    }
  }
})
