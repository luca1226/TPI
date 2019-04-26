/**
 * Devices routes
 *@module
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

import * as controller from '../controllers/databaseRequest'
var Router = require('koa-router')

/**
 * Function getting devices existing in the database
 * @param {Context} ctx - Koa context; Encapsulate request and response
 */
export const devicesGet = async (ctx) => {
  const devices = await controller.getDevices()

  ctx.body = {
    'Controllers existing in the database': devices
  }
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
router.get('get-devices-serialNumber', '/', devicesGet)

export const routes = router.routes()
