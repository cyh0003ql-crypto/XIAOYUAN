Page({
  data: {
    activeTab: 'all',
    tabs: [
      { id: 'all',        name: '全部' },
      { id: 'pending',    name: '待处理' },
      { id: 'processing', name: '进行中' },
      { id: 'done',       name: '已完成' }
    ],
    orders: [
      {
        id: 1,
        store: 'Petit Aura 数码维修',
        status: '已完成',
        statusClass: 'status-done',
        name: '手机屏幕维修',
        spec: 'iPhone 13 Pro',
        price: '159',
        date: '2025-06-15',
        emoji: '📱',
        canReview: true,
        canRebuy: false
      },
      {
        id: 2,
        store: 'Petit Aura 二手交易',
        status: '交易中',
        statusClass: 'status-processing',
        name: 'iPhone 12',
        spec: '64G 蓝色',
        price: '1469',
        date: '2025-06-20',
        emoji: '📱',
        canReview: false,
        canRebuy: false
      }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    // 从个人中心传入的订单子tab
    const pendingTab = wx.getStorageSync('ordersActiveTab')
    if (pendingTab) {
      this.setData({ activeTab: pendingTab })
      wx.removeStorageSync('ordersActiveTab')
    }
  },

  switchOrderTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.id })
  },

  goShop() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  contactStore() {
    wx.showToast({ title: '正在联系店家...', icon: 'none' })
  },

  reviewOrder() {
    wx.showToast({ title: '感谢您的评价！', icon: 'success' })
  },

  rebuyOrder() {
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  }
})
