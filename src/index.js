import React, { Component, Fragment } from 'react'
import getData from '../lib/getDate'
import PropType from 'prop-types'
import { checkTimerGet } from '../lib/timerGet'
import {
  checkParam,
  getDataSession,
  checkConfigSave
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
        if (Array.isArray(root)) {
          configSave = checkConfigSave(
            {
              ...this.state.configSave,
              rootName: nameRoot
            },
            root[1]
          )
        } else {
          configSave = {
            ...this.state.configSave,
            rootName: nameRoot
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

    // alterando dados de salvamento pelo grupo
    // aqui estão os daods de url das buscas
    if (root[1]) {
      checkConfigSave(configSave, root[1])
      if (typeof root[1] === 'object') {
        if (root[1].name) {
          configSave.rootName = root[1].name
        }
        if (root[1].timerPause) {
          configSave.timerPause = root[1].timerPause
        }
      }
    }

    if (Object.keys(getSiteConfig).length >= 1) {
      this.setState({
        progressValuePart: 100 / Object.keys(getSiteConfig).length,
        data: {
          ...this.state.data,
          [rootName]: {}
        }
      })

      let dataSession = false

      if (Object.keys(getSiteConfig).length >= 1) {
        this.setState({
          progressValuePart: 100 / Object.keys(getSiteConfig).length
        })

        Object.keys(getSiteConfig).map((n) => {
          // alterando dados de salvamento individual
          if (getSiteConfig[n][2]) {
            if (typeof getSiteConfig[n][2] === 'object') {
              if (getSiteConfig[n][2].name) {
                configSave.rootName = getSiteConfig[n][2].name
              }
              if (getSiteConfig[n][2]) {
                configSave.timerPause = getSiteConfig[n][2].timerPause
              }
            }
          }

          const name = checkParam(n, getSiteConfig[n][1]).saveName

          if (checkTimerGet(rootName, name)) {
            getData(
              this.props.url,
              n,
              this.callback,
              getSiteConfig[n][0],
              getSiteConfig[n][1],
              configSave
            )
          } else if (getDataSession(configSave.rootName, name)) {
            const dataVerify = verifyDataRequest(
              name,
              getDataSession(configSave.rootName, name),
              getSiteConfig[n][0]
            )

            if (!dataVerify.status) {
              getData(
                this.props.url,
                n,
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
                [name]: {
                  ...getDataSession(configSave.rootName, name)
                }
              }
            }
          } else {
            getData(
              this.props.url,
              n,
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

  configGet = (root, rootName) => {
    if (typeof root === 'object' || Array.isArray(root)) {
      // recolhendo dados de busca de paginas
      const getSiteConfig = Array.isArray(root) ? root[0] : root

      // iniciando configurações de salvamento geral de dados
      const configSave = {
        saveLog: this.props.saveLog,
        rootName: rootName,
        timerPause: this.props.timerPause
      }

      // alterando dados de salvamento pelo grupo
      if (root[1]) {
        if (typeof root[1] === 'object') {
          if (root[1].name) {
            configSave.rootName = root[1].name
          }
          if (root[1].timerPause) {
            configSave.timerPause = root[1].timerPause
          }
        }
      }

      if (Object.keys(getSiteConfig).length >= 1) {
        this.setState({
          progressValuePart: 100 / Object.keys(getSiteConfig).length,
          data: {
            ...this.state.data,
            [rootName]: {}
          }
        })

        let dataSession = false

        // eslint-disable-next-line no-new
        new Promise((resolve, reject) => {
          if (Object.keys(getSiteConfig).length >= 1) {
            this.setState({
              progressValuePart: 100 / Object.keys(getSiteConfig).length
            })

            Object.keys(getSiteConfig).map((n) => {
              // alterando dados de salvamento individual
              if (getSiteConfig[n][2]) {
                if (typeof getSiteConfig[n][2] === 'object') {
                  if (getSiteConfig[n][2].name) {
                    configSave.rootName = getSiteConfig[n][2].name
                  }
                  if (getSiteConfig[n][2]) {
                    configSave.timerPause = getSiteConfig[n][2].timerPause
                  }
                }
              }

              const name = checkParam(n, getSiteConfig[n][1]).saveName

              if (checkTimerGet(rootName, name)) {
                getData(
                  this.props.url,
                  n,
                  this.callback,
                  getSiteConfig[n][0],
                  getSiteConfig[n][1],
                  configSave
                )
              } else if (getDataSession(configSave.rootName, name)) {
                const dataVerify = verifyDataRequest(
                  name,
                  getDataSession(configSave.rootName, name),
                  getSiteConfig[n][0]
                )

                if (!dataVerify.status) {
                  getData(
                    this.props.url,
                    n,
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
                    [name]: {
                      ...getDataSession(configSave.rootName, name)
                    }
                  }
                }
              } else {
                getData(
                  this.props.url,
                  n,
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
          }

          resolve()
        })
          .then((e) => {})
          .catch((e) => {
            console.log(e)
          })
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
