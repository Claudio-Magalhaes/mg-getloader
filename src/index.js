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
      this.verifyDisableLoader();
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

    Object.keys(list.config).map(n => {
      getData(n, p => {
        this.setState({
          listVerify: {
            ...this.state.listVerify,
            config: {
              ...this.state.listVerify.config,
              [n]: {...p}
            }
          },
          liberado: {
            ...this.state.liberado,
            config: true,
            optional: true
          }
        });
      }, dataRouter.config[n])
    });

    Object.keys(list.require).map(n => {
      getData(n, p => {
        this.setState({
          listVerify: {
            ...this.state.listVerify,
            require: {
              ...this.state.listVerify.require,
              [n]: typeof p === "object" ? {...p} : p
            }
          },
          liberado: {
            ...this.state.liberado,
            require: true
          }
        });
      }, dataRouter.require[n])
    });

    Object.keys(list.optional).map(n => {
      getData(n, p => {
        this.setState({
          listVerify: {
            ...this.state.listVerify,
            optional: {
              ...this.state.listVerify.optional,
              [n]: true
            }
          },
          liberado: {
            ...this.state.liberado,
            optional: true
          }
        });
      }, dataRouter.optional[n])
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
        <this.props.data.Page {...this.props} />
      )
    }
  }

}

export default Index;
