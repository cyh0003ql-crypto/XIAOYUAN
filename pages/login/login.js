Page({
  data: {
    phone: '',
    password: '',
    showPwd: false,
    canLogin: false,
    isNewUser: false
  },

  onPhoneInput(e) {
    const phone = e.detail.value
    this.setData({ phone })
    this._checkForm(phone, this.data.password)
    // 检查是否新用户
    if (phone.length === 11) {
      const users = wx.getStorageSync('users') || {}
      this.setData({ isNewUser: !users[phone] })
    } else {
      this.setData({ isNewUser: false })
    }
  },

  onPasswordInput(e) {
    const password = e.detail.value
    this.setData({ password })
    this._checkForm(this.data.phone, password)
  },

  _checkForm(phone, password) {
    const canLogin = phone.length === 11 && password.length >= 6
    this.setData({ canLogin })
  },

  togglePwd() {
    this.setData({ showPwd: !this.data.showPwd })
  },

  doLogin() {
    if (!this.data.canLogin) return
    const { phone, password } = this.data
    let users = wx.getStorageSync('users') || {}

    if (users[phone]) {
      // 已有账号：验证密码
      if (users[phone].password !== password) {
        wx.showToast({ title: '密码错误，请重试', icon: 'none' })
        return
      }
    } else {
      // 新用户：注册
      users[phone] = {
        name: `用户${phone.slice(-4)}`,
        avatar: '',
        phone,
        password,
        school: '广州科技职业学院'
      }
      wx.setStorageSync('users', users)
      wx.showToast({ title: '注册成功！', icon: 'success' })
    }

    // 保存当前登录用户信息
    const userInfo = { ...users[phone] }
    wx.setStorageSync('userInfo', userInfo)

    wx.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  },

  quickLogin() {
    const userInfo = {
      name: '小科同学',
      avatar: '',
      phone: '',
      password: '',
      school: '广州科技职业学院',
      isGuest: true
    }
    wx.setStorageSync('userInfo', userInfo)
    wx.showToast({ title: '欢迎！', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  }
})
