import { setTmerGet } from '../timerGet'

/**
 * função salvará dados de retorno na session de acordo com a raiz, como por
 * exemplo 'siteConfig' ou 'require', e dentro desse utilizará o nome de
 * salvameto para salvar os dados.
 *
 * Caso a alternativa de salvamento de log esteja ativa, será também salvo um
 * log com os resultados da verificações, para que possa ser visto um possível
 * erro
 *
 * @param configSave
 * @param data
 * @param name
 * @param dataVerify
 */
const index = (configSave, data, name, dataVerify) => {
  const dataRoot = window.sessionStorage.getItem(configSave.rootName)
    ? JSON.parse(window.sessionStorage.getItem(configSave.rootName))
    : {}

  window.sessionStorage.setItem(
    configSave.rootName,
    JSON.stringify({
      ...dataRoot,
      [name]: data
    })
  )

  if (configSave.saveLog) {
    const log = window.sessionStorage.getItem('siteLog')
      ? JSON.parse(window.sessionStorage.getItem('siteLog'))
      : { [configSave.rootName]: {} }

    window.sessionStorage.setItem(
      'siteLog',
      JSON.stringify({
        ...log,
        [configSave.rootName]: {
          ...log[configSave.rootName],
          [name]: dataVerify.log
        }
      })
    )
  }

  setTmerGet(name, configSave.timerPause)
}

export default index
