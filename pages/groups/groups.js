const DEFAULT_GROUPS = [
  { id: 1, name: '新生交流群', count: 1568, emoji: '🎓', qrPath: '' },
  { id: 2, name: '二手交易群', count: 892,  emoji: '🔄', qrPath: '' },
  { id: 3, name: '兼职信息群', count: 623,  emoji: '💼', qrPath: '' }
]

Page({
  data: {
    groups: [],
    showQrPopup: false,
    activeGroup: null
  },

  onLoad() {
    this._loadData()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this._loadData()
  },

  _loadData() {
    let groups = wx.getStorageSync('campusGroups')
    if (!groups || groups.length === 0) {
      groups = DEFAULT_GROUPS
      wx.setStorageSync('campusGroups', groups)
    }
    this.setData({ groups })
  },

  joinGroup(e) {
    const id = e.currentTarget.dataset.id
    const group = this.data.groups.find(g => g.id === id)
    if (!group) return

    if (group.isFull) {
      wx.showToast({ title: '该群已满员', icon: 'none', duration: 2000 })
      return
    }
    if (group.qrPath) {
      this.setData({ showQrPopup: true, activeGroup: group })
    } else {
      wx.showToast({ title: '二维码暂未配置，请联系管理员', icon: 'none', duration: 2000 })
    }
  },

  closeQrPopup() {
    this.setData({ showQrPopup: false, activeGroup: null })
  },

  onSaveQr() {
    const { activeGroup } = this.data
    if (!activeGroup || !activeGroup.qrPath) return
    wx.saveImageToPhotosAlbum({
      filePath: activeGroup.qrPath,
      success: () => {
        wx.showToast({ title: '二维码已保存到相册', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '保存失败，请长按图片保存', icon: 'none' })
      }
    })
  },

  noop() {}
})
