/**
 * Koa Logger Middleware
 *
 * This module contains an log middleware function for any Koa application.
 * It logs automatically, in a concise manner, any incoming request and its response.
 * @author Luca Saccone
 * @module
 */

/**
 * The koa logging middleware function.
 * @param {Context} ctx - the koa context of the received request.
 * @param {Promise} next - the function to call to pass the request to the next middleware.
 */
const logMiddleware = async (ctx, next) => {
  const startTime = Date.now()

  // first call next middleware to let them do their work
  await next()

  // then, log some receive request info and some sent response info
  const status = ctx.response.status
  if (status === 404) return // this one is managed by the general error handler
  const responseTime = Date.now() - startTime
  const msg = `${ctx.ip} ${ctx.request.method} ${ctx.request.url} - ${status} ${ctx.response.message} ${responseTime}ms`
  if (status < 300) console.log(msg)
  else if (status < 400) console.log(msg)
  else (console.log(msg))
}

export default logMiddleware
