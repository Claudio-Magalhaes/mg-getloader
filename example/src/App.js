import React from 'react'
import GetLoader from 'mg-getloader'

const Home = (props) => {
  return <h1>Home</h1>
}

const routers = {
  Page: Home,
  data: {
    config: [
      {
        home: ["object", { param: 'home' }]
      }
    ],
    required: [
      {
        home: ["object", { param: 'home' }]
      }
    ],
    optional: [
      {
        home: ["object", { param: 'home' }]
      }
    ]
  }}

const App = () => {
  return <GetLoader
    data={routers}
    url={{
      base: '/core_magales/Public/Functions/DataSite?page=',
      alternative: '/core_magales/Public/Functions/DataSite?page=',
      test: '/core_magales/Public/Functions/DataSite/previa?page='
    }}
    timerPause={0}
    Loader={'loader...'}
  />
}

export default App
