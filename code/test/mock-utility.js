/* eslint-disable no-undef */
import { expect } from 'chai'
import * as td from 'testdouble'
import '@babel/polyfill'

export let context // this is the real koa context we will mock during the tests.
let expectedError // the error we expect the SUT will throw
let wrongFirstArg
let wrongSecondArg

beforeEach(function () {
  expectedError = new Error('expected exception')
  wrongFirstArg = new Error('wrong 1st arg')
  wrongSecondArg = new Error('wrong 2nd arg')

  context = td.object() // create the koa context mock
  context.request.body = {} // a 'body' property is always added to the request object by the 'koa-bodyparser'  middleware
  context.params = {}
})
afterEach(function () {
  td.reset()
})

/**
 *  Set the HTTP error expectations. Used when unit testing a route that must throw a specific exception.
 * @param {number} statusCode - The expected HTTP status code (200, 400, 404, ...)
 * @param {string} messagePartial - Part of the expected message, i.e. 'name' for HTTP error message = 'name is required'
 */
const setContextThrowExpectations = (statusCode, messagePartial) => {
  // define the action to do when the mocked 'context.throw' function is called with the expected status code and message
  td.when(context.throw(statusCode, td.matchers.contains(messagePartial))).thenThrow(expectedError)

  //  define the action to do when the mocked 'context.throw' function is called with the wrong status code
  td.when(context.throw(td.matchers.argThat((arg) => {
    expectedError.message = `expected=${statusCode}`
    if (typeof arg !== 'number') {
      wrongFirstArg.message = `error status code is not a number. code=${arg}`
      return true
    }
    if (arg !== statusCode) {
      wrongFirstArg.message = `wrong status code=${arg}`
      return true
    }
    return false
  })), { ignoreExtraArgs: true })
    .thenThrow(wrongFirstArg)

  //  define the action to do when the mocked 'context.throw' function is called with the wrong message
  td.when(context.throw(statusCode, td.matchers.argThat((arg) => {
    expectedError.message = `expected=${messagePartial}`
    if (typeof arg !== 'string') {
      wrongSecondArg.message = `message is not a string. current= ${arg}`
      return true
    }
    const check = arg.indexOf(messagePartial)
    wrongSecondArg.message = `wrong message=${arg}`
    return check === -1
  })), { ignoreExtraArgs: true })
    .thenThrow(wrongSecondArg)
}

/**
 * Check that a call to a given route handler function throws an exception that match the given HTTP status code and message..
 * @param {(ctx: Context) => void} sut - The route handler function to call and that is expected to throw
 * @param {number} statusCode - The expected HTTP status code (200, 400, 404, ...)
 * @param {string} messagePartial - Part of the expected message, i.e. 'name' for HTTP error message = 'name is required'
 */
export const expectMiddlewareFunctionThrow = async (sut, statusCode, messagePartial) => {
  // set expectations on the mocked context: must throw with given status code and message
  setContextThrowExpectations(statusCode, messagePartial)

  // call the SUT and assert that is throws the expected exception
  try {
    // call the SUT function that we expect to throw
    await sut(context)
  } catch (error) {
    // assert that caught exception is the right one
    expect(error).to.equal(expectedError)
    return
  }

  // if no exception have been raised, raise one to signal that the expected exception has not been trowed.
  // throw (new AssertionError({ actual: 'Expected exception not threw' }));
  throw (new Error(`Expected exception (status code=${statusCode}, message regex='${messagePartial}') not threw`))
}
