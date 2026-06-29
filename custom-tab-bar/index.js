Component({
  data: {
    selected: 0
  },
  methods: {
    switchTab(e) {
      const url = e.currentTarget.dataset.url
      const index = e.currentTarget.dataset.index
      wx.switchTab({ url })
      this.setData({ selected: index })
    }
  }
})
