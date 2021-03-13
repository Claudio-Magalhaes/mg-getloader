import React, { Component, Fragment } from 'react'
import getData from '../lib/getDate'
import PropType from 'prop-types'
import { checkTimerGet } from '../lib/timerGet'
import { getDataSession, check } from '../lib/getDate/config'
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
        param: '',
        save: true,
        saveLog: true,
        timerPause: 3,
        url: {},
        permiteErro: false
      }
    }
  }

  componentDidMount() {
    const props = this.props
    this.setState({
      state: 'start',
      configSave: {
        ...this.state.configSave,
        save: props.save,
        saveLog: props.saveLog,
        timerPause: props.timerPause,
        url: props.url,
        permiteErro: props.permiteErro
      }
    })
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

  configRequest = (root, rootName) => {
    if (root) {
      if (typeof root === 'object' || Array.isArray(root)) {
        let configSave = this.state.configSave
        configSave.rootName = rootName

        if (Array.isArray(root) && root[1]) {
          configSave = check(configSave, root[1])
        }

        this.setState({
          state: rootName,
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
        let finalConfig = configSave
        finalConfig.saveName = n
        if (getSiteConfig[n][1]) {
          finalConfig = check(finalConfig, getSiteConfig[n][1])
        }

        if (checkTimerGet(finalConfig.rootName, finalConfig.saveName)) {
          getData(
            finalConfig.url,
            finalConfig.param,
            this.callback,
            getSiteConfig[n][0],
            finalConfig
          )
        } else if (getDataSession(finalConfig.rootName, finalConfig.saveName)) {
          const dataVerify = verifyDataRequest(
            finalConfig.saveName,
            getDataSession(finalConfig.rootName, finalConfig.saveName),
            getSiteConfig[n][0]
          )

          if (!dataVerify.status) {
            getData(
              finalConfig.url,
              finalConfig.param,
              this.callback,
              getSiteConfig[n][0],
              finalConfig
            )
          } else {
            if (dataSession === false) {
              dataSession = {}
            }
            dataSession = {
              ...dataSession,
              [finalConfig.saveName]: {
                ...getDataSession(finalConfig.rootName, finalConfig.saveName)
              }
            }
          }
        } else {
          getData(
            finalConfig.url,
            finalConfig.param,
            this.callback,
            getSiteConfig[n][0],
            finalConfig
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

  callback = (data, configSave, error = false) => {
    if (error && configSave.permiteErro === false) {
      this.setState({
        progressError: 'error'
      })
    } else {
      this.setState({
        data: {
          ...this.state.data,
          [configSave.rootName]: {
            ...this.state.data[configSave.rootName],
            [configSave.saveName]: data
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
  save: true,
  saveLog: true,
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
  permiteErro: false
}

index.propTypes = {
  //config: PropType.object,
  timerPause: PropType.number,
  baseUrl: PropType.object,
  alternativeUrl: PropType.string,
  TestUrl: PropType.string
}

export default index
