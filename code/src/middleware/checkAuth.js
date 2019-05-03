/**
 * Check authentication module.
 * @author Luca Saccone
 * @module
 */
import * as jwt from 'jsonwebtoken'

/**
 * Check if a user is authenticated.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 * @param {*} next
 */
const checkAuth = async (ctx, next) => {
  try {
    // extract the JWT from the request and verify it
    // -requester must add the token into the headers, in a field called "token" and value equals to "Bearer " + the token got from user login
    // -here, we remove the "Bearer " part
    const token = ctx.request.headers.authorization.split(' ')[1]
    await jwt.verify(token, process.env.JWT_KEY)

    // the authentication succeeds, the we continue to the next route handler (will continue the routing process)
    await next()
  } catch (error) {
    ctx.throw(401, 'Login before!')
  }
}

export default checkAuth
