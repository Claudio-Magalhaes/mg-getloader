import Home from "../pages/home"
const routers = [
  {
    router: "/",
    Page: Home,
    exact: true,
    param: "",
    data: {
      config: [
        {
          home: ["object", { param: 'home' }],
          home2: ["object", { param: 'home' }],
          home3: ["object", { param: 'home' }],
          home4: ["object", { param: 'home' }],
          home5: ["object", { param: 'home' }]
        },
        {
          save: false
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
    }
  }
]

export default routers
