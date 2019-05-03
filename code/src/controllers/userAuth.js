/**
 * User Authentication module.
 * @author Luca Saccone
 * @module
 */
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'
import * as databaseRequest from './databaseRequest'

/**
 * Sign up a new user.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 */
export const signUp = async (ctx) => {
  // check that the given email does not exist into the DB. if yes return an error, if no continue the request processing
  const userEmailExistsInDB = await databaseRequest.getUserEmail(ctx.request.body.email)
  if (userEmailExistsInDB.length >= 1) {
    ctx.throw(409, 'Mail exist')
  }
  // email does not yet exist: Add user in DB. Salt and hash the password before storing it.
  try {
    const hash = await bcrypt.hash(ctx.request.body.password, 10)
    // encryption succeed: create the user in the DB
    await databaseRequest.postNewUser(ctx.request.body.email, hash)
    ctx.status = 201
    ctx.body = { message: 'User created' }
  } catch (error) {
    // encryption failed: return generic auth error
    ctx.throw(500, error)
  }
}

/**
 * Login a user.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 */
export const login = async (ctx) => {
  // check that the given email exists into the DB. If no it returns an error, if yes if continue the request processing.
  const userExistsInDB = await databaseRequest.getUserEmailAndPassword(ctx.request.body.email)

  if (userExistsInDB.length < 1) {
    ctx.throw(401, 'Auth failed')
  }
  // compare the given and the existing password to see if they match
  if (await bcrypt.compare(ctx.request.body.password, userExistsInDB[0].userPassword)) {
    // we succed to idenify the user: return the authorization token. The requester will have to use this token in following messages
    const token = jwt.sign({
      email: userExistsInDB[0].userEmail,
      password: userExistsInDB[0].userPassword
    },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      }
    )
    ctx.status = 200
    ctx.body = { message: 'Auth successful', token: token }
  } else {
    // password does not match: return generic error 'unauthorized'
    ctx.throw(401, 'Auth failed')
  }
}
