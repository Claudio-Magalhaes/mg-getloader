const verifyDataRequest = (page, data, verify, cont = false) => {
  if (typeof verify === "string") {

    if(verify === "array"){
      return Array.isArray(data);
    }

    return typeof data === verify;

  } else if (Array.isArray(verify)) {
    if (verify.length <= 0) {
      return Array.isArray(data);
    } else {
      let retorno = {};

      Object.keys(verify).map(v => {
        retorno[v] = verifyDataRequest(v, data[v], verify[0], true);
      });

      return retorno;
    }


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
