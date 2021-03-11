import React, { Component, Fragment } from 'react'
import getData from '../lib/getDate'
import PropType from 'prop-types'
import { checkTimerGet } from '../lib/timerGet'
import { checkParam, getDataSession } from '../lib/getDate/config'
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
      progressError: ''
    }
  }

  componentDidMount() {
    this.siteConfig()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    switch (this.state.state) {
      case 'siteConfig':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (
              Object.keys(this.state.data[this.state.compare]).length ===
              Object.keys(this.props.config).length
            ) {
              this.requestConfig()
            }
          }
        }
        break
      case 'requestConfig':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (
              Object.keys(this.state.data[this.state.compare]).length ===
              Object.keys(this.props.data.data.config).length
            ) {
              this.request()
            }
          }
        }
        break
      case 'request':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (
              Object.keys(this.state.data[this.state.compare]).length ===
              Object.keys(this.props.data.data.require).length
            ) {
              this.requestOptional()
            }
          }
        }
        break
      case 'optional':
        if (this.state.compare) {
          if (this.state.data[this.state.compare]) {
            if (this.props.data.data.optional) {
              if (
                Object.keys(this.state.data[this.state.compare]).length ===
                Object.keys(this.props.data.data.optional).length
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

  siteConfig = () => {
    this.setState({
      state: 'siteConfig',
      compare: 'siteConfig'
    })
    this.configGet(this.props.config, 'siteConfig')
  }

  requestConfig = () => {
    if (this.props.data.data.config) {
      if (this.props.data.data.config[0]) {
        this.setState({
          state: 'requestConfig',
          compare: 'config',
          progress: false,
          progressValue: 0,
          progressError: ''
        })
        this.configGet(this.props.data.data.config, 'config')
        return
      }
    }
    this.nextState()
  }

  request = () => {
    if (this.props.data.data.require) {
      if (this.props.data.data.require[0]) {
        this.setState({
          state: 'request',
          compare: 'require',
          progress: false,
          progressValue: 0,
          progressError: ''
        })
        this.configGet(this.props.data.data.require, 'require')
        return
      }
    }
    this.nextState()
  }

  requestOptional = () => {
    if (this.props.data.data.optional) {
      if (this.props.data.data.optional[0]) {
        this.setState({
          state: 'requestOptional',
          compare: 'optional',
          progress: false,
          progressValue: 0,
          progressError: ''
        })
        this.configGet(this.props.data.data.config, 'optional')
        return
      }
    }
    this.nextState()
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
        timerPause: this.props.timerGet
      }

      // alterando dados de salvamento pelo grupo
      if (root[1]) {
        if (typeof root[1] === 'object') {
          if (root[1].name) {
            configSave.rootName = root[1].name
          }
          if (root[1].timerGet) {
            configSave.timerPause = root[1].timerGet
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
                    configSave.timerPause = getSiteConfig[n][2].timerGet
                  }
                }
              }

              const name = checkParam(n, getSiteConfig[n][1]).saveName

              if (checkTimerGet(configSave.rootName, name)) {
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
                  this.callback(null, null, null, true)
                } else {
                  this.callback(
                    name,
                    getDataSession(configSave.rootName, name),
                    configSave.rootName
                  )
                }
              } else {
                window.alert('ultimo get')
              }
            })
          }

          resolve()
        })
          .then((e) => {

          })
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
  timerGet: 3,
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
  config: PropType.object,
  timerGet: PropType.number,
  baseUrl: PropType.object,
  alternativeUrl: PropType.string,
  TestUrl: PropType.string
}

export default index
