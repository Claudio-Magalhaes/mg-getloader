const index = (root, name = null) => {
  const rootData = window.sessionStorage.getItem(root)
    ? JSON.parse(window.sessionStorage.getItem(root))
    : {}

  if (name === null) {
    return rootData
  }

  if (rootData[name]) {
    return rootData[name]
  }
  return false
}

export default index
