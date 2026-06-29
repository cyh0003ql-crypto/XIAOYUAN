Page({
  data: {
    activeCategory: 'all',
    categories: [
      { id: 'all', name: '成品专区', emoji: '🎀' },
      { id: 'custom', name: '定制专区', emoji: '✂️' },
      { id: 'material', name: '材料包', emoji: '📦' },
      { id: 'tool', name: '配件工具', emoji: '🔧' }
    ],
    allProducts: [
      {
        id: 1,
        name: '懒喵小喷',
        desc: '食欲色 食欲70%',
        price: 29.9,
        emoji: '🐱',
        category: 'all',
        liked: false
      },
      {
        id: 2,
        name: '蛋鸡窝摆件',
        desc: '萌萌哒混色造型',
        price: 39.9,
        emoji: '🐣',
        category: 'all',
        liked: false
      },
      {
        id: 3,
        name: '小鹿挂件',
        desc: '奶油系清新风格',
        price: 19.9,
        emoji: '🦌',
        category: 'all',
        liked: true
      },
      {
        id: 4,
        name: '星空兔兔',
        desc: '梦幻紫色渐变',
        price: 45.9,
        emoji: '🐰',
        category: 'custom',
        liked: false
      },
      {
        id: 5,
        name: '小熊挂件',
        desc: '暖棕色系治愈款',
        price: 24.9,
        emoji: '🐻',
        category: 'custom',
        liked: false
      },
      {
        id: 6,
        name: '基础材料包',
        desc: '500粒混色拼豆',
        price: 12.9,
        emoji: '📦',
        category: 'material',
        liked: false
      },
      {
        id: 7,
        name: '渐变色料包',
        desc: '200粒渐变系列',
        price: 18.9,
        emoji: '🌈',
        category: 'material',
        liked: false
      },
      {
        id: 8,
        name: '熨斗套装',
        desc: '含熨斗纸+底板',
        price: 15.9,
        emoji: '🔧',
        category: 'tool',
        liked: false
      },
      {
        id: 9,
        name: '多孔底板',
        emoji: '⬜',
        desc: '29×29孔方形底板',
        price: 8.9,
        category: 'tool',
        liked: false
      }
    ],
    products: [],
    cartCount: 0,
    showOrderModal: false,
    selectedProduct: null,
    orderTotal: '0.00',
    orderForm: {
      count: 1,
      remark: ''
    }
  },

  onLoad() {
    this.filterProducts('all')
  },

  filterProducts(category) {
    const all = this.data.allProducts
    const filtered = category === 'all' ? all : all.filter(p => p.category === category)
    this.setData({ products: filtered, activeCategory: category })
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id
    this.filterProducts(id)
  },

  noop() {},

  onLikeTap(e) {
    const index = e.currentTarget.dataset.index
    const pid = e.currentTarget.dataset.pid
    const newLiked = !this.data.products[index].liked
    const allIndex = this.data.allProducts.findIndex(p => p.id === pid)
    const update = {}
    update[`products[${index}].liked`] = newLiked
    if (allIndex !== -1) {
      update[`allProducts[${allIndex}].liked`] = newLiked
    }
    this.setData(update)
  },

  _calcTotal(price, count) {
    return (Math.round(price * count * 100) / 100).toFixed(2)
  },

  onAddToCart(e) {
    const index = e.currentTarget.dataset.index
    const product = this.data.products[index]
    this.setData({
      showOrderModal: true,
      selectedProduct: product,
      orderTotal: this._calcTotal(product.price, 1),
      orderForm: { count: 1, remark: '' }
    })
  },

  onCountMinus() {
    const count = this.data.orderForm.count
    if (count > 1) {
      const newCount = count - 1
      this.setData({
        'orderForm.count': newCount,
        orderTotal: this._calcTotal(this.data.selectedProduct.price, newCount)
      })
    }
  },

  onCountPlus() {
    const count = this.data.orderForm.count
    if (count < 99) {
      const newCount = count + 1
      this.setData({
        'orderForm.count': newCount,
        orderTotal: this._calcTotal(this.data.selectedProduct.price, newCount)
      })
    }
  },

  onRemarkInput(e) {
    this.setData({ 'orderForm.remark': e.detail.value })
  },

  onCloseModal() {
    this.setData({ showOrderModal: false, selectedProduct: null })
  },

  onConfirmOrder() {
    const { selectedProduct, orderForm } = this.data
    wx.showLoading({ title: '加入购物车...' })
    setTimeout(() => {
      wx.hideLoading()
      this.setData({
        showOrderModal: false,
        selectedProduct: null,
        cartCount: this.data.cartCount + orderForm.count
      })
      wx.showToast({ title: '已加入购物车 🛍️', icon: 'none', duration: 1500 })
    }, 800)
  },

  onCustomTap() {
    wx.showModal({
      title: '定制服务',
      content: '拼豆定制需提前沟通设计稿，制作周期约3-5天，起步价20元。是否联系客服？',
      confirmText: '联系客服',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '正在跳转客服...', icon: 'none' })
        }
      }
    })
  },

  onSearchTap() {
    wx.showToast({ title: '搜索功能即将上线', icon: 'none' })
  },

  onShareAppMessage() {
    return {
      title: '拼豆摆件 - 创意拼豆 定制美好',
      path: '/pages/pindou/pindou'
    }
  }
})
