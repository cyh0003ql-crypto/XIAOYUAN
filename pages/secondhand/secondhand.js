Page({
  data: {
    recycleServices: [
      { id: 1, name: '手机回收', desc: '高价回收 | 快速打款', emoji: '📱' },
      { id: 2, name: '电脑回收', desc: '专业估值 | 安心回收', emoji: '💻' }
    ],
    products: [
      { id: 1, name: 'iPhone 13',  spec: '128G 黑色', price: '2009', emoji: '📱', liked: false },
      { id: 2, name: 'iPhone 12',  spec: '64G 蓝色',  price: '1469', emoji: '📱', liked: false },
      { id: 3, name: 'iPhone 12',  spec: '128G 白色', price: '1869', emoji: '📱', liked: false },
      { id: 4, name: 'iPhone 12',  spec: '64G 黑色',  price: '1069', emoji: '📱', liked: false }
    ]
  },

  goBack() {
    wx.navigateBack()
  },

  goRecycle(e) {
    wx.showToast({ title: '跳转回收估价...', icon: 'none' })
  },

  viewAll() {
    wx.showToast({ title: '查看全部二手商品', icon: 'none' })
  },

  viewProduct(e) {
    wx.showToast({ title: '商品详情页开发中', icon: 'none' })
  },

  toggleLike(e) {
    const id = e.currentTarget.dataset.id
    const products = this.data.products.map(p => {
      if (p.id === id) return Object.assign({}, p, { liked: !p.liked })
      return p
    })
    this.setData({ products })
  },

  publishItem() {
    wx.showModal({
      title: '发布闲置',
      content: '您即将发布闲置物品，请填写商品信息。',
      confirmText: '去发布',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '发布功能即将上线', icon: 'none' })
        }
      }
    })
  }
})
