/**
 * Users routes.
 * @author Luca Saccone
 * @module
 */
/**
 * @swagger
 * tags:
 *    name: Users
 *    description: Users management and login
 */

/**
 * @swagger
 * components:
 *       schemas:
 *          Users:
 *             description: Schema of users
 *             type: object
 *             properties:
 *                email:
 *                   type: string
 *                   description: email of the user
 *                password:
 *                   type: string
 *                   description: password of the user
 */
import * as userAuth from '../controllers/userAuth'
var Router = require('koa-router')

/**
 * Sign up a new user.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 */
export const userSignUp = async (ctx) => {
  await userAuth.signUp(ctx)
}

/**
 * Login user.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 */
export const userLogin = async (ctx) => {
  await userAuth.login(ctx)
}

const router = new Router()

/**
 * @swagger
 * /users/signup:
 *   post:
 *    summary: Create a new user
 *    description: Insert a new user in the database
 *    tags: [Users]
 *    operationId: post_new_user
 *    parameters:
 *      - in: header
 *        name: email
 *        description: email of the user
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: password
 *        description: password of the user
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *       description: a JSON object containing user information
 *       content:
 *          application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Users'
 *    responses:
 *        '201':
 *           description: User created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Users'
 *        '409':
 *           description: Mail exist
 *        '500':
 *           description: Internal Server Error
 */
router.post('post-a-user', '/signup', userSignUp)

/**
 * @swagger
 * /users/login:
 *   post:
 *    summary: Log a new user
 *    description: Log the user into the API
 *    tags: [Users]
 *    operationId: log_new_user
 *    parameters:
 *      - in: header
 *        name: email
 *        description: email of the user
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: password
 *        description: password of the user
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *       description: a JSON object containing user information
 *       content:
 *          application/json:
 *                schema:
 *                    $ref: '#/components/schemas/Users'
 *    responses:
 *        '200':
 *           description: Authentication successful
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Users'
 *        '401':
 *           description: Authentication failed
 */
router.post('log-a-user', '/login', userLogin)

export const routes = router.routes()
