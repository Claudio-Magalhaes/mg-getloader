import React from 'react'
import listVerifyData from "../lib/entradas/listRequestData";
import getData from "../lib/getData";

const VerifyData = d => {
  let data = {};

  /**
   *
   */
  if (typeof d.data === "object"){
    if (typeof d.data.config === "object" && Object.keys(d.data.config).length >= 1){
      data.config = d.data.config;
    } else {
      data.config = false;
    }

    if (typeof d.data.require === "object" && Object.keys(d.data.require).length >= 1){
      data.require = d.data.require;
    } else {
      data.require = false;
    }

    if (typeof d.data.optional === "object" && Object.keys(d.data.optional).length >= 1){
      data.optional = d.data.optional;
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

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loader: true
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

    if (typeof this.state.listVerify === "object" && this.state.loader === true) {
      if (
        Object.values(this.state.listVerify.config).indexOf(false) === -1 &&
        Object.values(this.state.listVerify.require).indexOf(false) === -1
      ) {
        this.setState({ loader: false });
      }

    }
  }

  configGetData = () => {
    let list = this.state.listVerify;

    let dataRouter = this.props.data.data;

    Object.keys(list.config).map(n => {
      getData(n, p => {
        this.setState({listVerify: {
            ...this.state.listVerify,
            config: {
              ...this.state.listVerify.config,
              [n]: true
            }
          }});
      }, dataRouter.config[n])
    });

    Object.keys(list.require).map(n => {
      getData(n, p => {
        this.setState({listVerify: {
            ...this.state.listVerify,
            require: {
              ...this.state.listVerify.require,
              [n]: p
            }
          }});
      }, dataRouter.require[n])
    });

    Object.keys(list.optional).map(n => {
      getData(n, p => {
        this.setState({listVerify: {
            ...this.state.listVerify,
            optional: {
              ...this.state.listVerify.optional,
              [n]: true
            }
          }});
      }, dataRouter.optional[n])
    })
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
