import { onRequestGet as __api_examen___id___js_onRequestGet } from "/home/diego/Development/preguntame/functions/api/examen/[[id]].js"
import { onRequestGet as __api_examenes_js_onRequestGet } from "/home/diego/Development/preguntame/functions/api/examenes.js"

export const routes = [
    {
      routePath: "/api/examen/:id*",
      mountPath: "/api/examen",
      method: "GET",
      middlewares: [],
      modules: [__api_examen___id___js_onRequestGet],
    },
  {
      routePath: "/api/examenes",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_examenes_js_onRequestGet],
    },
  ]