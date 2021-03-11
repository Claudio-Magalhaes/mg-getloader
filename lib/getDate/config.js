export const checkUrl = (dUrl, dConfig) => {
  const url = {}
  if (dConfig.url) {
    if (typeof dConfig.url === 'string') {
      url.base = dConfig.url
    } else if (typeof dConfig.url === 'object') {
      if (dConfig.url.anula) {
        if (dConfig.url.base) {
          url.base = dConfig.url.base
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'você definil uma substiruição mas não expecificou a url base'
        }
        if (dConfig.url.alternative) {
          url.alternative = dConfig.url.alternative
        }
        if (dConfig.url.test) {
          url.test = dConfig.url.test
        }
      } else {
        if (dConfig.url.base || dUrl.base) {
          url.base = dConfig.url.base ? dConfig.url.base : dUrl.base
        }
        if (dConfig.url.alternative || dUrl.alternative) {
          url.alternative = dConfig.url.alternative
            ? dConfig.url.alternative
            : dUrl.alternative
        }
        if (dConfig.url.test || dUrl.test) {
          url.test = dConfig.url.test ? dConfig.url.test : dUrl.test
        }
      }
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'url inválida 0'
    }
  } else {
    if (typeof dUrl === 'string') {
      url.base = dUrl
    } else if (typeof dUrl === 'object') {
      if (
        typeof dUrl.base === 'string' ||
        typeof dUrl.alternative === 'string' ||
        typeof dUrl.test === 'string'
      ) {
        if (dUrl.base) {
          url.base = dUrl.base
        }
        if (dUrl.alternative) {
          url.alternative = dUrl.alternative
        }
        if (dUrl.test) {
          url.test = dUrl.test
        }
      } else {
        // eslint-disable-next-line no-throw-literal
        throw 'url invalida 1'
      }
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'url invalida 2'
    }
  }

  return url
}

/**
 * @param dParam
 * @param dConfig
 *
 * função irá ajustar entrada de parametros para getData()
 * essa função deverá substituir os dados de parametro de dParam
 * utilizando os dados existentes em dConfig.
 * Caso existam correção de parametro para sem que seja alimentada a variavel
 * saveName, a mesma reconhecerá o parametro passado como nome se salvamento
 */
export const checkParam = (dParam, dConfig) => {
  if (!dConfig) {
    dConfig = {}
  }
  const param = {}
  /** caso dConfig.param exista */
  if (dConfig.param) {
    if (typeof dConfig.param === 'string') {
      param.saveName = dConfig.param
      param.param = dConfig.param

      return param
    } else if (typeof dConfig.param === 'object') {
      if (
        typeof dConfig.param.saveName !== 'string' &&
        typeof dConfig.param.param !== 'string'
      ) {
        // eslint-disable-next-line no-throw-literal
        throw 'parametro inválida - param vazio'
      }
      if (dConfig.param.saveName) {
        param.saveName = dConfig.param.saveName
      }
      if (dConfig.param.param) {
        param.param = dConfig.param.param
      } else {
        param.param = dConfig.param.saveName
      }

      return param
    } else {
      // eslint-disable-next-line no-throw-literal
      throw 'parametro inválida - esperávamos um tipop "object" ou "string"'
    }
  }

  if (typeof dParam === 'string') {
    param.saveName = dParam
    param.param = dParam

    return param
  } else if (typeof dParam === 'object') {
    if (
      typeof dParam.saveName !== 'string' &&
      typeof dParam.param !== 'string'
    ) {
      // eslint-disable-next-line no-throw-literal
      throw 'parametro inválida - param vazio 0'
    }
    if (dParam.saveName) {
      param.saveName = dParam.saveName
    } else {
      param.saveName = dParam.param
    }
    if (dParam.param) {
      param.param = dParam.param
    } else {
      param.param = param.saveName
    }

    return param
  } else {
    // eslint-disable-next-line no-throw-literal
    throw 'parametro inválida - esperávamos um tipop "object" ou "string"'
  }
}

export const getDataSession = (root, name) => {
  const rootData = window.sessionStorage.getItem(root)
    ? JSON.parse(window.sessionStorage.getItem(root))
    : {}

  if (rootData[name]) {
    return rootData[name]
  }
  return false
}

export const check = (dUrl, dParam, config) => {
  return {
    url: checkUrl(dUrl, config === null ? {} : config),
    param: checkParam(dParam, config === null ? {} : config)
  }
}

export const checkConfigSave = (base, sub, anula = false, delet = false) => {
  const retorno = {}

  if (sub) {
    Object.keys(base).map((k) => {
      if (anula) {
        if (delet) {
          if (sub[k]) {
            retorno[k] = sub[k]
          }
        } else {
          retorno[k] = sub[k] ? sub[k] : ''
        }
      } else {
        retorno[k] = sub[k] ? sub[k] : base[k]
      }
    })
  } else {
    return base
  }

  return retorno
}
