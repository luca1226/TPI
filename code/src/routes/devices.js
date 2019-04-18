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
 *             type: object
 *             properties:
 *                serial number:
 *                   type: string
 *                   description: serial number of the devices
 *                probe 1:
 *                   type: string
 *                   description: name of the first probe of the devices
 *                probe 2:
 *                   type: string
 *                   description: name of the second probe of the devices
 *                connectivity:
 *                   type: string
 *                   description: connectivity of the devices
 *            required:
 *              - serial number
 *              - connectivity
 */
