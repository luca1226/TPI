/**
 * This module returns all routes that are written.
 *
 * @author Luca Saccone
 * @module
 */
import Router from 'koa-router'

/**
 * handles the GET 'home' route
 * @param ctx Koa context
 */
const homeGet = async (ctx) => {
  ctx.type = 'text/plain; charset=utf-8'
  ctx.body = 'Hello API world!'
}

/**
 * Add all existing routes to the given router
 * @param {Router} router - The router where to add the routes
 */
export default () => {
  // create the router
  const router = new Router()

  // response to default route (TEMPORARY for test purpose...)
  router.get('get-home', '/', homeGet)

  // router.prefix('/v1')

  // all defined routes into the router

  return router
}
