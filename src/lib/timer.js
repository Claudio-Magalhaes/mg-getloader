export const checkTimerGet = (rootName, nomeTimer) => {
  const timer = window.sessionStorage.getItem('timerGetData')
    ? JSON.parse(window.sessionStorage.getItem('timerGetData'))
    : {}

  if (!timer[rootName]) {
    return true
  }

  if (timer[rootName][nomeTimer]) {
    return timer[rootName][nomeTimer] <= Date.now()
  }
  return true
}

export const setTmerGet = (rootName, nomeTimer, pause) => {
  const timer = window.sessionStorage.getItem('timerGetData')
    ? JSON.parse(window.sessionStorage.getItem('timerGetData'))
    : {}

  if (!timer[rootName]) {
    timer[rootName] = {}
  }

  timer[rootName] = {
    ...timer[rootName],
    [nomeTimer]: Date.now() + 1000 * 60 * pause
  }

  window.sessionStorage.setItem('timerGetData', JSON.stringify(timer))
}
