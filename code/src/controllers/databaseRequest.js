/**
 *
 * @module
 */
import mysql from 'mysql'

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASEUSER,
  password: process.env.DATABASEPASSWORD,
  database: process.env.DATABASENAME
})

connection.connect((err, result) => {
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
  return new Promise((resolve, reject) => {
    connection.query('SELECT serialNumber as "serial number" from controller', (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

/**
 * @returns {Promise<void>}
 */
export const getDevicesWithAllParameters = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT serialNumber, connectivityName, a.name as "probe 1", b.name as "probe 2" FROM controller INNER JOIN connectivity ON connectivity.idConnectivity = controller.idConnectivity LEFT JOIN probe a ON a.idProbe = controller.idProbeOne LEFT JOIN probe b ON b.idProbe = controller.idProbetwo', (error, rows) => {
      if (!error) resolve(rows)
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
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO controller (idController, serialNumber, idConnectivity, idProbeOne, idProbeTwo) VALUES (NULL, '${serialNumber}', '${idConnectivity}', '${idFirstProbe}', '${idSecondProbe}')`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

export const deleteDevice = (idController) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM controller WHERE controller.idController = ${idController}`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

export const getSerialNumber = (serialNumber) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT serialNumber from controller WHERE "${serialNumber}" = serialNumber`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

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

export const getUserEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT userEmail from user WHERE "${email}" = userEmail`, (error, rows) => {

      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

export const getUserEmailAndPassword = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT userEmail, userPassword from user WHERE "${email}" = userEmail`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}

export const postNewUser = (email, passwordHash) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO user (idUser, userEmail, userPassword) VALUES (NULL, '${email}', '${passwordHash}')`, (error, rows) => {
      if (!error) resolve(rows)
      else reject(error)
    })
  })
}