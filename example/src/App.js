import React from 'react'
import GetLoader from 'mg-getloader'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import routers from './core/routers'

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          {routers.map((d, k) => (
            <Route
              key={k}
              path={`${process.env.PUBLIC_URL + d.router + d.param}`}
              exact={d.exact}
              render={props => <GetLoader
                {...props}
                url={{
                  base: '/core_magales/Public/Functions/DataSite?page=',
                  alternative: '/core_magales/Public/Functions/DataSite?page=',
                  test: '/core_magales/Public/Functions/DataSite/previa?page='
                }}
                config={{}}
                timerPause={0}
                data={d}
                save={false}
              />}
            />
          ))
          }
        </Switch>
      </Router>
    </div>
  )
}

export default App
