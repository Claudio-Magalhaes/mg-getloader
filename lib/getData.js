import Axios from 'axios'
import verifyDataRequest from './verifyDataRequest'

const getData = (page, calback, verify = null) => {
  const getServer = () => {
    Axios.get(
      window.location.origin +
        '/core_magales/Public/Functions/DataSite?page=' +
        page
    )
      .then((resp) => {
        window.sessionStorage.setItem(page, JSON.stringify(resp.data))
        global.dataSite[page] = {
          ...global.dataSite[page],
          [page]: resp.data
        }
        if (verify !== null) {
          calback(verifyDataRequest(page, resp.data, verify))
        } else {
          calback(true)
        }
      })
      .catch((erro) => {
        console.log(erro)
        console.error(
          page,
          ': Erro ao buscar dados',
          'redirecionando busca para base de arquivos'
        )
        getDoc()
      })
  }

  const getDoc = () => {
    Axios.get('/_Doc/Public/site/pages/' + page + '.json')
      .then((resp) => {
        window.sessionStorage.setItem(page, JSON.stringify(resp.data))
        global.dataSite[page] = {
          ...global.dataSite[page],
          [page]: resp.data
        }
        if (verify !== null) {
          calback(verifyDataRequest(page, resp.data, verify))
        } else {
          calback(true)
        }
      })
      .catch((erro) => {
        console.log('erro', erro)
        console.error(
          'ERRO CRITICO',
          'Nenhuma base de dados respondeu ao site.'
        )
      })
  }

  const getPrevia = () => {
    Axios.get('/core_magales/Public/Functions/DataSite/previa?page=' + page)
      .then((resp) => {
        window.sessionStorage.setItem(page, JSON.stringify(resp.data))
        global.dataSite[page] = {
          ...global.dataSite[page],
          [page]: resp.data
        }
        if (verify !== null) {
          calback(verifyDataRequest(page, resp.data, verify))
        } else {
          calback(true)
        }
      })
      .catch((erro) => {
        console.log('erro', erro)
        console.log('Erro ao buscar dados, buscando da base publica')
        getServer()
      })
  }

  const verifyPrevius = () => {
    if (window.sessionStorage.getItem('VerPreviaDoSite') === 'true') {
      getPrevia()
    } else {
      getServer()
    }
  }

  if (window.sessionStorage.getItem(page) || global.dataSite[page]) {
    if (global.dataSite[page]) {
      calback(verifyDataRequest(page, global.dataSite[page]), verify)
    } else {
      calback(
        verifyDataRequest(
          page,
          JSON.parse(window.sessionStorage.getItem(page)),
          verify
        )
      )
    }
  }

  verifyPrevius()
}

export default getData
