import React, { Component, Fragment } from 'react'
import getData from './lib/getData'
import PropType from 'prop-types'
import { checkTimerGet } from './lib/timer'
import check from './lib/helpers'
import getDataSession from '../get'
import verifyDataRequest from './lib/verifyDataRequest'
import DefaultLoader from './container/loader'
import ProgressBar from './container/progressBar'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      state: {},
      compare: '',
      data: {},
      // state de controle do loader
      loader: false,
      propsLoader: {},
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
                if (!this.props.data.data) {
                  this.nextState('final')
                } else {
                  this.configRequest(
                    this.props.data.data.config,
                    'requestConfig'
                  )
                }
              }
            } else {
              this.nextState()
            }
          }
        }
        break
      case 'requestConfig':
        if (this.verifyState('config')) {
          this.configRequest(this.props.data.data.required, 'request')
        }
        break
      case 'request':
        if (this.verifyState('required')) {
          this.configRequest(this.props.data.data.optional, 'optional')
        }
        break
      case 'optional':
        if (this.verifyState('optional')) {
          this.nextState()
        }
        break
      default:
        break
    }
  }

  verifyState = (nivelData) => {
    if (this.state.compare) {
      if (this.state.data[this.state.compare]) {
        let config = {}

        if (this.props.data.data[nivelData]) {
          config = this.props.data.data[nivelData]
        }

        const length = Array.isArray(config)
          ? Object.keys(config[0]).length
          : Object.keys(config).length

        if (
          Object.keys(this.state.data[this.state.compare]).length ===
          length
        ) {
          return true
        }
      }
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

  nextState = (immed = null) => {
    if (immed) {
      this.setState({ state: immed })
    } else {
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
    const { state, progressValue, progressError } = this.state
    const {
      save,
      Loader,
      config,
      data,
      loaderOff,
      permiteErro,
      saveLog,
      timerPause,
      url,
      ...rest
    } = this.props

    if (
      (state === 'final' ||
        state === 'optional' ||
        this.props.loaderOff === true) &&
      this.state.loader !== true
    ) {
      return (
        <this.props.data.Page
          {...rest}
          {...this.state.data}
          loaderOn={(propsLoader = null) => {
            if (
              propsLoader &&
              !Array.isArray(propsLoader) &&
              typeof propsLoader === 'object'
            ) {
              this.setState({ loader: true })
            } else {
              this.setState({
                loader: true,
                classesLoader: propsLoader
              })
            }
          }}
          loaderOff={() => this.setState({ loader: false, propsLoader: {} })}
        />
      )
    }

    return (
      <Fragment>
        <this.props.Loader />
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <ProgressBar
          progressValue={progressValue}
          progressError={progressError}
        />
      </Fragment>
    )
  }
}

index.defaultProps = {
  config: {},
  url: {
    base:
      window.location.origin + '/core_magales/Public/Functions/DataSite?pages=',
    alternative:
      window.location.origin + '/core_magales/Public/Functions/DataSite?pages=',
    test:
      window.location.origin +
      '/core_magales/Public/Functions/DataSite/previa?pages='
  },
  data: {},
  timerPause: 3,
  Loader: DefaultLoader,
  loaderOff: false,
  save: true,
  saveLog: true,
  permiteErro: false
}

index.propTypes = {
  config: PropType.oneOfType([PropType.object, PropType.array]),
  url: PropType.oneOfType([
    PropType.shape({
      base: PropType.string,
      alternative: PropType.string,
      test: PropType.string,
      anula: PropType.bool
    }),
    PropType.array
  ]),
  data: PropType.oneOfType([PropType.object, PropType.array]),
  timerPause: PropType.number,
  Loader: PropType.node,
  loaderOff: PropType.bool,
  save: PropType.bool,
  saveLog: PropType.bool,
  permiteErro: PropType.bool
}

export default index
