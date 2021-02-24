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

> O array router representa todos os dados necessários para o roteamento e busca de dados da página.
>
> É recomendado que seja criado um arquivo separado para agrupar todos od dados de roteamento.

Routers | type | descrição
--- | --- | ---
router | string | rota acessada
param | string | parametros da rota
Page | component | Componente exibibo após busca
exact | boolean | significa que a rota deve ser exata
data | object | deve receber os dados das páginas buscadas na base da aplicação

### data
> O objeto ```data``` dentro de ``` routers[n] ``` informa ao metodo todos os dados que devem ser buscados para a página.
> Os dados se dividem em três principais metodos.

```config```
>   busca dados de configuração da página

```require```
>   busca de dados prioritários da página

```optinal```
>   busca de dados opicionais da página

```jsx
      require: {
        home: {

            // requerendo string
          exemplo_1: "string",

            // requerendo numeros
          exemplo_2: "number",

            // requerendo objeto
          exemplo_3: "object",
          exemplo_4: {},

            // requerendo array
          exemplo_5: "array",
          exemplo_6: [],

            // criando cadeia de requerimento
          exemplo_7: {
            apresentacao: {
                title: "string"
            },
            carousel: [{
                title: "string",
                img: "string"
            }]
          }
        }
      }
```

###### explicando
> Usamos o grupo de ```require``` por conveniência, pois essa ordem deve ser mantida por todos os grupos de dados.


#config
> informe aqui de os dados das páginas de configuração que devem ser baixadas antes antes dos dados do site.
> Para isso, informe um objeto semelhante ao das rotas

* será necessário informar de maneira literal os verificadore"


```jsx
      config: {
        configuracoes: "object",
        layout: "object"
      }
```



## License

MIT © [claudio magalhaes](https://github.com/claudio magalhaes)
