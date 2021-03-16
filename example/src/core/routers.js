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
    }
  }
]

export default routers
