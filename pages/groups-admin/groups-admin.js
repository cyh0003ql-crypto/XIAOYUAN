const DEFAULT_GROUPS = [
  { id: 1, name: '新生交流群', count: 1568, emoji: '🎓', qrPath: '', isFull: false },
  { id: 2, name: '二手交易群', count: 892,  emoji: '🔄', qrPath: '', isFull: false },
  { id: 3, name: '兼职信息群', count: 623,  emoji: '💼', qrPath: '', isFull: false }
]

Page({
  data: {
    groups: [],
    showAddModal: false,
    newName: '',
    newEmoji: '',
    newCount: '',
    newIsFull: false,
    newQrPath: '',
    addError: '',
    showDelModal: false,
    delId: null,
    delName: '',
    showQrModal: false,
    editQrId: null,
    editQrName: '',
    editQrPath: ''
  },

  onLoad() { this._loadData() },
  onShow() { this._loadData() },

  _loadData() {
    let groups = wx.getStorageSync('campusGroups')
    if (!groups || groups.length === 0) {
      groups = DEFAULT_GROUPS
      wx.setStorageSync('campusGroups', groups)
    }
    // 补充旧数据缺少 isFull 字段
    groups = groups.map(g => ({ isFull: false, ...g }))
    this.setData({ groups })
  },

  // ---- 新增群聊 ----
  onOpenAdd() {
    this.setData({ showAddModal: true, newName: '', newEmoji: '', newCount: '', newIsFull: false, newQrPath: '', addError: '' })
  },
  onCloseAdd() { this.setData({ showAddModal: false }) },
  onInputName(e)  { this.setData({ newName: e.detail.value }) },
  onInputEmoji(e) { this.setData({ newEmoji: e.detail.value }) },
  onInputCount(e) { this.setData({ newCount: e.detail.value }) },

  // 新增弹窗中切换满员
  onToggleNewFull() {
    this.setData({ newIsFull: !this.data.newIsFull })
  },

  onUploadQr() {
    wx.chooseImage({
      count: 1, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.showLoading({ title: '保存中...' })
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => { wx.hideLoading(); this.setData({ newQrPath: saveRes.savedFilePath }) },
          fail: () => { wx.hideLoading(); this.setData({ newQrPath: tempPath }) }
        })
      }
    })
  },

  onConfirmAdd() {
    const { newName, newEmoji, newCount, newIsFull, newQrPath } = this.data
    if (!newName.trim()) { this.setData({ addError: '请输入群聊名称' }); return }
    const newGroup = {
      id: Date.now(),
      name: newName.trim(),
      emoji: newEmoji.trim() || '💬',
      count: parseInt(newCount) || 0,
      isFull: newIsFull,
      qrPath: newQrPath
    }
    const updated = [...this.data.groups, newGroup]
    wx.setStorageSync('campusGroups', updated)
    this.setData({ groups: updated, showAddModal: false })
    wx.showToast({ title: '群聊已添加', icon: 'success' })
  },

  // ---- 满员快速切换（列表行内） ----
  onToggleFull(e) {
    const id = e.currentTarget.dataset.id
    const updated = this.data.groups.map(g =>
      g.id === id ? { ...g, isFull: !g.isFull } : g
    )
    wx.setStorageSync('campusGroups', updated)
    this.setData({ groups: updated })
    const group = updated.find(g => g.id === id)
    wx.showToast({ title: group.isFull ? '已设为满员' : '已取消满员', icon: 'none' })
  },

  // ---- 更新二维码 ----
  onEditQr(e) {
    const { id, name, qrpath } = e.currentTarget.dataset
    this.setData({ showQrModal: true, editQrId: id, editQrName: name, editQrPath: qrpath || '' })
  },
  onCloseQr() { this.setData({ showQrModal: false }) },

  onUploadEditQr() {
    wx.chooseImage({
      count: 1, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.showLoading({ title: '保存中...' })
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => { wx.hideLoading(); this.setData({ editQrPath: saveRes.savedFilePath }) },
          fail: () => { wx.hideLoading(); this.setData({ editQrPath: tempPath }) }
        })
      }
    })
  },

  onConfirmEditQr() {
    const { editQrId, editQrPath } = this.data
    if (!editQrPath) { wx.showToast({ title: '请先上传二维码', icon: 'none' }); return }
    const updated = this.data.groups.map(g => g.id === editQrId ? { ...g, qrPath: editQrPath } : g)
    wx.setStorageSync('campusGroups', updated)
    this.setData({ groups: updated, showQrModal: false })
    wx.showToast({ title: '二维码已更新', icon: 'success' })
  },

  // ---- 删除 ----
  onDelTap(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ showDelModal: true, delId: id, delName: name })
  },
  onCancelDel() { this.setData({ showDelModal: false, delId: null, delName: '' }) },
  onConfirmDel() {
    const updated = this.data.groups.filter(g => g.id !== this.data.delId)
    wx.setStorageSync('campusGroups', updated)
    this.setData({ groups: updated, showDelModal: false, delId: null, delName: '' })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  noop() {}
})
