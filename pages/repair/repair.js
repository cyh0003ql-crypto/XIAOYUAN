Page({
  data: {
    services: [
      {
        id: 1,
        name: '手机屏幕维修',
        desc: '光学原屏 | 极佳色准',
        price: '159',
        tag: '品质优选',
        emoji: '📱'
      },
      {
        id: 2,
        name: '主板维修',
        desc: '数据保留 | 安全放心',
        price: '299',
        tag: '今日热售',
        emoji: '🔧'
      },
      {
        id: 3,
        name: '电池更换',
        desc: '原装电池 | 快充优化',
        price: '89',
        tag: '高性价比',
        emoji: '🔋'
      },
      {
        id: 4,
        name: '摄像头维修',
        desc: '原装镜头 | 清晰如初',
        price: '199',
        tag: '人气推荐',
        emoji: '📷'
      }
    ]
  },

  goBack() {
    wx.navigateBack()
  },

  bookService(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '在线预约',
      content: '确认预约此维修服务？我们将在30分钟内联系您。',
      confirmText: '确认预约',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '预约成功！', icon: 'success' })
        }
      }
    })
  },

  onlineBook() {
    wx.showModal({
      title: '在线预约',
      content: '请选择您方便的时间，我们将安排师傅上门或到店维修。',
      confirmText: '立即预约',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '预约成功！', icon: 'success' })
        }
      }
    })
  },

  mailRepair() {
    wx.showToast({ title: '邮寄快修即将上线', icon: 'none' })
  }
})
