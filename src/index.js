import React, { Component, Fragment } from 'react'
import getData from '../lib/getDate'
import PropType from 'prop-types'
import { checkTimerGet, setTmerGet } from '../lib/timerGet'
require('../src/css/progressBar.css')
import { checkParam, getDataSession } from "../lib/getDate/config"
import verifyDataRequest from '../lib/verifyDataRequest'
import getLog from '../lib/getDate/getLog'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: true,
      progress: false,
      progressValue: 0,
      progressError: '',
      data: {}
    }
  }

  componentDidMount() {
    const props = this.props
    new Promise((resolve, reject) => {
      if (
        typeof this.props.config === 'object' ||
        Array.isArray(this.props.config)
      ) {
        // recolhendo dados de busca de paginas
        const getSiteConfig = Array.isArray(this.props.config)
          ? this.props.config[0]
          : this.props.config

        // iniciando configurações de salvamento geral de dados
        const configSave = {
          saveLog: this.props.saveLog,
          rootName: 'siteConfig',
          timerPause: props.timerGet
        }

        // alterando dados de salvamento pelo grupo
        if (this.props.config[1]) {
          if (typeof this.props.config[1] === 'object') {
            if (props.config[1].name) {
              configSave.rootName = props.config[1].name
            }
            if (props.config[1]) {
              configSave.timerPause = props.config[1].timerGet
            }
          }
        }

        if (Object.keys(getSiteConfig).length >= 1) {
          this.setState({
            progressValuePart: 100 / Object.keys(getSiteConfig).length
          })

          let self = this

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
              }

              this.setState({
                progressValue:
                  this.state.progressValue +
                  100 / Object.keys(getSiteConfig).length
              })
            } else {
              window.alert('ultimo get')
            }
          })

          resolve()
        }
      }

      resolve()
    })
      .then((name, data, root) => {
      })
      .catch((e) => {
        console.log(e)
        console.error(
          'erro de busca:',
          'não foi possível buscar dados de configuração do site'
        )
      })
  }

  callback = (name, data, nivel, error = false) => {
    this.setState({
      progressValue: this.state.progressValue + this.state.progressValuePart
    })
    console.log(name)
    console.log(data)
    console.log(nivel)
    if (error) {
      this.setState({
        progressError: 'error'
      })
    } else {
      this.setState({
        data: {
          ...data,
          [nivel]: {
            ...data[nivel],
            [name]: data
          }
        },
        progressValue: this.state.progressValue + this.state.progressValuePart
      })
    }
  }

  render() {
    const { loader, progressValue, progressError } = this.state

    if (!loader) {
      return (
        <this.props.data.Page
          {...this.props}
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
