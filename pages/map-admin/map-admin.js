const DEFAULT_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'repair', name: '数码维修' },
  { id: 'recycle', name: '二手回收' },
  { id: 'custom', name: '拼豆定制' },
  { id: 'print', name: '打印文印' },
  { id: 'life', name: '生活服务' },
  { id: 'food', name: '餐饮' },
  { id: 'express', name: '快递' }
]

Page({
  data: {
    tab: 'store',
    customMapPath: '',
    stores: [],
    imgMarkers: [],
    categories: [],
    pickableCats: [],
    // 添加标注弹窗
    showAddStore: false,
    pickXPct: 0,
    pickYPct: 0,
    newName: '',
    newAddress: '',
    newHours: '',
    newCategory: '',
    newImage: '',
    addStoreError: '',
    // 删除标注
    showDelStore: false,
    delStoreId: null,
    delStoreName: '',
    // 点击标注弹出信息
    showStorePopup: false,
    popupStore: null,
    // 分类管理
    showAddCat: false,
    newCatName: '',
    showDelCat: false,
    delCatId: null,
    delCatName: ''
  },

  onLoad() {
    this._loadData()
  },

  _loadData() {
    let categories = wx.getStorageSync('mapCategories')
    if (!categories || categories.length === 0) {
      categories = DEFAULT_CATEGORIES
      wx.setStorageSync('mapCategories', categories)
    }
    const stores = wx.getStorageSync('mapStores') || []
    const customMapPath = wx.getStorageSync('customMapPath') || ''
    const imgMarkers = stores.filter(s => s.xPct != null && s.yPct != null)
    const pickableCats = categories.filter(c => c.id !== 'all')
    this.setData({ categories, stores, imgMarkers, customMapPath, pickableCats })
  },

  onTabSwitch(e) {
    this.setData({ tab: e.currentTarget.dataset.tab })
  },

  // ---- 上传地图 ----
  onUploadMap() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.showLoading({ title: '保存中...' })
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => {
            wx.hideLoading()
            const savedPath = saveRes.savedFilePath
            wx.setStorageSync('customMapPath', savedPath)
            this.setData({ customMapPath: savedPath })
            wx.showToast({ title: '地图已更新', icon: 'success' })
          },
          fail: () => {
            wx.hideLoading()
            // 部分环境 saveFile 受限，直接用 tempPath（本次会话有效）
            wx.setStorageSync('customMapPath', tempPath)
            this.setData({ customMapPath: tempPath })
            wx.showToast({ title: '地图已上传', icon: 'success' })
          }
        })
      }
    })
  },

  // ---- 点击地图图片 → 计算相对坐标 ----
  onImageTap(e) {
    if (!this.data.customMapPath) {
      wx.showToast({ title: '请先上传地图', icon: 'none' })
      return
    }
    const { x: tapX, y: tapY } = e.detail
    wx.createSelectorQuery()
      .select('.img-map-container')
      .boundingClientRect(rect => {
        if (!rect) return
        const xPct = parseFloat(((tapX - rect.left) / rect.width * 100).toFixed(2))
        const yPct = parseFloat(((tapY - rect.top) / rect.height * 100).toFixed(2))
        this.setData({
          showAddStore: true,
          pickXPct: xPct,
          pickYPct: yPct,
          newName: '',
          newAddress: '',
          newHours: '',
          newCategory: '',
          newImage: '',
          addStoreError: ''
        })
      })
      .exec()
  },

  // ---- 点击已有标注图钉 ----
  onMarkerPinTap(e) {
    e.stopPropagation && e.stopPropagation()
    const id = e.currentTarget.dataset.id
    const store = this.data.stores.find(s => s.id === id)
    if (store) {
      this.setData({ showStorePopup: true, popupStore: store })
    }
  },

  closeStorePopup() {
    this.setData({ showStorePopup: false, popupStore: null })
  },

  onCloseAddStore() {
    this.setData({ showAddStore: false })
  },

  onInputName(e) { this.setData({ newName: e.detail.value }) },
  onInputAddress(e) { this.setData({ newAddress: e.detail.value }) },
  onInputHours(e) { this.setData({ newHours: e.detail.value }) },

  // ---- 上传店铺展示图片 ----
  onUploadStoreImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempPath = res.tempFilePaths[0]
        wx.showLoading({ title: '保存中...' })
        wx.saveFile({
          tempFilePath: tempPath,
          success: (saveRes) => {
            wx.hideLoading()
            this.setData({ newImage: saveRes.savedFilePath })
          },
          fail: () => {
            wx.hideLoading()
            this.setData({ newImage: tempPath })
          }
        })
      }
    })
  },

  // ---- 分类芯片选择 ----
  onSelectCat(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ newCategory: id })
  },

  onConfirmAddStore() {
    const { newName, newAddress, newHours, newCategory, newImage, pickXPct, pickYPct } = this.data
    if (!newName || !newAddress || !newHours || !newCategory) {
      this.setData({ addStoreError: '请填写完整信息并选择分类' })
      return
    }
    const newStore = {
      id: Date.now(),
      name: newName,
      address: newAddress,
      hours: newHours,
      category: newCategory,
      image: newImage || '',
      xPct: pickXPct,
      yPct: pickYPct
    }
    const updated = [...this.data.stores, newStore]
    wx.setStorageSync('mapStores', updated)
    const imgMarkers = updated.filter(s => s.xPct != null && s.yPct != null)
    this.setData({ stores: updated, imgMarkers, showAddStore: false })
    wx.showToast({ title: '标注已添加', icon: 'success' })
  },

  onDelStoreTap(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ showDelStore: true, delStoreId: id, delStoreName: name })
  },

  onCancelDelStore() {
    this.setData({ showDelStore: false, delStoreId: null, delStoreName: '' })
  },

  onConfirmDelStore() {
    const updated = this.data.stores.filter(s => s.id !== this.data.delStoreId)
    wx.setStorageSync('mapStores', updated)
    const imgMarkers = updated.filter(s => s.xPct != null && s.yPct != null)
    this.setData({ stores: updated, imgMarkers, showDelStore: false, delStoreId: null, delStoreName: '' })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  // ---- 分类管理 ----
  onOpenAddCat() {
    this.setData({ showAddCat: true, newCatName: '' })
  },
  onCloseAddCat() {
    this.setData({ showAddCat: false })
  },
  onInputCatName(e) { this.setData({ newCatName: e.detail.value }) },

  onConfirmAddCat() {
    const name = this.data.newCatName.trim()
    if (!name) {
      wx.showToast({ title: '请输入分类名称', icon: 'none' })
      return
    }
    const cats = this.data.categories
    if (cats.find(c => c.name === name)) {
      wx.showToast({ title: '分类已存在', icon: 'none' })
      return
    }
    const id = 'cat_' + Date.now()
    const updated = [...cats, { id, name }]
    wx.setStorageSync('mapCategories', updated)
    const pickableCats = updated.filter(c => c.id !== 'all')
    this.setData({ categories: updated, pickableCats, showAddCat: false })
    wx.showToast({ title: '分类已添加', icon: 'success' })
  },

  onDelCatTap(e) {
    const { id, name } = e.currentTarget.dataset
    if (id === 'all') {
      wx.showToast({ title: '"全部"不可删除', icon: 'none' })
      return
    }
    this.setData({ showDelCat: true, delCatId: id, delCatName: name })
  },

  onCancelDelCat() {
    this.setData({ showDelCat: false, delCatId: null, delCatName: '' })
  },

  onConfirmDelCat() {
    const updated = this.data.categories.filter(c => c.id !== this.data.delCatId)
    wx.setStorageSync('mapCategories', updated)
    const pickableCats = updated.filter(c => c.id !== 'all')
    this.setData({ categories: updated, pickableCats, showDelCat: false, delCatId: null, delCatName: '' })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  noop() {}
})
