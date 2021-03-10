import Axios from 'axios'
import { check } from './config'
import verifyDataRequest from '../verifyDataRequest'
import getLog from './getLog'

/**
 * Função de busca de dados
 *
 * @param dUrl
 * @param dPage
 * @param callback
 * @param verify
 * @param configGet
 * @param configSave
 */

const index = (
  dUrl,
  dPage,
  callback,
  verify = null,
  configGet = null,
  configSave
) => {
  const { url, param } = check(dUrl, dPage, configGet)

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
