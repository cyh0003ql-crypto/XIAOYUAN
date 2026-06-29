const DEFAULT_STORES = [
  { id: 1, name: 'Petit Aura 数码维修', address: '广科生活中心1栋A12', hours: '10:00-21:00', category: 'repair', latitude: 23.2645, longitude: 113.2130 },
  { id: 2, name: 'Petit Aura 二手交易', address: '广科生活中心2栋B05', hours: '09:00-20:00', category: 'recycle', latitude: 23.2625, longitude: 113.2115 },
  { id: 3, name: '打印文印中心', address: '图书馆1楼', hours: '08:00-22:00', category: 'print', latitude: 23.2640, longitude: 113.2105 }
]

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

function buildRealMarkers(stores) {
  return stores
    .filter(s => s.latitude != null && s.longitude != null)
    .map(s => ({
      id: s.id, latitude: s.latitude, longitude: s.longitude,
      title: s.name, width: 40, height: 40,
      category: s.category, name: s.name, address: s.address, hours: s.hours
    }))
}

Page({
  data: {
    useImgMap: false,
    customMapPath: '',
    imgHeightRpx: 1000,
    // 实时地图
    mapLat: 23.2635,
    mapLng: 113.2125,
    mapScale: 16,
    // 分类
    activeCategory: 'all',
    allStores: [],
    allMarkers: [],
    markers: [],
    imgMarkers: [],
    filteredImgMarkers: [],
    categories: [],
    // 底部卡片
    selectedMarker: null,
    showImgPopup: false,
    popupStore: null,
    currentStore: null
  },

  onLoad() {
    this._loadData()
    this.getUserLocation()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this._loadData()
  },

  _loadData() {
    let stores = wx.getStorageSync('mapStores')
    if (!stores || stores.length === 0) {
      stores = DEFAULT_STORES
      wx.setStorageSync('mapStores', stores)
    }
    let categories = wx.getStorageSync('mapCategories')
    if (!categories || categories.length === 0) {
      categories = DEFAULT_CATEGORIES
      wx.setStorageSync('mapCategories', categories)
    }
    const customMapPath = wx.getStorageSync('customMapPath') || ''
    const useImgMap = !!customMapPath
    const { activeCategory } = this.data
    const imgMarkers = stores.filter(s => s.xPct != null && s.yPct != null)
    const filteredImgMarkers = activeCategory === 'all' ? imgMarkers : imgMarkers.filter(m => m.category === activeCategory)
    const allMarkers = buildRealMarkers(stores)
    const markers = activeCategory === 'all' ? allMarkers : allMarkers.filter(m => m.category === activeCategory)
    this.setData({ useImgMap, customMapPath, allStores: stores, allMarkers, markers, imgMarkers, filteredImgMarkers, categories })
  },

  onImgLoad(e) {
    const { width, height } = e.detail
    if (width > 0) {
      const ratio = height / width
      const imgHeightRpx = Math.round(750 * ratio)
      this.setData({ imgHeightRpx })
    }
  },

  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => { this.setData({ mapLat: res.latitude, mapLng: res.longitude }) },
      fail: () => {}
    })
  },

  filterByCategory(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ activeCategory: id, selectedMarker: null, showImgPopup: false, popupStore: null, currentStore: null })
    const { allMarkers, imgMarkers } = this.data
    const markers = id === 'all' ? allMarkers : allMarkers.filter(m => m.category === id)
    const filteredImgMarkers = id === 'all' ? imgMarkers : imgMarkers.filter(m => m.category === id)
    this.setData({ markers, filteredImgMarkers })
  },

  // ---- 实时地图标注点击：展示底部卡片 ----
  onMarkerTap(e) {
    const marker = this.data.allMarkers.find(m => m.id === e.markerId)
    if (!marker) return
    this.setData({ selectedMarker: marker, showImgPopup: false, popupStore: null, currentStore: marker })
  },

  // ---- 点击地图空白关闭卡片 ----
  onMapBgTap() {
    if (this.data.currentStore) {
      this.setData({ selectedMarker: null, showImgPopup: false, popupStore: null, currentStore: null })
    }
  },

  closePopup() {
    this.setData({ selectedMarker: null, showImgPopup: false, popupStore: null, currentStore: null })
  },

  // ---- 图片地图 Pin 点击 ----
  onImgPinTap(e) {
    const store = this.data.allStores.find(s => s.id === e.currentTarget.dataset.id)
    if (!store) return
    this.setData({ showImgPopup: true, popupStore: store, selectedMarker: null, currentStore: store })
  },

  goNavigation() {
    const s = this.data.selectedMarker || this.data.popupStore
    if (!s) return
    if (s.latitude && s.longitude) {
      wx.openLocation({ latitude: s.latitude, longitude: s.longitude, name: s.name, address: '广州科技职业学院 ' + (s.address || '') })
    } else {
      wx.showToast({ title: '该店铺暂无导航坐标', icon: 'none' })
    }
  }
})
