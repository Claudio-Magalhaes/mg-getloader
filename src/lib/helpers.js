const check = (data, sub) => {
  const newData = {}
  Object.keys(data).map((d) => {
    if (typeof sub[d] !== 'undefined') {
      newData[d] = sub[d]
    } else {
      newData[d] = data[d]
    }
  })
  newData.url = url(data.url, sub.url)
  return newData
}

const url = (data, sub) => {
  if (typeof sub === 'object') {
    if (sub.anula) {
      return sub
    }
  }
  if (typeof sub === 'string') {
    return { base: sub }
  }
  return {
    ...data,
    ...sub
  }
}

export default check
