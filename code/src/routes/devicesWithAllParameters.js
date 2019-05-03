/**
 * Devices with all parameters routes
 * @module
 */

/**
 * @swagger
 * tags:
 *    name: DevicesWithAllParameters
 *    description: devices, probes and connectivity management
 */

/**
 * @swagger
 * components:
 *       schemas:
 *          DevicesWithAllParameters:
 *             description: Schema of devices with all parameters
 *             type: object
 *             properties:
 *                serial_number:
 *                   type: string
 *                   description: serial number of the devices
 *                connectivity:
 *                   type: string
 *                   description: connectivity of the devices
 *                probe_1:
 *                   type: string
 *                   description: name of the first probe of the devices
 *                probe_2:
 *                   type: string
 *                   description: name of the second probe of the devices

 */
import checkAuth from '../middleware/checkAuth'
import * as databaseRequest from '../controllers/databaseRequest'
var Router = require('koa-router')

/**
 * Function getting devices existing in the database
 * @param {Context} ctx - Koa context; Encapsulate request and response
 */
export const devicesGet = async (ctx) => {
  const rows = await databaseRequest.getDevicesWithAllParameters()
  let jsonArray = []
  rows.forEach(element => {
    const stringify = JSON.stringify(element)
    const parse = JSON.parse(stringify)

    jsonArray.push(parse)
  })
  const devices = { devices: jsonArray }
  ctx.body = JSON.stringify(devices)
}

export const devicesPost = async (ctx) => {
  const serialNumber = ctx.request.body.serialNumber
  const connectivity = ctx.request.body.connectivity
  const firstProbe = ctx.request.body.probe1
  const secondProbe = ctx.request.body.probe2
  if (serialNumber === '') {
    ctx.throw(400, 'Serial Number is empty')
  } else if (connectivity === '') {
    ctx.throw(400, 'Connectivity is empty')
  } else if (firstProbe === '') {
    ctx.throw(400, 'First probe is empty')
  } else if (secondProbe === '') {
    ctx.throw(400, 'Second probe is empty')
  }

  databaseRequest.insertDevice(serialNumber, connectivity, firstProbe, secondProbe)

  ctx.body = {
    'serial Number': serialNumber,
    'connectivity': connectivity,
    'probe 1': firstProbe,
    'probe 2': secondProbe
  }
}

export const deviceDelete = async (ctx) => {
  const id = ctx.params.id
  if (isNaN(id)) {
    ctx.throw(400, 'Must be a number')
  }
  await databaseRequest.deleteDevice(id)
  ctx.body = {
    id
  }
}

const router = new Router()

/**
 * @swagger
 * /devices_with_all_parameters/:
 *   get:
 *    summary: Get controllers with all parameters that exist in the database
 *    description: List of all controllers
 *    tags: [DevicesWithAllParameters]
 *    operationId: get_devices_with_all_parameters
 *    responses:
 *        '200':
 *           description: Successfully getting all devices existing in the database
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DevicesWithAllParameters'
 *
 */
router.get('get-devices-with-all-parameters', '/', checkAuth, devicesGet)

/**
 * @swagger
 * /devices_with_all_parameters/:
 *   post:
 *    summary: Post a new controller with his connectivity and their probes
 *    description: Insert a new controller in the database
 *    tags: [DevicesWithAllParameters]
 *    operationId: post_device_with_all_parameters
 *    parameters:
 *      - in: header
 *        name: serial number
 *        description: serial number of the device
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: connectivity
 *        description: connectivity of the device
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: probe 1
 *        description: first probe of the device
 *        schema:
 *          type: string
 *      - in: header
 *        name: probe 2
 *        description: second probe of the device
 *        schema:
 *          type: string
 *    requestBody:
 *       description: a JSON object containing devices information
 *       content:
 *          application/json:
 *                schema:
 *                    $ref: '#/components/schemas/DevicesWithAllParameters'
 *    responses:
 *        '200':
 *           description: Successfully inserting new device
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/DevicesWithAllParameters'
 *
 */
router.post('post-a-device', '/', checkAuth, devicesPost)

/**
 * @swagger
 * /devices_with_all_parameters/id:
 *   delete:
 *    summary: Delete device from the database
 *    description: Delete the device
 *    tags: [DevicesWithAllParameters]
 *    operationId: delete_device_with_all_parameters
 *    parameters:
 *      - in: header
 *        name: deviceId
 *        description: id of the device
 *        required: true
 *        schema:
 *          type: number
 *    responses:
 *        '200':
 *           description: Successfully deleting the device
 */
router.delete('delete-a-device', '/:id', checkAuth, deviceDelete)

export const routes = router.routes()
