import { getLog, setLog } from "./logData"


const loop = (page, data, verify, log = getLog(page)) => {

  if (typeof verify === "string") {

    let result = typeof data === verify;

    setLog(page, result, log);

    return log;

  } else if (typeof verify === "object") {

    if (Object.keys(verify).length >= 1) {

      if (!Array.isArray(page)) {
        let valor0 = page;
        page = [];
        page.push(valor0[0]);
      }

      Object.keys(verify).map((p, v) => {

        page.push(p);

        loop(page, data[p], verify[p], log[p]);
      });

    } else {
      return typeof data === typeof verify;
    }

    return log;

  }

    return log;
};

const _verifyDataRequest = (page, data, verify) => {

  if (typeof verify === "string") {

    let result = typeof data === verify;

    //setLog(page, result);

    return result;

  } else if (typeof verify === "object") {
    console.log(loop(page, data, verify));
    console.log("getLog - ", JSON.parse(sessionStorage.getItem("getLog")));
  }
  return true;
  //console.log(loop(data, verify));
};

const loop2 = (page, data, verify) => {
  let novoNivel = {};

  if (typeof verify === "string") {

    let result = typeof data === verify;

    novoNivel = {[page]: result};

  } else if (typeof verify === "object") {
    Object.keys(verify).map(v => {
      let tester = !loop2(v, data[v], verify[v])[v] ? loop2(v, data[v], verify[v]) : loop2(v, data[v], verify[v])[v];
      novoNivel[v] = tester;
    });
  }

  return novoNivel;

};

const verifyDataRequest = (page, data, verify) => {

  if (typeof verify === "string") {

    let result = typeof data === verify;

    return {[page]: result};

  } else if (typeof verify === "object") {
    return loop2(page, data, verify);
  }
  return false;
};

export default verifyDataRequest;
