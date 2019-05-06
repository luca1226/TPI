/**
 * Database request module.
 * @author Luca Saccone
 * @module
 */
import mysql from 'mysql'

/**
 * Creation of the connection to the DB.
 */
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASEUSER,
  password: process.env.DATABASEPASSWORD,
  database: process.env.DATABASENAME
})

/**
 * Connection to the DB.
 */
connection.connect((err, result) => {
  if (err) {
    console.error('Error:- ' + err.stack)
    return
  }
  result.message = 'Connected to the database'
})

/**
 * Getting all SN that are in the DB.
 * @function getDevices
 * @returns {Promise}
 */
export const getDevices = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT serialNumber as "serial number" from controller', (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Getting all devices that are in the DB.
 * @function getDevicesWithAllParameters
 * @returns {Promise}
 */
export const getDevicesWithAllParameters = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT serialNumber, connectivityName, a.name as "probe 1", b.name as "probe 2" FROM controller INNER JOIN connectivity ON connectivity.idConnectivity = controller.idConnectivity LEFT JOIN probe a ON a.idProbe = controller.idProbeOne LEFT JOIN probe b ON b.idProbe = controller.idProbetwo', (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Change probe name in ID.
 * @function knowIdProbe
 * @param {String} probe - probe name.
 * @returns {Number}
 */
const knowIdProbe = (probe) => {
  let idProbe
  if (probe === 'Amtax sc') {
    idProbe = 1
  } else if (probe === 'An-ISE sc') {
    idProbe = 2
  } else if (probe === 'A-ISE sc') {
    idProbe = 3
  } else if (probe === 'Nitratax sc') {
    idProbe = 4
  } else if (probe === 'Phosphax sc') {
    idProbe = 5
  } else if (probe === 'UVAS sc') {
    idProbe = 6
  } else if (probe === 'pHD sc') {
    idProbe = 7
  } else if (probe === '1200-S sc') {
    idProbe = 8
  } else if (probe === '3798-s sc') {
    idProbe = 9
  } else if (probe === 'LDO 2 sc') {
    idProbe = 10
  } else if (probe === 'Solitax sc') {
    idProbe = 11
  } else if (probe === 'Sonatax sc') {
    idProbe = 12
  }
  return idProbe
}

/**
 * Change connectivity name in ID.
 * @function knowIdConnectivity
 * @param {String} connectivity - connectivity name.
 * @returns {Number}
 */
const knowIdConnectivity = (connectivity) => {
  let idConnectivity
  if (connectivity === 'lan') {
    idConnectivity = 1
  } else if (connectivity === 'wifi') {
    idConnectivity = 2
  } else if (connectivity === 'modem') {
    idConnectivity = 3
  }
  return idConnectivity
}

/**
 * Insert new device in the DB.
 * @function insertDevice
 * @param {String} serialNumber - SN of the new device.
 * @param {String} connectivity - Connectivity of the new device.
 * @param {String} firstProbe - First probe of the new device.
 * @param {String} secondProbe - Second probe of the new Device.
 * @returns {Promise}
 */
export const insertDevice = (serialNumber, connectivity, firstProbe, secondProbe) => {
  let idFirstProbe = knowIdProbe(firstProbe)
  let idSecondProbe = knowIdProbe(secondProbe)
  let idConnectivity = knowIdConnectivity(connectivity)
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO controller (idController, serialNumber, idConnectivity, idProbeOne, idProbeTwo) VALUES (NULL, '${serialNumber}', '${idConnectivity}', '${idFirstProbe}', '${idSecondProbe}')`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Delete device in the DB.
 * @function deleteDevice
 * @param {Number} idController - Identification number of the controller to be deleted.
 * @returns {Promise}
 */
export const deleteDevice = (idController) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM controller WHERE controller.idController = ${idController}`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Getting a given SN of a device that are in the DB.
 * @function getSerialNumber
 * @param {String} serialNumber - Serial Number of the device.
 * @returns {Promise}
 */
export const getSerialNumber = (serialNumber) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT serialNumber from controller WHERE "${serialNumber}" = serialNumber`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Getting numbers of a given probe.
 * @function getNumberOfProbeType
 * @param {number} id - Identification Number of the given probe.
 * @returns {Promise}
 */
export const getNumberOfProbeType = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT COUNT(*) as "probes" FROM controller WHERE idProbeOne = ${id}`
      , (error, rows) => {
        const firstProbe = JSON.parse(JSON.stringify(rows))[0].probes
        if (!error) {
          connection.query(`SELECT COUNT(*) as "probes" FROM controller WHERE idProbeTwo = ${id}`
            , (error, rows) => {
              if (!error) {
                const secondProbe = JSON.parse(JSON.stringify(rows))[0].probes
                resolve(firstProbe + secondProbe)
              } else reject(error)
            })
        } else reject(error)
      })
  })
}

/**
 * Getting a given email from the DB.
 * @function getUserEmail
 * @param {String} email - Given email of the user.
 * @returns {Promise}
 */
export const getUserEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT userEmail from user WHERE "${email}" = userEmail`, (error, rows) => {

      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Getting user from the DB.
 * @function getUserEmailAndPassword
 * @param {String} email - Given email of the user.
 * @returns {Promise}
 */
export const getUserEmailAndPassword = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT userEmail, userPassword from user WHERE "${email}" = userEmail`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * Posting new user into the DB.
 * @function postNewUser
 * @param {String} email - Email of the new user.
 * @param {String} passwordHash - Password of the new user.
 * @returns {Promise}
 */
export const postNewUser = (email, passwordHash) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO user (idUser, userEmail, userPassword) VALUES (NULL, '${email}', '${passwordHash}')`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}
