/**
 *
 * @module
 */
import mysql from 'mysql'

export const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASEUSER,
  password: process.env.DATABASEPASSWORD,
  database: process.env.DATABASENAME
})

connection.connect(function (err, result) {
  if (err) {
    console.error('Error:- ' + err.stack)
    return
  }
  result.message = 'Connected to the database'
})

/**
 * @returns {Promise<void>}
 */
export const getDevices = () => {
  return new Promise(function (resolve, reject) {
    connection.query('SELECT serialNumber as "serial number" from controller', function (error, rows) {
      if (!error) resolve(JSON.parse(JSON.stringify(rows)))
      else reject(error)
    })
  })
}

/**
 * @returns {Promise<void>}
 */
export const getDevicesWithAllParameters = () => {
  return new Promise(function (resolve, reject) {
    connection.query('SELECT serialNumber as "serial number", connectivityName as "connectivity", probeOneName as "probe 1", probeTwoName as "probe 2" from controller INNER JOIN connectivity On controller.idConnectivity = connectivity.idConnectivity INNER JOIN probeone ON probeone.idProbeOne = controller.idProbeOne Inner Join probetwo On probetwo.idProbetwo = controller.idProbetwo', function (error, rows) {
      if (!error) resolve(JSON.parse(JSON.stringify(rows)))
      else reject(error)
    })
  })
}

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

export const insertDevice = (serialNumber, connectivity, firstProbe, secondProbe) => {
  let idFirstProbe = knowIdProbe(firstProbe)
  let idSecondProbe = knowIdProbe(secondProbe)
  let idConnectivity = knowIdConnectivity(connectivity)
  return new Promise(function (resolve, reject) {
    connection.query(`INSERT INTO controller (idController, serialNumber, idConnectivity, idProbeOne, idProbeTwo) VALUES (NULL, '${serialNumber}', '${idConnectivity}', '${idFirstProbe}', '${idSecondProbe}')`, function (error, rows) {
      if (!error) resolve(JSON.parse(JSON.stringify(rows)))
      else reject(error)
    })
  })
}

export const deleteDevice = (idController) => {
  return new Promise(function (resolve, reject) {
    connection.query(`DELETE FROM controller WHERE controller.idController = ${idController}`, function (error, rows) {
      if (!error) resolve(JSON.parse(JSON.stringify(rows)))
      else reject(error)
    })
  })
}
