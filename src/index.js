import React from 'react'
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
      }
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
      Object.values(this.state.liberado).indexOf(false) === -1
    ) {
      this.setState({ loader: false });
    } else if (
      typeof this.state.listVerify === "object" &&
      this.state.loader === true
    ) {

    }
  }

  verifyDisableLoader = () => {
    let objVerify = {};
    let self = this;

    const loop = (c, listVerify) => {
      let log = [];
      if (typeof listVerify[c] === "boolean") {
        return [listVerify[c]];
      } else if (typeof listVerify[c] === "object") {

        Object.keys(listVerify[c]).map(v => {
          log = [
            ...log,
            ...loop(v, listVerify[c])
          ];
        });
      }

      return log;
    };
    Object.keys(this.state.listVerify).map(v => {
      objVerify[v] = loop(v, this.state.listVerify);
      self.setState({
        liberado: {
          ...self.state.liberado,
          [v]: loop(v, self.state.listVerify).indexOf(false) === -1
        }
      })
    });
  };

  configGetData = () => {

    let list = this.state.listVerify;

    let dataRouter = this.props.data.data;

    Object.keys(list).map(l => {
      if (typeof list[l] === "object") {
        if (Object.keys(list[l]).length > 0) {
          Object.keys(list.config).map(n => {
            getData(n, p => {
              this.setState({
                listVerify: {
                  ...this.state.listVerify,
                  [l]: {
                    ...this.state.listVerify[l],
                    [n]: {...p}
                  }
                },
                liberado: {
                  ...this.state.liberado,
                  [l]: true
                }
              });
            }, dataRouter.config[n])
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
