import React, { Component, Fragment } from 'react'
import getData from '../lib/getDate'
import PropType from 'prop-types'
import { checkTimerGet } from '../lib/timerGet'
import {
  checkParam,
  getDataSession,
  checkConfigSave, checkUrl
} from '../lib/getDate/config'
import verifyDataRequest from '../lib/verifyDataRequest'
require('../src/css/progressBar.css')

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: {},
      compare: '',
      data: {},
      // state de controle do loader
      loader: true,
      // state de controle da barra de loader
      progress: false,
      progressValue: 0,
      progressError: '',
      // state base de configuração do props
      configSave: {
        saveLog: props.saveLog,
        timerPause: props.timerPause
      }
    }
  }

  componentDidMount() {
    this.setState({ state: 'start' })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    switch (this.state.state) {
      case 'start':
        this.configRequest(this.props.config, 'siteConfig')
        break
      case 'siteConfig':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (this.props.config) {
              const length = Array.isArray(this.props.config)
                ? Object.keys(this.props.config[0]).length
                : Object.keys(this.props.config).length
              if (
                Object.keys(this.state.data[this.state.compare]).length ===
                length
              ) {
                this.configRequest(this.props.data.data.config, 'requestConfig')
              }
            } else {
              this.nextState()
            }
          }
        }
        break
      case 'requestConfig':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (this.props.data.data.config) {
              const length = Array.isArray(this.props.data.data.config)
                ? Object.keys(this.props.data.data.config[0]).length
                : Object.keys(this.props.data.data.config).length
              if (
                Object.keys(this.state.data[this.state.compare]).length ===
                length
              ) {
                this.configRequest(this.props.data.data.required, 'request')
              }
            } else {
              this.nextState()
            }
          }
        }
        break
      case 'request':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (this.props.data.data.required) {
              const length = Array.isArray(this.props.data.data.required)
                ? Object.keys(this.props.data.data.required[0]).length
                : Object.keys(this.props.data.data.required).length
              if (
                Object.keys(this.state.data[this.state.compare]).length ===
                length
              ) {
                this.configRequest(this.props.data.data.optional, 'optional')
              }
            } else {
              this.nextState()
            }
          }
        }
        break
      case 'optional':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (this.props.data.data.optional) {
              const length = Array.isArray(this.props.data.data.optional)
                ? Object.keys(this.props.data.data.optional[0]).length
                : Object.keys(this.props.data.data.optional).length
              if (
                Object.keys(this.state.data[this.state.compare]).length ===
                length
              ) {
                this.nextState()
              }
            } else {
              this.nextState()
            }
          }
        }
        break
    }
  }

  configRequest = (root, nameRoot) => {
    if (root) {
      if (typeof root === 'object' || Array.isArray(root)) {
        let configSave = {}
        if (Array.isArray(root) && root[1]) {
          configSave = checkConfigSave(
            {
              ...this.state.configSave,
              rootName: nameRoot
            },
            root[1]
          )
          configSave.url = checkUrl(this.props.url, root[1].url)
        } else {
          configSave = {
            ...this.state.configSave,
            rootName: nameRoot,
            url: this.props.url
          }
        }
        this.setState({
          state: nameRoot,
          compare: configSave.rootName,
          progress: false,
          progressValue: 0,
          progressError: ''
        })
        this.request(root, configSave.rootName, configSave)
        return
      }
    }
    this.nextState()
  }

  request = (root, rootName, configSave) => {
    // recolhendo dados de busca de paginas
    // aqui estão os parâmetros de comparação das buscas
    const getSiteConfig = Array.isArray(root) ? root[0] : root

    if (Object.keys(getSiteConfig).length >= 1) {
      this.setState({
        progressValuePart: 100 / Object.keys(getSiteConfig).length,
        data: {
          ...this.state.data,
          [configSave.rootName]: {}
        }
      })

      let dataSession = false

      Object.keys(getSiteConfig).map((n) => {
        let param = {}
        let url = {}
        if (getSiteConfig[n][1]) {
          param = checkParam(n, getSiteConfig[n][1].param)
          url = checkUrl(configSave.url, getSiteConfig[n][1].url)
        } else {
          param = checkParam(n, {})
          url = configSave.url
        }

        if (checkTimerGet(rootName, param.saveName)) {
          getData(
            url,
            param,
            this.callback,
            getSiteConfig[n][0],
            getSiteConfig[n][1],
            configSave
          )
        } else if (getDataSession(configSave.rootName, param.saveName)) {
          const dataVerify = verifyDataRequest(
            param,
            getDataSession(configSave.rootName, param.saveName),
            getSiteConfig[n][0]
          )

          if (!dataVerify.status) {
            getData(
              url,
              param,
              this.callback,
              getSiteConfig[n][0],
              getSiteConfig[n][1],
              configSave
            )
          } else {
            if (dataSession === false) {
              dataSession = {}
            }
            dataSession = {
              ...dataSession,
              [param.saveName]: {
                ...getDataSession(configSave.rootName, param.saveName)
              }
            }
          }
        } else {
          getData(
            url,
            param.saveName,
            this.callback,
            getSiteConfig[n][0],
            getSiteConfig[n][1],
            configSave
          )
        }
      })

      if (dataSession !== false && Object.keys(dataSession).length >= 1) {
        this.setState({
          data: {
            ...this.state.data,
            [rootName]: {
              ...this.state.data[rootName],
              ...dataSession
            }
          }
        })
      }
    } else {
      this.setState({
        next: true,
        data: {
          ...this.state.data,
          [rootName]: {}
        }
      })
    }
  }

  nextState = () => {
    const state = this.state.state
    let next = ''
    switch (state) {
      case 'siteConfig':
        next = 'requestConfig'
        break
      case 'requestConfig':
        next = 'request'
        break
      case 'request':
        next = 'optional'
        break
      case 'optional':
        next = 'final'
        break
    }

    this.setState({ state: next })
  }

  callback = (name, data, nivel, error = false) => {
    if (error) {
      this.setState({
        progressError: 'error'
      })
    } else {
      this.setState({
        data: {
          ...this.state.data,
          [nivel]: {
            ...this.state.data[nivel],
            [name]: data
          }
        },
        progressValue: this.state.progressValue + this.state.progressValuePart
      })
    }
  }

  render() {
    const { progressValue, progressError } = this.state

    if (this.state.state === 'final') {
      return (
        <this.props.data.Page
          {...this.state.data}
          loaderOn={() => this.setState({ loader: true })}
          loaderOff={() => this.setState({ loader: false })}
        />
      )
    }

    return (
      <Fragment>
        {this.props.Loader}
        <div className='pre-progress'>
          <div className='progress'>
            <div
              className={`progress-value ${progressError}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
      </Fragment>
    )
  }
}

index.defaultProps = {
  config: {},
  timerPause: 3,
  url: {
    base:
      window.location.origin + '/core_magales/Public/Functions/DataSite?page=',
    alternative:
      window.location.origin + '/core_magales/Public/Functions/DataSite?page=',
    test:
      window.location.origin +
      '/core_magales/Public/Functions/DataSite/previa?page='
  },
  permiteErro: false,
  saveLog: true
}

index.propTypes = {
  //config: PropType.object,
  timerPause: PropType.number,
  baseUrl: PropType.object,
  alternativeUrl: PropType.string,
  TestUrl: PropType.string
}

export default index
