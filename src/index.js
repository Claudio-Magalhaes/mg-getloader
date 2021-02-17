import React from 'react';
import listVerifyData from "../lib/entradas/listRequestData";
import getData from "../lib/getData";

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      liberado: {
        config: false,
        require: false,
        optional: false
      },
      verificado: {}
    };
  }

  componentDidMount() {
    let listVerify = listVerifyData(this.props.data);

    if (listVerify === false) {
      this.setState({
        loader: false,
      });
    } else {
      this.setState({
        listVerify
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(typeof prevState.listVerify === "undefined" && typeof this.state.listVerify === "object"){
      this.configGetData();
    }

    if (
      typeof this.state.listVerify === "object" &&
      this.state.loader === true &&
      Object.values(this.state.liberado).indexOf(false) === -1 &&
      this.state.liberado !== prevState.liberado
    ) {
      this.verifyDisableLoader();
    }


    if (Object.keys(this.state.liberado).length === Object.keys(this.state.verificado).length && this.state.loader) {
      if (Object.values(this.state.verificado).indexOf(false) === -1){
        this.setState({
          loader: false
        })
      }
    }
  }

  loop = (c, listVerify, push = false) => {
    let log = [];
    if (typeof listVerify[c] === "boolean") {
      return [listVerify[c]];
    } else if (typeof listVerify[c] === "object") {
      Object.keys(listVerify[c]).map((v, k, b, p=push) => {

        if (p) {
          log.concat(...this.loop(v, listVerify[c], true));
        } else {
          log.push(...this.loop(v, listVerify[c], true));
        }
        log = [
          ...log,
          ...this.loop(v, listVerify[c], true)
        ];

      });
    }
    return log
  };

  verifyDisableLoader = () => {
    let objVerify = {};
    let self = this;

    Object.keys(this.state.liberado).map(v => {
      objVerify[v] = this.loop(v, this.state.listVerify).indexOf(false) === -1;

    });

    this.setState({
      verificado: objVerify
    })
  };

  configGetData = () => {

    let list = this.state.listVerify;

    let dataRouter = this.props.data.data;

    Object.keys(list).map(l => {
      if (typeof list[l] === "object") {

        if (Object.keys(list[l]).length > 0) {

          Object.keys(list[l]).map(n => {
            getData(n, p => {
              this.setState({
                listVerify: {
                  ...this.state.listVerify,
                  [l]: {
                    ...this.state.listVerify[l],
                    [n]: p
                  }
                },
                liberado: {
                  ...this.state.liberado,
                  [l]: true
                }
              });
            }, dataRouter[l][n])
          });
          return;
        }
      }

      let liberado = this.state.liberado;
      delete liberado[l];

      this.setState({
        liberado: liberado
      })
    });

  };

  render() {
    const {
      loader
    } = this.state;


    if (loader) {
      return this.props.Loader;
    } else {
      return (
        <this.props.data.Page {...this.props}  />
      )
    }
  }

}

export default Index;
