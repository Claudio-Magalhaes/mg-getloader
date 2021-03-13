import Axios from 'axios'
import { checkUrl } from './config'
import verifyDataRequest from '../verifyDataRequest'
import getLog from './getLog'
import { checkTimerGet } from '../timerGet'

/**
 * Função de busca de dados
 *
 * @param url
 * @param param
 * @param callback
 * @param verify
 * @param configGet
 * @param configSave
 */

const index = (
  url,
  param,
  callback,
  verify = null,
  configGet = null, // root[0][1]
  configSave
) => {

  //url = checkUrl(url, configGet)

  const base = () => {
    Axios.get(url.base + param.param)
      .then((resp) => {
        if (resp.status === 200) {
          if (verify !== null) {
            const dataVerify = verifyDataRequest(
              param.saveName,
              resp.data,
              verify
            )

            getLog(configSave, resp.data, param.saveName, dataVerify)

            if (!dataVerify.status) {
              callback(null, null, null, true)
              // eslint-disable-next-line no-throw-literal
              throw 'param01'
            }

            callback(param.saveName, resp.data, configSave.rootName)
          }
        }
      })
      .catch((erro) => {
        switch (erro) {
          case 'param01':
            if (url.alternative) {
              console.warn(
                param.saveName,
                ': Não corresponde ao esperado, buscando em base alternativa'
              )
              alternative()
            } else {
              console.warn(
                param.saveName,
                ': Não corresponde ao esperado, e não há alternativas de busca'
              )
            }
            break
          default:
            console.log(erro)
            console.warn(param.saveName, ': Erro ao buscar dados')
            break
        }
      })
  }

  const alternative = () => {
    Axios.get(url.alternative + param.param)
      .then((resp) => {
        if (resp.status === 200) {
          if (verify !== null) {
            const dataVerify = verifyDataRequest(
              param.saveName,
              resp.data,
              verify
            )

            getLog(configSave, resp.data, param.saveName, dataVerify)

            if (!dataVerify.status) {
              callback(null, null, null, true)
              // eslint-disable-next-line no-throw-literal
              throw 'param01'
            }

            callback(param.saveName, resp.data, configSave.rootName)
          }
        }
      })
      .catch((erro) => {
        switch (erro) {
          case 'param01':
            console.error(
              param.saveName,
              ': Não corresponde ao esperado, essa foi a ultima alternativas de busca'
            )
            break
          default:
            console.log(erro)
            console.warn(param.saveName, ': Erro ao buscar dados')
            break
        }
      })
  }

  const getPrevia = () => {}

  if (window.sessionStorage.getItem('VerPreviaDoSite') === 'true') {
    getPrevia()
  } else {
    base()
  }
}

export default index
