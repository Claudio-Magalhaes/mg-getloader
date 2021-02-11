# mg-getLoader

[![NPM](https://img.shields.io/npm/v/mg-getloader.svg)](https://www.npmjs.com/package/mg-getloader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save mg-getloader
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'mg-getloader'


const routers = [
  {
    router: "/",
    Page: Home,
    exact: true,
    param: "",
    data: {
      config: {
        Site_Config: "object",
      },
      require: {
        home: {
          apresentacao: "object"
        }
      }
    }
  }
];

function App(props) {

  return (
    <div>
      <Router>
        <Switch>
          {routers.map((d, k) => (
            <Route
              key={k}
              path={`${process.env.PUBLIC_URL + d.router + d.param}`}
              exact={d.exact}
              render={props => <VerifLoader
                {...props}
                data={d}
                Loader={(<>Loader</>)}
              />}
            />
          ))}
          <Route exact component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}
```

## routers

> O array router representa todos os dados necessários para o roteamento e busca de dados da página

##### router
> representa a rota acessada

##### param
> informa os parametros da pádina

##### Page
> representa a página a ser esibida


## License

MIT © [claudio magalhaes](https://github.com/claudio magalhaes)
