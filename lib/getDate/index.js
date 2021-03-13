import Axios from 'axios'
import verifyDataRequest from '../verifyDataRequest'
import getLog from './getLog'

/**
 * Função de busca de dados
 *
 * @param url
 * @param param
 * @param callback
 * @param verify
 * @param configSave
 */

const index = (url, param, callback, verify = null, configSave) => {
  const base = () => {
    Axios.get(url.base + param)
      .then((resp) => {
        if (resp.status === 200) {
          // verificando retorno
          const dataVerify = verifyDataRequest(
            configSave.saveName,
            resp.data,
            verify
          )

          // verificando salvamento de dados e log
          getLog(configSave, resp.data, dataVerify)

          if (verify !== null) {
            if (!dataVerify.status) {
              callback(resp.data, configSave, true)
              // eslint-disable-next-line no-throw-literal
              throw 'param01'
            }
          }

          callback(resp.data, configSave)
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'param02'
        }
      })
      .catch((erro) => {
        switch (erro) {
          case 'param01':
            if (url.alternative) {
              console.warn(
                configSave.saveName,
                ': Não corresponde ao esperado, buscando em base alternativa'
              )
              alternative()
            } else {
              console.warn(
                configSave.saveName,
                ': Não corresponde ao esperado, e não há alternativas de busca'
              )
            }
            break
          case 'param02':
            if (url.alternative) {
              console.warn(
                configSave.saveName,
                ': Erro na busca de dados, buscando em base alternativa'
              )
              alternative()
            } else {
              console.warn(
                configSave.saveName,
                ': Erro na busca de dados, e não há alternativas de busca'
              )
            }
            break
          default:
            console.log(erro)
            console.warn(configSave.saveName, ': Erro ao buscar dados')
            break
        }
      })
  }

  const alternative = () => {
    Axios.get(url.alternative + param)
      .then((resp) => {
        if (resp.status === 200) {
          // verificando retorno
          const dataVerify = verifyDataRequest(
            configSave.saveName,
            resp.data,
            verify
          )

          // verificando salvamento de dados e log
          getLog(configSave, resp.data, dataVerify)

          if (verify !== null) {
            if (!dataVerify.status) {
              callback(resp.data, configSave, true)
              // eslint-disable-next-line no-throw-literal
              throw 'param01'
            }
          }

          callback(resp.data, configSave)
        } else {
          // eslint-disable-next-line no-throw-literal
          throw 'param02'
        }
      })
      .catch((erro) => {
        switch (erro) {
          case 'param01':
            console.error(
              configSave.saveName,
              ': Não corresponde ao esperado, essa foi a ultima alternativas de busca'
            )
            break
          case 'param02':
            console.error(
              configSave.saveName,
              ': Erro na busca de dados, essa foi a ultima alternativas de busca'
            )
            break
          default:
            console.log(erro)
            console.warn(configSave.saveName, ': Erro ao buscar dados')
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
