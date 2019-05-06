/**
 * Probes routes.
 * @author Luca Saccone
 * @module
 */
/**
 * @swagger
 * tags:
 *    name: Probes
 *    description: Probes management
 */

/**
* @swagger
* components:
*       schemas:
*          Probes:
*             description: Schema of probes
*             type: object
*             properties:
*                probe_id:
*                   type: string
*                   description: id of the probe
*                number_of_type:
*                   type: number
*                   description: number of sensor type
*/
import checkAuth from '../middleware/checkAuth'
import * as databaseRequest from '../controllers/databaseRequest'
var Router = require('koa-router')

/**
 * Getting number of a given probe that are in DB.
 * @function probesGet
 * @async
 * @param {Context} ctx - Koa context; Encapsulate request and response.
 */
export const probesGet = async (ctx) => {
  const probeId = ctx.params.probeId
  if (isNaN(probeId)) {
    ctx.throw(400, 'Must be a number')
  }
  const probes = await databaseRequest.getNumberOfProbeType(probeId)
  const devices = { type: probeId, number: probes }
  ctx.body = JSON.stringify(devices)
}

const router = new Router()

/**
 * @swagger
 * /probes/id:
 *   get:
 *    summary: Get number of sensor type
 *    description: List the id of the probe and his number used
 *    tags: [Probes]
 *    operationId: get_number_of_sensor_type
 *    responses:
 *        '200':
 *           description: Successfully getting number of sensor type
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Probes'
 * */
router.get('get-number-of-probe-type', '/:probeId', checkAuth, probesGet)

export const routes = router.routes()
