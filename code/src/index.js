/**
 * This module bootstrap the Device management Application (DmA).
 * @author Luca Saccone
 * @module
 */
import app from './app'
// import log from './utils/logger'

const logHeader = 'Device Management API server'

console.log(`Node environment: ${process.env.NODE_ENV}`)

/**
 * Convert API server address into a descriptive string.
 */
const bind = () => {
  const addr = apiServer.address()
  if (addr) {
    return (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
  } else {
    return `port ${port}`
  }
}

/**
 * Server 'listening' event handler.
 */
const onListening = () => {
  console.log(`${logHeader}: Listening on ${bind()}...`)
}

/**
 * Server 'error' event handler that catch errors raised on listening start.
 * @param {NodeJS.ErrnoException} error - The error raised by the the server.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') throw error

  switch (error.code) {
    case 'EACCESS':
      console.log(`${logHeader}: Server error= ${bind()} requires elevated privileges`)
      process.exit(1)
      // eslint-disable-next-line no-unreachable
      break

    case 'EADDRINUSE':
      console.log(`${logHeader}: Server error= ${bind()} is already in use`)
      process.exit(1)
      // eslint-disable-next-line no-unreachable
      break

    default:
      throw error
  }
}

// Start the server listening...
console.log(`${logHeader}: Starting server`)
const port = process.env.PORT || 3000
const apiServer = app.listen(port)
apiServer.on('listening', onListening)
apiServer.on('error', onError)
