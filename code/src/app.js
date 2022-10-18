/**
 * Device management API module.
 *
 * This module contains a class that build the Device management Application (DmA).
 * The builder class exposes a public property 'App' that is the built application, e.g. the EBApp.
 * The built application is of type 'Koa'. It embeds an HTTP server that must be use to start the application.
 * The built application is exported by default.
 *
 * @author Luca Saccone
 * @module
 */
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import Koa from 'koa'
import responseTime from 'koa-response-time'
import getRouter from './routes/index'
import errorHandler from './middleware/koa-error'
import koaLogger from './middleware/koa-logger'

/**
 * Eagle API Server Application Builder
 *
 * That class build and exposes the 'Device management API Server Application' object, that is of type 'Koa'.
 */
class AppBuilder {
  /**
   * The object of type 'Koa' that implements the 'device management API Server Application'.
   */
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    const app = new Koa()

    // Add some utility middleware
    app
      .use(errorHandler) // custom generic error handler
      .use(responseTime()) // add a response time field into HTTP response
      .use(helmet()) // add some security skills
      .use(bodyParser()) // extract incoming request data into body properties
      .use(koaLogger) // log automatically, in a concise manner, any received request and the associated response

    // Add routes
    const router = getRouter()
    app
      .use(router.routes())
      .use(router.allowedMethods())

    this.App = app
  }
}

export default new AppBuilder().App
