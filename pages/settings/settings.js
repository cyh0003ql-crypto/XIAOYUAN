Page({
  data: {
    userInfo: {
      name: '',
      avatar: '',
      phone: '',
      school: '广州科技职业学院'
    },
    oldPwd: '',
    newPwd: '',
    confirmPwd: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  // 更换头像
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => {
            const userInfo = { ...this.data.userInfo, avatar: saveRes.savedFilePath }
            this.setData({ userInfo })
          },
          fail: () => {
            // 保存失败时使用临时路径
            const userInfo = { ...this.data.userInfo, avatar: tempPath }
            this.setData({ userInfo })
          }
        })
      }
    })
  },

  // 修改昵称输入
  onNameInput(e) {
    this.setData({ 'userInfo.name': e.detail.value })
  },

  // 密码输入
  onOldPwdInput(e) { this.setData({ oldPwd: e.detail.value }) },
  onNewPwdInput(e) { this.setData({ newPwd: e.detail.value }) },
  onConfirmPwdInput(e) { this.setData({ confirmPwd: e.detail.value }) },

  // 修改密码
  changePwd() {
    const { oldPwd, newPwd, confirmPwd, userInfo } = this.data
    if (!oldPwd || !newPwd || !confirmPwd) {
      wx.showToast({ title: '请填写完整密码信息', icon: 'none' })
      return
    }
    if (newPwd.length < 6) {
      wx.showToast({ title: '新密码至少6位', icon: 'none' })
      return
    }
    if (newPwd !== confirmPwd) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }
    // 验证旧密码
    const users = wx.getStorageSync('users') || {}
    const phone = userInfo.phone
    if (!users[phone] || users[phone].password !== oldPwd) {
      wx.showToast({ title: '当前密码错误', icon: 'none' })
      return
    }
    // 更新密码
    users[phone].password = newPwd
    wx.setStorageSync('users', users)
    const newUserInfo = { ...userInfo, password: newPwd }
    wx.setStorageSync('userInfo', newUserInfo)
    this.setData({ oldPwd: '', newPwd: '', confirmPwd: '', userInfo: newUserInfo })
    wx.showToast({ title: '密码修改成功', icon: 'success' })
  },

  // 保存个人信息
  saveProfile() {
    const { userInfo } = this.data
    if (!userInfo.name || !userInfo.name.trim()) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }
    // 同步更新 users 存储中的用户名和头像
    if (userInfo.phone) {
      const users = wx.getStorageSync('users') || {}
      if (users[userInfo.phone]) {
        users[userInfo.phone].name = userInfo.name
        users[userInfo.phone].avatar = userInfo.avatar
        wx.setStorageSync('users', users)
      }
    }
    wx.setStorageSync('userInfo', userInfo)
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.showToast({ title: '已退出', icon: 'success' })
          setTimeout(() => {
            wx.switchTab({ url: '/pages/profile/profile' })
          }, 800)
        }
      }
    })
  }
})
