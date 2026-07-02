const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, item) => Promise.resolve(window.localStorage.setItem(key, item)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key))
}

export default storage
