const app = getApp()

Page({
  data: {
    statusBarHeight: 44,
    reviews: [
      {
        id: 1,
        stars: 5,
        tag: '手机维修',
        content: '维修速度很快，价格也很透明，师傅很专业！',
        author: '小陈，广科22级学生'
      },
      {
        id: 2,
        stars: 5,
        tag: '二手交易',
        content: '在这里买到了性价比很高的二手手机，成色好价格实惠！',
        author: '小李，广科23级学生'
      }
    ]
  },

  onLoad() {
    try {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({ statusBarHeight: res.statusBarHeight || 44 })
        },
        fail: () => {
          this.setData({ statusBarHeight: 44 })
        }
      })
    } catch (e) {
      this.setData({ statusBarHeight: 44 })
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  goToMap() {
    wx.switchTab({ url: '/pages/map/map' })
  },

  goToRepair() {
    wx.navigateTo({ url: '/pages/repair/repair' })
  },

  goToSecondhand() {
    wx.navigateTo({ url: '/pages/secondhand/secondhand' })
  },

  goToPinDou() {
    wx.navigateTo({ url: '/pages/pindou/pindou' })
  },

  onShareAppMessage() {
    return {
      title: 'Petit Aura校园服务 - 一站式解决校园需求',
      path: '/pages/index/index'
    }
  }
})
