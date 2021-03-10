export const checkTimerGet = (root, nomeTimer) => {
  const timer = window.sessionStorage.getItem('timerGetData')
    ? JSON.parse(window.sessionStorage.getItem('timerGetData'))
    : {}

  if (timer[nomeTimer]) {
    return timer[nomeTimer] <= Date.now()
  }
  return true
}

export const setTmerGet = (nomeTimer, pause) => {
  const timer = window.sessionStorage.getItem('timerGetData')
    ? JSON.parse(window.sessionStorage.getItem('timerGetData'))
    : {}

  timer[nomeTimer] = Date.now() + 1000 * 60 * pause
  window.sessionStorage.setItem('timerGetData', JSON.stringify(timer))
}
