const verifyDataRequest = (page, data, verify, cont = false) => {

  if (typeof verify === "string") {

    return typeof data === verify;

  } else if (typeof verify === "object") {
    let retorno = {};

    Object.keys(verify).map(v => {
      retorno[v] = verifyDataRequest(v, data[v], verify[v], true);
    });

    return retorno;
  }
  return false;
};

export default verifyDataRequest;
