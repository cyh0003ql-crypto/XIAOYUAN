Page({
  data: {
    userInfo: {
      name: '',
      avatar: '',
      phone: '',
      school: '广州科技职业学院'
    },
    isLogin: false,
    noticeCount: 3,
    favoriteCount: 5,
    couponCount: 2,
    orderBadge: {
      unpaid: 1,
      unsent: 2,
      unreceived: 0,
      unreview: 0
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.name) {
      // 未登录，跳转登录页
      wx.navigateTo({
        url: '/pages/login/login',
        fail() {
          wx.showToast({ title: '请先登录', icon: 'none' })
        }
      })
      return
    }
    this.setData({ userInfo, isLogin: true })
  },

  // 顶部通知
  goNotice() {
    wx.showToast({ title: '消息功能即将上线', icon: 'none' })
  },

  // 前往设置页（修改头像/密码）
  goSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings',
      fail() {
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  // 全部订单
  goOrders() {
    wx.setStorageSync('ordersActiveTab', 'all')
    wx.switchTab({ url: '/pages/orders/orders' })
  },

  // 订单分类跳转（orders 是 tabBar 页，用 storage 传 tab 参数）
  goOrderTab(e) {
    const tab = e.currentTarget.dataset.tab
    const tabMap = {
      unpaid: 'pending',
      unsent: 'pending',
      unreceived: 'processing',
      unreview: 'done',
      refund: 'all'
    }
    wx.setStorageSync('ordersActiveTab', tabMap[tab] || 'all')
    wx.switchTab({ url: '/pages/orders/orders' })
  },

  // 常用功能点击
  onFuncTap(e) {
    const type = e.currentTarget.dataset.type
    const tips = {
      favorite: '收藏夹功能即将上线',
      notice: '消息通知功能即将上线',
      coupon: '优惠券功能即将上线',
      service: '客服功能即将上线'
    }
    wx.showToast({ title: tips[type] || '功能即将上线', icon: 'none' })
  },

  // 列表菜单点击
  onMenuTap(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'privacy') {
      wx.navigateTo({
        url: '/pages/settings/settings',
        fail() {
          wx.showToast({ title: '页面跳转失败', icon: 'none' })
        }
      })
      return
    }
    const tips = {
      service: '客服功能即将上线',
      help: '帮助中心即将上线',
      about: 'Petit Aura 校园服务小程序 v1.0'
    }
    wx.showToast({ title: tips[type] || '功能即将上线', icon: 'none' })
  },

  // 联系我们
  goContact() {
    wx.navigateTo({
      url: '/pages/contact/contact',
      fail() {
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  },

  // 工作台
  goMerchant() {
    wx.navigateTo({
      url: '/pages/merchant/merchant',
      fail() {
        wx.showToast({ title: '页面跳转失败', icon: 'none' })
      }
    })
  }
})
