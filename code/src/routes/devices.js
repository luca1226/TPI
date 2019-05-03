/**
 * Devices routes.
 * @author Luca Saccone
 * @module
 */

/**
 * @swagger
 * tags:
 *    name: Devices
 *    description: devices management
 */

/**
 * @swagger
 * components:
 *       schemas:
 *          Devices:
 *             description: Schema of devices
 *             type: object
 *             properties:
 *                serial_number:
 *                   type: string
 *                   description: serial number of the devices
 */

import * as databaseRequest from '../controllers/databaseRequest'
import checkAuth from '../middleware/checkAuth'
var Router = require('koa-router')

/**
 * Getting devices existing in the database.
 * @param {Koa.Context} ctx - Koa context; Encapsulate request and response.
 */
export const devicesGet = async (ctx) => {
  const rows = await databaseRequest.getDevices()
  let jsonArray = []
  rows.forEach(element => {
    const stringify = JSON.stringify(element)
    const parse = JSON.parse(stringify)

    jsonArray.push(parse)
  })
  const devices = { devices: jsonArray }
  ctx.body = JSON.stringify(devices)
}

const router = new Router()

/**
 * @swagger
 * /devices/:
 *   get:
 *    summary: Get controllers that exist in the database
 *    description: List of all controllers
 *    tags: [Devices]
 *    operationId: get_devices_serial_numbers
 *    responses:
 *        '200':
 *           description: Successfully getting all devices existing in the database
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Devices'
 * */
router.get('get-devices-serialNumber', '/', checkAuth, devicesGet)

export const routes = router.routes()
