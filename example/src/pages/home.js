import React from 'react'

const Home = (props) => {
  console.log(props)
  props.loaderOn({})
  return <h1>Home</h1>
}

export default Home
