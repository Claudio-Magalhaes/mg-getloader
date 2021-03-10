const verifyDataRequest = (page, data, verify) => {
  if (typeof verify === 'string') {
    if (Array.isArray(data)) {
      return verify === 'array'
    } else if (verify === 'array') {
      return false
    }

    // eslint-disable-next-line valid-typeof
    return typeof data === verify
  } else if (Array.isArray(verify)) {
    if (verify.length <= 0) {
      return Array.isArray(data)
    } else {
      const retorno = {}

      data.map((v, k) => {
        retorno[k] = verifyDataRequest(page, v, verify[0])
      })

      return retorno
    }
  } else if (typeof verify === 'object') {
    const retorno = {}

    Object.keys(verify).map((v) => {
      retorno[v] = verifyDataRequest(v, data[v], verify[v])
    })

    return retorno
  }
  return false
}

const verifyStatus = (result) => {
  const status = []
  if (typeof result === 'boolean') {
    status.push(result)
  } else if (typeof result === 'object') {
    Object.values(result).map((v, k) => {
      if (typeof v === 'boolean') {
        status.push(v)
      } else {
        status.push(verifyStatus(v))
      }
    })
  }

  return status.indexOf(false) === -1
}

const index = (page, data, verify) => {
  const log = verifyDataRequest(page, data, verify)
  const status = verifyStatus(log)

  return { log, status }
}

export default index
