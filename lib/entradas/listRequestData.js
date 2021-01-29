
const verifica = pg => {
  let list = {};

  Object.keys(pg).map(p => {
    list[p] = false;
  });

  return list;
};

const listVerifyData = d => {
  let data = {};

  /**
   *
   */
  if (typeof d.data === "object"){
    if (typeof d.data.config === "object" && Object.keys(d.data.config).length >= 1){
      data.config = verifica(d.data.config);
    } else {
      data.config = false;
    }

    if (typeof d.data.require === "object" && Object.keys(d.data.require).length >= 1){
      data.require = verifica(d.data.require);
    } else {
      data.require = false;
    }

    if (typeof d.data.optional === "object" && Object.keys(d.data.optional).length >= 1){
      data.optional = verifica(d.data.optional);
    } else {
      data.optional = false;
    }

  } else {
    data = false;
  }

  /**
   *
   */
  return data !== false ?
    (data.config === false) && (data.require === false) && (data.optional === false) ? false : data
    : data;
};

export default listVerifyData;
