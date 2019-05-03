import * as jwt from 'jsonwebtoken'

const checkAuth = async (ctx, next) => {
  try {
    console.log()
    const token = ctx.request.headers.authorization.split(' ')[1]

    await jwt.verify(token, process.env.JWT_KEY)

    await next()
  } catch (error) {
    ctx.throw(401, 'Login before!')
  }
}

export default checkAuth
