/**
 * Bootstrap module.
 * @module
 */
import { sayHello } from './greeter'

console.log(`Node environment: ${process.env.NODE_ENV}`)

function init() {
  sayHello('luca')
}

init()
