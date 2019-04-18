/**
 * Koa Error Middleware.
 *
 * This module contains an error middleware function for any Koa application.
 * @requires koa-logger It uses internally the logger added to the Koa context by the koa-logger.
 *
 * @author Luca Saccone
 * @module
 */

/**
 * uncaught error handler middleware for koa
 *
 * This middleware is intended to catch any unexpected app error in API route processing.
 * @param {Koa.Context} ctx - the Koa context for the received request
 * @param {Function} next - the next middleware to call
 * @returns {Promise<void>} - Returns the middleware function to use with a koa server.
 */
const errorMiddleware = async (ctx, next) => {
  try {
    // delegate directly the processing of the received request to the next middleware; we just set the default response type
    ctx.response.type = 'application/json'
    await next()

    // manage 404-not-found errors
    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    // build HTTP response
    ctx.status = err.statusCode || err.status || 500
    ctx.body = (ctx.status >= 500) ? { message: err.message } : err

    // common part of the log message
    let msg = `${ctx.ip} ${ctx.request.method} ${ctx.request.url} - ${ctx.status}`

    // add specific info depending of type of 'err' and node env mode
    if (err instanceof Error) {
      // ----- err type is error
      if (err.name) {
        msg += ` ${err.name}`
      }
      if (process.env.NODE_ENV !== 'production' && ctx.status >= 500) {
        msg += `, ${err.stack}`
      } else {
        msg += ` ${err.message}`
      }
    } else {
      // ----- err type is NOT error
      msg += ` ${err}`
    }

    // ctx.log.error(msg)
    console.log(msg)
  }
}

export default errorMiddleware
