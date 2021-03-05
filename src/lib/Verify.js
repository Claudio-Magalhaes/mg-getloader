import React from 'react'

class Verify extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: true
    }
  }

  componentDidMount() {
    if (typeof data.conferiData === 'object' && verifyData === false) {
      setVerifyData(true)
      if (Object.keys(data.conferiData).length > 0) {
        setVerifyData(montarVerify(data.conferiData))
      }

      if (
        typeof data.conferiData === 'object' &&
        typeof montarVerify(data.conferiData) === 'object'
      ) {
      }
    }
  }

  render() {
    const { loader } = this.state

    if (loader) {
      return <this.props.Loader />
    } else {
      return <div>ok</div>
    }
    return <div>Example Component: {this.props.text}</div>
  }
}

export default Verify
