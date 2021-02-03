
export const getLog = p => {
  if(sessionStorage.getItem('getLog')) {
    return JSON.parse(sessionStorage.getItem('getLog'));
  } else {
    return {};
  }
};

function loopSetLog(p, log, v) {

  p.map(v => {
    console.log(v, v);
  });

  return log;
}

export const setLog = (p, v, log) => {

  let newLog = {...log};

  if (Array.isArray(p)) {
    newLog[p] = loopSetLog(p, log, v);
  } else {
    newLog[p] = v;

  }

  sessionStorage.setItem("getLog", JSON.stringify(newLog));

};
