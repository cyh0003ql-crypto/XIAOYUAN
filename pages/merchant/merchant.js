Page({
  data: {
    view: 'login',
    loginUsername: '',
    loginPassword: '',
    loginError: '',
    sessionUser: null,
    subAccounts: [],
    showAddSubModal: false,
    newSubUsername: '',
    newSubPassword: '',
    newSubName: '',
    addSubError: '',
    showDeleteConfirm: false,
    deleteTargetId: null,
    deleteTargetName: ''
  },

  onLoad() {
    this._initMainAccount()
    const session = wx.getStorageSync('workbenchSession') || null
    if (session) {
      const subAccounts = wx.getStorageSync('workbenchSubAccounts') || []
      this.setData({ view: session.role, sessionUser: session, subAccounts })
    }
  },

  _initMainAccount() {
    const exist = wx.getStorageSync('workbenchMainAccount')
    if (!exist) {
      wx.setStorageSync('workbenchMainAccount', {
        username: 'admin',
        password: 'admin123',
        name: '主账号管理员'
      })
    }
    const subs = wx.getStorageSync('workbenchSubAccounts')
    if (!subs) {
      wx.setStorageSync('workbenchSubAccounts', [])
    }
  },

  onUsernameInput(e) {
    this.setData({ loginUsername: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ loginPassword: e.detail.value })
  },

  onLogin() {
    const { loginUsername, loginPassword } = this.data
    if (!loginUsername || !loginPassword) {
      this.setData({ loginError: '请输入账号和密码' })
      return
    }

    const main = wx.getStorageSync('workbenchMainAccount')
    if (loginUsername === main.username && loginPassword === main.password) {
      const session = { role: 'main', username: main.username, name: main.name }
      wx.setStorageSync('workbenchSession', session)
      const subAccounts = wx.getStorageSync('workbenchSubAccounts') || []
      this.setData({ view: 'main', sessionUser: session, subAccounts, loginError: '' })
      return
    }

    const subs = wx.getStorageSync('workbenchSubAccounts') || []
    const sub = subs.find(s => s.username === loginUsername && s.password === loginPassword)
    if (sub) {
      const session = { role: 'sub', username: sub.username, name: sub.name }
      wx.setStorageSync('workbenchSession', session)
      this.setData({ view: 'sub', sessionUser: session, loginError: '' })
      return
    }

    this.setData({ loginError: '账号或密码错误' })
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出工作台吗？',
      confirmText: '退出',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('workbenchSession')
          this.setData({
            view: 'login',
            sessionUser: null,
            loginUsername: '',
            loginPassword: '',
            loginError: ''
          })
        }
      }
    })
  },

  onOpenAddSub() {
    this.setData({
      showAddSubModal: true,
      newSubUsername: '',
      newSubPassword: '',
      newSubName: '',
      addSubError: ''
    })
  },

  onCloseAddSub() {
    this.setData({ showAddSubModal: false, addSubError: '' })
  },

  onNewSubUsername(e) {
    this.setData({ newSubUsername: e.detail.value })
  },

  onNewSubPassword(e) {
    this.setData({ newSubPassword: e.detail.value })
  },

  onNewSubName(e) {
    this.setData({ newSubName: e.detail.value })
  },

  onConfirmAddSub() {
    const { newSubUsername, newSubPassword, newSubName } = this.data
    if (!newSubUsername || !newSubPassword || !newSubName) {
      this.setData({ addSubError: '请填写完整信息' })
      return
    }
    const main = wx.getStorageSync('workbenchMainAccount')
    if (newSubUsername === main.username) {
      this.setData({ addSubError: '账号名与主账号重复' })
      return
    }
    const subs = wx.getStorageSync('workbenchSubAccounts') || []
    if (subs.find(s => s.username === newSubUsername)) {
      this.setData({ addSubError: '该账号名已存在' })
      return
    }
    if (subs.length >= 5) {
      this.setData({ addSubError: '最多创建 5 个子账号' })
      return
    }
    const newSub = {
      id: Date.now(),
      username: newSubUsername,
      password: newSubPassword,
      name: newSubName,
      createdAt: new Date().toLocaleDateString('zh-CN')
    }
    const updated = [...subs, newSub]
    wx.setStorageSync('workbenchSubAccounts', updated)
    this.setData({ subAccounts: updated, showAddSubModal: false })
    wx.showToast({ title: '子账号已创建', icon: 'success' })
  },

  onDeleteSubTap(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ showDeleteConfirm: true, deleteTargetId: id, deleteTargetName: name })
  },

  onCancelDelete() {
    this.setData({ showDeleteConfirm: false, deleteTargetId: null, deleteTargetName: '' })
  },

  onConfirmDelete() {
    const { deleteTargetId } = this.data
    const subs = wx.getStorageSync('workbenchSubAccounts') || []
    const updated = subs.filter(s => s.id !== deleteTargetId)
    wx.setStorageSync('workbenchSubAccounts', updated)
    this.setData({
      subAccounts: updated,
      showDeleteConfirm: false,
      deleteTargetId: null,
      deleteTargetName: ''
    })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  goMapAdmin() {
    wx.navigateTo({ url: '/pages/map-admin/map-admin' })
  },

  goGroupsAdmin() {
    wx.navigateTo({ url: '/pages/groups-admin/groups-admin' })
  },

  goContactAdmin() {
    wx.navigateTo({ url: '/pages/contact-admin/contact-admin' })
  },

  onModuleTap(e) {
    const name = e.currentTarget.dataset.name
    wx.showToast({ title: `${name}功能即将上线`, icon: 'none' })
  },

  noop() {},

  onShareAppMessage() {
    return {
      title: '工作台 - Petit Aura校园服务',
      path: '/pages/merchant/merchant'
    }
  }
})
